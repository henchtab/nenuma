<script lang="ts">
  import { goto } from '$app/navigation';
  import logo from '$lib/assets/logo.svg';
  import Ton from '$lib/components/Ton.svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Drawer from '$lib/components/ui/drawer';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { TON_CONNECT_UI_CONTEXT } from '$lib/constants';
  import { getAccountInfo } from '$lib/data';
  import { hapticFeedback } from '$lib/stores/tma';
  import { type TonConnectStore } from '$lib/stores/ton-connect';
  import { KlineTopic, latestPrices } from '$lib/stores/ws.svelte';
  import { createQuery } from '@tanstack/svelte-query';
  import { Address } from '@ton/core';
  import Menu from 'lucide-svelte/icons/menu';
  import X from 'lucide-svelte/icons/x';
  import TestTubes from 'lucide-svelte/icons/test-tubes';
  import { getContext } from 'svelte';

  const accountInfo = createQuery({
    queryKey: ['accountInfo'],
    queryFn: getAccountInfo,
    refetchInterval: 5000
  });

  const tonConnect = getContext<TonConnectStore>(TON_CONNECT_UI_CONTEXT);

  const items = [
    {
      symbol: 'BTC',
      href: '/dashboard/BTCUSDT',
      name: 'Bitcoin',
      priceKey: KlineTopic.BTCUSDT
    }
  ];

  function formatWalletAddress(address: string | undefined) {
    if (!address) {
      return 'Connect';
    }

    const formattedAddress = Address.parse(address).toString({
      testOnly: true,
      bounceable: false
    });

    return `${formattedAddress.slice(0, 6)}...${formattedAddress.slice(-4)}`;
  }
</script>

<header class="border-b sticky h-16 top-0 z-50 bg-ds-background-200">
  <div class="container pr-0 flex justify-between items-center">
    <img src={logo} alt="Nenuma" class="w-8 h-8" />
    <div class="flex items-center gap-2 p-4">
      <div class="inline-flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 17 18" width="17"
          ><g
            fill="none"
            fill-rule="evenodd"
            stroke="var(--ds-gray-1000, '#000')"
            stroke-width="1.5"
            ><path
              d="m1.84 3h13.3c.28 0 .5.22.5.5 0 .09-.02.17-.06.25l-6.33 11.18c-.27.48-.88.65-1.36.38-.16-.09-.3-.23-.38-.39l-6.11-11.18c-.13-.24-.04-.55.2-.68.08-.04.16-.06.24-.06z"
            /><path d="m8.5 15v-12" /></g
          ></svg
        >

        <Skeleton show={$accountInfo.isLoading}>
          <div class="font-medium min-w-10 text-center">
            {$accountInfo.data?.balance.slice(0, 6)}
          </div>
        </Skeleton>
      </div>
      <Drawer.Root>
        <Drawer.Trigger
          class="w-8 h-8 border border-ds-gray-400 rounded-full"
          onclick={() => $hapticFeedback.impactOccurred('light')}
        >
          <Menu class="overflow-visible m-auto" size="16" strokeWidth={1.5} /></Drawer.Trigger
        >
        <Drawer.Content>
          <input type="checkbox" id="drawer" class="sr-only" aria-hidden="true" />

          <Drawer.Header>
            <Drawer.Title>Navigation</Drawer.Title>

            <Drawer.Close onclick={() => $hapticFeedback.impactOccurred('light')}>
              <div
                class="w-8 h-8 border border-ds-gray-400 transition-colors text-ds-gray-1000 hover:bg-ds-gray-200 bg-ds-gray-100 inline-flex items-center justify-center rounded-full"
              >
                <X class="overflow-visible" size="20" strokeWidth={2} />
              </div>
            </Drawer.Close>
          </Drawer.Header>

          <nav class="gap-3 pt-4 pb-8 overflow-y-auto container">
            <section>
              <span class="text-base mb-2 text-ds-gray-900">Trading Pairs</span>

              <div class="pl-2">
                {#each items as item}
                  <Drawer.Close asChild let:builder>
                    <a
                      use:builder.action
                      {...builder}
                      class="flex justify-between items-center h-12"
                      href={item.href}
                      onclick={() => $hapticFeedback.impactOccurred('light')}
                    >
                      <div class="flex flex-col items-baseline">
                        <div>
                          <span
                            class="text-ds-gray-1000 text-left text-lg tracking-tight font-medium"
                          >
                            {item.symbol}
                          </span>
                          <span class="text-ds-gray-900 text-sm">/ USDT</span>
                        </div>
                      </div>
                      <div class="text-ds-gray-1000 flex-1 text-lg justify-end flex font-medium">
                        {$latestPrices[item.priceKey].toFixed(2)} $
                      </div>
                    </a>
                  </Drawer.Close>
                {/each}
              </div>
            </section>
            <div class="py-3 grid">
              <Drawer.Close asChild let:builder>
                <a
                  use:builder.action
                  {...builder}
                  class="flex h-12 justify-between items-center"
                  href="/playground"
                  onclick={() => $hapticFeedback.impactOccurred('light')}
                >
                  <div class="font-medium text-ds-gray-1000 text-lg">Playground</div>
                  <TestTubes size="20" strokeWidth={1.5} />
                </a>
              </Drawer.Close>
            </div>
            <div>
              <Button
                class="w-full"
                type="button"
                size="lg"
                onclickcapture={() => {
                  $tonConnect.disconnectWallet();
                  $hapticFeedback.impactOccurred('medium');
                  goto('/');
                }}
              >
                <div class="flex gap-2 items-center">
                  <Ton />
                  {formatWalletAddress($tonConnect.connection.wallet?.account.address)}
                </div>
              </Button>
            </div>
          </nav>
        </Drawer.Content>
      </Drawer.Root>
    </div>
  </div>
</header>
