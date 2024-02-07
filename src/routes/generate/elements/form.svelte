<script lang="ts">
	import { t } from '$lib/i18n';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import { AlertCircle, Loader2, MemoryStick } from 'svelte-lucide';
	import {
		createBound,
		transacting,
		dropsAmount,
		customDropsAmount,
		customDropsValue,
		hasEnoughTokens,
		useRandomDrop,
		randomDrop,
		lastResultError,
		lastResult,
		lastResultId,
		transactBatchProgress,
		transactBatchSize,
		canGenerate,
		accountRamPurchaseAmount,
		contractRamPurchaseAmount,
		actionRequiresSessionKey
	} from '../generate';
	import { session } from '$lib/wharf';
	import { maximumBatchSize } from '$lib/constants';

	export let generate: () => void;

	const selectDropAmount = (e: Event) => {
		if (e.target.value === 'X') {
			customDropsAmount.set(true);
		} else {
			customDropsAmount.set(false);
			dropsAmount.set(Number(e.target.value));
		}
	};

	function reset() {
		lastResult.set(undefined);
		lastResultId.set(undefined);
	}
</script>

<form class="space-y-8" on:submit|preventDefault={generate}>
	<div>
		<p>{$t('generate.selectbound')}</p>
		<RadioGroup>
			<RadioItem bind:group={$createBound} name="justify" value={true} disabled={$transacting}
				>{$t('common.bound')}</RadioItem
			>
			<RadioItem bind:group={$createBound} name="justify" value={false} disabled={$transacting}>
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
	{#if $session}
		{#if $lastResult}
			<aside class="alert bg-gradient-to-br from-green-500 to-green-700">
				<div class="alert-message font-white text-center">
					<div class="text-white font-bold">{$t('common.transactsuccess')}</div>
					<div class="text-sm font-normal text-gray-200 uppercase">
						<a
							href="https://bloks.io/transaction/{$lastResultId}"
							target="_blank"
							rel="noopener noreferrer"
						>
							{$lastResultId?.slice(0, 8)}...{$lastResultId.slice(-8)}
						</a>
					</div>
					{#if $transactBatchSize > 1}
						<div class="lowercase text-xs text-white hidden sm:block">
							{$transactBatchProgress} / {$transactBatchSize}
						</div>
					{/if}
				</div>
			</aside>
			<button type="button" class="btn bg-green-600 w-full" on:click={reset}>Continue</button>
		{:else}
			{#if ($accountRamPurchaseAmount || $contractRamPurchaseAmount) && !$hasEnoughTokens}
				<p class="text-center text-red-500">{$t('common.insufficientbalance')}</p>
			{/if}
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
		{/if}
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
