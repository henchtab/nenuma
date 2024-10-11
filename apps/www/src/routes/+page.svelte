<script lang="ts">
  import logo from "$lib/assets/logo.svg";
  import { getContext, onMount } from "svelte";
  import { hapticFeedback, mainButton } from "$lib/stores/tma";
  import { TON_CONNECT_UI_CONTEXT } from "$lib/constants";
  import type { TonConnectStore } from "$lib/stores/ton-connect";

  const tonConnect = getContext<TonConnectStore>(TON_CONNECT_UI_CONTEXT);

  onMount(() => {
    $mainButton.setText("Connect Wallet").enable().show();

    const cleanup = $mainButton.on("click", () => {
      $tonConnect.connectWallet();
      $hapticFeedback.impactOccurred("medium");
    });

    return () => {
      cleanup();
      $mainButton.hide().disable();
    };
  });
</script>

<div class="container flex flex-col flex-1 items-center justify-center">
  <img src={logo} alt="Nenuma logo" class="size-32" />
  <h1 class="text-3xl mt-10 font-bold">Welcome to Nenuma</h1>
  <p class="text-lg mt-4 text-ds-gray-900">Where your data is yours and yours alone.</p>
</div>
