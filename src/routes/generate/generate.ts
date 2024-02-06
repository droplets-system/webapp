import { ramPrice, ramPricePlusFee } from '$lib/bancor';
import { sizeDropRow, sizeDropRowPurchase } from '$lib/constants';
import {
	DropsContract,
	accountContractRam,
	accountContractBalance,
	accountRamBalance,
	accountTokenBalance
} from '$lib/wharf';
import { type Writable, writable, derived, type Readable } from 'svelte/store';

export const useRandomDrop: Writable<boolean> = writable(true);
export const randomDrop: Writable<string> = writable(randomName());
export const createBound: Writable<boolean> = writable(true);
export const dropsAmount: Writable<number> = writable(1);
export const customDropsAmount: Writable<boolean> = writable(false);
export const customDropsValue: Writable<number> = writable();
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
// totalRamToPurchase = totalRamRequired - accountContractBalance.ram_bytes
export const totalRamToPurchase: Readable<number> = derived(
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

export const totalRamCreditsToUse: Readable<number> = derived(
	[createBound, totalRamRequired, accountContractBalance],
	([$createBound, $totalRamRequired, $accountContractBalance]) => {
		if (!$createBound && $totalRamRequired && $accountContractBalance) {
			if ($totalRamRequired > Number($accountContractBalance.ram_bytes)) {
				return Number($accountContractBalance.ram_bytes);
			} else {
				return $totalRamRequired;
			}
		}
		return 0;
	}
);

export const totalPrice: Readable<number> = derived(
	[ramPricePlusFee, totalRamToPurchase],
	([$ramPricePlusFee, $totalRamToPurchase]) => {
		console.log($ramPricePlusFee * $totalRamToPurchase);
		return $ramPricePlusFee * $totalRamToPurchase;
	}
);

export const hasEnoughRAM: Readable<boolean> = derived(
	[accountRamBalance, totalRamToPurchase],
	([$accountRamBalance, $totalRamToPurchase]) => {
		if ($accountRamBalance >= 0 && $totalRamToPurchase >= 0) {
			return $accountRamBalance >= $totalRamToPurchase;
		}
		return false;
	}
);

export const hasEnoughTokens: Readable<boolean> = derived(
	[accountTokenBalance, totalPrice],
	([$accountTokenBalance, $totalPrice]) => {
		if ($accountTokenBalance && $accountTokenBalance) {
			return Number($accountTokenBalance.units) > $totalPrice;
		}
		return false;
	}
);

export const canGenerate: Readable<boolean> = derived(
	[createBound, derivedDropsAmount, hasEnoughRAM, hasEnoughTokens, transacting],
	([$createBound, $derivedDropsAmount, $hasEnoughRAM, $hasEnoughTokens, $transacting]) => {
		const general = $derivedDropsAmount > 0 && !$transacting;
		if ($createBound) {
			return general && $hasEnoughRAM;
		} else {
			return general && $hasEnoughTokens;
		}
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
