<script lang="ts">
  import { recreateTonProofPayload } from '$lib';
  import { Button } from '$lib/components/ui/button';
  import { TON_PROOF_REFRESH_INTERVAL_MS } from '$lib/constants';
  import { checkProofAndRedirect, reset } from '$lib/data';
  import { tonConnectUI } from '$lib/ton-connect';
  import { type ConnectedWallet } from '@tonconnect/ui';
  import LogIn from 'lucide-svelte/icons/log-in';
  import { onDestroy, onMount } from 'svelte';

  let intervalId: ReturnType<typeof setInterval> | undefined = $state();
  let isFirstProofLoading = $state(true);

  onMount(() => {
    tonConnectUI.subscribe((tonConnectUI) => {
      if (!tonConnectUI) {
        return;
      }

      recreateTonProofPayload(isFirstProofLoading, tonConnectUI);

      if (!intervalId) {
        intervalId = setInterval(
          async () => await recreateTonProofPayload(isFirstProofLoading, tonConnectUI),
          TON_PROOF_REFRESH_INTERVAL_MS
        );
      }

      tonConnectUI.onStatusChange(handleStatusChange);
    });
  });

  onDestroy(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });

  async function handleStatusChange(wallet: ConnectedWallet | null) {
    if (!wallet) {
      reset();
      return;
    }

    if (wallet.connectItems?.tonProof && 'proof' in wallet.connectItems.tonProof) {
      console.log('Proof:', wallet.connectItems.tonProof.proof);

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
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-white">
  <div class="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <!-- svelte-ignore element_invalid_self_closing_tag -->
      <enhanced:img
        src="/src/assets/tailwindcss-logo.svg"
        alt="Tailwind CSS"
        class="mx-auto h-10 w-auto"
      />
      <h1 class="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-foreground">
        Sign in with your wallet
      </h1>
    </div>
    <div class="mt-10 text-center sm:w-full sm:max-w-sm">
      <Button class="mx-auto flex gap-2" size="lg" onclickcapture={connectWallet}>
        <LogIn size="20" strokeWidth={1.5} />
        Sign in
      </Button>
    </div>
  </div>
</div>
