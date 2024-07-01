import type { Contract, OpenedContract } from '@ton/core';

export function saveContractAddress<C extends Contract>(
  contract: string | C,
  key: string
) {
  try {
    let address: string;

    if (typeof contract === 'string') {
      address = contract;
    } else {
      address = contract.address.toString({ testOnly: true });
    }

    localStorage.setItem(
      key,
      JSON.stringify({
        address,
        timestamp: Date.now()
      })
    );
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('Failed to save stream address: quota exceeded');
    }
  }
}

export type AddressData = {
  address: string;
  timestamp: number;
};

export function loadData<T = any>(key: string): T | null {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

// export const bocToHash = (boc: string): string => {
//   return Cell.fromBase64(boc).hash().toString('base64');
// };

// const getTransactionsByMessageHash = async (hash: string) => {
//   const res = await fetch(`/api/transactionsByMessage?hash=${hash}`);

//   if (!res.ok) {
//     throw new Error('Failed to get transactions by message hash');
//   }

//   return await res.json();
// };

// export interface WaitForTransactionOptions {
//   hash: string;
//   refetchInterval?: number;
//   refetchLimit?: number;
// }

// export async function waitForTransaction(
//   options: WaitForTransactionOptions
// ): Promise<Transaction | undefined> {
//   const { hash, refetchInterval = 1000, refetchLimit = undefined } = options || {};

//   return new Promise((resolve, reject) => {
//     let refetches = 0;

//     const interval = setInterval(async () => {
//       refetches += 1;

//       try {
//         const res = await getTransactionsByMessageHash(hash);
//         if (res?.transactions.length) {
//           clearInterval(interval);
//           resolve(res.transactions[0]);
//         }

//         if (refetchLimit && refetches >= refetchLimit) {
//           clearInterval(interval);
//           resolve(undefined);
//         }
//       } catch (error) {
//         console.error('Failed to get transaction by message hash', error);
//         clearInterval(interval);
//         reject(error);
//       }
//     }, refetchInterval);
//   });
// }
