<script lang="ts">
  import { recreateTonProofPayload } from '$lib';
  import { TON_CONNECT_UI_CONTEXT, TON_PROOF_REFRESH_INTERVAL_MS } from '$lib/constants';
  import { checkProofAndRedirect, removeAccessTokenCookie } from '$lib/data';
  import { tonConnect, tonConnectUI } from '$lib/stores/ton-connect';
  import { mediaQuery } from '$lib/utils';
  import { postEvent, retrieveLaunchParams } from '@telegram-apps/sdk';
  import { CHAIN, type ConnectedWallet } from '@tonconnect/ui';
  import TriangleAlert from 'lucide-svelte/icons/triangle-alert';
  import { onMount, setContext } from 'svelte';
  import { toast, Toaster } from 'svelte-sonner';
  import { browser } from '$app/environment';
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import '../app.css';

  let { children } = $props();
  let wrapper = $state<HTMLDivElement>();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser
      }
    }
  });

  const isDesktop = mediaQuery('(min-width: 768px)');

  setContext(TON_CONNECT_UI_CONTEXT, tonConnect);
  let isFirstProofLoading = $state(true);

  onMount(async () => {
    try {
      const lp = retrieveLaunchParams();

      expandApp(lp.platform);
    } catch (error) {}

    tonConnectUI.subscribe(async (tonConnectUI) => {
      if (!tonConnectUI) {
        return;
      }

      recreateTonProofPayload(isFirstProofLoading, tonConnectUI);

      setInterval(
        async () => await recreateTonProofPayload(isFirstProofLoading, tonConnectUI),
        TON_PROOF_REFRESH_INTERVAL_MS
      );

      tonConnectUI.onStatusChange((w) => {
        handleStatusChange(w);

        tonConnect.update((value) => ({
          ...value,
          connection: {
            status: w ? 'connected' : 'disconnected',
            wallet: w
          }
        }));
      });

      await tonConnectUI.connectionRestored;
      tonConnect.update((value) => ({
        ...value,
        sdk: tonConnectUI,
        connection: {
          status: tonConnectUI.connected ? 'connected' : 'disconnected',
          wallet: tonConnectUI.wallet
        },
        connectWallet,
        disconnectWallet
      }));
    });
  });

  function expandApp(platform: string) {
    try {
      // Some versions of Telegram don't need the classes above.
      if (['macos', 'tdesktop', 'weba', 'web', 'webk'].includes(platform)) {
        return;
      }

      postEvent('web_app_expand');

      document.body.setAttribute('data-sticky-app', 'true');
      wrapper?.setAttribute('data-sticky-app', 'true');
    } catch (error) {
      console.error(error);
    }
  }

  async function handleStatusChange(wallet: ConnectedWallet | null) {
    if (!wallet) {
      removeAccessTokenCookie();
      return;
    }

    if (wallet.account.chain === CHAIN.MAINNET) {
      toast.error('You are using the mainnet wallet. Please switch to the testnet wallet.');
      disconnectWallet();
      return;
    }

    if (wallet.connectItems?.tonProof && 'proof' in wallet.connectItems.tonProof) {
      await checkProofAndRedirect(wallet.connectItems.tonProof.proof, wallet.account);
    }
  }

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
      removeAccessTokenCookie();
    } catch (error) {
      console.error(error);
    }
  }
</script>

<QueryClientProvider client={queryClient}>
  <div
    bind:this={wrapper}
    class="group data-[sticky-app]:absolute data-[sticky-app]:inset-0 data-[sticky-app]:overflow-x-hidden data-[sticky-app]:overflow-y-auto"
  >
    <div class="group-data-[sticky-app]:h-[calc(100%+1px)]">
      <div class="relative isolate min-h-screen flex bg-ds-background-200 flex-col">
        <header
          class="bg-ds-amber-100 border-b border-ds-amber-400 text-center text-ds-amber-900 p-2 font-medium flex items-center justify-center min-h-10 select-none cursor-default"
        >
          <div class="max-w-[60%] flex items-center gap-2">
            <TriangleAlert size={16} strokeWidth={1.5} />
            Testnet Only
          </div>
        </header>
        {@render children()}
      </div>

      <div id="portalled-content"></div>
    </div>
  </div>
</QueryClientProvider>

<Toaster
  position={$isDesktop ? 'bottom-right' : 'top-center'}
  richColors
  theme="dark"
  toastOptions={{
    classes: {
      default: '',
      error: '!bg-ds-red-100 !text-ds-red-900'
    }
  }}
/>
