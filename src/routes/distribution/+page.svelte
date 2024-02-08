<script lang="ts">
	import { t } from '$lib/i18n';
	import { sizeDropRow, sizeDropRowPurchase } from '$lib/constants';
	import { DropsContract, dropsContract } from '$lib/wharf';
	import type { Readable } from 'svelte/motion';
	import { derived, writable } from 'svelte/store';
	import { Asset, Name, UInt64 } from '@wharfkit/session';
	import { PieChart } from 'svelte-lucide';

	const ramPrice = writable(0);
	const totaldrops = writable(0);

	const accounts: Readable<DropsContract.Types.balances_row[]> = derived(
		[ramPrice],
		([$ramPrice], set) => {
			dropsContract
				.table('balances')
				.all()
				.then((results) => {
					const sorted = results
						.sort((a, b) => {
							return Number(b.drops) - Number(a.drops);
						})
						.filter((s) => Number(s.drops) > 0 && !s.owner.equals('drops'));

					totaldrops.set(sorted.reduce((t, result) => t + Number(result.drops), 0));
					set(sorted);
				});
			set([]);
		}
	);
</script>

<div class="container p-4 sm:p-8 lg:p-16">
	<div class="mx-auto py-4 sm:p-4 space-y-4 bg-surface-900 rounded-lg shadow-xl">
		<div class="h1 flex items-center px-2 sm:px-6">
			<PieChart class="dark:text-purple-400 inline size-12 mr-4" />
			<span
				class="leading-snug bg-gradient-to-br from-purple-300 to-blue-300 bg-clip-text text-transparent box-decoration-clone"
				>{$t('common.distribution')}</span
			>
		</div>
		<p>{$t('common.distributiondescription')}</p>
		<table class="table">
			<thead>
				<tr>
					<th />
					<th>{$t('common.accountname')}</th>
					<th class="text-right">%</th>
					<th class="text-right">{$t('common.ramkb')}</th>
					<th class="text-right">{$t('common.itemnames')}</th>
				</tr>
			</thead>
			<tbody>
				{#each $accounts as row, index}
					<tr>
						<td class="text-right">{index + 1}</td>
						<td>
							<a href={`https://bloks.io/account/{$row.account}`}>
								<span class="font-bold text-blue-300">
									{row.owner}
								</span>
							</a>
						</td>
						<td class="text-right font-mono"
							>{((Number(row.drops) / $totaldrops) * 100).toLocaleString()}%</td
						>
						<td class="text-right font-mono"
							>{((Number(row.drops) * sizeDropRow) / 1024).toLocaleString(undefined, {
								minimumFractionDigits: 3,
								maximumFractionDigits: 3
							})}</td
						>
						<td class="text-right font-mono">{Number(row.drops).toLocaleString()}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style lang="postcss">
</style>
