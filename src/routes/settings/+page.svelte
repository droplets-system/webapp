<script lang="ts">
	import { t } from '$lib/i18n';
	import {
		account,
		accountContractRam,
		dropsContract,
		loadAccountBalances,
		loadAccountData,
		loadBalanceRow,
		session
	} from '$lib/wharf';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { Permission } from '@wharfkit/account';
	import { onMount } from 'svelte';
	import { Settings } from 'svelte-lucide';
	import { type Writable, writable, derived, type Readable } from 'svelte/store';

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

	const sessionKeyPermission: Readable<Permission | undefined> = derived(account, ($account) => {
		if ($account) {
			try {
				return $account.permission('dropssession');
			} catch (e) {
				return undefined;
			}
		}
		return undefined;
	});

	const hasSessionKey: Readable<boolean> = derived(
		sessionKeyPermission,
		($sessionKeyPermission) => {
			return !!$sessionKeyPermission;
		}
	);

	modalStore.subscribe((value) => {
		setTimeout(loadAccountData, 1000);
	});
</script>

<div class="container p-4 sm:p-8 lg:p-16">
	<div class="mx-auto py-4 sm:p-4 space-y-4 bg-surface-900 rounded-lg shadow-xl">
		<div class="h1 flex items-center px-2 sm:px-6">
			<Settings class="dark:text-gray-300 inline size-12 mr-4" />
			<span
				class="leading-snug bg-gradient-to-br from-blue-200 to-gray-300 bg-clip-text text-transparent box-decoration-clone"
				>{$t('common.settings')}</span
			>
		</div>
		<div class="p-6 space-y-8">
			{#if $session}
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
	</div>
</div>

<style lang="postcss">
</style>
