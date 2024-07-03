<script lang="ts">
  import { goto } from '$app/navigation';
  import logo from '$lib/assets/logo.svg';
  import { Button } from '$lib/components/ui/button';
  import * as Drawer from '$lib/components/ui/drawer';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { TON_CONNECT_UI_CONTEXT } from '$lib/constants';
  import { getAccountInfo, removeAccessTokenCookie } from '$lib/data';
  import { type TonConnectStore } from '$lib/stores/ton-connect';
  import { KlineTopic, latestPrices } from '$lib/stores/ws.svelte';
  import { cn, mediaQuery } from '$lib/utils';
  import { createQuery } from '@tanstack/svelte-query';
  import CandlestickChart from 'lucide-svelte/icons/candlestick-chart';
  import Coins from 'lucide-svelte/icons/coins';
  import CreditCard from 'lucide-svelte/icons/credit-card';
  import LogOut from 'lucide-svelte/icons/log-out';
  import Menu from 'lucide-svelte/icons/menu';
  import TestTubes from 'lucide-svelte/icons/test-tubes';
  import { getContext } from 'svelte';

  const accountInfo = createQuery({
    queryKey: ['accountInfo'],
    queryFn: getAccountInfo
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
</script>

<header class="border-b border-ds-gray-400">
  <div class="container pr-0 flex justify-between items-center">
    <img src={logo} alt="Nenuma" class="w-8 h-8" />
    <div class="flex items-center gap-2 border-l border-ds-gray-400 p-4">
      <div class="inline-flex gap-2">
        <Coins size="24" strokeWidth={1.5} />
        <Skeleton show={$accountInfo.isLoading}>
          <div class="font-medium min-w-10 text-center">
            {$accountInfo.data?.balance.slice(0, 4)}
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
              <Drawer.Close>
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
              </Drawer.Close>
              <Drawer.Close>
                <a class="flex h-12 justify-between items-center" href="/playground">
                  <div class="font-medium text-ds-gray-900">Playground</div>
                  <TestTubes size="20" strokeWidth={1.5} />
                </a>
              </Drawer.Close>
            </div>
            <div class="py-3">
              <Button onclickcapture={signOut} class="flex w-full gap-2" size="lg">
                <LogOut size="20" strokeWidth={1.5} />
                Sign out
              </Button>
            </div>
            <ul class="flex pt-3 gap-3 justify-center">
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
            </ul>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
    </div>
  </div>
</header>
