<script lang="ts">
	import {
		Asset,
		Bytes,
		Checksum256,
		Serializer,
		type TransactResult,
		type TransactResultReturnValue
	} from '@wharfkit/session';
	import { type ModalSettings, getModalStore } from '@skeletonlabs/skeleton';
	import { PackagePlus } from 'svelte-lucide';
	import { page } from '$app/stores';

	import { t } from '$lib/i18n';
	import {
		DropsContract,
		accountContractBalance,
		accountContractRam,
		accountRamBalance,
		dropsContract,
		loadAccountData,
		session,
		sessionKey,
		systemContract,
		tokenContract
	} from '$lib/wharf';
	import { loadRamPrice } from '$lib/bancor';
	import { maximumBatchSize, sizeDropRow, sizeDropRowPurchase } from '$lib/constants';
	import {
		lastResultError,
		transacting,
		transactBatchSize,
		transactBatchProgress,
		lastResultId,
		lastResult,
		derivedDropsAmount,
		createBound,
		randomName,
		accountRamPurchaseAmount,
		accountRamDepositAmount,
		actionRequiresSessionKey
	} from './generate';

	import Account from './elements/account.svelte';
	import Explainer from './elements/explainer.svelte';
	import GenerateForm from './elements/form.svelte';

	import DevTools from './elements/devtools.svelte';
	import DevState from './elements/devstate.svelte';

	export const modalStore = getModalStore();
	export const devmode = $page.url.searchParams.has('dev');
	export const batch = Number($page.url.searchParams.get('batch'));
	const maxPerTransaction = batch || maximumBatchSize;

	async function generate() {
		lastResultError.set('');
		lastResult.set(undefined);
		lastResultId.set(undefined);
		transacting.set(true);
		transactBatchSize.set(0);
		transactBatchProgress.set(0);

		const amount = $derivedDropsAmount;

		const batches = Math.ceil(amount / maxPerTransaction);
		if (batches > 1) {
			const batchSizes = Array.from({ length: batches }, (_, idx) =>
				idx === batches - 1 && amount % maxPerTransaction > 0
					? amount % maxPerTransaction
					: maxPerTransaction
			);
			transactBatchSize.set(batchSizes.length);
			for (const batchSize of batchSizes) {
				await mint(batchSize, amount);
				if ($lastResultError) {
					break;
				}
				transactBatchProgress.update((p) => p + 1);
				if ($transactBatchProgress < $transactBatchSize) {
					await new Promise((r) => setTimeout(r, 500));
				}
			}
		} else {
			transactBatchSize.set(1);
			await mint(amount, amount);
			transactBatchProgress.set(1);
		}

		loadRamPrice();
		setTimeout(loadAccountData, 1000);
		transacting.set(false);
	}

	async function mint(amount: number, totalAmount: number) {
		const hash = String(Checksum256.hash(Bytes.from(randomName(), 'utf8')));
		const bound = $createBound;

		// Specify the RAM required for this transaction and the RAM total
		let ramRequired = amount * sizeDropRow;
		let ramRequiredTotal = totalAmount * sizeDropRow;

		// If RAM purchase is required, use the purchase size
		if ($accountContractRam < ramRequired) {
			ramRequired = amount * sizeDropRowPurchase;
			ramRequiredTotal = totalAmount * sizeDropRowPurchase;
		}

		if ($session) {
			const actions = [
				dropsContract.action('generate', {
					amount,
					bound,
					data: hash,
					owner: $session.actor
				})
			];

			const requiresRAMPurchase = $createBound && $accountRamBalance < ramRequired;
			let ramPurchaseAmount = 0; // The bytes purchased in tx, will update account record on success
			if (requiresRAMPurchase) {
				actions.unshift(
					systemContract.action('buyrambytes', {
						payer: $session.actor,
						receiver: $session.actor,
						bytes: $accountRamPurchaseAmount
					})
				);
			}

			const requiresDeposit = !$createBound && $accountContractRam < ramRequired;
			if (requiresDeposit) {
				actions.unshift(
					tokenContract.action('transfer', {
						from: $session.actor,
						to: 'drops',
						quantity: Asset.fromUnits($accountRamDepositAmount, '4,EOS'),
						memo: String($session.actor)
					})
				);
			}

			if (!$accountContractBalance) {
				actions.unshift(
					dropsContract.action('open', {
						owner: $session.actor
					})
				);
			}

			let result: TransactResult;
			try {
				if ($sessionKey) {
					result = await $session.localTransact({ actions });
				} else {
					result = await $session.transact({ actions });
				}
				// result = await $session.transact({ actions });

				// Set the last successful transaction ID
				lastResultId.set(String(result.resolved?.transaction.id));

				// Process return values
				result.returns
					.filter((r) => r.action.equals('generate'))
					.forEach((v) => processReturn(v, bound, amount, ramPurchaseAmount));
			} catch (e) {
				lastResult.set(undefined);
				lastResultId.set(undefined);
				lastResultError.set(String(e));
			}
		}
	}

	function processReturn(
		returnValue: TransactResultReturnValue,
		bound: boolean,
		mintAmount: number,
		ramPurchaseAmount: number
	) {
		try {
			const returned = Serializer.decode({
				data: returnValue.hex,
				type: DropsContract.Types.generate_return_value
			});

			// Set result of last transaction
			lastResult.set(returned);

			// Update UI balances
			if (bound) {
				accountRamBalance.update(
					(balance) => balance + ramPurchaseAmount - Number(returned.bytes_used)
				);
				accountContractBalance.set(
					DropsContract.Types.balances_row.from({
						owner: $session.actor,
						drops: $accountContractBalance.drops.adding(mintAmount),
						ram_bytes: $accountContractBalance.ram_bytes
					})
				);
			} else {
				accountContractBalance.set(
					DropsContract.Types.balances_row.from({
						owner: $session.actor,
						drops: $accountContractBalance.drops.adding(mintAmount),
						ram_bytes: returned.bytes_balance
					})
				);
			}
		} catch (e) {
			// console.warn(e);
		}
	}

	function help() {
		const modal: ModalSettings = {
			type: 'component',
			component: 'generateHelp'
		};
		modalStore.trigger(modal);
	}
