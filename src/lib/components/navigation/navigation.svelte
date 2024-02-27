<script lang="ts">
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { Home, LogOut, PieChart, Settings, VenetianMask } from 'svelte-lucide';
	import { page } from '$app/stores';

	import Generate from '../headers/generate.svelte';
	import MyItems from '../headers/myitems.svelte';
	import { t, locales, locale } from '$lib/i18n';
	import { logout, session } from '$lib/wharf';

	const drawerStore = getDrawerStore();

	function drawerClose(): void {
		drawerStore.close();
	}

	const handleChange = ({ currentTarget }) => {
		const { value } = currentTarget;

		document.cookie = `lang=${value} ;`;
	};

	const inactiveClasses = 'rounded rounded-3xl border border-surface-100-800-token';
	const activeClasses = 'rounded rounded-3xl border ';
</script>

<nav class="list-nav p-4">
	<ul>
		<li class={$page.url.pathname === '/' ? activeClasses + 'border-yellow-500' : inactiveClasses}>
			<a href="/" on:click={drawerClose}>
				<div class={`h4 flex items-center`}>
					<Home class={`dark:text-yellow-300 inline size-6 mr-4`} />
					<span
						class="bg-gradient-to-br from-yellow-400 to-orange-200 bg-clip-text text-transparent box-decoration-clone"
					>
						{$t('common.home')}
					</span>
				</div>
			</a>
		</li>
		<li
			class={$page.url.pathname === '/droplets'
				? activeClasses + 'border-green-500'
				: inactiveClasses}
		>
			<a href="/droplets" on:click={drawerClose}>
				<MyItems format="h4" size={6} />
			</a>
		</li>
		<li
			class={$page.url.pathname === '/generate'
				? activeClasses + 'border-blue-500'
				: inactiveClasses}
		>
			<a href="/generate" on:click={drawerClose}>
				<Generate format="h4" size={6} />
			</a>
		</li>
		<!-- <li>
			<a href="/oracles" on:click={drawerClose}>
				<div class={`h4 flex items-center`}>
					<VenetianMask class={`dark:text-pink-400 inline size-6 mr-4`} />
					<span
						class="bg-gradient-to-br from-pink-300 to-violet-300 bg-clip-text text-transparent box-decoration-clone"
					>
						{$t('common.oracles')}
					</span>
				</div>
			</a>
		</li> -->
		<li
			class={$page.url.pathname === '/distribution'
				? activeClasses + 'border-purple-300'
				: inactiveClasses}
		>
			<a href="/distribution" on:click={drawerClose}>
				<div class={`h4 flex items-center`}>
					<PieChart class={`dark:text-purple-400 inline size-6 mr-4`} />
					<span
						class="bg-gradient-to-br from-purple-300 to-blue-300 bg-clip-text text-transparent box-decoration-clone"
					>
						{$t('common.distribution')}
					</span>
				</div>
			</a>
		</li>
		{#if $session}
			<li
				class={$page.url.pathname === '/settings'
					? activeClasses + 'border-gray-300'
					: inactiveClasses}
			>
				<a href="/settings" on:click={drawerClose}>
					<div class={`h4 flex items-center`}>
						<Settings class={`dark:text-gray-300 inline size-6 mr-4`} />
						<span
							class="bg-gradient-to-br from-blue-200 to-gray-300 bg-clip-text text-transparent box-decoration-clone"
						>
							{$t('common.settings')}
						</span>
					</div>
				</a>
			</li>
		{/if}

		<li>
			{#if $session}
				<!-- svelte-ignore a11y-invalid-attribute -->
				<a href="#" on:click={logout}>
					<div class={`h4 flex items-center`}>
						<LogOut class={`dark:text-slate-300 inline size-6 mr-4`} />
						<span
							class="bg-gradient-to-br from-slate-400 to-slate-300 bg-clip-text text-transparent box-decoration-clone"
						>
							{$t('common.signout')}
						</span>
					</div>
				</a>
			{/if}
		</li>
		<li class="p-4">
			<label>
				<span>{$t('common.language')}</span>
				<select class="select" bind:value={$locale} on:change={handleChange}>
					{#each $locales as value}
						<option {value} selected={$locale === value}
							>{$t(`common.${value}`)} ({value.toUpperCase()})</option
						>
					{/each}
				</select>
			</label>
		</li>
	</ul>
</nav>
