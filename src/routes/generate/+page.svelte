<script lang="ts">
	import {
		Asset,
		Bytes,
		Checksum256,
		Serializer,
		type TransactResult,
		type TransactResultReturnValue
	} from '@wharfkit/session';
	import { RadioGroup, RadioItem, type ModalSettings, getModalStore } from '@skeletonlabs/skeleton';
	import { AlertCircle, Loader2, MemoryStick, PackagePlus } from 'svelte-lucide';
	import { page } from '$app/stores';

	import { t } from '$lib/i18n';
	import {
		DropsContract,
		accountContractBalance,
		accountContractDrops,
		accountContractRam,
		accountRamBalance,
		accountTokenBalance,
		dropsContract,
		loadAccountData,
		session,
		sessionKey,
		systemContract,
		tokenContract
	} from '$lib/wharf';
	import { loadRamPrice, ramPrice, ramPricePlusFee } from '$lib/bancor';
	import { maximumBatchSize, sizeDropRow, sizeDropRowPurchase } from '$lib/constants';
	import {
		lastResultError,
		transacting,
		transactBatchSize,
		transactBatchProgress,
		lastResultId,
		lastResult,
		customDropsAmount,
		dropsAmount,
		derivedDropsAmount,
		createBound,
		totalRamRequired,
		customDropsValue,
		hasEnoughTokens,
		useRandomDrop,
		randomDrop,
		totalPrice,
		totalRamCreditsToUse,
		canGenerate,
		randomName
	} from './generate';

	import DevTools from './devtools.svelte';
	import { derived } from 'svelte/store';

	export const modalStore = getModalStore();
	export const devmode = $page.url.searchParams.has('dev');
	export const batch = Number($page.url.searchParams.get('batch'));
	const maxPerTransaction = batch || maximumBatchSize;

	const actionRequiresSessionKey = derived(
		[derivedDropsAmount, sessionKey],
		([$derivedDropsAmount, $sessionKey]) => {
			console.log($derivedDropsAmount, $sessionKey);
			return $derivedDropsAmount > maximumBatchSize && !$sessionKey;
		}
	);

	async function generate() {
		lastResultError.set('');
		transacting.set(true);
		transactBatchSize.set(0);
		transactBatchProgress.set(0);

		const amount = $derivedDropsAmount;

		const batches = Math.ceil(amount / maxPerTransaction);
		if (batches > 1) {
			const batchSizes = Array.from({ length: batches }, (_, idx) =>
				idx === batches - 1 && amount % maxPerTransaction > 0
					? amount % maxPerTransaction
					: maxPerTransaction
			);
			transactBatchSize.set(batchSizes.length);
			for (const batchSize of batchSizes) {
				await mint(batchSize, amount);
				if ($lastResultError) {
					break;
				}
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
		const hash = String(Checksum256.hash(Bytes.from(randomName(), 'utf8')));
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
				const depositRequired = $ramPricePlusFee * ($totalRamRequired - $accountContractRam);

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
				if ($sessionKey) {
					result = await $session.localTransact({ actions });
				} else {
					result = await $session.transact({ actions });
				}
				// result = await $session.transact({ actions });

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
						drops: $accountContractBalance.drops.adding(mintAmount),
						ram_bytes: $accountContractBalance.ram_bytes
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

	function help() {
		const modal: ModalSettings = {
			type: 'component',
			component: 'generateHelp'
		};
		modalStore.trigger(modal);
	}
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
			{$t('generate.description', { itemnames: $t('common.itemnames') })}
			<a class="hidden underline" href="#" on:click={help} on:keyup={help} tabindex="0"
				>{$t('common.leanmore')}</a
			>
		</p>
		<div class="p-2 sm:p-6 space-y-8 shadow-xl rounded-lg">
			<form class="space-y-8" on:submit|preventDefault={generate}>
				<div>
					<p>{$t('generate.selectbound')}</p>
					<RadioGroup>
						<RadioItem bind:group={$createBound} name="justify" value={true} disabled={$transacting}
							>{$t('common.bound')}</RadioItem
						>
						<RadioItem
							bind:group={$createBound}
							name="justify"
							value={false}
							disabled={$transacting}
						>
							{$t('common.unbound')}
						</RadioItem>
					</RadioGroup>
				</div>
				<label class="label">
					<span>{$t('generate.togenerate')}</span>
					<select
						class="select"
						on:change={selectDropAmount}
						value={$dropsAmount}
						disabled={$transacting}
					>
						{#each [1, 10, 100, 1000, 5000, 'X'] as amount}
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
							disabled={$transacting}
							type="text"
							bind:value={$customDropsValue}
						/>
						{#if !$hasEnoughTokens}
							<p class="text-red-500">{$t('common.insufficientbalance')}</p>
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
								<th class="text-center table-cell-fit">{$t('common.change')}</th>
								<th class="text-center">{$t('common.balance')}</th>
								<th class="text-center">{$t('common.delta')}</th>
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
									<th class="table-cell-fit px-6">EOS ({$t('common.balance')})</th>
									<td class="text-center">
										{#if $accountTokenBalance}
											{Number($accountTokenBalance.value).toLocaleString()}
										{:else}
											0
										{/if}
									</td>
									<td class="text-center">
										<span class="text-yellow-500">
											- {Number(Asset.fromUnits($totalPrice, '4,EOS').value)}
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
				{:else if $actionRequiresSessionKey}
					<aside class="alert variant-filled-error">
						<div><AlertCircle /></div>
						<div class="alert-message">
							<h3 class="h3">{$t('generate.reqsk')}</h3>
							<p>{$t('generate.reqskdesc')}</p>
						</div>
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
						disabled={!$canGenerate || $actionRequiresSessionKey}
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
			<DevTools />
		{/if}
	</div>
</div>

<style lang="postcss">
</style>
