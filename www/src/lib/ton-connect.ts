import { TonConnectUI } from '@tonconnect/ui';
import { readable } from 'svelte/store';
import { browser } from '$app/environment';

export const tonConnectUI = readable<TonConnectUI | null>(null, (set) => {
  const sdk = browser
    ? new TonConnectUI({
        // TODO: Change the manifest URL to your own
        manifestUrl:
          'https://raw.githubusercontent.com/ton-connect/demo-telegram-bot/master/tonconnect-manifest.json',
        widgetRootId: 'ton-connect'
      })
    : null;

  if (sdk) {
    set(sdk);
  }
});
