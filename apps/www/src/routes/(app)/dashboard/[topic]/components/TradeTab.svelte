<script lang="ts">
  import { PUBLIC_BROKER_ADDRESS } from '$env/static/public';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { TON_CONNECT_UI_CONTEXT } from '$lib/constants';
  import { hapticFeedback } from '$lib/stores/tma';
  import type { TonConnectStore } from '$lib/stores/ton-connect';
  import { latestPrices } from '$lib/stores/ws.svelte';
  import { cn, formatTime } from '$lib/utils';
  import { useBroker } from '$lib/wrappers';
  import { Address, fromNano, toNano } from '@ton/core';
  import { ChevronDown, TrendingDown, TrendingUp } from 'lucide-svelte';
  import { getContext, onMount } from 'svelte';
  import { derived, writable } from 'svelte/store';

  const tonConnect = getContext<TonConnectStore>(TON_CONNECT_UI_CONTEXT);

  const previousPrice = writable(0);
  const isPriceGoingUp = derived(
    [previousPrice, latestPrices],
    ([$previousPrice, $latestPrices], set) => {
      if ($previousPrice > $latestPrices.BTCUSDT) {
        set(false);
      } else if ($previousPrice < $latestPrices.BTCUSDT) {
        set(true);
      }

      previousPrice.set($latestPrices.BTCUSDT);
    }
  );

  const broker = useBroker(writable(PUBLIC_BROKER_ADDRESS));

  let initiation = $state(initiationTime(3));
  let maxInvestment = $state(0);
  let optionType: boolean;

  let isInvestmentValid = $state(true);

  onMount(async () => {
    try {
      maxInvestment = Number(await getMaxInvestment());
    } catch (error) {
      console.error(error);
    }

    const interval = setInterval(() => {
      if (initiation < initiationTime(3)) {
        initiation = initiationTime(3);
      }
    }, 1000 * 30);

    return clearTimeout(interval);
  });

  function initiationTime(numberOfMinutes: number) {
    return formatTime(new Date(Date.now() + 1000 * 60 * numberOfMinutes));
  }

  async function getMaxInvestment() {
    const balance = await $broker.getBalance();
    const coefficient = await $broker.getPayoutRatio();
    const storageReserve = await $broker.getStorageReserve();

    return fromNano(
      ((balance - storageReserve) * coefficient.nominator) / coefficient.denominator
    ).slice(0, 5);
  }

  async function handleSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const initiationTime = formData.get('initiation') as string;
    const initiation = BigInt(
      new Date(`${new Date().toDateString()} ${initiationTime}`).getTime() / 1000
    );

    const expiration = BigInt(initiation + BigInt(formData.get('expiration') as string) * 60n);

    const args = {
      queryId: BigInt(Date.now()),
      draft: {
        holder: Address.parse($tonConnect.connection.wallet!.account.address),
        initiation,
        expiration,
        investment: toNano(formData.get('investment') as string),
        optionType
      }
    };

    // const optionId = await $broker.getNextOptionId();
    // options.update((prev) => [
    //   ...prev,
    //   {
    //     status: 'pending',
    //     optionId: Number(optionId),
    //     draft: {
    //       $$type: 'CashOrNothingOptionDraftAgreement',
    //       ...args.draft
    //     }
    //   }
    // ]);

    await $broker.deployOption(args);
  }
</script>

<div class="container">
  <h1 class="text-ds-gray-900 font-medium">Mark Price</h1>
  <span
    class={cn('text-2xl tracking-tight font-semibold', {
      'text-ds-green-900': $isPriceGoingUp,
      'text-ds-red-900': !$isPriceGoingUp
    })}
  >
    {$latestPrices.BTCUSDT.toFixed(2)}
  </span>
</div>

<div class="w-full p-4 gap-2">
  <form class="grid gap-4" onsubmit={handleSubmit}>
    <div class="grid grid-cols-2 gap-4">
      <div class="grid gap-2">
        <Label for="initiation" class="w-fit">Initiation</Label>
        <Input
          id="initiation"
          type="time"
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
          placeholder="1 - {maxInvestment}"
          min="1"
          max={maxInvestment}
          step={0.01}
          oninput={(e) =>
            (isInvestmentValid =
              Number(e.currentTarget.value) >= 1 && Number(e.currentTarget.value) <= maxInvestment)}
          required
        />
        <span class="absolute right-3 select-none text-sm font-medium text-ds-gray-1000">TON</span>
      </div>

      {#if !isInvestmentValid}
        <p class="text-sm text-ds-red-900">
          Investment must be between 1 and {maxInvestment} TON
        </p>
      {/if}
    </div>

    <div class="grid grid-cols-2 gap-4">
      <Button
        class="bg-ds-green-800 flex gap-2 text-base font-medium text-white hover:bg-ds-green-700"
        onclick={() => {
          optionType = true;
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
          optionType = false;
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
