<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Drawer from '$lib/components/ui/drawer';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { hapticFeedback, mainButton } from '$lib/stores/tma';
  import type { TDataStream } from '$lib/wrappers';
  import { getContext } from 'svelte';

  const stream = getContext<TDataStream>('stream');
  let isOpened = $state(false);
  let form = $state<HTMLFormElement>();

  $effect(() => {
    if ($mainButton && isOpened && form) {
      $mainButton.setText('Deploy Stream').enable().show();

      const unsubscribe = $mainButton.on('click', () => form?.requestSubmit());

      return unsubscribe;
    } else {
      $mainButton.hide().disable();
    }
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

    await $stream.deploy(args);
  }
</script>

<Drawer.Root onOpenChange={(s) => (isOpened = s)}>
  <Drawer.Trigger asChild let:builder>
    <Button
      builders={[builder]}
      onclick={() => $hapticFeedback?.impactOccurred('medium')}
      class="bg-ds-green-800 text-white hover:bg-ds-green-700"
      type="submit">Deploy Stream</Button
    >
    <Drawer.Content>
      <Drawer.Header>
        <Drawer.Title>Deploy Stream</Drawer.Title>
        <Drawer.Description>Deploy your own stream.</Drawer.Description>
      </Drawer.Header>
      <form
        bind:this={form}
        class="flex container py-6 flex-col gap-4 overflow-auto"
        onsubmit={handleDeploySubmit}
      >
        <!-- Prevent autofocus on the first input field as it breaks scroll after closing the drawer -->
        <input class="sr-only" aria-hidden="true" type="checkbox" />
        <Label class="flex flex-col gap-2"
          >Topic
          <Input type="text" name="topic" placeholder="1.candlestick.TONUSDT" required />
        </Label>
        <Label class="flex flex-col gap-2"
          >Query ID
          <Input type="number" name="queryId" placeholder="777" required min="0" />
        </Label>
      </form>
    </Drawer.Content>
  </Drawer.Trigger>
</Drawer.Root>
