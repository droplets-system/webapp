<script lang="ts">
	import { Asset, UInt64 } from '@wharfkit/session';

	import {
		accountRamBalance,
		dropsContract,
		loadAccountBalances,
		loadBalanceRow,
		session,
		systemContract,
		tokenContract
	} from '$lib/wharf';

	async function claim() {
		if ($session) {
			const action = dropsContract.action('claim', {
				owner: $session.actor
			});
			await $session.transact({ action });
			setTimeout(loadAccountBalances, 1000);
			setTimeout(loadBalanceRow, 1000);
		}
	}

	async function deposit() {
		const action = tokenContract.action('transfer', {
			from: $session.actor,
			to: 'drops',
			quantity: Asset.fromUnits(50000, '4,EOS'),
			memo: String($session.actor)
		});
		await $session?.transact({ action });
		setTimeout(loadAccountBalances, 1000);
		setTimeout(loadBalanceRow, 1000);
	}

	async function sellram() {
		const action = systemContract.action('sellram', {
			account: $session.actor,
			bytes: $accountRamBalance
		});
		await $session?.transact({ action });
		setTimeout(loadAccountBalances, 1000);
		setTimeout(loadBalanceRow, 1000);
	}

	async function buyram() {
		const action = systemContract.action('buyrambytes', {
			payer: $session.actor,
			receiver: $session.actor,
			bytes: UInt64.from(100000)
		});
		await $session?.transact({ action });
		setTimeout(loadAccountBalances, 1000);
		setTimeout(loadBalanceRow, 1000);
	}
</script>

<div class="text-center space-y-2">
	<div class="h1">DEV TOOLS</div>
	<button
		class="btn btn-lg variant-filled w-full bg-gradient-to-br from-blue-300 to-cyan-400 box-decoration-clone"
		on:click|preventDefault={claim}
	>
		claim
	</button>
	<button
		class="btn btn-lg variant-filled w-full bg-gradient-to-br from-blue-300 to-cyan-400 box-decoration-clone"
		on:click|preventDefault={deposit}
	>
		deposit 5 EOS
	</button>
	<button
		class="btn btn-lg variant-filled w-full bg-gradient-to-br from-blue-300 to-cyan-400 box-decoration-clone"
		on:click|preventDefault={buyram}
	>
		buy 100kb ram
	</button>
	<button
		class="btn btn-lg variant-filled w-full bg-gradient-to-br from-blue-300 to-cyan-400 box-decoration-clone"
		on:click|preventDefault={sellram}
	>
		sell all ram
	</button>
</div>

<style lang="postcss">
</style>
