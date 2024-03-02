<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import { Asset, Checksum256, Serializer, UInt64, Bytes } from '@wharfkit/session';
	import type { TableRowCursor } from '@wharfkit/contract';

	import { t } from '$lib/i18n';
	import ProofOfDrop from '$lib/components/headers/pos.svelte';
	import {
		DropsContract,
		session,
		dropsContract,
		contractKit,
		accountContractBalance
	} from '$lib/wharf';
	import { hex2bin } from '$lib/compute';
	import {
		epochNumber,
		epochRemaining,
		lastEpoch,
		lastEpochDrop,
		lastEpochRevealed,
		loadEpoch
	} from '$lib/epoch';
	import { onDestroy, onMount } from 'svelte';

	const loaded = writable(false);

	const dropsLoaded = writable(0);
	const dropsProcessed = writable(0);

	const dropsFound = writable(0);
	const dropsClaimed = writable(0);
	const dropsRedeemable = writable(0);
	const dropsResults: Writable<DropsResults[]> = writable([]);

	const demoBalance: Writable<Asset> = writable();

	const drops: Writable<DropsContract.Types.drop_row[]> = writable([]);
	const validdrops: Writable<DropsContract.Types.drop_row[]> = writable([]);

	interface DropsResults {
		drop: DropsContract.Types.drop_row;
		hash: string;
		valid: boolean;
	}

	session.subscribe(() => {
		loadBalance();
	});

	let epochInterval;
	onMount(() => {
		loadEpoch();
		epochInterval = setInterval(loadEpoch, 5000);
	});

	onDestroy(() => {
		clearInterval(epochInterval);
	});

	lastEpochDrop.subscribe((value) => {
		if (value) {
			loaddrops(value);
		} else {
			loaded.set(false);
		}
	});

	async function loadBalance() {
		if ($session) {
			const tokenContract = await contractKit.load('token.gm');
			const row = await tokenContract.table('accounts', $session.actor).get();
			if (row) {
				demoBalance.set(row.balance);
			}
		}
	}

	async function loaddrops(lastDrop: Checksum256) {
		if ($session) {
			loaded.set(false);

			// Reset all state
			dropsLoaded.set(0);
			dropsProcessed.set(0);
			dropsFound.set(0);
			dropsClaimed.set(0);
			dropsRedeemable.set(0);
			drops.set([]);
			validdrops.set([]);

			// const tokenContract = await contractKit.load('token.gm');
			// const claimed = await tokenContract.table('claims', 'DEMO').all();

			const from = Serializer.decode({
				data:
					Serializer.encode({ object: UInt64.from(UInt64.min) }).hexString +
					Serializer.encode({ object: $session.actor }).hexString,
				type: 'uint128'
			});

			const to = Serializer.decode({
				data:
					Serializer.encode({ object: UInt64.from(UInt64.max) }).hexString +
					Serializer.encode({ object: $session.actor }).hexString,
				type: 'uint128'
			});

			const cursor: TableRowCursor = await dropsContract.table('drop').query({
				key_type: 'i128',
				index_position: 'secondary',
				from,
				to
			});

			const accumulator: DropsContract.Types.drop_row[] = [];
			while (!cursor.endReached) {
				const rows = await cursor.next();
				accumulator.push(...rows);
				dropsLoaded.set(accumulator.length);
			}

			const results: DropsResults[] = [];
			dropsFound.set(accumulator.length);

			const validToSubmit: DropsContract.Types.drop_row[] = accumulator.reduce(
				(acc: DropsContract.Types.drop_row[], row: DropsContract.Types.drop_row) => {
					dropsProcessed.update((s) => s + 1);
					const result = {
						drop: row,
						hash: '',
						valid: false
					};
					// const validEpoch = Number(row.created) <= Number($lastEpoch);
					// console.log(validEpoch);
					// if (!validEpoch) {
					// 	return acc;
					// }
					const combined = String(lastDrop) + String(row.seed);
					const hash = Checksum256.hash(Bytes.from(combined, 'utf8'));
					result.hash = String(hash);
					// Difficulty is 2
					if (String(hash).startsWith('00')) {
						result.valid = true;
						dropsRedeemable.update((s) => s + 1);
						acc.push(row);
					}
					results.push(result);
					return acc;
				},
				[]
			);
			results.sort((a, b) => (b.valid ? 1 : 0) - (a.valid ? 1 : 0));
			dropsResults.set(results);
			loaded.set(true);
			drops.set(accumulator);
			validdrops.set(validToSubmit);
		}
	}

	async function claim() {
		if ($session) {
			const action = dropsContract.action('destroy', {
				owner: $session?.actor,
				droplet_ids: $validdrops.map((s) => s.seed),
				memo: '',
				to_notify: 'token.gm'
			});
			$session.transact({ action });
			accountContractBalance.update((current) => {
				return {
					...current,
					ram_bytes: 0
				};
			});
			loaded.set(false);
			setTimeout(() => {
				loadBalance();
				loaddrops($lastEpochDrop);
			}, 1000);
		}
	}
