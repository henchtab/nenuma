<script lang="ts">
  import { page } from '$app/stores';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { randomize } from '$lib/utils';

  import { mainButton } from '$lib/stores/tma';
  import { createDataStream } from '$lib/wrappers';
  import { writable } from 'svelte/store';
  import { onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  const searchParams = $page.url.searchParams;

  const streamAddress = searchParams.get('streamAddress') || '';
  const stream = createDataStream(writable(streamAddress));

  let form = $state<HTMLFormElement>();
  let queryId = $state<number>(0);

  $effect(() => {
    if ($mainButton && form) {
      $mainButton.setText('Deploy Batch').enable().show();

      const unsubscribe = $mainButton.on('click', () => form?.requestSubmit());

      return unsubscribe;
    } else {
      $mainButton.hide().disable();
    }
  });

  onDestroy(() => {
    if (browser) {
      $mainButton.hide().disable();
    }
  });

  async function handleDeployBatchSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const args = {
      queryId: BigInt(formData.get('queryId') as string)
    };

    await $stream.deploySubscriptionBatch(args);
  }
</script>

<form
  bind:this={form}
  class="flex container py-6 flex-col gap-4 overflow-auto"
  onsubmit={handleDeployBatchSubmit}
>
  <div class="grid gap-2">
    <Label for="queryId" class="w-fit">Query ID</Label>
    <div
      class="flex relative ring-1 ring-ds-gray-400 rounded-md transition-all duration-300 focus-within:ring-2 focus-within:ring-ds-gray-600"
    >
      <Input
        id="queryId"
        type="number"
        name="queryId"
        placeholder="101"
        required
        bind:value={queryId}
        class="rounded-r-none border-0 border-r focus-visible:ring-0 appearance-none"
      />
      <Button
        variant="secondary"
        class="text-sm rounded-l-none ring-0"
        onclick={() => (queryId = randomize())}>Randomize</Button
      >
    </div>
  </div>
</form>
