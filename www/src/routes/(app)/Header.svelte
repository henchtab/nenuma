<script lang="ts">
  import { goto } from '$app/navigation';
  import { tonConnectUI } from '$lib/ton-connect';
  import { Button } from '$lib/components/ui/button';
  import * as Drawer from '$lib/components/ui/drawer';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { getAccountInfo, reset } from '$lib/data';
  import { cn, mediaQuery } from '$lib/utils';
  import { KlineTopic, latestPrices } from '$lib/ws.svelte';
  import { createQuery } from '@tanstack/svelte-query';
  import CandlestickChart from 'lucide-svelte/icons/candlestick-chart';
  import Coins from 'lucide-svelte/icons/coins';
  import CreditCard from 'lucide-svelte/icons/credit-card';
  import LogOut from 'lucide-svelte/icons/log-out';
  import Menu from 'lucide-svelte/icons/menu';

  const accountInfo = createQuery({
    queryKey: ['accountInfo'],
    queryFn: getAccountInfo
  });

  const isDesktop = mediaQuery('(min-width: 768px)');

  const items = [
    {
      symbol: 'ETH',
      href: '/dashboard/ETHUSDT',
      name: 'Ethereum',
      priceKey: KlineTopic.ETHUSDT
    },
    {
      symbol: 'BTC',
      href: '/dashboard/BTCUSDT',
      name: 'Bitcoin',
      priceKey: KlineTopic.BTCUSDT
    },
    {
      symbol: 'TON',
      href: '/dashboard/TONUSDT',
      name: 'Toncoin',
      priceKey: KlineTopic.TONUSDT
    },
    {
      symbol: 'SOL',
      href: '/dashboard/SOLUSDT',
      name: 'Solana',
      priceKey: KlineTopic.SOLUSDT
    },
    {
      symbol: 'BNB',
      href: '/dashboard/BNBUSDT',
      name: 'Binance Coin',
      priceKey: KlineTopic.BNBUSDT
    }
  ];

  function signOut() {
    $tonConnectUI?.disconnect();
    reset();
    goto('/auth/sign-in');
  }
</script>

<header class="border-b border-ds-gray-400">
  <div class="container pr-0 flex justify-between items-center">
    <span class="text-xl text-center text-medium">Nenuma</span>
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
