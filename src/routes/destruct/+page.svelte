<script lang="ts">
	import { Asset, UInt64, type TransactResult } from '@wharfkit/session';
	import { ProgressBar, getModalStore } from '@skeletonlabs/skeleton';
	import { AlertCircle, PackageX } from 'svelte-lucide';
	import { page } from '$app/stores';

	import { t } from '$lib/i18n';
	import {
		DropsContract,
		client,
		dropletsAPI,
		dropsContract,
		loadAccountData,
		session,
		sessionKey
	} from '$lib/wharf';
	import { loadRamPrice } from '$lib/bancor';
	import { maximumBatchSize } from '$lib/constants';
	import {
		lastResultError,
		transacting,
		transactBatchSize,
		transactBatchProgress,
		lastResultId,
		lastResult,
		actionRequiresSessionKey
	} from '../generate/generate';
	import { loadEpoch, lastEpochRevealed } from '$lib/epoch';
	import { onMount, onDestroy } from 'svelte';
	import { type Writable, writable } from 'svelte/store';

	export const modalStore = getModalStore();
	export const devmode = $page.url.searchParams.has('dev');
	export const batch = Number($page.url.searchParams.get('batch'));
	const maxPerTransaction = batch || maximumBatchSize;

	const connected = writable(false);

	// Whether the Drops are currently loaded
	const loaded = writable(false);

	// Whether the Drops are being loaded
	const loading = writable(false);

	const ownedDrops = writable(0);
	const limit = writable(Number.MAX_SAFE_INTEGER);
	const limitSet = writable(false);

	const droplets: Writable<UInt64[]> = writable([]);

	const processed = writable(0);

	let pingInterval: ReturnType<typeof setInterval>;

	const dropsTotal = writable(0);
	const dropsProcessed = writable(0);

	async function loadDroplets(skip = 0) {
		if ($session && !$loading) {
			loading.set(true);
			await fetch(
				dropletsAPI + `/get/droplets?account=${$session.actor}&skip=${skip}&limit=${toLoad}`
			)
				.then((res) => res.json())
				.then(async (data) => {
					droplets.update((current) => [
						...current,
						...data.droplets.map((d: any) => UInt64.from(d._id))
					]);
					// droplets.set(data.droplets.map((d: any) => UInt64.from(d._id)));
					dropsTotal.set(data.total);
					if ($dropsTotal > 0 && $droplets.length < $dropsTotal) {
						loading.set(false);
						if ($droplets.length === $ownedDrops || $droplets.length >= $limit) {
							loaded.set(true);
						} else {
							await loadDroplets($droplets.length);
						}
					} else {
						loaded.set(true);
						loading.set(false);
					}
				});
		}
	}

	async function loadTotal() {
		if ($session) {
			const balance = await dropsContract
				.table('balances')
				.get(String($session.actor), { scope: 'drops' });
			ownedDrops.set(Number(balance?.drops) || 0);
			limit.set(Number(balance?.drops) || 0);
		}
	}

	setInterval(() => {
		if (!$ownedDrops) {
			loadTotal();
		}
		if ($droplets.length === 0 && $limitSet) {
			loadDroplets();
		}
	}, 2000);

	function resetDropsState() {
		droplets.set([]);
		dropsProcessed.set(0);
		dropsTotal.set(0);
		loaded.set(false);
	}

	session.subscribe(() => {
		resetDropsState();
		// loadDroplets();
	});

	onMount(() => {
		// loadDroplets();
		loadEpoch();
		loadTotal();
	});

	onDestroy(() => {
		clearInterval(pingInterval);
	});

	async function selfDestruct() {
		lastResultError.set('');
		lastResult.set(undefined);
		lastResultId.set(undefined);
		transacting.set(true);
		transactBatchSize.set(0);
		transactBatchProgress.set(0);

		const amount = $dropsTotal;
		const batches = Math.ceil($limit / maxPerTransaction);
		if (batches > 1) {
			const batchSizes = Array.from({ length: batches }, (_, idx) =>
				idx === batches - 1 && amount % maxPerTransaction > 0
					? amount % maxPerTransaction
					: maxPerTransaction
			);
			transactBatchSize.set(batchSizes.length);
			for (const [i, batchSize] of batchSizes.entries()) {
				// for (const batchSize of batchSizes) {
				const start = 0 + maxPerTransaction * i;
				const end = maxPerTransaction * i + batchSize;
				const batch = Array.from([...$droplets]).slice(start, end);
				await destroy(batch);
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
			await destroy(Array.from([...$droplets]));
			transactBatchProgress.set(1);
		}

		transacting.set(false);
	}

	async function destroy(droplet_ids: UInt64[]) {
		if ($session) {
			const actions = [
				dropsContract.action('destroy', {
					owner: $session.actor,
					droplet_ids
				})
			];

			let result: TransactResult;
			try {
				if ($sessionKey) {
					result = await $session.localTransact({ actions });
				} else {
					result = await $session.transact({ actions });
				}
				// Set the last successful transaction ID
				lastResultId.set(String(result.resolved?.transaction.id));
			} catch (e) {
				lastResult.set(undefined);
				lastResultId.set(undefined);
				lastResultError.set(String(e));
				resetDropsState();
				// loadDroplets();
			}
		}
	}
</script>

<div class="container p-4 sm:p-8 lg:p-16">
	<div class="mx-auto py-4 sm:p-4 space-y-4 bg-surface-900 rounded-lg shadow-xl">
		<div class="h1 flex items-center px-2 sm:px-6">
			<PackageX class="dark:text-orange-400 inline size-12 mr-4" />
			<span class="leading-snug dark:text-orange-400">{$t('common.selfdestruct.title')}</span>
		</div>
		<p class="px-2 sm:px-6">
			{$t('common.selfdestruct.description', { itemnames: $t('common.itemnames') })}
		</p>
		{#if $limit === Number.MAX_SAFE_INTEGER}
			<p>Loading...</p>
		{:else if $limitSet === false}
			<p>
				{$t('common.selfdestruct.total', {
					itemnames: $t('common.itemnames'),
					default: 'Enter the maximum amount to destroy:'
				})}
			</p>
			<input class="input" type="text" bind:value={$limit} />
			<button class="btn bg-red-400" on:click={() => limitSet.set(true)}>Load Droplets</button>
		{:else if $loading || !$loaded}
			<p>Loading Droplets: {$droplets.length}/{$limit}</p>
			<ProgressBar value={$droplets.length} max={$limit} />
		{:else if $dropsTotal === 0}
			<p>You have no Droplets to destroy.</p>
		{:else}
			{#if $transacting}
				<p>Progress: {$transactBatchProgress}/{$transactBatchSize}</p>
				<ProgressBar value={$transactBatchProgress} max={$transactBatchSize} />
			{/if}
			<button class="btn bg-red-400" on:click={selfDestruct} disabled={!$loaded || $transacting}
				>{$t('common.selfdestruct.button', {
					itemnames: $t('common.itemnames'),
					count: $droplets.length
				})}</button
			>
			<p>
				Destroying all of your Droplets will require approximately {($dropsTotal * 10) / 1000} ms of
				CPU and {($dropsTotal * 9) / 1000} kb of NET. Make sure to Powerup your account enough to perform
				these operations before beginning.
			</p>
		{/if}
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
					<p>
						{$t('generate.reqskdesc', { max: maximumBatchSize, itemnames: $t('common.itemnames') })}
					</p>
				</div>
			</aside>
		{/if}
	</div>
</div>

<style lang="postcss">
</style>
