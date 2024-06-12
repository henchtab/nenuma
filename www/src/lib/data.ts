import { goto } from '$app/navigation';
import { PUBLIC_API_URL } from '$env/static/public';
import { ACCESS_TOKEN_COOKIE, COOKIE_EXPIRES, REDIRECT_TO_COOKIE } from '$lib';
import type { Account, ConnectAdditionalRequest, TonProofItemReplySuccess } from '@tonconnect/ui';
import cookie from 'js-cookie';

/**
 * Generate a new proof payload
 *
 * @returns {Promise<ConnectAdditionalRequest | null>}
 */
export async function generatePayload(): Promise<ConnectAdditionalRequest | null> {
  try {
    const response = await (
      await fetch(`${PUBLIC_API_URL}/api/generate-proof-payload`, {
        method: 'POST'
      })
    ).json();
    return { tonProof: response.proofToken as string };
  } catch {
    return null;
  }
}

/**
 * Check the proof and redirect to the requested page
 *
 * @param {TonProofItemReplySuccess['proof']} proof
 * @param {Account} account
 
 * @returns {Promise<void>}
 */
export async function checkProofAndRedirect(
  proof: TonProofItemReplySuccess['proof'],
  account: Account
): Promise<void> {
  try {
    const reqBody = {
      address: account.address,
      network: account.chain,
      public_key: account.publicKey,
      proof: {
        ...proof,
        state_init: account.walletStateInit
      }
    };

    const response = await (
      await fetch(`${PUBLIC_API_URL}/api/check-proof`, {
        method: 'POST',
        body: JSON.stringify(reqBody),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    ).json();

    if (response?.token) {
      cookie.set(ACCESS_TOKEN_COOKIE, response.token, {
        expires: COOKIE_EXPIRES,
        sameSite: 'Strict',
        secure: true
      });
      const redirectTo = cookie.get(REDIRECT_TO_COOKIE);

      if (redirectTo) {
        await goto(redirectTo, {
          replaceState: true
        });
      }
    }
  } catch (e) {
    console.log('checkProof error:', e);
  }
}

/**
 * Get account info
 *
 * @returns {Promise<{ balance: string; address: string }>}
 */
export async function getAccountInfo(): Promise<{
  balance: string;
  address: string;
}> {
  const response = await (
    await fetch(`${PUBLIC_API_URL}/api/account-info`, {
      headers: {
        Authorization: `Bearer ${cookie.get(ACCESS_TOKEN_COOKIE)}`,
        'Content-Type': 'application/json'
      }
    })
  ).json();

  return response;
}

/**
 * Reset the token
 */
export function reset() {
  cookie.remove(ACCESS_TOKEN_COOKIE);
  generatePayload();
}