</script>

<div class="container p-4 sm:p-8 lg:p-16 mx-auto flex justify-center items-center">
	<div class="space-y-4 flex flex-col bg-surface-900 p-8 rounded-lg shadow-xl">
		<ProofOfDrop />
		<p>
			An experimental system to distribute new tokens using a "Proof of {$t('common.itemnames')}"
			algorithm. This system allows users to destroy qualifying {$t('common.itemnames')} to mint new
			tokens, so long as they meet the difficulty requirement.
		</p>
		{#if !$lastEpochRevealed}
			<section class="card w-full">
				<div class="p-4 space-y-4">
					<div class="text-center h3">Waiting for next Epoch ({$lastEpoch}) to process...</div>
					<div class="grid grid-cols-3 gap-8">
						<div class="placeholder animate-pulse" />
						<div class="placeholder animate-pulse" />
						<div class="placeholder animate-pulse" />
					</div>
					<div class="grid grid-cols-4 gap-4">
						<div class="placeholder animate-pulse" />
						<div class="placeholder animate-pulse" />
						<div class="placeholder animate-pulse" />
						<div class="placeholder animate-pulse" />
					</div>
				</div>
			</section>
		{:else if !$loaded}
			<section class="card w-full">
				<div class="p-4 space-y-4">
					<div class="text-center h3">
						{$dropsLoaded}
						{$t('common.itemnames')} loaded...
					</div>
					<div class="grid grid-cols-3 gap-8">
						<div class="placeholder animate-pulse" />
						<div class="placeholder animate-pulse" />
						<div class="placeholder animate-pulse" />
					</div>
					<div class="grid grid-cols-4 gap-4">
						<div class="placeholder animate-pulse" />
						<div class="placeholder animate-pulse" />
						<div class="placeholder animate-pulse" />
						<div class="placeholder animate-pulse" />
					</div>
				</div>
			</section>
		{:else if $drops.length}
			<div class="table-container text-center space-y-4">
				<div class="p-6 space-y-4">
					{#if $dropsRedeemable > 0}
						<div class="h6">
							{$validdrops.length}
							{$t('common.itemnames')} valid for Epoch {$lastEpoch}
						</div>
						<div class="h2 text-center">
							+ {Asset.from($validdrops.length, '4,DEMO')}
						</div>
					{:else if $dropsClaimed > 0}
						<div class="h4">
							You have already claimed all your {$t('common.itemnames')} this epoch.
						</div>
					{:else}
						<div class="h4">None of your {$t('common.itemnames')} qualified to claim.</div>
					{/if}
					<div>
						Next claim period begins in {$epochRemaining} seconds
					</div>
				</div>
				<div class="text-sm">
					Out of your <span class="font-bold">{$dropsFound.toLocaleString()}</span>
					{$t('common.itemnames')},
					<span class="font-bold">{$dropsRedeemable.toLocaleString()}</span>
					are available and successful in meeting the difficulty requirement allowing you to mint tokens
					for this epoch. You have already redeemed
					<span class="font-bold">{$dropsClaimed.toLocaleString()}</span> of your valid {$t(
						'common.itemnames'
					)}.
				</div>
				<p class="font-bolt">You currently have {$demoBalance}</p>
				<button
					class="btn btn-lg variant-filled w-full bg-gradient-to-br from-purple-500 to-blue-300 box-decoration-clone"
					on:click={claim}
					disabled={$dropsRedeemable <= 0}
				>
					{#if $dropsRedeemable > 0}
						Destroy {$validdrops.length} {$t('common.itemnames')} to Claim Tokens
					{:else}
						No claim available
					{/if}
				</button>
			</div>
			<div class="space-y-6 mt-100">
				<div class="h2">Hashing Results</div>
				<p>
					The following table shows the results of hashing the Drop's value with the last epoch's
					revealed seed. If the hash starts with "00" then the drop is valid and can be converted
					into a token by destroying it. The RAM backing the Drop will be released to the owner of
					the Drop.
				</p>
				<div class="table-container">
					<table class="table">
						<thead>
							<tr>
								<th>Valid?</th>
								<th>Seed</th>
								<th>Hashed</th>
							</tr>
						</thead>
						<tbody>
							{#each $dropsResults as drop}
								<tr>
									<td>
										{#if drop.valid}
											<span class="text-green-500">Valid</span>
										{:else}
											<span class="text-red-500">Invalid</span>
										{/if}
									</td>
									<td class="font-mono">{Bytes.from(drop.drop.seed.byteArray)}</td>
									<td class="font-mono">{drop.hash}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{:else}
			<div class="h4">
				<div class="p-6 space-y-4 text-center">
					<p>{$t('inventory.none')}</p>
				</div>
			</div>
		{/if}
	</div>
</div>
