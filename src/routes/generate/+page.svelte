<script lang="ts">
	import {
		Asset,
		Bytes,
		Checksum256,
		Name,
		Serializer,
		type TransactResult,
		UInt64,
		type TransactResultReturnValue
	} from '@wharfkit/session';
	import { onDestroy, onMount } from 'svelte';
	import { derived, writable, type Readable, type Writable } from 'svelte/store';
	import { page } from '$app/stores';
	import { AlertCircle, Loader2, MemoryStick, PackagePlus } from 'svelte-lucide';
	import {
		DropsContract,
		accountKit,
		dropsContract,
		session,
		systemContract,
		tokenContract
	} from '$lib/wharf';
	import { getRamPrice } from '$lib/bancor';
	import { maximumBatchSize, sizeDropRow, sizeDropRowPurchase } from '$lib/constants';
	import { t } from '$lib/i18n';
	import { epochNumber } from '$lib/epoch';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

	const useRandomDrop: Writable<boolean> = writable(true);
	const randomDrop: Writable<Name> = writable(randomName());

	const accountRamBalance: Writable<number> = writable();
	const accountTokenBalance: Writable<Asset> = writable();

	const ramPrice = writable(0);
	const dropsPrice: Writable<number> = writable();

	// Form and processing
	const createBound = writable(true);
	const dropsAmount: Writable<number> = writable(1);
	const customDropsAmount: Writable<boolean> = writable(false);
	const customDropsValue: Writable<number> = writable();
	const lastResult: Writable<DropsContract.Types.generate_return_value | undefined> = writable();
	const lastResultId: Writable<string | undefined> = writable();
	const lastResultError: Writable<string> = writable();
	const transacting: Writable<boolean> = writable(false);
	const transactBatchSize: Writable<number> = writable(0);
	const transactBatchProgress: Writable<number> = writable(0);

	const devmode = $page.url.searchParams.has('dev');

	const accountContractBalance: Writable<DropsContract.Types.balances_row> = writable();
	const accountContractDrops = derived(accountContractBalance, ($accountContractBalance) =>
		$accountContractBalance ? Number($accountContractBalance.drops) : 0
	);
	const accountContractRam = derived(accountContractBalance, ($accountContractBalance) =>
		$accountContractBalance ? Number($accountContractBalance.ram_bytes) : 0
	);

	const derivedDropsAmount: Readable<number> = derived(
		[dropsAmount, customDropsAmount, customDropsValue],
		([$dropsAmount, $customDropsAmount, $customDropsValue]) => {
			if ($customDropsAmount) {
				if ($customDropsValue) {
					return Number($customDropsValue);
				} else {
					return 0;
				}
			} else {
				return $dropsAmount;
			}
		}
	);

	const createBound = writable(true);

	const totalRamRequired: Readable<number> = derived(
		[createBound, derivedDropsAmount, accountContractRam],
		([$createBound, $derivedDropsAmount, $accountContractRam]) => {
			if ($derivedDropsAmount) {
				/*
				 * If the account has enough of a RAM balance to cover the cost of minting, then we can use the actual
				 * size of the drop row as the RAM requirement using `sizeDropRow`.
				 *
				 * If the account does not have enough RAM balance to cover the cost of minting, then we need to use the
				 * size of the drop row as the RAM requirement using `sizeDropRowPurchase`. This adds additional RAM as a
				 * purchase buffer to prevent rounding errors that happen in the bancor algorithm.
				 */
				const ramRequiredWithBalance = $derivedDropsAmount * sizeDropRow;
				if (!$createBound && $accountContractRam < ramRequiredWithBalance) {
					const ramRequiredWithoutBalance = $derivedDropsAmount * sizeDropRowPurchase;
					return ramRequiredWithoutBalance;
				} else {
					return ramRequiredWithBalance;
				}
			}
			return 0;
		}
	);

	// The amount of RAM needed to complete the transaction
	// totalRamToPurchase = totalRamRequired - accountContractBalance.ram_bytes
	const totalRamToPurchase: Readable<number> = derived(
		[createBound, totalRamRequired, accountContractRam],
		([$createBound, $totalRamRequired, $accountContractRam]) => {
			console.log('total', $totalRamRequired);
			if (!$createBound && $totalRamRequired && $totalRamRequired > $accountContractRam) {
				if ($accountContractRam) {
					return $totalRamRequired - $accountContractRam;
				} else {
					return $totalRamRequired;
				}
			}
			return 0;
		}
	);

	const totalRamCreditsToUse: Readable<number> = derived(
		[createBound, totalRamRequired, accountContractBalance],
		([$createBound, $totalRamRequired, $accountContractBalance]) => {
			if (!$createBound && $totalRamRequired && $accountContractBalance) {
				if ($totalRamRequired > Number($accountContractBalance.ram_bytes)) {
					return Number($accountContractBalance.ram_bytes);
				} else {
					return $totalRamRequired;
				}
			}
			return 0;
		}
	);

	const totalPrice: Readable<number> = derived(
		[ramPrice, totalRamToPurchase],
		([$ramPrice, $totalRamToPurchase]) => {
			console.log($ramPrice, $totalRamToPurchase);
			return $ramPrice * $totalRamToPurchase;
		}
	);

	const hasEnoughRAM: Readable<boolean> = derived(
		[accountRamBalance, totalRamToPurchase],
		([$accountRamBalance, $totalRamToPurchase]) => {
			if ($accountRamBalance >= 0 && $totalRamToPurchase >= 0) {
				return $accountRamBalance >= $totalRamToPurchase;
			}
			return false;
		}
	);

	const hasEnoughTokens: Readable<boolean> = derived(
		[accountTokenBalance, totalPrice],
		([$accountTokenBalance, $totalPrice]) => {
			if ($accountTokenBalance && $accountTokenBalance) {
				return Number($accountTokenBalance.units) > $totalPrice;
			}
			return false;
		}
	);

	const canGenerate: Readable<boolean> = derived(
		[createBound, derivedDropsAmount, hasEnoughRAM, hasEnoughTokens, transacting],
		([$createBound, $derivedDropsAmount, $hasEnoughRAM, $hasEnoughTokens, $transacting]) => {
			const general = $derivedDropsAmount > 0 && !$transacting;
			if ($createBound) {
				return general && $hasEnoughRAM;
			} else {
				return general && $hasEnoughTokens;
			}
		}
	);

	let ramLoader: ReturnType<typeof setInterval>;

	onMount(async () => {
		loadRamPrice();
		ramLoader = setInterval(loadRamPrice, 2000);
	});

	onDestroy(() => {
		clearInterval(ramLoader);
	});

	epochNumber.subscribe(() => {
		loadAccountData();
	});

	session.subscribe(() => {
		loadAccountData();
	});

	async function loadAccountData() {
		await loadAccountBalances();
		await loadBalanceRow();
	}

	async function loadBalanceRow() {
		if ($session) {
			const results = await dropsContract.table('balances').get($session.actor);
			console.log(results);
			if (results) {
				accountContractBalance.set(results);
			}
		}
	}

	async function loadAccountBalances() {
		if ($session) {
			const result = await accountKit.load($session.actor);
			accountRamBalance.set(Number(result.resource('ram').available));
			if (result.data.core_liquid_balance) {
				accountTokenBalance.set(result.data.core_liquid_balance);
			}
		}
	}

	async function loadRamPrice() {
		const cost_plus_fee = await getRamPrice();
		ramPrice.set(Number(cost_plus_fee));
		if (cost_plus_fee) {
			dropsPrice.set(Number(cost_plus_fee) * sizeDropRowPurchase);
		}
	}

	function randomName(): Name {
		const length = 12;
		const chars = 'abcdefghijklmnopqrstuvwxyz12345';
		let drops = '';
		for (var i = 0; i < length; i++) {
			drops += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return Name.from(drops);
	}

	async function claim() {
		if ($session) {
			const action = dropsContract.action('claim', {
				owner: $session.actor,
				sell_ram: true
			});
			await $session.transact({ action });
			setTimeout(loadAccountBalances, 1000);
			setTimeout(loadBalanceRow, 1000);
		}
	}

	async function deposit() {
		const action = tokenContract.action('transfer', {
			from: $session.actor,
			to: 'drops',
			quantity: Asset.fromUnits(50000, '4,EOS'),
			memo: String($session.actor)
		});
		await $session?.transact({ action });
		setTimeout(loadAccountBalances, 1000);
		setTimeout(loadBalanceRow, 1000);
	}

	async function sellram() {
		const action = systemContract.action('sellram', {
			account: $session.actor,
			bytes: $accountRamBalance
		});
		await $session?.transact({ action });
		setTimeout(loadAccountBalances, 1000);
		setTimeout(loadBalanceRow, 1000);
	}

	async function buyram() {
		const action = systemContract.action('buyrambytes', {
			payer: $session.actor,
			receiver: $session.actor,
			bytes: UInt64.from(100000)
		});
		await $session?.transact({ action });
		setTimeout(loadAccountBalances, 1000);
		setTimeout(loadBalanceRow, 1000);
	}

	async function generate() {
		lastResultError.set('');
		transacting.set(true);
		transactBatchSize.set(0);
		transactBatchProgress.set(0);

		const amount = $derivedDropsAmount;
		const max = maximumBatchSize;

		const batches = Math.ceil(amount / max);
		if (batches > 1) {
			const batchSizes = Array.from({ length: batches }, (_, idx) =>
				idx === batches - 1 && amount % max > 0 ? amount % max : max
			);
			transactBatchSize.set(batchSizes.length);
			for (const batchSize of batchSizes) {
				await mint(batchSize, amount);
				transactBatchProgress.update((p) => p + 1);
				if ($transactBatchProgress < $transactBatchSize) {
					await new Promise((r) => setTimeout(r, 500));
				}
			}
		} else {
			transactBatchSize.set(1);
			await mint(amount, amount);
			transactBatchProgress.set(1);
		}

		loadRamPrice();
		setTimeout(loadAccountData, 1000);
		transacting.set(false);
	}

	async function mint(amount: number, totalAmount: number) {
		const hash = String(Checksum256.hash(Bytes.from(String(randomName()), 'utf8')));
		const bound = $createBound;

		// Specify the RAM required for this transaction and the RAM total
		let ramRequired = amount * sizeDropRow;
		let ramRequiredTotal = totalAmount * sizeDropRow;

		// If RAM purchase is required, use the purchase size
		if ($accountContractRam < ramRequired) {
			ramRequired = amount * sizeDropRowPurchase;
			ramRequiredTotal = totalAmount * sizeDropRowPurchase;
		}

		if ($session) {
			const actions = [
				dropsContract.action('generate', {
					amount,
					bound,
					data: hash,
					owner: $session.actor
				})
			];

			const requiresRAMPurchase = $createBound && $accountRamBalance < ramRequired;
			let ramPurchaseAmount = 0; // The bytes purchased in tx, will update account record on success
			if (requiresRAMPurchase) {
				ramPurchaseAmount = ramRequiredTotal;
				actions.unshift(
					systemContract.action('buyrambytes', {
						payer: $session.actor,
						receiver: $session.actor,
						bytes: ramRequiredTotal
					})
				);
			}

			const requiresDeposit = !$createBound && $accountContractRam < ramRequired;
			if (requiresDeposit) {
				const depositRequired = $ramPrice * ($totalRamRequired - $accountContractRam);

				actions.unshift(
					tokenContract.action('transfer', {
						from: $session.actor,
						to: 'drops',
						quantity: Asset.fromUnits(depositRequired, '4,EOS'),
						memo: String($session.actor)
					})
				);
			}

			if (!$accountContractBalance) {
				actions.unshift(
					dropsContract.action('open', {
						owner: $session.actor
					})
				);
			}

			let result: TransactResult;
			try {
				result = await $session.transact({ actions });

				// Set the last successful transaction ID
				lastResultId.set(String(result.resolved?.transaction.id));

				// Process return values
				result.returns
					.filter((r) => r.action.equals('generate'))
					.forEach((v) => processReturn(v, bound, amount, ramPurchaseAmount));
			} catch (e) {
				lastResult.set(undefined);
				lastResultId.set(undefined);
				lastResultError.set(String(e));
			}
		}
	}

	function processReturn(
		returnValue: TransactResultReturnValue,
		bound: boolean,
		mintAmount: number,
		ramPurchaseAmount: number
	) {
		try {
			const returned = Serializer.decode({
				data: returnValue.hex,
				type: DropsContract.Types.generate_return_value
			});

			// Set result of last transaction
			lastResult.set(returned);

			// Update UI balances
			if (bound) {
				accountRamBalance.update(
					(balance) => balance + ramPurchaseAmount - Number(returned.bytes_used)
				);
				accountContractBalance.set(
					DropsContract.Types.balances_row.from({
						owner: $session.actor,
						drops: row.drops.adding(mintAmount),
						ram_bytes: row.ram_bytes
					})
				);
			} else {
				accountContractBalance.set(
					DropsContract.Types.balances_row.from({
						owner: $session.actor,
						drops: $accountContractBalance.drops.adding(mintAmount),
						ram_bytes: returned.bytes_balance
					})
				);
			}
		} catch (e) {
			// console.warn(e);
		}
	}

	const selectDropAmount = (e: Event) => {
		if (e.target.value === 'X') {
			customDropsAmount.set(true);
		} else {
			customDropsAmount.set(false);
			dropsAmount.set(Number(e.target.value));
		}
	};
</script>

<div class="container p-4 sm:p-8 lg:p-16">
	<div class="mx-auto py-4 sm:p-4 space-y-4 bg-surface-900 rounded-lg shadow-xl">
		<div class="h1 flex items-center px-2 sm:px-6">
			<PackagePlus class="dark:text-blue-400 inline size-12 mr-4" />
			<span
				class="bg-gradient-to-br from-blue-500 to-cyan-300 bg-clip-text text-transparent box-decoration-clone"
				>{$t('common.generate')}</span
			>
		</div>
		<p class="px-2 sm:px-6">
			Generate bound drops using your own RAM or unbound drops using tokens.
		</p>
		<div class="p-2 sm:p-6 space-y-8 shadow-xl rounded-lg">
			<form class="space-y-8" on:submit|preventDefault={generate}>
				<div>
					<p>Select bound vs unbound</p>
					<RadioGroup>
						<RadioItem bind:group={$createBound} name="justify" value={true}>Bound</RadioItem>
						<RadioItem bind:group={$createBound} name="justify" value={false}>Unbound</RadioItem>
					</RadioGroup>
				</div>
				<label class="label">
					<span>{$t('generate.togenerate')}</span>
					<select class="select" on:change={selectDropAmount} value={$dropsAmount}>
						{#each [1, 10, 100, 1000, 10000, 'X'] as amount}
							<option value={amount}>+ {amount.toLocaleString()} {$t('common.itemnames')}</option>
						{/each}
					</select>
				</label>
				{#if $customDropsAmount}
					<label class="label">
						<span>{$t('generate.enteramount')}</span>
						<input
							class="input"
							class:input-error={!$hasEnoughTokens}
							type="text"
							bind:value={$customDropsValue}
						/>
						{#if !$hasEnoughTokens}
							<p class="text-red-500">Not enough tokens</p>
						{/if}
					</label>
				{/if}
				<!-- <label>
                            <label class="flex items-center space-x-2">
                                <input
                                    class="checkbox"
                                    type="checkbox"
                                    checked={$useRandomDrop}
                                    on:change={(e) => useRandomDrop.set(e.target?.checked)}
                                />
                                <p>Randomly generate drops value</p>
                            </label>
                        </label> -->
				{#if !$useRandomDrop}
					<label class="label space-y-4">
						<span class="h4 font-bold"
							>{$t('generate.dropseedvalue', { itemname: $t('common.itemname') })}</span
						>
						<input class="input" type="text" placeholder="Random Drop" value={$randomDrop} />
					</label>
				{/if}
				<div class="table-container">
					<table class="table">
						<thead>
							<tr>
								<th class="text-center table-cell-fit">Change</th>
								<th class="text-center">Balance</th>
								<th class="text-center">Delta</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<th class="table-cell-fit px-6">Drops</th>
								<td class="text-center">
									{#if $accountContractBalance}
										{$accountContractDrops.toLocaleString()}
									{:else}
										0
									{/if}
								</td>
								<td class="text-center">
									<span class="text-green-500">
										+ {$derivedDropsAmount.toLocaleString()}
									</span>
								</td>
							</tr>
							{#if $totalPrice > 0}
								<tr>
									<th class="table-cell-fit px-6">EOS (Balance)</th>
									<td class="text-center">
										{#if $accountTokenBalance}
											{Number($accountTokenBalance.value).toLocaleString()}
										{:else}
											0
										{/if}
									</td>
									<td class="text-center">
										<span class="text-yellow-500">
											- {Number(Asset.fromUnits($totalPrice, '4,EOS').value).toLocaleString()}
										</span>
									</td>
								</tr>
							{/if}
							{#if !$createBound && $accountContractBalance && $totalRamCreditsToUse > 0}
								<tr>
									<th class="table-cell-fit px-6">RAM (Credits)</th>
									<td class="text-center">
										{#if $accountContractBalance}
											{Number($accountContractBalance.ram_bytes).toLocaleString()}
										{:else}
											0
										{/if}
									</td>
									<td class="text-center">
										<span class="text-yellow-500">
											- {$totalRamCreditsToUse.toLocaleString()}
										</span>
									</td>
								</tr>
							{/if}
							{#if $createBound && $ramPrice && $totalRamRequired > 0 && $accountRamBalance < $totalRamRequired}
								<tr>
									<th class="table-cell-fit px-6">RAM (Purchase)</th>
									<td class="text-center">
										{#if $accountRamBalance}
											{Asset.from($accountTokenBalance.value, '4,EOS')}
										{:else}
											0
										{/if}
									</td>
									<td class="text-center">
										<span class="text-yellow-500">
											- {Asset.fromUnits($totalRamRequired * $ramPrice, '4,EOS')}
										</span>
									</td>
								</tr>
							{/if}
							{#if $createBound && $totalRamRequired > 0 && $accountRamBalance >= $totalRamRequired}
								<tr>
									<th class="table-cell-fit px-6">RAM (Balance)</th>
									<td class="text-center">
										{#if $accountRamBalance}
											{$accountRamBalance.toLocaleString()}
										{:else}
											0
										{/if}
									</td>
									<td class="text-center">
										<span class="text-yellow-500">
											- {$totalRamRequired.toLocaleString()}
										</span>
									</td>
								</tr>
							{/if}
						</tbody>
					</table>
				</div>
				{#if $lastResultError}
					<aside class="alert variant-filled-error">
						<div><AlertCircle /></div>
						<div class="alert-message">
							<h3 class="h3">{$t('common.transacterror')}</h3>
							<p>{$lastResultError}</p>
						</div>
						<div class="alert-actions"></div>
					</aside>
				{/if}
				{#if $lastResult}
					<div class="table-container">
						<table class="table">
							<thead>
								<tr>
									<th
										colspan="3"
										class="text-center variant-filled w-full bg-gradient-to-br from-green-500 to-green-700 box-decoration-clone"
									>
										<div class="text-white">
											{$t('common.transactsuccess')}
										</div>
										<div class="lowercase text-xs text-white hidden sm:block">
											{$transactBatchProgress} / {$transactBatchSize}
										</div>
									</th>
								</tr>
							</thead>
						</table>
					</div>
				{/if}
				{#if $session}
					<button
						class="btn btn-lg variant-filled w-full bg-gradient-to-br from-blue-300 to-cyan-400 box-decoration-clone"
						disabled={!$canGenerate}
					>
						<span>
							{#if $transacting}
								<Loader2 class="animate-spin" />
							{:else}
								<MemoryStick />
							{/if}
						</span>
						<span class="text-sm">
							{$t('common.generate')}
						</span>
					</button>
				{:else}
					<aside class="alert variant-filled-error">
						<div><AlertCircle /></div>
						<div class="alert-message">
							<h3 class="h3">{$t('common.signinfirst')}</h3>
							<p>{$t('generate.signinfirst')}</p>
						</div>
						<div class="alert-actions"></div>
					</aside>
				{/if}
			</form>
		</div>
		{#if devmode}
			<div class="text-center space-y-2">
				<div class="h1">DEV TOOLS</div>
				<p>
					<span>Account RAM Balance:</span>
					<span>{Number($accountRamBalance).toLocaleString()} bytes</span>
				</p>
				<p>
					<span>Account Token Balance:</span>
					<span>{$accountTokenBalance}</span>
				</p>

				{#if $accountContractBalance}
					<p>
						<span>Contract RAM Balance:</span>
						<span>{Number($accountContractBalance.ram_bytes).toLocaleString()} kb</span>
					</p>
					<button
						class="btn btn-lg variant-filled w-full bg-gradient-to-br from-blue-300 to-cyan-400 box-decoration-clone"
						on:click|preventDefault={claim}
					>
						claim
					</button>
					<button
						class="btn btn-lg variant-filled w-full bg-gradient-to-br from-blue-300 to-cyan-400 box-decoration-clone"
						on:click|preventDefault={deposit}
					>
						deposit 5 EOS
					</button>
					<button
						class="btn btn-lg variant-filled w-full bg-gradient-to-br from-blue-300 to-cyan-400 box-decoration-clone"
						on:click|preventDefault={buyram}
					>
						buy 100kb ram
					</button>
					<button
						class="btn btn-lg variant-filled w-full bg-gradient-to-br from-blue-300 to-cyan-400 box-decoration-clone"
						on:click|preventDefault={sellram}
					>
						sell all ram
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
</style>
