import { PUBLIC_API_URL } from '$env/static/public';
import type { Account, ConnectAdditionalRequest, TonProofItemReplySuccess } from '@tonconnect/ui';
import cookie from 'js-cookie';
import { ACCESS_TOKEN_COOKIE, COOKIE_EXPIRES } from './constants';

/**
 * Generate a new proof payload
 *
 * @returns {Promise<ConnectAdditionalRequest | null>}
 */
export async function generatePayload(): Promise<ConnectAdditionalRequest | null> {
  try {
    const response = await (await fetch(`${PUBLIC_API_URL}/api/generate-proof-payload`)).json();
    return { tonProof: response.proofToken as string };
  } catch {
    return null;
  }
}

/**
 * Check the proof
 *
 * @param {TonProofItemReplySuccess['proof']} proof
 * @param {Account} account
 
 * @returns {Promise<void>}
 */
export async function checkProof(
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
        sameSite: 'Lax'
      });
    }
  } catch (e) {
    console.log('checkProof error:', e);
  }
}

/**
 * Get account info
 *
 * @returns {Promise<{ balance: string; address: string }>}
 * @throws {Error}
 */
export async function getAccountInfo(): Promise<{
  balance: string;
  address: string;
}> {
  const response = await fetch(`${PUBLIC_API_URL}/api/account-info`, {
    headers: {
      Authorization: `Bearer ${cookie.get(ACCESS_TOKEN_COOKIE)}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

/**
 * Reset the token
 */
export function removeAccessTokenCookie() {
  cookie.remove(ACCESS_TOKEN_COOKIE);
  generatePayload();
}
