import { THEME, TonConnectUI, Wallet } from "@tonconnect/ui";
import { Writable, derived, readable, writable } from "svelte/store";
import { browser } from "$app/environment";
import type { SenderArguments } from "@ton/core";

export const tonConnectUI = readable<TonConnectUI>(undefined, (set) => {
  const update = () => {
    if (!browser) return;

    const sdk = new TonConnectUI({
      manifestUrl: "https://nenuma.telegram-mini-apps.manuvantara.com/tonconnect-manifest.json",
      widgetRootId: "ton-connect",
      uiPreferences: {
        theme: THEME.DARK,
      },
    });

    set(sdk);
  };

  update();

  return () => {
    if (browser) {
      const el = document.getElementById("ton-connect");

      if (el) {
        el.innerHTML = "";
        console.log("tonConnectUI cleanup");
      }
    }
  };
});

type TonConnect = {
  sdk: TonConnectUI | null;
  connection: {
    status: "reconnecting" | "connected" | "disconnected";
    wallet: Wallet | null;
  };
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
};

export type TonConnectStore = Writable<TonConnect>;

export const tonConnect = writable<TonConnect>({
  sdk: null,
  connection: {
    status: "reconnecting",
    wallet: null,
  },
  connectWallet: async () => {},
  disconnectWallet: async () => {},
});

export const isReconnecting = derived(
  tonConnect,
  ($tonConnect) => $tonConnect.connection.status === "reconnecting",
);
export const isConnected = derived(
  tonConnect,
  ($tonConnect) => $tonConnect.connection.status === "connected",
);

export const isDisconnected = derived(
  tonConnect,
  ($tonConnect) => $tonConnect.connection.status === "disconnected",
);

export const sender = derived(tonConnectUI, ($tonConnectUI) => {
  return {
    send: async (args: SenderArguments) => {
      $tonConnectUI.sendTransaction({
        messages: [
          {
            address: args.to.toString(),
            amount: args.value.toString(),
            payload: args.body?.toBoc().toString("base64"),
          },
        ],
        validUntil: Date.now() + 5 * 60 * 1000,
      });
    },
    connected: $tonConnectUI.connected,
  };
});
