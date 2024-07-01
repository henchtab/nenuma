<script lang="ts">
  import { browser } from '$app/environment';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { hapticFeedback, mainButton } from '$lib/stores/tma';
  import { randomize } from '$lib/utils';
  import { createDataStream } from '$lib/wrappers';
  import { onDestroy, onMount } from 'svelte';
  import { toast } from 'svelte-sonner';

  const stream = createDataStream();

  let form = $state<HTMLFormElement>();

  let queryId = $state<number>();

  $effect(() => {});

  onMount(() => {
    let unsubscribe: (() => void) | undefined;

    if ($mainButton && form) {
      $mainButton.setText('Deploy Stream').enable().show();

      unsubscribe = $mainButton.on('click', () => {
        $hapticFeedback.impactOccurred('heavy');
        form?.requestSubmit();
      });
    }

    return () => {
      unsubscribe?.();
      $mainButton.disable().hide().setText('D');
      console.log('unsubscribed');
    };
  });

  async function handleDeploySubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const args = {
      topic: formData.get('topic') as string,
      queryId: BigInt(formData.get('queryId') as string)
    };

    try {
      await $stream.deploy(args);
      toast.success('The stream deployment transaction is on its way');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }
</script>

<form
  bind:this={form}
  class="flex container py-6 flex-col gap-4 overflow-auto"
  onsubmit={handleDeploySubmit}
>
  <div class="grid gap-2">
    <Label class="w-fit">Topic</Label>
    <Input type="text" name="topic" placeholder="1.candlestick.TONUSDT" required />
  </div>

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
