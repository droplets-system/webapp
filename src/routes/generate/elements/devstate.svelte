<script>
	import {
		derivedDropsAmount,
		hasEnoughAccountRAM,
		hasEnoughContractRAM,
		hasEnoughTokens,
		contractBalanceToUse,
		totalRamRequired,
		contractRamPurchaseAmount,
		contractRamPurchasePrice,
		accountRamPurchaseAmount,
		accountRamPurchasePrice,
		requiresDeposit,
		canGenerate
	} from '../generate';
</script>

<div>
	<div class="table-container space-y-4">
		<div class="h3 text-blue-300 font-bold">State</div>
		<table class="table">
			<tbody>
				<tr><td>derivedDropsAmount</td><td>{$derivedDropsAmount}</td></tr>
				<tr><td>hasEnoughAccountRAM</td><td>{$hasEnoughAccountRAM}</td></tr>
				<tr><td>hasEnoughContractRAM</td><td>{$hasEnoughContractRAM}</td></tr>
				<tr><td>hasEnoughTokens</td><td>{$hasEnoughTokens}</td></tr>
				<tr><td>contractBalanceToUse</td><td>{$contractBalanceToUse}</td></tr>
				<tr><td>totalRamRequired</td><td>{$totalRamRequired}</td></tr>
				<tr><td>contractRamPurchaseAmount</td><td>{$contractRamPurchaseAmount}</td></tr>
				<tr><td>contractRamPurchasePrice</td><td>{$contractRamPurchasePrice}</td></tr>
				<tr><td>accountRamPurchaseAmount</td><td>{$accountRamPurchaseAmount}</td></tr>
				<tr><td>accountRamTransferAmount</td><td>{$accountRamPurchaseAmount}</td></tr>
				<tr><td>accountRamPurchasePrice</td><td>{$accountRamPurchasePrice}</td></tr>
				<tr><td>requiresDeposit</td><td>{$requiresDeposit}</td></tr>
				<tr><td>canGenerate</td><td>{$canGenerate}</td></tr>
			</tbody>
		</table>
	</div>
</div>
