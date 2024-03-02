<script lang="ts">
	import { derived, writable, type Readable, type Writable } from 'svelte/store';
	import { AlertCircle } from 'svelte-lucide';
	import { Asset, Int64, Serializer, type TransactResult } from '@wharfkit/session';

	import { t } from '$lib/i18n';
	import {
		DropsContract,
		session,
		sessionKey,
		dropsContract,
		tokenContract,
		accountContractRam,
		loadAccountData
	} from '$lib/wharf';
	import { sizeDropRowPurchase } from '$lib/constants';
	import { dropsPricePlusFee, ramPricePlusFee } from '$lib/bancor';

	const unbinding = writable(false);
	export let drops: Writable<DropsContract.Types.drop_row[]> = writable([]);
	export let selected: Writable<Record<string, boolean>> = writable({});
	export let selectingAll: Writable<boolean> = writable(false);

	interface UnbindResult {
		unbound: number;
		cost: Asset;
		ram_released: Int64;
		txid: string;
	}

	const numBoundSelected = derived([drops, selected], ([$drops, $selected]) => {
		const selectedBound = Object.keys($selected).filter(
			(s) => $drops.find((d) => String(d.seed) === String(s))?.bound
		);
		return selectedBound.length;
	});

	const numUnboundSelected = derived([drops, selected], ([$drops, $selected]) => {
		const selectedBound = Object.keys($selected).filter(
			(s) => !$drops.find((d) => String(d.seed) === String(s))?.bound
		);
		return selectedBound.length;
	});

	const isBoundSelected: Readable<boolean> = derived(
		numBoundSelected,
		($numBoundSelected) => $numBoundSelected > 0
	);

	const isUnboundSelected: Readable<boolean> = derived(
		numUnboundSelected,
		($numUnboundSelected) => $numUnboundSelected > 0
	);

	const estimatedEOS = derived(
		[dropsPricePlusFee, numBoundSelected],
		([$dropsPricePlusFee, $numBoundSelected]) => {
			return $dropsPricePlusFee * $numBoundSelected;
		}
	);

	const estimatedRAM = derived(numBoundSelected, ($numBoundSelected) => {
		return sizeDropRowPurchase * $numBoundSelected;
	});

	const contractBalanceToUse: Readable<number> = derived(
		[accountContractRam, estimatedRAM],
		([$accountContractRam, $estimatedRAM]) => {
			const canCoverAll = $accountContractRam >= $estimatedRAM;
			return $accountContractRam ? (canCoverAll ? $estimatedRAM : $accountContractRam) : 0;
		}
	);

	const accountRamPurchaseAmount: Readable<number> = derived(
		[contractBalanceToUse, estimatedRAM],
		([$contractBalanceToUse, $estimatedRAM]) => {
			return $estimatedRAM - $contractBalanceToUse;
		}
	);

	const accountRamPurchasePrice: Readable<Asset> = derived(
		[accountRamPurchaseAmount, ramPricePlusFee],
		([$accountRamPurchaseAmount, $ramPricePlusFee]) => {
			let amount = $accountRamPurchaseAmount * $ramPricePlusFee;
			if (amount <= 2) {
				amount = 3;
			}
			return Asset.fromUnits(amount, '4,EOS');
		}
	);

	const requiresDeposit = derived(
		[accountContractRam, estimatedRAM],
		([$accountContractRam, $estimatedRAM]) => {
			return $accountContractRam < $estimatedRAM;
		}
	);

	const lastUnbindResult: Writable<UnbindResult | undefined> = writable();
	const lastUnbindError = writable();

	async function unbindSelected() {
		unbinding.set(true);
		lastUnbindError.set(undefined);
		if ($session) {
			const actions = [];
			actions.push(
				dropsContract.action('unbind', {
					owner: $session?.actor,
					droplet_ids: Object.keys($selected)
				})
			);

			if ($requiresDeposit) {
				actions.unshift(
					tokenContract.action('transfer', {
						from: $session.actor,
						to: 'drops',
						quantity: $accountRamPurchasePrice,
						memo: String($session.actor)
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

				result.returns.forEach((returnValue) => {
					if (returnValue.action.equals('unbind')) {
						const ram_released = Serializer.decode({
							data: returnValue.hex,
							type: Int64
						});

						// Refresh drops that were unbound
						const dropsUnbound = Object.keys($selected).map((s) => String(s));
						drops.update((current) => {
							for (const toUnbind of dropsUnbound) {
								const index = current.findIndex((row) => String(row.seed) === String(toUnbind));
								current[index].bound = false;
							}
							return current;
						});

						selected.set({});
						selectingAll.set(false);

						lastUnbindResult.set({
							unbound: dropsUnbound.length,
							cost: $accountRamPurchasePrice,
							ram_released,
							txid: String(result.resolved?.transaction.id)
						});
					}
				});
			} catch (e) {
				lastUnbindResult.set(undefined);
				lastUnbindError.set(e);
			}
			unbinding.set(false);
			setTimeout(loadAccountData, 1000);
		}
	}
</script>

<form class="space-y-8 p-4">
	<p>
		{$t('inventory.unbindheader', { itemnames: $t('common.itemnames') })}
	</p>
	<div class="table-container">
		<table class="table">
			<thead>
				<tr>
					<th colspan="2"> {$t('inventory.estimatedresults')} </th>
				</tr>
			</thead>
			<tbody>
				{#if $isBoundSelected}
					<tr>
						<th>{$t('inventory.ramtorelease')}</th>
						<td>{$estimatedRAM} bytes</td>
					</tr>
					{#if $requiresDeposit}
						<tr>
							<th>{$t('inventory.ramtobuy')}</th>
							<td>{$accountRamPurchasePrice}</td>
						</tr>
					{/if}
					{#if $contractBalanceToUse > 0}
						<tr>
							<th>{$t('inventory.rambalanceuse')}</th>
							<td>{$contractBalanceToUse} bytes</td>
						</tr>
					{/if}
				{/if}
				{#if !$isBoundSelected && !$isUnboundSelected}
					<tr>
						<td colspan="2" class="text-center">
							{$t('inventory.estimationwaiting', { itemnames: $t('common.itemnames') })}
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
	{#if $lastUnbindError}
		<aside class="alert variant-filled-error">
			<div><AlertCircle /></div>
			<div class="alert-message">
				<h3 class="h3">{$t('common.transacterror')}</h3>
				<p>{$lastUnbindError}</p>
			</div>
			<div class="alert-actions"></div>
		</aside>
	{/if}
	{#if $isUnboundSelected}
		<aside class="alert variant-filled-warning">
			<div><AlertCircle /></div>
			<div class="alert-message">
				<h3 class="h3">
					{$t('inventory.unbindunboundwarning', { itemnames: $t('common.itemnames') })}
				</h3>
				<p>{$t('inventory.unbindunboundwarningtext', { itemnames: $t('common.itemnames') })}</p>
			</div>
			<div class="alert-actions"></div>
		</aside>
	{/if}
	<button
		type="button"
		class="btn bg-orange-600 w-full"
		on:click={unbindSelected}
		disabled={!Object.keys($selected).length || $isUnboundSelected || $unbinding}
	>
		{$t('inventory.unbinditems', {
			itemnames: $t('common.itemnames'),
			drops: Object.keys($selected).length
		})}
	</button>
	{#if $lastUnbindResult}
		<div class="table-container">
			<table class="table">
				<thead>
					<tr>
						<th
							colspan="3"
							class="variant-filled w-full bg-gradient-to-br from-green-500 to-green-700 box-decoration-clone"
						>
							<div class="lowercase text-sm text-white">
								<a href={`https://bloks.io/transaction/${$lastUnbindResult.txid}`}>
									{$t('common.transactsuccess')}
								</a>
							</div>
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td class="text-right"
							>{$t('inventory.unbindcount', {
								itemnames: $t('common.itemnames')
							})}</td
						>
						<td>{$lastUnbindResult.unbound}</td>
					</tr>
					{#if $lastUnbindResult.cost && $lastUnbindResult.cost.value > 0}
						<tr>
							<td class="text-right">{$t('inventory.ramtobuy')}</td>
							<td>{$lastUnbindResult.cost}</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	{/if}
</form>
