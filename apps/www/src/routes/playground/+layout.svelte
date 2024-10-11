<script lang="ts">
  import logo from "$lib/assets/logo.svg";
  import { AccountBalance, TonLogo } from "$lib/components";
  import { Button } from "$lib/components/ui/button";
  import * as Drawer from "$lib/components/ui/drawer";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import { TON_CONNECT_UI_CONTEXT } from "$lib/constants";
  import { shortenAddress } from "$lib/shorten-address";
  import { hapticFeedback, mainButton } from "$lib/stores/tma";
  import { isConnected, isReconnecting, type TonConnectStore } from "$lib/stores/ton-connect";
  import { Bookmark, Menu, Wallet, X } from "lucide-svelte";
  import { getContext, onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import Saved from "./components/Saved.svelte";

  let { children } = $props();

  const tonConnect = getContext<TonConnectStore>(TON_CONNECT_UI_CONTEXT);

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
</script>

<header class="border-b sticky top-0 h-16 overflow-hidden bg-ds-background-200 z-50">
  <div class="flex items-center h-full justify-between container">
    <img src={logo} alt="Nenuma" class="w-8 h-8" />
    <div class="py-4 flex">
      <div class="inline-flex items-center gap-1">
        {#if $isConnected}
          <AccountBalance />
        {/if}
      </div>

      <Drawer.Root onOpenChange={(v) => (isSavedOpen = v)}>
        <Drawer.Trigger
          class="w-8 h-8 border border-ds-gray-400 rounded-full ml-2"
          onclick={() => $hapticFeedback.impactOccurred("light")}
        >
          <Bookmark class="overflow-visible m-auto" size="16" strokeWidth={1.5} />
        </Drawer.Trigger>
        <Drawer.Content>
          <input type="checkbox" class="sr-only" aria-hidden="true" />

          <Drawer.Header>
            <Drawer.Title>Deployed Accounts</Drawer.Title>

            <Drawer.Close onclick={() => $hapticFeedback.impactOccurred("light")}>
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
          onclick={() => $hapticFeedback.impactOccurred("light")}
        >
          <Menu class="overflow-visible m-auto" size="16" strokeWidth={1.5} /></Drawer.Trigger
        >
        <Drawer.Content>
          <input type="checkbox" class="sr-only" aria-hidden="true" />

          <Drawer.Header>
            <Drawer.Title>Navigation</Drawer.Title>

            <Drawer.Close onclick={() => $hapticFeedback.impactOccurred("light")}>
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
                  onclick={() => $hapticFeedback.impactOccurred("light")}
                >
                  Derivatives Exchange
                </a>
              </Drawer.Close>

              <section class="flex flex-col">
                <span class="text-base mb-2 text-ds-gray-900">Streams API</span>
                <ul class="pl-2">
                  <li>
                    <Drawer.Close asChild let:builder>
                      <a
                        use:builder.action
                        {...builder}
                        class="flex justify-between items-center h-12 text-lg font-medium"
                        href="/playground/streams-api/data-stream"
                        onclick={() => $hapticFeedback.impactOccurred("light")}
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
                        onclick={() => $hapticFeedback.impactOccurred("light")}
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
                        onclick={() => $hapticFeedback.impactOccurred("light")}
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
                        onclick={() => $hapticFeedback.impactOccurred("light")}
                      >
                        Simple Subscriber
                      </a>
                    </Drawer.Close>
                  </li>
                </ul>
              </section>

              <section class="flex flex-col">
                <span class="text-base mb-2 text-ds-gray-900">Derivatives API</span>
                <ul class="pl-2">
                  <li>
                    <Drawer.Close asChild let:builder>
                      <a
                        use:builder.action
                        {...builder}
                        class="flex justify-between items-center h-12 text-lg font-medium"
                        href="/playground/options-api/brokerage"
                        onclick={() => $hapticFeedback.impactOccurred("light")}
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
                        onclick={() => $hapticFeedback.impactOccurred("light")}
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
                        onclick={() => $hapticFeedback.impactOccurred("light")}
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
                        onclick={() => $hapticFeedback.impactOccurred("light")}
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
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Root>
    </div>
  </div>
</header>

{@render children()}
