<script>
	import { accountRamBalance, accountTokenBalance, accountContractRam } from '$lib/wharf';
	import {
		derivedDropsAmount,
		hasEnoughAccountRAM,
		hasEnoughContractRAM,
		hasEnoughTokens,
		contractBalanceToUse,
		totalRamRequired,
		totalRamToPurchase,
		accountRamPurchaseAmount,
		accountRamPurchasePrice,
		requiresDeposit,
		canGenerate
	} from '../generate';
</script>

<div>
	<div class="table-container space-y-4">
		<div class="h4">balances</div>
		<table class="table">
			<tbody>
				<tr><td>accountRamBalance</td><td>{$accountRamBalance}</td></tr>
				<tr><td>accountTokenBalance</td><td>{$accountTokenBalance}</td></tr>
				<tr><td>accountContractRam</td><td>{$accountContractRam}</td></tr>
			</tbody>
		</table>
		<div class="h4">funding</div>
		<table class="table">
			<tbody>
				<tr><td>derivedDropsAmount</td><td>{$derivedDropsAmount}</td></tr>
				<tr><td>hasEnoughAccountRAM</td><td>{$hasEnoughAccountRAM}</td></tr>
				<tr><td>hasEnoughContractRAM</td><td>{$hasEnoughContractRAM}</td></tr>
				<tr><td>hasEnoughTokens</td><td>{$hasEnoughTokens}</td></tr>
				<tr><td>contractBalanceToUse</td><td>{$contractBalanceToUse}</td></tr>
				<tr><td>totalRamRequired</td><td>{$totalRamRequired}</td></tr>
				<tr><td>totalRamToPurchase</td><td>{$totalRamToPurchase}</td></tr>
				<tr><td>accountRamPurchaseAmount</td><td>{$accountRamPurchaseAmount}</td></tr>
				<tr><td>accountRamPurchasePrice</td><td>{$accountRamPurchasePrice}</td></tr>
				<tr><td>requiresDeposit</td><td>{$requiresDeposit}</td></tr>
				<tr><td>canGenerate</td><td>{$canGenerate}</td></tr>
			</tbody>
		</table>
	</div>
</div>
