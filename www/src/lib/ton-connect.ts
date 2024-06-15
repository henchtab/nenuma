import { TonConnectUI } from '@tonconnect/ui';
import { derived, readable } from 'svelte/store';
import { browser } from '$app/environment';
import type { SenderArguments } from '@ton/core';

export const tonConnectUI = readable<TonConnectUI>(undefined, (set) => {
  if (!browser) {
    // If not in the browser, return early and don't set sdk
    return () => {};
  }

  const sdk = new TonConnectUI({
    // TODO: Change the manifest URL to your own
    manifestUrl:
      'https://raw.githubusercontent.com/ton-connect/demo-telegram-bot/master/tonconnect-manifest.json',
    widgetRootId: 'ton-connect'
  });

  set(sdk);
});

export const sender = derived(tonConnectUI, ($tonConnectUI) => {
  return {
    send: async (args: SenderArguments) => {
      $tonConnectUI.sendTransaction({
        messages: [
          {
            address: args.to.toString(),
            amount: args.value.toString(),
            payload: args.body?.toBoc().toString('base64')
          }
        ],
        validUntil: Date.now() + 5 * 60 * 1000
      });
    },
    connected: $tonConnectUI.connected
  };
});
