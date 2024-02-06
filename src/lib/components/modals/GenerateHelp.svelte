<script lang="ts">
	import { t } from '$lib/i18n';
	import { getModalStore } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();
</script>

{#if $modalStore[0]}
	<div class="relative z-10" aria-labelledby="modal-title" aria-modal="true">
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<div
				class="relative overflow-hidden rounded-lg bg-slate-300 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg"
			>
				<div class="bg-slate-700 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
					<article class="prose lg:prose dark:prose-invert px-8">
						<h3>Generating Drops</h3>
						<p>
							Are you sure you want to deactivate your account? All of your data will be permanently
							removed. This action cannot be undone.
						</p>
						<p>
							Are you sure you want to deactivate your account? All of your data will be permanently
							removed. This action cannot be undone.
						</p>
						<p>
							Are you sure you want to deactivate your account? All of your data will be permanently
							removed. This action cannot be undone.
						</p>
						<p>
							Are you sure you want to deactivate your account? All of your data will be permanently
							removed. This action cannot be undone.
						</p>
						<p>
							Are you sure you want to deactivate your account? All of your data will be permanently
							removed. This action cannot be undone.
						</p>
					</article>
				</div>
				<div class="bg-slate-600 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
					<button
						type="button"
						class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
						on:click={modalStore.close}
					>
						Close
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
</style>
