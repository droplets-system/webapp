<script>
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
				<tr><th colspan="2">Balances</th></tr>
			</thead>
			<tbody>
				<tr><td>EOS</td><td>{$accountTokenBalance}</td></tr>
				<tr><td>Drops</td><td>{$accountContractDrops}</td></tr>
			</tbody>
			<thead>
				<tr><th colspan="2">RAM</th></tr>
			</thead>
			<tbody>
				{#if $accountRamBalance}
					<tr><td>Account</td><td>{$accountRamBalance.toLocaleString()} bytes</td></tr>
				{/if}
				{#if $accountContractRam > 0}
					<tr><td>Contract</td><td>{$accountContractRam.toLocaleString()} bytes</td></tr>
				{/if}
			</tbody>
			<thead>
				<tr><th colspan="2">Resources</th></tr>
			</thead>
			<tbody>
				<tr><td>CPU</td><td>{($accountCpuBalance / 1000).toLocaleString()} ms</td></tr>
				<tr><td>NET</td><td>{$accountNetBalance / 1000} kb</td></tr>
			</tbody>
		</table>
	</div>
{/if}
