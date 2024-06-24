<script lang="ts">
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { backButton, mainButton } from '$lib/stores/tma';
  import type { TDataStream as CDataStream } from '$lib/wrappers';
  import { getContext, onMount } from 'svelte';

  const stream = ((getContext < DataStream) as CDataStream) > 'stream';
  let isOpened = $state(false);
  let form = $state<HTMLFormElement>();

  $effect(() => {
    if ($mainButton && isOpened && form) {
      $mainButton.setText('Publish Candlestick').enable().show();

      const unsubscribe = $mainButton.on('click', () => form?.requestSubmit());

      return unsubscribe;
    } else {
      $mainButton.hide().disable();
    }
  });

  onMount(() => {
    $backButton.show();

    const unsubscribe = $backButton.on('click', async () => {
      history.back();
    });

    return () => {
      unsubscribe();
      $backButton.hide();
    };
  });

  async function handlePublishCandlestickSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const start = formData.get('start');
    const end = formData.get('end');
    const open = formData.get('open');
    const high = formData.get('high');
    const low = formData.get('low');
    const close = formData.get('close');

    if (start && end && open && high && low && close) {
      const candlestick = {
        start: BigInt(start as string),
        end: BigInt(end as string),
        open: BigInt(open as string),
        high: BigInt(high as string),
        low: BigInt(low as string),
        close: BigInt(close as string)
      };

      const args = {
        candlestick,
        queryId: BigInt(formData.get('queryId') as string)
      };

      await $stream.publishCandlestick(args);
    }
  }
</script>

<form
  bind:this={form}
  class="flex container py-6 flex-1 flex-col gap-4"
  onsubmit={handlePublishCandlestickSubmit}
>
  <div class="grid gap-2">
    <Label for="start" class="w-fit">Start</Label>
    <Input id="start" type="number" name="start" placeholder="1718207640000" required />
  </div>
  <div class="grid gap-2">
    <Label for="end" class="w-fit">End</Label>
    <Input id="end" type="number" name="end" placeholder="1718207699999" required />
  </div>
  <div class="grid gap-2">
    <Label id="open" class="w-fit">Open</Label>
    <Input id="open" type="number" name="open" placeholder="6969709" required />
  </div>
  <div class="grid gap-2">
    <Label for="high" class="w-fit">High</Label>
    <Input id="high" type="number" name="high" placeholder="6969774" required />
  </div>
  <div class="grid gap-2">
    <Label for="low" class="w-fit">Low</Label>
    <Input id="low" type="number" name="low" placeholder="6970129" required />
  </div>
  <div class="grid gap-2">
    <Label for="close" class="w-fit">Close</Label>
    <Input id="close" type="number" name="close" placeholder="6966979" required />
  </div>
  <div class="grid gap-2">
    <Label for="query" class="w-fit">Query ID</Label>
    <Input id="query" type="number" name="queryId" placeholder="777" required />
  </div>
</form>
