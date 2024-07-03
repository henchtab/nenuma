<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { tonConnectUI } from '$lib/stores/ton-connect';
  import { KlineTopic, ws } from '$lib/stores/ws.svelte';
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import { onDestroy, onMount } from 'svelte';
  import { type Unsubscriber } from 'svelte/store';
  import Header from './Header.svelte';

  let { children } = $props();

  let isRestoringSession = $state(true);
  let isConnected = $state(false);
  let subscription: Unsubscriber | undefined = $state();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser
      }
    }
  });

  onMount(() => {
    subscription = tonConnectUI.subscribe(async (tonConnectUI) => {
      if (!tonConnectUI) {
        return;
      }

      tonConnectUI.onStatusChange((status) => {
        isConnected = status ? true : false;
      });

      const status = await tonConnectUI.connectionRestored;

      // Redirect to sign-in page if the user is not connected and somehow got here (e.g. by having access cookie)
      if (!status) {
        await goto('/auth/sign-in');
      }

      isRestoringSession = false;
      isConnected = status;
    });

    $ws.addEventListener('open', () => {
      $ws.send(JSON.stringify({ op: 'subscribe', args: [KlineTopic.BTCUSDT] }));
    });
  });

  onDestroy(() => {
    subscription?.();
  });
</script>

{#if isRestoringSession}
  <div class="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
    <div class="animate-rotate">
      <div
        class="absolute bg-spinner top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-14 rounded-full before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:size-10 before:bg-ds-background-200 before:rounded-full after:absolute after:top-1/2 after:-translate-y-1/2 after:right-0 after:rounded-lg after:bg-ds-blue-700 after:size-2"
      ></div>
    </div>
  </div>
{:else if isConnected}
  <QueryClientProvider client={queryClient}>
    <Header />

    {@render children()}
  </QueryClientProvider>
{/if}
