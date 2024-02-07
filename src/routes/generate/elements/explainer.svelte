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
		totalRamRequired
	} from '../generate';
</script>

<div class="prose text-white dark:prose-invert">
	{#if $derivedDropsAmount}
		You will generate <span class="text-green-200 font-bold"
			>{$derivedDropsAmount.toLocaleString()}</span
		>
		new
		{#if $createBound}
			<strong class="text-blue-300">
				<Lock class="inline size-4" />
				bound
			</strong>
		{:else}
			<strong class="text-yellow-300">
				<Unlock class="inline size-4" />
				unbound
			</strong>
		{/if}
		Drops.
	{/if}

	{#if !$createBound && $contractBalanceToUse}
		This action will use <span class="font-bold text-orange-200"
			>{$contractBalanceToUse.toLocaleString()}</span
		> bytes of RAM from your Drops contract balance.
	{/if}

	{#if !$createBound && $contractRamPurchaseAmount}
		Your account will send <span class="text-red-300 font-bold">{$contractRamPurchasePrice}</span>
		to the Drops contract to purchase the required
		<span class="text-green-300 font-bold">{$contractRamPurchaseAmount.toLocaleString()}</span>
		bytes of RAM.
	{/if}

	{#if $createBound && $accountRamPurchasePrice.value > 0}
		This will cost <span class="text-red-300 font-bold">{$accountRamPurchasePrice}</span> to
		purchase an additional
		<span class="text-green-300 font-bold">{$accountRamPurchaseAmount.toLocaleString()}</span>
		bytes of RAM.
	{/if}

	{#if $createBound && $totalRamRequired}
		This action will use <span class="text-red-300 font-bold"
			>{$totalRamRequired.toLocaleString()}</span
		> bytes of RAM from your account.
	{/if}
</div>
