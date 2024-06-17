<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { tonConnectUI } from '$lib/ton-connect';
  import { mediaQuery } from '$lib/utils';
  import { onMount } from 'svelte';
  import { Toaster, toast } from 'svelte-sonner';
  import * as Drawer from '$lib/components/ui/drawer';
  import '../app.css';
  import { Menu } from 'lucide-svelte';

  let { children } = $props();

  let connectionState = $state({
    isConnnected: false,
    isReconnecting: true
  });

  const isDesktop = mediaQuery('(min-width: 768px)');

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
</script>

<div class="relative isolate flex-1 flex flex-col">
  <!-- <header class="container py-4 flex items-center justify-between">
    <h1 class="text-xl font-medium text-center">Nenuma</h1>
    {#if $isDesktop}
      <nav>
        <ul class="flex space-x-4">
          <li>
            <a
              class="text-semibold text-lg text-ds-gray-900 hover:text-ds-gray-1000 transition-colors"
              href="/">Streams API</a
            >
          </li>
          <li>
            <a
              class="text-semibold text-lg text-ds-gray-900 hover:text-ds-gray-1000 transition-colors"
              href="/options-api">Options API</a
            >
          </li>
          <li>
            <a
              class="text-semibold text-lg text-ds-gray-900 hover:text-ds-gray-1000 transition-colors"
              href="/dashboard">Dashboard</a
            >
          </li>
        </ul>
      </nav>
      <Skeleton show={connectionState.isReconnecting}>
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
            Connected
          {:else}
            Connect
          {/if}
        </Button>
      </Skeleton>
    {:else}
      <Drawer.Root>
        <Drawer.Trigger class="w-8 h-8 border border-ds-gray-400 rounded-full">
          <Menu class="overflow-visible m-auto" size="16" strokeWidth={1.5} /></Drawer.Trigger
        >
        <Drawer.Content class="bg-ds-background-100 max-h-[90%] h-full">
          <Drawer.Footer class="gap-0 m-0 overflow-auto">
            <nav class="grid gap-3 pb-3 border-b">
              <Drawer.Close>
                <a class="flex justify-between items-center text-lg font-medium" href="/">
                  Streams API
                </a>
              </Drawer.Close>
              <Drawer.Close>
                <a class="flex justify-between items-center text-lg font-medium" href="/dashboard">
                  Dashboard
                </a>
              </Drawer.Close>
              <Drawer.Close>
                <a
                  class="flex justify-between items-center text-lg font-medium"
                  href="/options-api"
                >
                  Options API
                </a>
              </Drawer.Close>
            </nav>
            <div class="py-3">
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
                    Connected
                  {:else}
                    Connect
                  {/if}
                </Button>
              </Skeleton>
            </div>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
    {/if}
  </header> -->

  {@render children()}
</div>

<Toaster position={$isDesktop ? 'bottom-right' : 'top-center'} richColors />
