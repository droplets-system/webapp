import type { Asset, Int64 } from '@wharfkit/session';
import { systemContract } from './wharf';
import { writable, type Writable } from 'svelte/store';
import { sizeDropRow, sizeDropRowPurchase } from './constants';

export const ramPrice = writable(0);
export const ramPricePlusFee = writable(0);
export const dropsPrice: Writable<number> = writable();
export const dropsPricePlusFee: Writable<number> = writable();

export async function loadRamPrice(bound = false) {
	const cost = await getRamPrice();
	const rowSize = bound ? sizeDropRow : sizeDropRowPurchase;
	if (cost) {
		const costPlusFee = await getRamPricePlusFee(cost);
		ramPrice.set(cost);
		ramPricePlusFee.set(costPlusFee);
		dropsPrice.set(cost * rowSize);
		dropsPricePlusFee.set(costPlusFee * sizeDropRowPurchase + 1);
	}
}

export function get_bancor_input(out_reserve: Asset, inp_reserve: Asset, out: number): Int64 {
	const ob = out_reserve.units;
	const ib = inp_reserve.units;
	return ib.multiplying(out).dividing(ob.subtracting(out));
}

export function get_bancor_output(inp_reserve: Asset, out_reserve: Asset, inp: number): Int64 {
	const ib = inp_reserve.units;
	const ob = out_reserve.units;
	return ob.multiplying(inp).dividing(ib.adding(inp));
}

export async function getRamPrice(): Promise<number> {
	const results = await systemContract.table('rammarket').get();
	if (!results) {
		throw new Error('Could not load RAM price.');
	}
	const { base, quote } = results;
	const bytes = 10000;
	const cost = Number(get_bancor_input(base.balance, quote.balance, bytes));
	return cost / 10000;
}

// export async function getRamPriceMinusFee(input?: number): Promise<number> {
// 	let cost: number;
// 	if (input) {
// 		cost = input;
// 	} else {
// 		cost = await getRamPrice();
// 	}
// 	return cost * 0.995;
// }

export async function getRamPricePlusFee(input?: number): Promise<number> {
	let cost: number;
	if (input) {
		cost = input;
	} else {
		cost = await getRamPrice();
	}
	return cost / 0.995;
}
