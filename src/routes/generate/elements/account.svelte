<script>
	import { t } from '$lib/i18n';
	import {
		account,
		accountContractBalance,
		accountContractDrops,
		accountCpuBalance,
		accountNetBalance,
		accountRamBalance,
		accountTokenBalance,
		accountContractRam,
		dropsContract,
		session
	} from '$lib/wharf';
	import { Tv } from 'svelte-lucide';
	import { writable } from 'svelte/store';

	const claiming = writable(false);

	async function claim() {
		if ($session) {
			claiming.set(true);
			// Perform the claim action
			const action = dropsContract.action('claim', {
				owner: $session.actor
			});
			const result = await $session.transact({ action });
			// Add the returned RAM amount to the account balance
			result.returns.forEach((rv) => {
				if (rv.contract.equals('drops') && rv.action.equals('claim')) {
					accountRamBalance.update((current) => {
						return current + Number(rv.data);
					});
				}
			});
			// Set the contract balance to 0 locally
			accountContractBalance.update((current) => {
				return {
					...current,
					ram_bytes: 0
				};
			});
			claiming.set(false);
		}
	}
</script>

{#if $account}
	<div class="table-container">
		<table class="table table-compact align-middle">
			<thead>
				<tr><th colspan="2">{$t('common.balances')}</th></tr>
			</thead>
			<tbody>
				<tr><td>EOS</td><td>{$accountTokenBalance}</td></tr>
				{#if $accountRamBalance}
					<tr>
						<td>RAM {$t('common.bytes')}</td>
						<td>{$accountRamBalance.toLocaleString()}</td>
					</tr>
				{/if}
				<tr
					><td>{$t('common.itemnames')}</td><td>{$accountContractDrops.toLocaleString()} bytes</td
					></tr
				>
			</tbody>
			{#if $accountContractRam > 0}
				<thead>
					<tr><th colspan="2">{$t('common.ramkb')}</th></tr>
				</thead>
				<tbody>
					<tr>
						<td>{$t('common.contract')}</td>
						<td>
							{$accountContractRam.toLocaleString()}
							{$t('common.bytes')}
							<button
								class="btn btn-sm variant-filled bg-blue-500 float-right"
								on:click={claim}
								disabled={$claiming}
							>
								Claim
							</button>
						</td>
					</tr>
				</tbody>
			{/if}
			<thead>
				<tr><th colspan="2">{$t('common.resources')}</th></tr>
			</thead>
			<tbody>
				<tr
					><td>{$t('common.cpu')}</td><td>{($accountCpuBalance / 1000).toLocaleString()} ms</td></tr
				>
				<tr
					><td>{$t('common.net')}</td><td>{($accountNetBalance / 1000).toLocaleString()} kb</td></tr
				>
			</tbody>
		</table>
	</div>
{/if}
