<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { tonConnectUI } from '$lib/ton-connect';
  import { mediaQuery } from '$lib/utils';
  import { onMount } from 'svelte';
  import { Toaster, toast } from 'svelte-sonner';
  import '../app.css';

  let { children } = $props();

  let connectionState = $state({
    isConnnected: false,
    isReconnecting: true
  });

  const isDesktop = mediaQuery('(min-width: 768px)');

  onMount(() => {
    window.onerror = (e) => toast.error(`An error occurred - ${e}`);
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
  <header class="container py-4 flex items-center justify-between">
    <h1 class="text-xl font-medium text-center">Nenuma</h1>
    <nav>
      <ul class="flex space-x-4">
        <li>
          <a class="text-semibold text-lg" href="/">Streams API</a>
        </li>
        <li>
          <a class="text-semibold text-lg" href="/options-api">Options API</a>
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
  </header>

  {@render children()}
</div>

<Toaster position={$isDesktop ? 'bottom-right' : 'top-center'} richColors />
