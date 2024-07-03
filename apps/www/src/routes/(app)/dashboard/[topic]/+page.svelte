<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import TrendingDown from 'lucide-svelte/icons/trending-down';
  import TrendingUp from 'lucide-svelte/icons/trending-up';
  import type { PageData } from './$types';
  import ChartData from './ChartData.svelte';
  import OpenOptions from './OpenOptions.svelte';
  import { cn } from '$lib/utils';

  let { data }: { data: PageData } = $props();

  let actionsHeight = $state(0);

  async function handleSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
    console.log('submit');
  }
</script>

<div
  style="--actions-height: {actionsHeight}px;"
  class={cn('pt-6 flex flex-col min-h-[calc(100vh+var(--actions-height))]')}
>
  <div class="border-b pb-6">
    <h1 class="container text-2xl tracking-tight mb-4 font-bold">
      {data.topic}
    </h1>

    {#key data.result.list}
      <ChartData initialData={[...data.result.list, data.result.latest]} />
    {/key}
  </div>

  <div class="container pt-6">
    <OpenOptions />
  </div>

  <div
    bind:offsetHeight={actionsHeight}
    class="fixed bg-ds-background-100 bottom-0 z-10 border-t w-full p-4 gap-2"
  >
    <form onsubmit={handleSubmit}>
      <div class="grid grid-cols-2 gap-4">
        <Button
          class="bg-ds-green-700 flex gap-2 text-base font-medium text-white hover:bg-ds-green-800"
        >
          Call
          <TrendingUp size="20" strokeWidth={1.5} />
        </Button>
        <Button class="flex gap-2 text-base font-medium" variant="destructive">
          Put
          <TrendingDown size="20" strokeWidth={1.5} />
        </Button>
      </div>
    </form>
  </div>
</div>
