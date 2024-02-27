<script>
	import { t } from '$lib/i18n';
	import {
		account,
		accountContractDrops,
		accountCpuBalance,
		accountNetBalance,
		accountRamBalance,
		accountTokenBalance,
		accountContractRam
	} from '$lib/wharf';
</script>

{#if $account}
	<div class="table-container">
		<table class="table table-compact">
			<thead>
				<tr><th colspan="2">{$t('common.balances')}</th></tr>
			</thead>
			<tbody>
				<tr><td>EOS</td><td>{$accountTokenBalance}</td></tr>
				<tr><td>{$t('common.itemnames')}</td><td>{$accountContractDrops.toLocaleString()}</td></tr>
			</tbody>
			<thead>
				<tr><th colspan="2">{$t('common.ramkb')}</th></tr>
			</thead>
			<tbody>
				{#if $accountRamBalance}
					<tr
						><td>{$t('common.account')}</td><td
							>{$accountRamBalance.toLocaleString()} {$t('common.bytes')}</td
						></tr
					>
				{/if}
				{#if $accountContractRam > 0}
					<tr
						><td>{$t('common.contract')}</td><td
							>{$accountContractRam.toLocaleString()} {$t('common.bytes')}</td
						></tr
					>
				{/if}
			</tbody>
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
