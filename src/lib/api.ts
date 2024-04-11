import type { NameType } from '@wharfkit/session';
import { DropsContract, dropletsAPI } from './wharf';

export interface APIDroplet {
	_id: string;
	owner: string;
	created: string;
	bound: boolean;
}

export interface DropletsResult {
	droplets: DropsContract.Types.drop_row[];
	total: number;
}

export async function loadDroplets(
	account: NameType,
	skip: number = 0,
	limit: number = 10
): Promise<DropletsResult> {
	const response = await fetch(
		dropletsAPI + `/get/droplets?account=${account}&skip=${skip}&limit=${limit}`
	);
	const result = await response.json();
	const droplets = result.droplets.map((data: APIDroplet) =>
		DropsContract.Types.drop_row.from({
			...data,
			seed: data._id,
			created: new Date(data.created)
		})
	);
	return {
		droplets,
		total: result.total
	};
}
