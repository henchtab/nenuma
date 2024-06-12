<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import ArrowDown from 'lucide-svelte/icons/arrow-down';
  import ArrowUp from 'lucide-svelte/icons/arrow-up';
  import type { PageData } from './$types';
  import ChartData from './ChartData.svelte';
  import OpenOptions from './OpenOptions.svelte';
  import { cn } from '$lib/utils';

  let { data }: { data: PageData } = $props();

  let actionsHeight = $state(0);
</script>

<div
  style="--actions-height: {actionsHeight}px;"
  class={cn('pt-6 flex flex-col min-h-[calc(100vh+var(--actions-height))]')}
>
    <div class="container border-b pb-6">
      <h1 class="text-2xl tracking-tight mb-4 font-bold">
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
    class="bg-white fixed bottom-0 z-10 border-t w-full grid grid-cols-2 p-4 gap-2"
  >
    <Button class="bg-ds-green-700 hover:bg-ds-green-800">
      <ArrowUp size="24" strokeWidth={1.5} />
    </Button>
    <Button class="bg-ds-red-700 hover:bg-ds-red-800">
      <ArrowDown size="24" strokeWidth={1.5} />
    </Button>
  </div>
</div>
