<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { initializeStores, Drawer, getDrawerStore, Modal } from '@skeletonlabs/skeleton';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { PUBLIC_CHAIN_NAME } from '$env/static/public';

	import { setLocale, t } from '$lib/i18n';
	import { login, session, restore } from '$lib/wharf';

	import GenerateHelp from '$lib/components/modals/GenerateHelp.svelte';
	import SessionKey from '$lib/components/modals/SessionKey.svelte';

	import '../app.postcss';

	initializeStores();

	const drawerStore = getDrawerStore();

	import Navigation from '$lib/components/navigation/navigation.svelte';
	import { loadRamPrice } from '$lib/bancor';

	function getLanguage(name: string) {
		const value = document.cookie;
		const parts = value.split(`=`);
		if (parts && parts.length === 2) {
			return parts.pop().split(';').shift();
		}
		const defaultLanguage = navigator.language.split('-')[0];
		if (defaultLanguage) {
			return defaultLanguage;
		}
		return 'en';
	}

	let ramLoader: ReturnType<typeof setInterval>;

	onDestroy(() => {
		clearInterval(ramLoader);
	});

	onMount(async () => {
		restore();
		setLocale(getLanguage('lang'));
		loadRamPrice();
		ramLoader = setInterval(loadRamPrice, 5000);
	});

	function drawerOpen(): void {
		drawerStore.open({});
	}

	const modalRegistry = {
		generateHelp: { ref: GenerateHelp },
		sessionKey: { ref: SessionKey }
	};
</script>

<Modal components={modalRegistry} />

<Drawer class="shadow-xl">
	<img src="/logo.png" class="w-48 px-6 py-4" />
	<hr />
	<Navigation />
</Drawer>

<!-- App Shell -->
<AppShell
	regionPage="relative"
	slotPageHeader="sticky top-0 z-10 shadow-lg"
	slotSidebarLeft="bg-surface-500/5 w-0 xl:w-64 bg-surface-100-800-token shadow-xl"
>
	<svelte:fragment slot="pageHeader">
		<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
			<svelte:fragment slot="lead">
				<div class="flex items-center">
					<button class="xl:hidden btn btn-sm mr-4" on:click={drawerOpen}>
						<span>
							<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
								<rect width="100" height="20" />
								<rect y="30" width="100" height="20" />
								<rect y="60" width="100" height="20" />
							</svg>
						</span>
					</button>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if $session}
					{$session.actor}
				{:else}
					<button type="button" class="btn variant-filled" on:click={login}
						>{$t('common.signin')}</button
					>
				{/if}
			</svelte:fragment>
		</AppBar>
		{#if PUBLIC_CHAIN_NAME === 'Jungle4'}
			<aside class="alert bg-gradient-to-br variant-gradient-error-warning rounded-none">
				<div class="text-center w-full font-bold">{$t('common.testnetnotice')}</div>
			</aside>
		{:else}
			<aside class="alert bg-gradient-to-br variant-gradient-secondary-tertiary rounded-none">
				<div class="text-center w-full font-bold">{$t('common.mainnetnotice')}</div>
			</aside>
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<img src="/logo.png" class="w-48 px-6 py-4" />
		<Navigation />
	</svelte:fragment>
	<slot />
</AppShell>
