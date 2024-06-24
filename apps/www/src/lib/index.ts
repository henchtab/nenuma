import type { TonConnectUI } from '@tonconnect/ui';
import { generatePayload } from './data';

export async function recreateTonProofPayload(
  isFirstProofLoading: boolean,
  tonConnectUI: TonConnectUI
) {
  if (isFirstProofLoading) {
    tonConnectUI.setConnectRequestParameters({
      state: 'loading'
    });
    // Changing external $state rune
    isFirstProofLoading = false;
  }

  console.log(
    '%cRecreating payload',
    'font-weight: bold; color: blue; background-color: #f0f0f0; padding: 2px 4px; border-radius: 4px;'
  );

  const payload = await generatePayload();

  if (payload) {
    tonConnectUI.setConnectRequestParameters({
      state: 'ready',
      value: payload
    });
  } else {
    tonConnectUI.setConnectRequestParameters(null);
  }
}