</script>

<div class="container p-4 sm:p-8 lg:p-16">
	<div class="mx-auto py-4 sm:p-4 space-y-4 bg-surface-900 rounded-lg shadow-xl">
		<div class="h1 flex items-center px-2 sm:px-6">
			<PackagePlus class="dark:text-blue-400 inline size-12 mr-4" />
			<span
				class="leading-snug bg-gradient-to-br from-blue-500 to-cyan-300 bg-clip-text text-transparent box-decoration-clone"
				>{$t('common.generate')}</span
			>
		</div>
		<p class="px-2 sm:px-6">
			{$t('generate.description', { itemnames: $t('common.itemnames') })}
			<a class="hidden underline" href="#" on:click={help} on:keyup={help} tabindex="0"
				>{$t('common.learnmore')}</a
			>
		</p>
		<div class={'p-2 sm:p-6 shadow-xl rounded-lg lg:grid lg:grid-cols-2 lg:gap-16'}>
			<div class="space-y-8 mb-12">
				<div class="h3 font-bold text-blue-300">
					{$t('common.generate')}
					{$t('common.itemnames')}
				</div>
				<GenerateForm {generate} />
				{#if !$lastResult && !$actionRequiresSessionKey}
					<Explainer />
				{/if}
				{#if devmode}
					<DevTools />
				{/if}
			</div>
			<div class="space-y-6">
				<div class="h3 font-bold text-blue-300">{$t('common.myaccount')}</div>
				<Account />
				{#if devmode}
					<DevState />
				{/if}
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
</style>
