import { ramPricePlusFee } from '$lib/bancor';
import {
	maximumBatchSize,
	ramPurchaseBuffer,
	sizeDropRow,
	sizeDropRowPurchase
} from '$lib/constants';
import {
	DropsContract,
	accountContractRam,
	accountRamBalance,
	accountTokenBalance,
	sessionKey
} from '$lib/wharf';
import { Asset } from '@wharfkit/session';
import { type Writable, writable, derived, type Readable } from 'svelte/store';

export const useRandomDrop: Writable<boolean> = writable(true);
export const randomDrop: Writable<string> = writable(randomName());
export const createBound: Writable<boolean> = writable(true);
export const dropsAmount: Writable<number> = writable(1);
export const customDropsAmount: Writable<boolean> = writable(false);
export const customDropsValue: Writable<number> = writable(1);
export const lastResult: Writable<DropsContract.Types.generate_return_value | undefined> =
	writable();
export const lastResultId: Writable<string | undefined> = writable();
export const lastResultError: Writable<string> = writable();
export const transacting: Writable<boolean> = writable(false);
export const transactBatchSize: Writable<number> = writable(0);
export const transactBatchProgress: Writable<number> = writable(0);

export const derivedDropsAmount: Readable<number> = derived(
	[dropsAmount, customDropsAmount, customDropsValue],
	([$dropsAmount, $customDropsAmount, $customDropsValue]) => {
		if ($customDropsAmount) {
			if ($customDropsValue) {
				return Number($customDropsValue);
			} else {
				return 0;
			}
		} else {
			return $dropsAmount;
		}
	}
);

export const totalRamRequired: Readable<number> = derived(
	[createBound, derivedDropsAmount, accountContractRam],
	([$createBound, $derivedDropsAmount, $accountContractRam]) => {
		if ($derivedDropsAmount) {
			/*
			 * If the account has enough of a RAM balance to cover the cost of minting, then we can use the actual
			 * size of the drop row as the RAM requirement using `sizeDropRow`.
			 *
			 * If the account does not have enough RAM balance to cover the cost of minting, then we need to use the
			 * size of the drop row as the RAM requirement using `sizeDropRowPurchase`. This adds additional RAM as a
			 * purchase buffer to prevent rounding errors that happen in the bancor algorithm.
			 */
			const ramRequiredWithBalance = $derivedDropsAmount * sizeDropRow;
			if (!$createBound && $accountContractRam < ramRequiredWithBalance) {
				const ramRequiredWithoutBalance = $derivedDropsAmount * sizeDropRowPurchase;
				return ramRequiredWithoutBalance;
			} else {
				return ramRequiredWithBalance;
			}
		}
		return 0;
	}
);

// The amount of RAM needed to complete the transaction
// contractRamPurchaseAmount = totalRamRequired - accountContractBalance.ram_bytes
export const contractRamPurchaseAmount: Readable<number> = derived(
	[createBound, totalRamRequired, accountContractRam],
	([$createBound, $totalRamRequired, $accountContractRam]) => {
		if (!$createBound && $totalRamRequired && $totalRamRequired > $accountContractRam) {
			if ($accountContractRam) {
				return $totalRamRequired - $accountContractRam;
			} else {
				return $totalRamRequired;
			}
		}
		return 0;
	}
);

export const contractRamPurchasePrice: Readable<Asset> = derived(
	[contractRamPurchaseAmount, ramPricePlusFee],
	([$contractRamPurchaseAmount, $ramPricePlusFee]) => {
		let amount = $contractRamPurchaseAmount * $ramPricePlusFee;
		if (amount > 0 && amount < 3) {
			amount = 3;
		}
		return Asset.fromUnits(amount, '4,EOS');
	}
);

export const contractBalanceToUse: Readable<number> = derived(
	[accountContractRam, totalRamRequired],
	([$accountContractRam, $totalRamRequired]) => {
		const canCoverAll = $accountContractRam >= $totalRamRequired;
		return $accountContractRam ? (canCoverAll ? $totalRamRequired : $accountContractRam) : 0;
	}
);

