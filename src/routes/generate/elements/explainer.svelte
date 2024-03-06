<script>
	import { Lock, Unlock } from 'svelte-lucide';
	import {
		derivedDropsAmount,
		createBound,
		contractBalanceToUse,
		contractRamPurchaseAmount,
		contractRamPurchasePrice,
		accountRamPurchasePrice,
		accountRamPurchaseAmount,
		accountRamTransferAmount,
		totalRamRequired
	} from '../generate';
	import { t } from '$lib/i18n';
</script>

<div class="prose text-white dark:prose-invert">
	{#if $derivedDropsAmount}
		{$t('generate.willgenerate')}
		<span class="text-green-200 font-bold">{$derivedDropsAmount.toLocaleString()}</span>
		{$t('common.new')}
		{#if $createBound}
			<strong class="text-blue-300">
				<Lock class="inline size-4" />
				{$t('common.bound')}
			</strong>
		{:else}
			<strong class="text-yellow-300">
				<Unlock class="inline size-4" />
				{$t('common.unbound')}
			</strong>
		{/if}
		{$t('common.itemnames')}.
	{/if}

	{#if !$createBound && $contractBalanceToUse}
		{$t('generate.willuse')}
		<span class="font-bold text-orange-200">{$contractBalanceToUse.toLocaleString()}</span>
		{$t('generate.willusecontractbalance')}
	{/if}

	<!-- {#if !$createBound && $contractRamPurchaseAmount}
		{$t('generate.willsend')}
		<span class="text-red-300 font-bold">{$contractRamPurchasePrice}</span>
		{$t('generate.willsendto')}
		<span class="text-green-300 font-bold">{$contractRamPurchaseAmount.toLocaleString()}</span>
		{$t('generate.bytesofram')}
	{/if} -->

	{#if $accountRamPurchasePrice.value > 0}
		{$t('generate.willcost')}
		<span class="text-red-300 font-bold">{$accountRamPurchasePrice}</span>
		{$t('generate.topurchase')}
		<span class="text-green-300 font-bold">{$accountRamPurchaseAmount.toLocaleString()}</span>
		{$t('generate.bytesofram')}
	{/if}

	{#if !$createBound && $accountRamTransferAmount}
		{$t('generate.willsend')}
		<span class="text-red-300 font-bold">{$accountRamTransferAmount.toLocaleString()}</span>
		{$t('generate.bytesoframcontract')}
	{/if}

	{#if $createBound && $totalRamRequired}
		{$t('generate.willuse')}
		<span class="text-red-300 font-bold">{$totalRamRequired.toLocaleString()}</span>
		{$t('generate.bytesoframaccount')}
	{/if}
</div>
