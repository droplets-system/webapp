<script lang="ts">
	import { safeActions } from '$lib/constants';
	import { t } from '$lib/i18n';
	import { accountKit, session, sessionKey, systemContract } from '$lib/wharf';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { Account, LinkedAction, Permission } from '@wharfkit/account';
	import { PrivateKey } from '@wharfkit/session';
	import { onMount } from 'svelte';
	import { type Writable, writable, derived, type Readable } from 'svelte/store';

	const modalStore = getModalStore();
	const account: Writable<Account> = writable();
	const transacting: Writable<boolean> = writable(false);

	onMount(async () => {
		loadAccount();
	});

	async function loadAccount() {
		if ($session) {
			const result = await accountKit.load($session.actor);
			account.set(result);
		}
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

	async function createSessionKey() {
		const key = PrivateKey.generate('K1');

		const actions = [
			systemContract.action('updateauth', {
				account: $session.actor,
				permission: 'dropssession',
				parent: 'active',
				auth: {
					threshold: 1,
					keys: [{ key: key.toPublic(), weight: 1 }],
					accounts: [],
					waits: []
				}
				// authorized_by: `${$session.permission}`
			})
		];

		safeActions.forEach((action) =>
			actions.push(
				systemContract.action('linkauth', {
					account: $session.actor,
					code: 'drops',
					type: action,
					requirement: 'dropssession'
					// authorized_by: `${$session.permission}`
				})
			)
		);

		await $session.transact({
			actions
		});
		sessionKey.set(key);
		localStorage.setItem('sessionKey', key.toString());
		modalStore.close();
	}

	async function removeSessionKey() {
		transacting.set(true);
		const actions = [];
		if ($sessionKeyPermission && $sessionKeyPermission.linked_actions) {
			actions.push(
				...$sessionKeyPermission.linked_actions.map((linked: LinkedAction) =>
					systemContract.action('unlinkauth', {
						account: $session.actor,
						code: linked.account,
						type: linked.action
						// authorized_by: $session.permission
					})
				)
			);
		}
		actions.push(
			systemContract.action('deleteauth', {
				account: $session.actor,
				permission: 'dropssession'
				// authorized_by: $session.permission
			})
		);
		try {
			const result = await $session.transact({
				actions
			});
			localStorage.removeItem('sessionKey');
			sessionKey.set(undefined);
			modalStore.close();
		} catch (error) {}
		transacting.set(false);
	}
</script>

{#if $modalStore[0]}
	<div class="relative z-10" aria-labelledby="modal-title" aria-modal="true">
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<div
				class="relative overflow-hidden rounded-lg bg-slate-700 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg"
			>
				<div class="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
					<article class="prose lg:prose dark:prose-invert px-6">
						{#if $hasSessionKey}
							<h3>{$t('common.skd_h3')}</h3>
							<p>{$t('common.skd_p1')}</p>
							<p>{$t('common.skd_p2')}</p>
						{:else}
							<h3>{$t('common.ske_h3')}</h3>
							<p>{$t('common.ske_p1')}</p>
							<p>{$t('common.ske_p2')}</p>
							<p>{$t('common.ske_p3')}</p>
						{/if}
					</article>
				</div>
				<div class="bg-slate-600 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
					{#if $hasSessionKey}
						<button
							type="button"
							class="mt-3 inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold hover:bg-red-600 sm:mt-0 sm:w-auto mx-6"
							on:click={removeSessionKey}
							disabled={$transacting}
						>
							{$t('common.sessionkeyremove')}
						</button>
					{:else}
						<button
							type="button"
							class="mt-3 inline-flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold hover:bg-blue-400 sm:mt-0 sm:w-auto mx-6"
							on:click={createSessionKey}
							disabled={$transacting}
						>
							{$t('common.sessionkeyadd')}
						</button>
					{/if}
					<button
						type="button"
						class="mt-3 inline-flex w-full justify-center rounded-md bg-slate-300 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 sm:mt-0 sm:w-auto"
						on:click={modalStore.close}
					>
						{$t('common.cancel')}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
</style>