export const accountBalanceToUse: Readable<number> = derived(
	[accountRamBalance, totalRamRequired],
	([$accountRamBalance, $totalRamRequired]) => {
		const canCoverAll = $accountRamBalance >= $totalRamRequired;
		return $accountRamBalance ? (canCoverAll ? $totalRamRequired : $accountRamBalance) : 0;
	}
);

export const accountRamPurchaseAmount: Readable<number> = derived(
	[createBound, accountBalanceToUse, contractBalanceToUse, totalRamRequired],
	([$createBound, $accountBalanceToUse, $contractBalanceToUse, $totalRamRequired]) => {
		if ($createBound) {
			const amount = $totalRamRequired - $contractBalanceToUse - $accountBalanceToUse;
			if (amount > 0) {
				return amount + ramPurchaseBuffer;
			}
		}
		return 0;
	}
);

export const accountRamDepositAmount: Readable<number> = derived(
	[ramPricePlusFee, totalRamRequired, accountContractRam],
	([$ramPricePlusFee, $totalRamRequired, $accountContractRam]) => {
		return $ramPricePlusFee * ($totalRamRequired - $accountContractRam);
	}
);

export const accountRamDepositPrice: Readable<Asset> = derived(
	[accountRamDepositAmount],
	([$accountRamDepositAmount]) => {
		return Asset.fromUnits($accountRamDepositAmount, '4,EOS');
	}
);

export const accountRamPurchasePrice: Readable<Asset> = derived(
	[accountRamPurchaseAmount, ramPricePlusFee],
	([$accountRamPurchaseAmount, $ramPricePlusFee]) => {
		let amount = $accountRamPurchaseAmount * $ramPricePlusFee;
		if (amount > 0 && amount < 3) {
			amount = 3;
		}
		return Asset.fromUnits(amount, '4,EOS');
	}
);

export const requiresDeposit = derived(
	[accountContractRam, totalRamRequired],
	([$accountContractRam, $totalRamRequired]) => {
		return $accountContractRam < $totalRamRequired;
	}
);

export const hasEnoughAccountRAM: Readable<boolean> = derived(
	[accountRamBalance, totalRamRequired],
	([$accountRamBalance, $totalRamRequired]) => {
		if ($accountRamBalance >= 0 && $totalRamRequired >= 0) {
			return $accountRamBalance >= $totalRamRequired;
		}
		return false;
	}
);

export const hasEnoughContractRAM: Readable<boolean> = derived(
	[accountContractRam, totalRamRequired],
	([$accountContractRam, $totalRamRequired]) => {
		if ($accountContractRam >= 0 && $totalRamRequired >= 0) {
			return $accountContractRam >= $totalRamRequired;
		}
		return false;
	}
);

export const hasEnoughTokens: Readable<boolean> = derived(
	[accountTokenBalance, accountRamPurchasePrice],
	([$accountTokenBalance, $accountRamPurchasePrice]) => {
		if ($accountTokenBalance && $accountTokenBalance) {
			return $accountTokenBalance.value > $accountRamPurchasePrice.value;
		}
		return false;
	}
);

export const canGenerate: Readable<boolean> = derived(
	[createBound, derivedDropsAmount, hasEnoughAccountRAM, hasEnoughTokens, transacting],
	([$createBound, $derivedDropsAmount, $hasEnoughAccountRAM, $hasEnoughTokens, $transacting]) => {
		const general = $derivedDropsAmount > 0 && !$transacting;
		if ($createBound) {
			return (general && $hasEnoughAccountRAM) || $hasEnoughTokens;
		} else {
			return general && $hasEnoughTokens;
		}
	}
);

export const actionRequiresSessionKey = derived(
	[derivedDropsAmount, sessionKey],
	([$derivedDropsAmount, $sessionKey]) => {
		return $derivedDropsAmount > maximumBatchSize && !$sessionKey;
	}
);

export function randomName(): string {
	const length = 12;
	const chars = 'abcdefghijklmnopqrstuvwxyz12345';
	let drops = '';
	for (let i = 0; i < length; i++) {
		drops += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return drops;
}
