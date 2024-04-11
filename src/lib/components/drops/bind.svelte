<script lang="ts">
	import { derived, writable, type Readable, type Writable } from 'svelte/store';
	import { AlertCircle } from 'svelte-lucide';
	import { Asset, Int64, Serializer, type TransactResult } from '@wharfkit/session';

	import { t } from '$lib/i18n';
	import { DropsContract, session, sessionKey, dropsContract, loadAccountData } from '$lib/wharf';
	import { sizeDropRow } from '$lib/constants';
	import { dropsPricePlusFee } from '$lib/bancor';

	const binding = writable(false);
	export let drops: Writable<DropsContract.Types.drop_row[]> = writable([]);
	export let selected: Writable<Record<string, boolean>> = writable({});
	export let selectingAll: Writable<boolean> = writable(false);
	const claim = writable(false);

	interface BindResult {
		bound: number;
		ram_used: Int64;
		txid: string;
	}

	const lastBindResult: Writable<BindResult | undefined> = writable();
	const lastBindError = writable();

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
		[dropsPricePlusFee, numUnboundSelected],
		([$dropsPricePlusFee, $numUnboundSelected]) => {
			return $dropsPricePlusFee * $numUnboundSelected;
		}
	);

	const estimatedRAM = derived(numUnboundSelected, ($numUnboundSelected) => {
		return sizeDropRow * $numUnboundSelected;
	});

	async function bindSelected() {
		lastBindError.set(undefined);
		binding.set(true);
		if ($session) {
			const actions = [
				dropsContract.action('bind', {
					owner: $session?.actor,
					droplet_ids: Object.keys($selected)
				})
			];

			if ($claim) {
				actions.push(
					dropsContract.action('claim', {
						owner: $session?.actor,
						sell_ram: true
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
				binding.set(false);

				result.returns.forEach((returnValue) => {
					try {
						if (returnValue.action.equals('bind')) {
							// Refresh drops that were bound
							const dropsBound = Object.keys($selected).map((s) => String(s));
							drops.update((current) => {
								for (const toBind of dropsBound) {
									const index = current.findIndex((row) => String(row.seed) === String(toBind));
									current[index].bound = true;
								}
								return current;
							});

							const ram_used = Serializer.decode({
								data: returnValue.hex,
								type: Int64
							});

							lastBindResult.set({
								bound: dropsBound.length,
								ram_used,
								txid: String(result.resolved?.transaction.id)
							});
						}

						// Clear selected
						selected.set({});
						selectingAll.set(false);
					} catch (e) {
						// console.log(e);
					}
				});
			} catch (e) {
				binding.set(false);
				lastBindResult.set(undefined);
				lastBindError.set(e);
			}
			setTimeout(loadAccountData, 1000);
		}
	}

	function toggleClaim(e) {
		claim.set(e.target.checked);
	}
</script>

<form class="space-y-8 p-4">
	<p>
		{$t('inventory.bindheader', { itemnames: $t('common.itemnames') })}
	</p>
	{#if $lastBindError}
		<aside class="alert variant-filled-error">
			<div><AlertCircle /></div>
			<div class="alert-message">
				<h3 class="h3">{$t('common.transacterror')}</h3>
				<p>{$lastBindError}</p>
			</div>
			<div class="alert-actions"></div>
		</aside>
	{/if}
	{#if $isBoundSelected}
		<aside class="alert variant-filled-warning">
			<div><AlertCircle /></div>
			<div class="alert-message">
				<h3 class="h3">
					{$t('inventory.bindboundwarning', { itemnames: $t('common.itemnames') })}
				</h3>
				<p>{$t('inventory.bindboundwarningtext', { itemnames: $t('common.itemnames') })}</p>
			</div>
			<div class="alert-actions"></div>
		</aside>
	{/if}
	<label>
		<label class="flex items-center space-x-2">
			<input class="checkbox" type="checkbox" on:change={toggleClaim} />
			<p>{$t('inventory.claimbalance')}</p>
		</label>
	</label>

	<button
		type="button"
		class="btn bg-blue-400 w-full"
		on:click={bindSelected}
		disabled={!Object.keys($selected).length || $isBoundSelected}
	>
		{$t('inventory.binditems', { itemnames: $t('common.itemnames') })}
		{Object.keys($selected).length}
	</button>
	{#if Object.keys($selected).length}
		<div class="table-container">
			<table class="table">
				<thead>
					<tr>
						<th colspan="2"> {$t('inventory.estimatedresults')} </th>
					</tr>
				</thead>
				<tbody>
					{#if $isUnboundSelected}
						<tr>
							<th>{$t('inventory.ramtouse')}</th>
							<td>{$estimatedRAM} bytes</td>
						</tr>
						{#if $claim}
							<tr>
								<th>{$t('inventory.tokenredeemed', { token: 'EOS' })}</th>
								<td>{Asset.fromUnits($estimatedEOS, '4,EOS')}</td>
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
	{/if}
	{#if $lastBindResult && !Object.keys($selected).length}
		<div class="table-container">
			<table class="table">
				<thead>
					<tr>
						<th
							colspan="3"
							class="variant-filled w-full bg-gradient-to-br from-green-500 to-green-700 box-decoration-clone"
						>
							<div class="text-sm text-white">
								<a href={`https://bloks.io/transaction/${$lastBindResult.txid}`}>
									{$t('common.transactsuccess')}
								</a>
							</div>
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td class="text-right"
							>{$t('inventory.itemsbound', {
								itemnames: $t('common.itemnames')
							})}</td
						>
						<td>{$lastBindResult.bound}</td>
					</tr>
					<tr>
						<td class="text-right">{$t('inventory.ramused')}</td>
						<td>{$lastBindResult.ram_used}</td>
					</tr>
				</tbody>
			</table>
		</div>
	{/if}
</form>
