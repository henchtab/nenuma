import type { TonConnectUI } from '@tonconnect/ui';
import { generatePayload } from './data';

export const TON_PROOF_REFRESH_INTERVAL_MS = 1000 * 60 * 9; // 9 minutes
export const ACCESS_TOKEN_COOKIE = 'access_token';
export const REDIRECT_TO_COOKIE = 'redirect_to';
export const COOKIE_EXPIRES = new Date(Date.now() + 1000 * 60 * 60 * 24 * 180);

export const TON_CONNECT_UI_KEY = 'tonConnectUI';

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
