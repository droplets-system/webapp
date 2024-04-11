<script lang="ts">
	import { derived, writable, type Writable } from 'svelte/store';
	import { Lock } from 'svelte-lucide';
	import { Paginator, type PaginationSettings } from '@skeletonlabs/skeleton';
	import { Bytes } from '@wharfkit/session';

	import { t } from '$lib/i18n';
	import { DropsContract } from '$lib/wharf';

	export let drops: Writable<DropsContract.Types.drop_row[]>;
	export let selected: Writable<Record<string, boolean>> = writable({});
	export let selectingAll: Writable<boolean>;
	export let paginationSettings: PaginationSettings;
	export let loaded: Writable<boolean>;
	export let onPageChange: (e: CustomEvent) => void;
	export let onAmountChange: (e: CustomEvent) => void;

	const searchingFor: Writable<string> = writable();
	const filteredDrops = derived([drops, searchingFor], ([$drops, $searchingFor]) => {
		return $drops;
		return $drops.filter((row) => {
			if ($searchingFor) {
				const matchesInt = String(row.seed).includes($searchingFor);
				const matchesHex = String(Bytes.from(row.seed.byteArray)).includes($searchingFor);
				return matchesInt || matchesHex;
			}
			return true;
		});
	});

	function selectDrop(e: Event) {
		if (e.target) {
			const { checked, value } = e.target as HTMLInputElement;
			if (checked) {
				selected.update((s) => {
					s[value] = true;
					return s;
				});
			} else {
				selected.update((s) => {
					delete s[value];
					return s;
				});
			}
		}
	}

	function selectAll(e: Event) {
		if (e.target) {
			const { checked } = e.target as HTMLInputElement;
			if (checked) {
				selectingAll.set(true);
				selected.update((current) => {
					$filteredDrops.forEach((s) => (current[String(s.seed)] = true));
					return current;
				});
			} else {
				selectingAll.set(false);
				selected.set({});
			}
		}
	}
</script>

<div class="table-container space-y-4">
	<table class="table">
		<thead>
			<tr>
				<th colspan="4">
					<Paginator
						active="bg-blue-300"
						bind:settings={paginationSettings}
						on:page={onPageChange}
						on:amount={onAmountChange}
						showFirstLastButtons={false}
						showPreviousNextButtons={true}
						showNumerals
						maxNumerals={1}
					/>
				</th>
			</tr>
			<!-- <tr>
				<td class="p-4" colspan="4">
					<label class="label">
						<input
							bind:value={$searchingFor}
							class="input rounded"
							type="text"
							placeholder={$t('common.search')}
						/>
					</label>
				</td>
			</tr> -->
			<tr>
				<th class="text-center table-cell-fit">
					<input type="checkbox" checked={$selectingAll} on:change={selectAll} />
				</th>
				<th class="table-cell-fit">{$t('common.itemname')}</th>
				<th class="text-center">{$t('common.bound')}</th>
			</tr>
		</thead>
		<tbody>
			{#if $loaded}
				{#each $filteredDrops as drop}
					<tr>
						<td class="text-center">
							{#if $selectingAll}
								<input checked type="checkbox" disabled />
							{:else}
								<input
									checked={$selected[String(drop.seed)]}
									type="checkbox"
									on:change={selectDrop}
									value={drop.seed}
								/>
							{/if}
						</td>
						<td>
							<p class="text-lg font-mono">{Bytes.from(drop.seed.byteArray)}</p>
							<p class="text-xs font-mono">{drop.created}</p>
						</td>
						<td class="flex justify-center items-center">
							{#if drop.bound}
								<Lock />
							{/if}
						</td>
					</tr>
				{/each}
			{:else}
				<tr>
					<td colspan="10">
						<div class="text-center h2">{$t('common.loading')}</div>
					</td>
				</tr>
			{/if}
		</tbody>
		<tfoot class="p-12">
			<tr>
				<td colspan="4">
					<Paginator
						active="bg-blue-300"
						bind:settings={paginationSettings}
						on:page={onPageChange}
						on:amount={onAmountChange}
						showFirstLastButtons={false}
						showPreviousNextButtons={true}
						showNumerals
						maxNumerals={1}
					/>
				</td>
			</tr>
		</tfoot>
	</table>
</div>
