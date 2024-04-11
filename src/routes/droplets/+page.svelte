<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import { AlertCircle, Combine, Lock, PackageX, Unlock } from 'svelte-lucide';
	import { Serializer, UInt64 } from '@wharfkit/session';
	import { TabGroup, Tab, type PaginationSettings } from '@skeletonlabs/skeleton';

	import { t } from '$lib/i18n';
	import MyItems from '$lib/components/headers/myitems.svelte';
	import DropsTable from '$lib/components/drops/table.svelte';
	import DropUnbind from '$lib/components/drops/unbind.svelte';
	import DropBind from '$lib/components/drops/bind.svelte';
	import DropDestroy from '$lib/components/drops/destroy.svelte';
	import DropTransfer from '$lib/components/drops/transfer.svelte';

	import { DropsContract, session, dropsContract } from '$lib/wharf';
	import type { TableRowCursor } from '@wharfkit/contract';
	import { loadDroplets } from '$lib/api';

	const loaded = writable(false);
	const selected: Writable<Record<string, boolean>> = writable({});
	const selectingAll = writable(false);

	const drops: Writable<DropsContract.Types.drop_row[]> = writable([]);
	const dropsLoaded = writable(0);
	const dropsFound = writable(0);

	const page = writable(0);
	const limit = writable(10);

	const paginationSettings = {
		page: 0,
		limit: 10,
		size: 20,
		amounts: [10, 25, 100, 500, 1000, 2500]
	} satisfies PaginationSettings;

	$: paginationSettings.size = $dropsFound;

	function onPageChange(e: CustomEvent): void {
		page.set(e.detail);
		loaddrops();
	}

	function onAmountChange(e: CustomEvent): void {
		limit.set(e.detail);
		loaddrops();
	}

	// $: paginatedSource = $filteredDrops.slice(
	// 	paginationSettings.page * paginationSettings.limit,
	// 	paginationSettings.page * paginationSettings.limit + paginationSettings.limit
	// );

	session.subscribe(() => loaddrops());

	async function loaddrops() {
		if ($session) {
			loaded.set(false);
			const skip = $page * $limit;
			const result = await loadDroplets($session.actor, skip, $limit);
			drops.set(result.droplets);
			dropsFound.set(result.total);
			dropsLoaded.set(result.droplets.length);
			loaded.set(true);
		}
	}
	// async function loaddrops() {
	// 	if ($session) {
	// 		loaded.set(false);

	// 		// Reset all state
	// 		dropsLoaded.set(0);
	// 		dropsProcessed.set(0);
	// 		dropsFound.set(0);
	// 		dropsClaimed.set(0);
	// 		drops.set([]);

	// 		const from = Serializer.decode({
	// 			data:
	// 				Serializer.encode({ object: UInt64.from(UInt64.min) }).hexString +
	// 				Serializer.encode({ object: $session.actor }).hexString,
	// 			type: 'uint128'
	// 		});

	// 		const to = Serializer.decode({
	// 			data:
	// 				Serializer.encode({ object: UInt64.from(UInt64.max) }).hexString +
	// 				Serializer.encode({ object: $session.actor }).hexString,
	// 			type: 'uint128'
	// 		});

	// 		const cursor: TableRowCursor = await dropsContract.table('drop').query({
	// 			key_type: 'i128',
	// 			index_position: 'secondary',
	// 			rowsPerAPIRequest: 10000,
	// 			from,
	// 			to
	// 		});

	// 		const accumulator: DropsContract.Types.drop_row[] = [];
	// 		while (!cursor.endReached) {
	// 			const rows = await cursor.next();
	// 			accumulator.push(...rows);
	// 			dropsLoaded.set(accumulator.length);
	// 		}

	// 		dropsFound.set(accumulator.length);
	// 		loaded.set(true);
	// 		drops.set(accumulator);
	// 	}
	// }

	function resetSelected() {
		selected.set({});
		selectingAll.set(false);
	}

	let tabSet: number = 1;
</script>

<!-- <div class="container p-4 sm:p-8 lg:p-16">
	<div class="mx-auto py-4 sm:p-4 space-y-4 bg-surface-900 rounded-lg shadow-xl">
		<div class="h1 flex items-center px-2 sm:px-6"> -->

<div class="container p-4 sm:p-8 lg:p-16">
	<div
		class="mx-auto py-4 sm:p-4 space-y-4 bg-surface-900 rounded-lg shadow-xl grid lg:grid-cols-4 2xl:grid-cols-7"
	>
		<div class="lg:col-span-2 2xl:col-span-3">
			<MyItems format="h1 px-2 sm:px-6 mb-6" />
			<TabGroup justify="justify-center" flex="flex-auto">
				<Tab bind:group={tabSet} name="tab1" value={1} on:click={resetSelected}>
					<svelte:fragment slot="lead">
						<Combine class={`dark:text-green-400 inline size-6 mr-2`} />
					</svelte:fragment>
					<span class="font-bold">{$t('common.transfer')}</span>
				</Tab>
				<Tab bind:group={tabSet} name="tab3" value={3} on:click={resetSelected}>
					<svelte:fragment slot="lead">
						<Lock class={`dark:text-blue-400 inline size-6 mr-2`} />
					</svelte:fragment>
					<span class="font-bold">{$t('common.bind')}</span>
				</Tab>
				<Tab bind:group={tabSet} name="tab4" value={4} on:click={resetSelected}>
					<svelte:fragment slot="lead">
						<Unlock class={`dark:text-orange-400 inline size-6 mr-2`} />
					</svelte:fragment>
					<span class="font-bold">{$t('common.unbind')}</span>
				</Tab>
				<Tab bind:group={tabSet} name="tab2" value={2} on:click={resetSelected}>
					<svelte:fragment slot="lead">
						<PackageX class={`dark:text-pink-400 inline size-6 mr-2`} />
					</svelte:fragment>
					<span class="font-bold">{$t('common.destroy')}</span>
				</Tab>
				<svelte:fragment slot="panel">
					{#if tabSet === 1}
						<DropTransfer {drops} {selected} {selectingAll} />
					{:else if tabSet === 2}
						<DropDestroy {drops} {selected} {selectingAll} />
					{:else if tabSet === 3}
						<DropBind {drops} {selected} {selectingAll} />
					{:else if tabSet === 4}
						<DropUnbind {drops} {selected} {selectingAll} />
					{/if}
				</svelte:fragment>
			</TabGroup>
		</div>
		<div class="lg:col-span-2 2xl:col-span-4">
			<div class="p-8">
				{#if !$session}
					<div class="p-4 space-y-4">
						<aside class="alert variant-filled-error">
							<div><AlertCircle /></div>
							<div class="alert-message">
								<h3 class="h3">{$t('common.signinfirst')}</h3>
								<p>{$t('inventory.signinfirst', { itemnames: $t('common.itemnames') })}</p>
							</div>
							<div class="alert-actions"></div>
						</aside>
					</div>
				{:else if $drops.length}
					<div class="space-y-8">
						<DropsTable
							{drops}
							{loaded}
							{onAmountChange}
							{onPageChange}
							{paginationSettings}
							{selected}
							{selectingAll}
						/>
					</div>
				{:else}
					<div class="p-4 space-y-4">
						<aside class="alert variant-filled-warning">
							<div><AlertCircle /></div>
							<div class="alert-message">
								<h3 class="h3">{$t('inventory.none', { itemnames: $t('common.itemnames') })}</h3>
							</div>
							<div class="alert-actions"></div>
						</aside>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<div class="container mx-auto xl:columns-2 columns-1 rounded-lg shadow-xl bg-surface-900"></div>
