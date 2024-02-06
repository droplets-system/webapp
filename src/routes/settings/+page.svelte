<script lang="ts">
	import { t } from '$lib/i18n';
	import {
		accountContractRam,
		dropsContract,
		loadAccountBalances,
		loadAccountData,
		loadBalanceRow,
		session
	} from '$lib/wharf';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { type Writable, writable } from 'svelte/store';

	const modalStore = getModalStore();

	onMount(() => {
		loadAccountData();
	});

	function createSessionKey() {
		const modal: ModalSettings = {
			type: 'component',
			component: 'sessionKey'
		};
		modalStore.trigger(modal);
	}

	async function claim() {
		const action = dropsContract.action('claim', {
			owner: $session.actor,
			sell_ram: true
		});
		await $session.transact({ action });
		setTimeout(loadAccountBalances, 1000);
		setTimeout(loadBalanceRow, 1000);
	}

	const hasSessionKey: Writable<boolean> = writable(!!localStorage.getItem('sessionKey'));

	modalStore.subscribe((value) => {
		hasSessionKey.set(!!localStorage.getItem('sessionKey'));
	});
</script>

<div class="p-8 space-y-8">
	{#if $session}
		<div class="h2 font-bold">{$t('common.settings')}</div>
		<div class="h3">{$t('common.account')}</div>
		<p>{$t('common.loggedinas', { account: $session.actor })}</p>
		{#if $accountContractRam}
			<div class="h3">{$t('common.contractbalance')}</div>
			<p>{$t('common.contractbalanceexists')}</p>
			<button class="btn bg-green-600" on:click={claim}>{$t('common.claim')}</button>
		{/if}
		<div class="h3">{$t('common.sessionkey')}</div>
		{#if $hasSessionKey}
			<p>{$t('common.sessionkeyenabled')}</p>
			<button class="btn bg-red-400" on:click={createSessionKey}
				>{$t('common.sessionkeyremove')}</button
			>
		{:else}
			<p>{$t('common.sessionkeydisabled')}</p>
			<button class="btn bg-blue-400" on:click={createSessionKey}
				>{$t('common.sessionkeyadd')}</button
			>
		{/if}
	{/if}
</div>

<style lang="postcss">
</style>
