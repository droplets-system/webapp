<script>
	import { t } from '$lib/i18n';
	import {
		accountContractBalance,
		accountContractDrops,
		accountTokenBalance,
		accountRamBalance
	} from '$lib/wharf';
	import {
		derivedDropsAmount,
		createBound,
		accountRamPurchasePrice,
		accountRamDepositPrice,
		contractBalanceToUse,
		accountRamPurchaseAmount,
		totalRamRequired
	} from '../generate';
	import { page } from '$app/stores';

	export const devmode = $page.url.searchParams.has('dev');
</script>

<div class="table-container">
	<table class="table">
		<thead>
			<tr>
				<th class="text-right table-cell-fit"></th>
				{#if devmode}
					<th class="text-center">{$t('common.balance')}</th>
				{/if}
				<th>{$t('common.change')}</th>
				{#if devmode}
					<th class="text-center">{$t('common.total')}</th>
				{/if}
			</tr>
		</thead>
		<tbody>
			<tr>
				<th class="table-cell-fit text-right px-6">Drops</th>
				{#if devmode}
					<td class="text-center">
						{#if $accountContractBalance}
							{$accountContractDrops.toLocaleString()}
						{:else}
							0
						{/if}
					</td>
				{/if}
				<td>
					<span class="text-green-500">
						+ {$derivedDropsAmount.toLocaleString()}
					</span>
				</td>
				{#if devmode}
					<td>
						{($accountContractDrops + $derivedDropsAmount).toLocaleString()}
					</td>
				{/if}
			</tr>
			{#if $createBound && $accountTokenBalance && $accountRamPurchasePrice.value > 0}
				<tr>
					<th class="table-cell-fit text-right px-6">EOS ({$t('common.balance')})</th>
					{#if devmode}
						<td class="text-center">
							{#if $accountTokenBalance}
								{Number($accountTokenBalance.value).toLocaleString()}
							{:else}
								0
							{/if}
						</td>
					{/if}
					<td>
						<span class="text-yellow-500">
							- {$accountRamPurchasePrice.value}
						</span>
					</td>
					{#if devmode}
						<td>
							{($accountTokenBalance.value - $accountRamPurchasePrice.value).toLocaleString()}
						</td>
					{/if}
				</tr>
			{/if}
			{#if !$createBound && $accountTokenBalance && $accountRamDepositPrice.value > 0}
				<tr>
					<th class="table-cell-fit text-right px-6">EOS ({$t('common.balance')})</th>
					{#if devmode}
						<td class="text-center">
							{#if $accountTokenBalance}
								{Number($accountTokenBalance.value).toLocaleString()}
							{:else}
								0
							{/if}
						</td>
					{/if}
					<td>
						<span class="text-yellow-500">
							- {$accountRamDepositPrice}
						</span>
					</td>
					{#if devmode}
						<td>
							{($accountTokenBalance.value - $accountRamDepositPrice.value).toLocaleString()}
						</td>
					{/if}
				</tr>
			{/if}
			{#if !$createBound && $accountContractBalance && $contractBalanceToUse > 0}
				<tr>
					<th class="table-cell-fit text-right px-6">RAM (Credits)</th>
					{#if devmode}
						<td>
							{#if $accountContractBalance}
								{Number($accountContractBalance.ram_bytes).toLocaleString()}
							{:else}
								0
							{/if}
						</td>
					{/if}
					<td>
						<span class="text-yellow-500">
							- {$contractBalanceToUse.toLocaleString()}
						</span>
					</td>
				</tr>
			{/if}
			{#if $createBound && $accountRamPurchaseAmount > 0}
				<tr>
					<th class="table-cell-fit text-right px-6">RAM (Purchase)</th>
					{#if devmode}
						<td class="text-center">
							{#if $accountRamBalance}
								{$accountRamBalance.toLocaleString()}
							{:else}
								0
							{/if}
						</td>
					{/if}
					<td>
						<span class="text-green-500">
							+ {$accountRamPurchaseAmount.toLocaleString()}
						</span>
					</td>
					{#if devmode}
						<td>
							{($accountRamBalance + $accountRamPurchaseAmount).toLocaleString()}
						</td>
					{/if}
				</tr>
			{/if}
			{#if $createBound && $totalRamRequired > 0}
				<tr>
					<th class="table-cell-fit text-right px-6">RAM ({$t('common.used')})</th>
					{#if devmode}
						<td class="text-center">
							{($accountRamBalance + $accountRamPurchaseAmount).toLocaleString()}
						</td>
					{/if}
					<td>
						<span class="text-yellow-500">
							- {$totalRamRequired.toLocaleString()}
						</span>
					</td>
					{#if devmode}
						<td>
							{(
								$accountRamBalance +
								$accountRamPurchaseAmount -
								$totalRamRequired
							).toLocaleString()}
						</td>
					{/if}
				</tr>
			{/if}
		</tbody>
	</table>
</div>
