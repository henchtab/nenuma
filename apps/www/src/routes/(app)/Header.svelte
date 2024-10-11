<script lang="ts">
  import logo from "$lib/assets/logo.svg";
  import { Button } from "$lib/components/ui/button";
  import * as Drawer from "$lib/components/ui/drawer";
  import { TON_CONNECT_UI_CONTEXT } from "$lib/constants";
  import { hapticFeedback } from "$lib/stores/tma";
  import { isConnected, isReconnecting, type TonConnectStore } from "$lib/stores/ton-connect";
  import { KlineTopic, latestPrices } from "$lib/stores/ws.svelte";
  import { shortenAddress } from "$lib/shorten-address";
  import { Menu, TestTubes, X, Wallet } from "lucide-svelte";
  import { getContext } from "svelte";
  import { AccountBalance, TonLogo } from "$lib/components";
  import { Skeleton } from "$lib/components/ui/skeleton";

  const tonConnect = getContext<TonConnectStore>(TON_CONNECT_UI_CONTEXT);

  const items = [
    {
      symbol: "BTC",
      href: "/dashboard/BTCUSDT",
      name: "Bitcoin",
      priceKey: KlineTopic.BTCUSDT,
    },
  ];
</script>

<header class="border-b sticky h-16 top-0 z-50 bg-ds-background-200">
  <div class="container pr-0 flex justify-between items-center">
    <img src={logo} alt="Nenuma" class="w-8 h-8" />
    <div class="flex items-center p-4">
      {#if $isConnected}
        <AccountBalance />
      {/if}

      <Drawer.Root>
        <!-- Drawer creates a hidden div for its body at the initial render, which causes the header to jump a
        little if the parent element has gap property as in this case it will also add gap between drawer trigger
        and this hidden div. To avoid this, we add margin directly to the trigger element. -->
        <Drawer.Trigger
          class="w-8 h-8 border border-ds-gray-400 ml-2 rounded-full"
          onclick={() => $hapticFeedback.impactOccurred("light")}
        >
          <Menu class="overflow-visible m-auto" size="16" /></Drawer.Trigger
        >
        <Drawer.Content>
          <input type="checkbox" id="drawer" class="sr-only" aria-hidden="true" />

          <Drawer.Header>
            <Drawer.Title>Navigation</Drawer.Title>

            <Drawer.Close onclick={() => $hapticFeedback.impactOccurred("light")}>
              <div
                class="w-8 h-8 border border-ds-gray-400 transition-colors text-ds-gray-1000 hover:bg-ds-gray-200 bg-ds-gray-100 inline-flex items-center justify-center rounded-full"
              >
                <X class="overflow-visible" size="20" />
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
                      onclick={() => $hapticFeedback.impactOccurred("light")}
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
                  onclick={() => $hapticFeedback.impactOccurred("light")}
                >
                  <div class="font-medium text-ds-gray-1000 text-lg">Playground</div>
                  <TestTubes size="20" />
                </a>
              </Drawer.Close>
            </div>
            <Skeleton class="w-full" show={$isReconnecting}>
              {#if $isConnected}
                <Button
                  class="w-full gap-2"
                  onclickcapture={() => {
                    $tonConnect.disconnectWallet();
                    $hapticFeedback.impactOccurred("medium");
                  }}
                >
                  <TonLogo />
                  {shortenAddress($tonConnect.connection.wallet!.account.address)}
                </Button>
              {:else}
                <Button
                  class="w-full gap-2"
                  onclickcapture={() => {
                    $tonConnect.connectWallet();
                    $hapticFeedback.impactOccurred("medium");
                  }}
                >
                  <Wallet size={16} />
                  Connect Wallet
                </Button>
              {/if}
            </Skeleton>
          </nav>
        </Drawer.Content>
      </Drawer.Root>
    </div>
  </div>
</header>
