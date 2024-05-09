import { Account, AccountKit } from '@wharfkit/account';
import ContractKit from '@wharfkit/contract';
import SessionKit, {
	APIClient,
	Asset,
	Chains,
	Name,
	PrivateKey,
	Session,
	type TransactArgs,
	type TransactOptions
} from '@wharfkit/session';
import { TransactPluginResourceProvider } from '@wharfkit/transact-plugin-resource-provider';
import { WalletPluginAnchor } from '@wharfkit/wallet-plugin-anchor';
import { WalletPluginPrivateKey } from '@wharfkit/wallet-plugin-privatekey';
import { WalletPluginScatter } from '@wharfkit/wallet-plugin-scatter';
import { WalletPluginTokenPocket } from '@wharfkit/wallet-plugin-tokenpocket';
import { WalletPluginWombat } from '@wharfkit/wallet-plugin-wombat';
import WebRenderer from '@wharfkit/web-renderer';

import { derived, writable, type Readable, type Writable, get } from 'svelte/store';

import { PUBLIC_CHAIN_NAME, PUBLIC_LOCAL_SIGNER, PUBLIC_DROPLETS_API } from '$env/static/public';

import { Contract as SystemContract } from './contracts/eosio';
export * as SystemContract from './contracts/drops';

import { Contract as TokenContract } from './contracts/eosio-token';
export * as TokenContract from './contracts/drops';

import { Contract as DropsContract } from './contracts/drops';
export * as DropsContract from './contracts/drops';

import { Contract as EpochContract } from './contracts/epoch.drops';
import { safeActions } from './constants';
export * as EpochContract from './contracts/epoch.drops';

export const chain = Chains[PUBLIC_CHAIN_NAME];
if (!chain) {
	throw new Error(`Unknown chain: ${PUBLIC_CHAIN_NAME}`);
}

export const dropletsAPI = PUBLIC_DROPLETS_API;

const walletPlugins = [
	new WalletPluginAnchor(),
	new WalletPluginScatter(),
	new WalletPluginTokenPocket(),
	new WalletPluginWombat()
];

// If a local key is provided, add the private key wallet
if (PUBLIC_LOCAL_SIGNER) {
	walletPlugins.unshift(new WalletPluginPrivateKey(PUBLIC_LOCAL_SIGNER));
}

const urlParams = new URLSearchParams(window.location.search);
export const apiUrl: string = urlParams.get('url') ? urlParams.get('url') : chain.url;
chain.url = apiUrl;

export const client = new APIClient({ url: apiUrl });
export const accountKit = new AccountKit(chain, { client });
export const contractKit = new ContractKit({
	client
});

export const systemContract = new SystemContract({ client });
export const tokenContract = new TokenContract({ client });
export const dropsContract: DropsContract = new DropsContract({ client });
export const epochContract: EpochContract = new EpochContract({ client });

export const sessionKit = new SessionKit(
	{
		appName: 'drops',
		chains: [chain],
		ui: new WebRenderer({ minimal: true }),
		walletPlugins
	},
	{
		transactPlugins: [new TransactPluginResourceProvider()]
	}
);

export const walletSession: Writable<Session | undefined> = writable();

const stored = localStorage.getItem('sessionKey');
const storedKey = stored ? PrivateKey.from(stored) : undefined;
export const sessionKey: Writable<PrivateKey | undefined> = writable(storedKey);

const sessionKeyWallet: Readable<WalletPluginPrivateKey | undefined> = derived(
	sessionKey,
	($sessionKey) => {
		if ($sessionKey) {
			return new WalletPluginPrivateKey($sessionKey);
		}
	}
);

export const localSession: Readable<Session | undefined> = derived(
	[walletSession, sessionKeyWallet],
	([$walletSession, $sessionKeyWallet]) => {
		if ($walletSession && $sessionKeyWallet) {
			return new Session({
				actor: $walletSession.actor,
				chain: $walletSession.chain,
				permission: 'dropssession',
				walletPlugin: $sessionKeyWallet
			});
		}
	}
);

export async function localTransact(args: TransactArgs, options: TransactOptions = {}) {
	let valid = true;
	args.actions?.forEach((action) => {
		if (!Name.from('drops').equals(action.account) || !safeActions.includes(String(action.name))) {
			valid = false;
		}
	});
	if (valid) {
		const local = get(localSession);
		return local?.transact(args, options);
	} else {
		const wallet = get(walletSession);
		return wallet?.transact(args, options);
	}
}

export const session: Readable<Session | undefined> = derived(
	[localSession, walletSession],
	([$localSession, $walletSession]) => {
		if ($walletSession) {
			if ($localSession) {
				$walletSession.localTransact = localTransact;
			}
			return $walletSession;
		}
	}
);

session.subscribe(() => {
	loadAccountData();
});

export async function login() {
	const result = await sessionKit.login();
	walletSession.set(result.session);
}

export async function logout() {
	await sessionKit.logout();
	walletSession.set(undefined);
	sessionKey.set(undefined);
	localStorage.removeItem('sessionKey');
}

export async function restore() {
	const restored = await sessionKit.restore();
	walletSession.set(restored);
}

export const account: Writable<Account | undefined> = writable();
session.subscribe((session) => {
	if (session) {
		accountKit.load(session.actor).then((data) => account.set(data));
	}
});

export const accountRamBalance: Writable<number> = writable();
export const accountTokenBalance: Writable<Asset> = writable();
export const accountCpuBalance: Writable<number> = writable();
export const accountNetBalance: Writable<number> = writable();

export const accountContractBalance: Writable<DropsContract.Types.balances_row> = writable();
export const accountContractDrops = derived(accountContractBalance, ($accountContractBalance) =>
	$accountContractBalance ? Number($accountContractBalance.drops) : 0
);
export const accountContractRam = derived(accountContractBalance, ($accountContractBalance) =>
	$accountContractBalance ? Number($accountContractBalance.ram_bytes) : 0
);

export async function loadAccountData() {
	await loadAccountBalances();
	await loadBalanceRow();
}

export async function loadAccountBalances() {
	const currentSession = get(session);
	if (currentSession) {
		const result = await accountKit.load(currentSession.actor);
		account.set(result);
		accountRamBalance.set(Number(result.resource('ram').available));
		accountCpuBalance.set(Number(result.resource('cpu').available));
		accountNetBalance.set(Number(result.resource('net').available));
		if (result.data.core_liquid_balance) {
			accountTokenBalance.set(result.data.core_liquid_balance);
		}
	}
}

export async function loadBalanceRow() {
	const currentSession = get(session);
	if (currentSession) {
		const results = await dropsContract.table('balances').get(currentSession.actor);
		if (results) {
			accountContractBalance.set(results);
		}
	}
}
