<script lang="ts">
  import { PUBLIC_API_URL, PUBLIC_BROKER_ADDRESS } from '$env/static/public';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Note } from '$lib/components/ui/note';
  import { Spinner } from '$lib/components/ui/spinner';
  import { ACCESS_TOKEN_COOKIE, TON_CONNECT_UI_CONTEXT } from '$lib/constants';
  import { hapticFeedback } from '$lib/stores/tma';
  import type { TonConnectStore } from '$lib/stores/ton-connect';
  import { latestPrices } from '$lib/stores/ws.svelte';
  import { cn, formatTime } from '$lib/utils';
  import { withWalletConnection } from '$lib/with-wallet-connection';
  import { useBroker } from '$lib/wrappers';
  import { Address, fromNano, toNano } from '@ton/core';
  import cookie from 'js-cookie';
  import { ChevronDown, TrendingDown, TrendingUp } from 'lucide-svelte';
  import { getContext, onMount } from 'svelte';
  import { derived, writable } from 'svelte/store';
  import { formState } from './stores';

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

  // Form state

  let initiation = $state(initiationTime(3));

  let minInvestment = $state('1.00');
  let maxInvestment = $state('0.00');

  let optionType: boolean | undefined = $state();

  // End of form state

  let isInvestmentValid = $state(true);

  $effect(() => {
    console.log($formState);
  });

  onMount(() => {
    try {
      getMaxInvestment().then((x) => (maxInvestment = x));
    } catch (error) {
      console.error(error);
    }

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

  async function getMaxInvestment() {
    const balance = await $broker.getBalance();
    const coefficient = await $broker.getPayoutRatio();
    const storageReserve = await $broker.getStorageReserve();

    return fromNano(
      ((balance - storageReserve) * coefficient.nominator) / coefficient.denominator
    ).slice(0, 4);
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
        optionType: optionType as boolean
      }
    };

    const optionId = await $broker.getNextOptionId();

    await fetch(`${PUBLIC_API_URL}/api/options`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookie.get(ACCESS_TOKEN_COOKIE)}`
      },
      body: JSON.stringify(
        {
          pendingOption: {
            status: 'pending',
            optionId,
            draft: {
              $$type: 'CashOrNothingOptionDraftAgreement',
              ...args.draft
            }
          },
          trader: $tonConnect.connection.wallet!.account.address
        },
        (_, v) => {
          if (typeof v === 'bigint') {
            return v.toString();
          }

          if (v instanceof Address) {
            return v.toString();
          }

          return v;
        }
      )
    });

    await $broker.deployOption(args);

    formState.set({
      isSubmitDisabled: true,
      buttonWithSpinner: optionType ? 'call' : 'put',
      expiration: Date.now() + 1000 * 60
    });

    setTimeout(() => {
      formState.set({
        isSubmitDisabled: false,
        buttonWithSpinner: undefined,
        expiration: undefined
      });
    }, 1000 * 60);
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
  <form class="grid gap-4" onsubmit={(e) => withWalletConnection(() => handleSubmit(e))}>
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
          placeholder="1.00 — {maxInvestment}"
          min={minInvestment}
          max={maxInvestment}
          step={0.01}
          oninput={(e) => {
            const value = Number(e.currentTarget.value);

            if (!value) {
              // Reset the validation state
              isInvestmentValid = true;
              return;
            }

            if (value < Number(minInvestment) || value > Number(maxInvestment)) {
              isInvestmentValid = false;
            } else {
              isInvestmentValid = true;
            }
          }}
          required
        />
        <span class="absolute right-3 select-none text-sm font-medium text-ds-gray-1000">TON</span>
      </div>

      {#if !isInvestmentValid}
        <p class="text-sm text-ds-red-900">
          The investment must be {minInvestment} to {maxInvestment} TON.
        </p>
      {/if}
    </div>

    <div class="grid grid-cols-2 relative gap-4">
      <Button
        class="bg-ds-green-800 flex gap-2 text-white hover:bg-ds-green-700"
        onclick={() => {
          optionType = true;
          $hapticFeedback.impactOccurred('medium');
        }}
        type="submit"
        disabled={$formState.isSubmitDisabled}
      >
        {#if $formState.isSubmitDisabled && $formState.buttonWithSpinner === 'call'}
          <Spinner />
        {:else}
          <TrendingUp size="16" />
        {/if}
        Call
      </Button>
      <Button
        class="flex gap-2"
        variant="destructive"
        onclick={() => {
          optionType = false;
          $hapticFeedback.impactOccurred('medium');
        }}
        type="submit"
        disabled={$formState.isSubmitDisabled}
      >
        {#if $formState.isSubmitDisabled && $formState.buttonWithSpinner === 'put'}
          <Spinner />
        {:else}
          <TrendingDown size="16" />
        {/if}
        Put
      </Button>
    </div>

    <Note class="border-ds-amber-400 text-ds-amber-900 selection:bg-amber-500 selection:text-white"
      >An additional 2 TON will be reserved for fees, with any excess refunded to you.</Note
    >
  </form>
</div>
