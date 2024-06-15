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

export function formatDate(date: Date) {
  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC'
  ];

  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0').slice(0, 2);

  return `${month} ${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}
