<script lang="ts">
  import { PUBLIC_BROKER_ADDRESS } from '$env/static/public';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { TON_CONNECT_UI_CONTEXT } from '$lib/constants';
  import { hapticFeedback } from '$lib/stores/tma';
  import type { TonConnectStore } from '$lib/stores/ton-connect';
  import { cn, formatTime } from '$lib/utils';
  import { useBroker } from '$lib/wrappers';
  import { Address, toNano } from '@ton/core';
  import ChevronDown from 'lucide-svelte/icons/chevron-down';
  import TrendingDown from 'lucide-svelte/icons/trending-down';
  import TrendingUp from 'lucide-svelte/icons/trending-up';
  import { getContext, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import type { PageData } from './$types';
  import ChartData from './ChartData.svelte';
  import OpenOptions from './OpenOptions.svelte';

  let { data }: { data: PageData } = $props();

  const tonConnect = getContext<TonConnectStore>(TON_CONNECT_UI_CONTEXT);

  let actionsHeight = $state(0);

  const broker = useBroker(writable(PUBLIC_BROKER_ADDRESS));

  let initiation = $state(initiationTime(3));
  let optionType: 'call' | 'put';

  onMount(() => {
    const interval = setInterval(() => {
      if (initiation < initiationTime(3)) {
        initiation = initiationTime(3);
      }
    }, 1000 * 30);

    return () => clearInterval(interval);
  });

  function initiationTime(numberOfMinutes: number) {
    return formatTime(new Date(Date.now() + 1000 * 60 * numberOfMinutes));
  }

  async function handleSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    formData.append('type', optionType);

    const initiation = BigInt(new Date(formData.get('initiation') as string).getTime() / 1000);
    const expiration = BigInt(initiation + BigInt(formData.get('expiration') as string) * 60n);

    const type = (formData.get('type') as string) ? 'true' : 'false';

    const args = {
      queryId: BigInt(Date.now()),
      draft: {
        holder: Address.parse($tonConnect.connection.wallet!.account.address),
        initiation,
        expiration,
        investment: toNano(formData.get('investment') as string),
        optionType: Boolean(type)
      }
    };

    await $broker.deployOption(args);
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
    <form class="grid gap-4" onsubmit={handleSubmit}>
      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label for="initiation" class="w-fit">Initiation</Label>
          <Input
            id="initiation"
            type="datetime-local"
            name="initiation"
            min={initiation}
            bind:value={initiation}
            required
            onchange={() => $hapticFeedback.selectionChanged()}
          />
        </div>

        <div class="grid gap-2">
          <Label for="expiration" class="w-fit">Expiration</Label>
          <div class="relative flex items-center">
            <select
              class="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-ds-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-gray-600 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
              id="expiration"
              name="expiration"
              required
              onchange={() => $hapticFeedback.selectionChanged()}
            >
              <option value="2">2 minutes</option>
              <option value="3">3 minutes</option>
              <option value="4">4 minutes</option>
              <option value="5">5 minutes</option>
            </select>
            <ChevronDown size={16} stroke-width={1.5} class="absolute right-2 text-ds-gray-900" />
          </div>
        </div>
      </div>

      <div class="grid gap-2">
        <Label for="investment" class="w-fit">Investment</Label>
        <div class="relative flex items-center">
          <Input
            class="pr-12"
            id="investment"
            type="number"
            name="investment"
            placeholder="100"
            min="1"
            step="any"
            required
          />
          <span class="absolute right-3 select-none text-sm font-medium text-ds-gray-1000">TON</span
          >
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <Button
          class="bg-ds-green-800 flex gap-2 text-base font-medium text-white hover:bg-ds-green-700"
          onclick={() => {
            optionType = 'call';
            $hapticFeedback.impactOccurred('medium');
          }}
          type="submit"
        >
          Call
          <TrendingUp size="20" strokeWidth={1.5} />
        </Button>
        <Button
          class="flex gap-2 text-base font-medium"
          variant="destructive"
          onclick={() => {
            optionType = 'put';
            $hapticFeedback.impactOccurred('medium');
          }}
          type="submit"
        >
          Put
          <TrendingDown size="20" strokeWidth={1.5} />
        </Button>
      </div>
    </form>
  </div>
</div>
