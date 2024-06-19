<script lang="ts">
  import logo from '$lib/assets/logo.svg';
  import Ton from '$lib/components/Ton.svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Drawer from '$lib/components/ui/drawer';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { tonConnectUI } from '$lib/ton-connect';
  import { Address } from '@ton/core';
  import { Menu } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { page } from '$app/stores';

  let { children } = $props();

  let connectionState = $state({
    isConnnected: false,
    isReconnecting: true
  });
  let walletAddress = $state();

  onMount(() => {
    window.onunhandledrejection = (e) =>
      toast.error(`An unhandled promise rejection occurred - ${e.reason}`);

    tonConnectUI.subscribe(async (tonConnectUI) => {
      if (!tonConnectUI) {
        connectionState.isConnnected = false;
        connectionState.isReconnecting = false;
        return;
      }

      const status = await tonConnectUI.connectionRestored;
      connectionState.isConnnected = status;
      connectionState.isReconnecting = false;

      tonConnectUI.onStatusChange((status) => {
        connectionState.isConnnected = status ? true : false;
      });

      walletAddress = formatWalletAddress(tonConnectUI.account?.address);
    });
  });

  async function connectWallet() {
    if (!$tonConnectUI) {
      console.warn('TonConnectUI is not initialized');
      return;
    }

    try {
      if ($tonConnectUI.connected || $tonConnectUI.wallet) {
        await $tonConnectUI.disconnect();
      }

      await $tonConnectUI.openModal();
    } catch (error) {
      console.error(error);
    }
  }

  async function disconnectWallet() {
    if (!$tonConnectUI) {
      console.warn('TonConnectUI is not initialized');
      return;
    }

    try {
      await $tonConnectUI.disconnect();
    } catch (error) {
      console.error(error);
    }
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

<header class="border-b sticky top-0 h-16 bg-ds-background-200 z-50">
  <div class="flex items-center h-full justify-between container">
    <div class="flex items-center gap-8">
      <img src={logo} alt="Nenuma" class="w-8 h-8" />
      <nav class="py-4 hidden md:block">
        <ul class="flex justify-center space-x-4">
          <li>
            <a
              data-active={$page.url.pathname === '/'}
              class="text-semibold text-lg text-ds-gray-900 hover:text-ds-gray-1000 transition-colors data-[active=true]:text-ds-gray-1000"
              href="/">Streams API</a
            >
          </li>
          <li>
            <a
              data-active={$page.url.pathname === '/options-api'}
              class="text-semibold text-lg text-ds-gray-900 hover:text-ds-gray-1000 transition-colors data-[active=true]:text-ds-gray-1000"
              href="/options-api">Options API</a
            >
          </li>
          <li>
            <a
              data-active={$page.url.pathname.includes('/dashboard')}
              class="text-semibold text-lg text-ds-gray-900 hover:text-ds-gray-1000 transition-colors data-[active=true]:text-ds-gray-1000"
              href="/dashboard">Derivatives Exchange</a
            >
          </li>
        </ul>
      </nav>
    </div>

    <Skeleton class="hidden md:block" show={connectionState.isReconnecting}>
      <Button
        type="button"
        onclickcapture={() => {
          if (connectionState.isConnnected) {
            disconnectWallet();
          } else {
            connectWallet();
          }
        }}
      >
        {#if connectionState.isConnnected}
          <div class="flex gap-2 items-center">
            <Ton />
            {formatWalletAddress($tonConnectUI.account?.address)}
          </div>
        {:else}
          Connect
        {/if}
      </Button>
    </Skeleton>
    <div class="border-l py-4 pl-4 block md:hidden">
      <Drawer.Root>
        <Drawer.Trigger class="w-8 h-8 border border-ds-gray-400 rounded-full">
          <Menu class="overflow-visible m-auto" size="16" strokeWidth={1.5} /></Drawer.Trigger
        >
        <Drawer.Content class="bg-ds-background-100 h-full">
          <Drawer.Footer class="gap-0 m-0 overflow-auto">
            <nav class="grid gap-3 pb-3 border-b">
              <Drawer.Close>
                <a class="flex justify-between items-center h-12 text-lg font-medium" href="/">
                  Streams API
                </a>
              </Drawer.Close>
              <Drawer.Close>
                <a
                  class="flex justify-between items-center h-12 text-lg font-medium"
                  href="/options-api"
                >
                  Options API
                </a>
              </Drawer.Close>
              <Drawer.Close>
                <a
                  class="flex justify-between items-center h-12 text-lg font-medium"
                  href="/dashboard"
                >
                  Derivatives Exchange
                </a>
              </Drawer.Close>
            </nav>
            <div class="pt-8">
              <Skeleton class="w-full" show={connectionState.isReconnecting}>
                <Button
                  class="w-full"
                  type="button"
                  onclickcapture={() => {
                    if (connectionState.isConnnected) {
                      disconnectWallet();
                    } else {
                      connectWallet();
                    }
                  }}
                >
                  {#if connectionState.isConnnected}
                    <div class="flex gap-2 items-center">
                      <Ton />
                      {formatWalletAddress($tonConnectUI.account?.address)}
                    </div>
                  {:else}
                    Connect
                  {/if}
                </Button>
              </Skeleton>
            </div>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
    </div>
  </div>
</header>

{@render children()}
