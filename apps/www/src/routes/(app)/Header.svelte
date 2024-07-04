<script lang="ts">
  import { goto } from '$app/navigation';
  import logo from '$lib/assets/logo.svg';
  import Ton from '$lib/components/Ton.svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Drawer from '$lib/components/ui/drawer';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { TON_CONNECT_UI_CONTEXT } from '$lib/constants';
  import { getAccountInfo } from '$lib/data';
  import { type TonConnectStore } from '$lib/stores/ton-connect';
  import { KlineTopic, latestPrices } from '$lib/stores/ws.svelte';
  import { cn, mediaQuery } from '$lib/utils';
  import { createQuery } from '@tanstack/svelte-query';
  import { Address } from '@ton/core';
  import LogOut from 'lucide-svelte/icons/log-out';
  import Menu from 'lucide-svelte/icons/menu';
  import TestTubes from 'lucide-svelte/icons/test-tubes';
  import { getContext } from 'svelte';

  const accountInfo = createQuery({
    queryKey: ['accountInfo'],
    queryFn: getAccountInfo,
    refetchInterval: 5000
  });

  const tonConnect = getContext<TonConnectStore>(TON_CONNECT_UI_CONTEXT);

  const isDesktop = mediaQuery('(min-width: 768px)');

  const items = [
    {
      symbol: 'BTC',
      href: '/dashboard/BTCUSDT',
      name: 'Bitcoin',
      priceKey: KlineTopic.BTCUSDT
    }
  ];

  function signOut() {
    $tonConnect?.disconnectWallet();
    goto('/');
  }

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

<header class="border-b sticky top-0 z-50 bg-ds-background-200 border-ds-gray-400">
  <div class="container pr-0 flex justify-between items-center">
    <img src={logo} alt="Nenuma" class="w-8 h-8" />
    <div class="flex items-center gap-2 border-l border-ds-gray-400 p-4">
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
      <Drawer.Root direction={$isDesktop ? 'right' : 'bottom'}>
        <Drawer.Trigger class="w-8 h-8 border border-ds-gray-400 rounded-full">
          <Menu class="overflow-visible m-auto" size="16" strokeWidth={1.5} /></Drawer.Trigger
        >
        <Drawer.Content
          class={cn(
            'max-h-[96%] bg-ds-background-200',
            $isDesktop && 'h-full left-auto min-w-[25%] right-0'
          )}
        >
          <input type="checkbox" id="drawer" class="sr-only" aria-hidden="true" />
          <Drawer.Footer class="gap-0 m-0 overflow-auto">
            <div class="grid gap-3 pb-3 border-b">
              {#each items as item}
                <Drawer.Close>
                  <a class="flex justify-between items-center" href={item.href}>
                    <div class="flex flex-col items-baseline">
                      <div class="flex items-center gap-1">
                        <span class="text-ds-gray-1000 text-left tracking-tight font-medium">
                          {item.symbol}
                        </span>
                        <span class="text-ds-gray-900 text-xs">/ USDT</span>
                      </div>
                      <span class="text-sm text-left text-ds-gray-900"> {item.name} </span>
                    </div>
                    <div class="text-ds-gray-1000 flex-1 justify-end flex font-medium">
                      {$latestPrices[item.priceKey].toFixed(2)} $
                    </div>
                  </a>
                </Drawer.Close>
              {/each}
            </div>
            <div class="py-3 grid">
              <!-- <Drawer.Close>
                <a class="flex h-12 justify-between items-center" href="/dashboard/options">
                  <div class="font-medium text-ds-gray-900">Options</div>
                  <CandlestickChart size="20" strokeWidth={1.5} />
                </a>
              </Drawer.Close>
              <Drawer.Close>
                <a class="flex h-12 justify-between items-center" href="/dashboard/transactions">
                  <div class="font-medium text-ds-gray-900">Transactions</div>
                  <CreditCard size="20" strokeWidth={1.5} />
                </a>
              </Drawer.Close> -->
              <Drawer.Close>
                <a class="flex h-12 justify-between items-center" href="/playground">
                  <div class="font-medium text-ds-gray-900">Playground</div>
                  <TestTubes size="20" strokeWidth={1.5} />
                </a>
              </Drawer.Close>
            </div>
            <div class="py-3">
              <Button
                class="w-full"
                type="button"
                size="lg"
                onclickcapture={() => {
                  $tonConnect.disconnectWallet();
                  goto('/');
                }}
              >
                <div class="flex gap-2 items-center">
                  <Ton />
                  {formatWalletAddress($tonConnect.connection.wallet?.account.address)}
                </div>
              </Button>
            </div>
            <!-- <ul class="flex pt-3 gap-3 justify-center">
              <li>
                <Drawer.Close
                  ><a class="text-ds-gray-900 font-medium" href="/about">About</a></Drawer.Close
                >
              </li>
              <li>
                <Drawer.Close
                  ><a class="text-ds-gray-900 font-medium" href="/terms">Terms</a></Drawer.Close
                >
              </li>
              <li>
                <Drawer.Close
                  ><a class="text-ds-gray-900 font-medium" href="/privacy">Privacy</a></Drawer.Close
                >
              </li>
            </ul> -->
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
    </div>
  </div>
</header>
