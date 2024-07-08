<script lang="ts">
  import { goto } from '$app/navigation';
  import logo from '$lib/assets/logo.svg';
  import Ton from '$lib/components/Ton.svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Drawer from '$lib/components/ui/drawer';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { TON_CONNECT_UI_CONTEXT } from '$lib/constants';
  import { getAccountInfo } from '$lib/data';
  import { hapticFeedback, mainButton } from '$lib/stores/tma';
  import { isReconnecting, type TonConnectStore } from '$lib/stores/ton-connect';
  import { createQuery } from '@tanstack/svelte-query';
  import { Address } from '@ton/core';
  import Bookmark from 'lucide-svelte/icons/bookmark';
  import Menu from 'lucide-svelte/icons/menu';
  import X from 'lucide-svelte/icons/x';
  import { getContext, onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import Saved from './components/Saved.svelte';

  let { children } = $props();

  const tonConnect = getContext<TonConnectStore>(TON_CONNECT_UI_CONTEXT);

  const accountInfo = createQuery({
    queryKey: ['accountInfo'],
    queryFn: getAccountInfo,
    refetchInterval: 5000
  });

  let isSavedOpen = $state(false);

  onMount(() => {
    // Hack to prevent the button from being shown after Saved is opened and closed
    // E.g. open deploy form -> go back -> reload app -> open Saved -> close Saved
    if ($mainButton.isEnabled) {
      $mainButton.disable().hide();
    }

    window.onunhandledrejection = (e) =>
      toast.error(`An unhandled promise rejection occurred - ${e.reason}`);
  });

  function formatWalletAddress(address: string) {
    const formattedAddress = Address.parse(address).toString({
      testOnly: true,
      bounceable: false
    });

    return `${formattedAddress.slice(0, 6)}...${formattedAddress.slice(-4)}`;
  }
</script>

<header class="border-b sticky top-0 h-16 overflow-hidden bg-ds-background-200 z-50">
  <div class="flex items-center h-full justify-between container">
    <img src={logo} alt="Nenuma" class="w-8 h-8" />
    <div class="py-4 flex">
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

      <Drawer.Root onOpenChange={(v) => (isSavedOpen = v)}>
        <Drawer.Trigger
          class="w-8 h-8 border border-ds-gray-400 rounded-full ml-2"
          onclick={() => $hapticFeedback.impactOccurred('light')}
        >
          <Bookmark class="overflow-visible m-auto" size="16" strokeWidth={1.5} />
        </Drawer.Trigger>
        <Drawer.Content>
          <input type="checkbox" class="sr-only" aria-hidden="true" />

          <Drawer.Header>
            <Drawer.Title>Deployed Accounts</Drawer.Title>

            <Drawer.Close onclick={() => $hapticFeedback.impactOccurred('light')}>
              <div
                class="w-8 h-8 border border-ds-gray-400 transition-colors text-ds-gray-1000 hover:bg-ds-gray-200 bg-ds-gray-100 inline-flex items-center justify-center rounded-full"
              >
                <X class="overflow-visible" size="20" strokeWidth={2} />
              </div>
            </Drawer.Close>
          </Drawer.Header>

          <Saved isOpened={isSavedOpen} />
        </Drawer.Content>
      </Drawer.Root>

      <Drawer.Root>
        <!-- To avoid excessive gap while drawer content being portalled, we need to add ml-2 here -->
        <Drawer.Trigger
          class="w-8 h-8 border border-ds-gray-400 rounded-full ml-2"
          onclick={() => $hapticFeedback.impactOccurred('light')}
        >
          <Menu class="overflow-visible m-auto" size="16" strokeWidth={1.5} /></Drawer.Trigger
        >
        <Drawer.Content>
          <input type="checkbox" class="sr-only" aria-hidden="true" />

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

          <div class="container pt-4 pb-8 overflow-y-scroll">
            <input class="sr-only" aria-hidden="true" type="checkbox" />

            <nav class="grid gap-3">
              <Drawer.Close asChild let:builder>
                <a
                  use:builder.action
                  {...builder}
                  class="flex justify-between items-center h-12 text-lg font-medium"
                  href="/dashboard"
                  onclick={() => $hapticFeedback.impactOccurred('light')}
                >
                  Derivatives Exchange
                </a>
              </Drawer.Close>

              <section class="flex flex-col">
                <span class="text-base text-ds-gray-900">Streams API</span>
                <ul class="pl-2">
                  <li>
                    <Drawer.Close asChild let:builder>
                      <a
                        use:builder.action
                        {...builder}
                        class="flex justify-between items-center h-12 text-lg font-medium"
                        href="/playground/streams-api/data-stream"
                        onclick={() => $hapticFeedback.impactOccurred('light')}
                      >
                        Data Stream
                      </a>
                    </Drawer.Close>
                  </li>
                  <li>
                    <Drawer.Close asChild let:builder>
                      <a
                        use:builder.action
                        {...builder}
                        class="flex justify-between items-center h-12 text-lg font-medium"
                        href="/playground/streams-api/subscription-batch"
                        onclick={() => $hapticFeedback.impactOccurred('light')}
                      >
                        Subscription Batch
                      </a>
                    </Drawer.Close>
                  </li>
                  <li>
                    <Drawer.Close asChild let:builder>
                      <a
                        use:builder.action
                        {...builder}
                        class="flex justify-between items-center h-12 text-lg font-medium"
                        href="/playground/streams-api/session"
                        onclick={() => $hapticFeedback.impactOccurred('light')}
                      >
                        Session
                      </a>
                    </Drawer.Close>
                  </li>
                  <li>
                    <Drawer.Close asChild let:builder>
                      <a
                        use:builder.action
                        {...builder}
                        class="flex justify-between items-center h-12 text-lg font-medium"
                        href="/playground/streams-api/simple-subscriber"
                        onclick={() => $hapticFeedback.impactOccurred('light')}
                      >
                        Simple Subscriber
                      </a>
                    </Drawer.Close>
                  </li>
                </ul>
              </section>

              <section class="flex flex-col">
                <span class="text-base text-ds-gray-900">Derivatives API</span>
                <ul class="pl-2">
                  <li>
                    <Drawer.Close asChild let:builder>
                      <a
                        use:builder.action
                        {...builder}
                        class="flex justify-between items-center h-12 text-lg font-medium"
                        href="/playground/options-api/brokerage"
                        onclick={() => $hapticFeedback.impactOccurred('light')}
                      >
                        Brokerage
                      </a>
                    </Drawer.Close>
                  </li>
                  <li>
                    <Drawer.Close asChild let:builder>
                      <a
                        use:builder.action
                        {...builder}
                        class="flex justify-between items-center h-12 text-lg font-medium"
                        href="/playground/options-api/broker"
                        onclick={() => $hapticFeedback.impactOccurred('light')}
                      >
                        Broker
                      </a>
                    </Drawer.Close>
                  </li>
                  <li>
                    <Drawer.Close asChild let:builder>
                      <a
                        use:builder.action
                        {...builder}
                        class="flex justify-between items-center h-12 text-lg font-medium"
                        href="/playground/options-api/brokerage-account"
                        onclick={() => $hapticFeedback.impactOccurred('light')}
                      >
                        Brokerage Account
                      </a>
                    </Drawer.Close>
                  </li>
                  <li>
                    <Drawer.Close asChild let:builder>
                      <a
                        use:builder.action
                        {...builder}
                        class="flex justify-between items-center h-12 text-lg font-medium"
                        href="/playground/options-api/cash-or-nothing-option"
                        onclick={() => $hapticFeedback.impactOccurred('light')}
                      >
                        Cash-or-Nothing Option
                      </a>
                    </Drawer.Close>
                  </li>
                </ul>
              </section>
            </nav>

            <div class="pt-6">
              <Skeleton class="w-full" show={$isReconnecting}>
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
                    {formatWalletAddress($tonConnect.connection.wallet!.account.address)}
                  </div>
                </Button>
              </Skeleton>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Root>
    </div>
  </div>
</header>

{@render children()}
