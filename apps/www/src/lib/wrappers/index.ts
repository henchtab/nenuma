import { Address, OpenedContract, TonClient, TonClient4, beginCell, toNano } from '@ton/ton';
import { CHAIN } from '@tonconnect/ui';
import {
  Broker,
  Brokerage,
  BrokerageAccount,
  CashOrNothingOption,
  CashOrNothingOptionAgreement,
  storeBRGDeploy,
  storeBrokerDeployOption,
  storeCashOrNothingOptionDeploy,
  storeStateInit,
  type Candlestick,
  type CashOrNothingOptionDraftAgreement
} from 'nenuma-contracts';
import { derived, readable, type Readable, type Writable } from 'svelte/store';
import {
  BRG_DEPLOY_ACCOUNT_DEPOSIT,
  BRG_DEPLOY_BROKER_DEPOSIT,
  LATEST_OPTION_STORAGE_KEY,
  OPTIONS_STORAGE_KEY
} from '../constants';
import { sender, tonConnectUI } from '../stores/ton-connect';
import DataStreamWrapper from './data-stream';
import SessionWrapper from './session';
import SimpleSubscriberWrapper from './simple-subscriber';
import SubscriptionBatchWrapper from './subscription-batch';

export const publicClient = readable<TonClient4>(undefined, (set) => {
  set(
    new TonClient4({
      endpoint: 'https://testnet-v4.tonhubapi.com/'
    })
  );
});

export interface OpenContract<C> {
  getOpenedContract: () => OpenedContract<C> | Promise<OpenedContract<C>>;
}

export type TDataStream = ReturnType<typeof createDataStream>;
export const createDataStream = (streamAddress?: Writable<string>): Readable<DataStreamWrapper> => {
  return derived(
    [publicClient, tonConnectUI, streamAddress ? streamAddress : readable('')],
    ([$publicClient, $tonConnectUI, $streamAddress], set) => {
      const wrapper = new DataStreamWrapper($publicClient, $tonConnectUI, $streamAddress);

      set(wrapper);
    }
  );
};

export const useSubscriptioBatch = (
  batchId: Writable<number | bigint>
): Readable<SubscriptionBatchWrapper> => {
  return derived([publicClient, batchId], ([$publicClient, $batchId], set) => {
    const wrapper = new SubscriptionBatchWrapper($publicClient, BigInt($batchId));

    set(wrapper);
  });
};

export const useSession = (subscriberAddress: Writable<string>): Readable<SessionWrapper> => {
  return derived(
    [publicClient, tonConnectUI, subscriberAddress],
    ([$publicClient, $tonConnectUI, $subscriberAddress], set) => {
      const wrapper = new SessionWrapper($publicClient, $tonConnectUI, $subscriberAddress);

      set(wrapper);
    }
  );
};

export const createSimpleSubscriber = (
  subscriberAddress?: Writable<string>
): Readable<SimpleSubscriberWrapper> => {
  return derived(
    [publicClient, tonConnectUI, subscriberAddress ? subscriberAddress : readable('')],
    ([$publicClient, $tonConnectUI, $subscriberAddress], set) => {
      const wrapper = new SimpleSubscriberWrapper($publicClient, $tonConnectUI, $subscriberAddress);

      set(wrapper);
    }
  );
};

type BrokerageMethods = {
  getOwner: () => Promise<Address>;
  getStorageReserve: () => Promise<bigint>;
  getBroker: (stream: Address) => Promise<Address>;
  getAccount: (trader: Address) => Promise<Address>;
  deploy: (args: { queryId: bigint }) => Promise<void>;
  deployBroker: (args: { stream: Address; queryId: bigint }) => Promise<void>;
  deployAccount: (args: { queryId: bigint }) => Promise<void>;
};

export const createBrokerage = (): Readable<BrokerageMethods> => {
  const provider = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: '9e557d76a302f31496f5fe90a62cb4f90ed4ef97a0e8aa08d310080f30f6263c'
  });

  return derived([sender, tonConnectUI], ([$sender, $tonConnectUI], set) => {
    const getOwner = async () => {
      const brokerageAddress = localStorage.getItem('brokerage');

      if (!brokerageAddress) {
        throw new Error('No brokerage found. Did you deploy a brokerage?');
      }

      const brokerage = provider.open(Brokerage.fromAddress(Address.parse(brokerageAddress)));

      return await brokerage.getOwner();
    };

    const getStorageReserve = async () => {
      const brokerageAddress = localStorage.getItem('brokerage');

      if (!brokerageAddress) {
        throw new Error('No brokerage found. Did you deploy a brokerage?');
      }

      const brokerage = provider.open(Brokerage.fromAddress(Address.parse(brokerageAddress)));

      return await brokerage.getStorageReserve();
    };

    const getBroker = async (stream: Address) => {
      const brokerageAddress = localStorage.getItem('brokerage');

      if (!brokerageAddress) {
        throw new Error('No brokerage found. Did you deploy a brokerage?');
      }

      const brokerage = provider.open(Brokerage.fromAddress(Address.parse(brokerageAddress)));

      return await brokerage.getBroker(stream);
    };

    const getAccount = async (trader: Address) => {
      const brokerageAddress = localStorage.getItem('brokerage');

      if (!brokerageAddress) {
        throw new Error('No brokerage found. Did you deploy a brokerage?');
      }

      const brokerage = provider.open(Brokerage.fromAddress(Address.parse(brokerageAddress)));

      return await brokerage.getAccount(trader);
    };

    const deploy = async (args: { queryId: bigint }) => {
      const owner = $tonConnectUI.account?.address;

      if (!owner) {
        throw new Error('No account connected. Did you connect to the wallet?');
      }

      const brokerage = provider.open(await Brokerage.fromInit(Address.parse(owner)));

      localStorage.setItem('brokerage', brokerage.address.toString({ testOnly: true }));

      await $tonConnectUI?.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
          {
            address: brokerage.address.toString(),
            amount: toNano('0.2').toString(),
            stateInit: beginCell()
              .store(
                storeStateInit({
                  $$type: 'StateInit',
                  ...brokerage.init!
                })
              )
              .endCell()
              .toBoc()
              .toString('base64'),
            payload: beginCell()
              .store(
                storeBRGDeploy({
                  $$type: 'BRGDeploy',
                  queryId: args.queryId
                })
              )
              .endCell()
              .toBoc()
              .toString('base64')
          }
        ]
      });
    };

    const deployBroker = async (args: { stream: Address; queryId: bigint }) => {
      const brokerageAddress = localStorage.getItem('brokerage');

      if (!brokerageAddress) {
        throw new Error('No brokerage found. Did you deploy a brokerage?');
      }

      const brokerage = provider.open(Brokerage.fromAddress(Address.parse(brokerageAddress)));

      await brokerage.send(
        $sender,
        {
          value: BRG_DEPLOY_BROKER_DEPOSIT
        },
        { $$type: 'BRGDeployBroker', queryId: args.queryId, stream: args.stream }
      );
    };

    const deployAccount = async (args: { queryId: bigint }) => {
      const brokerageAddress = localStorage.getItem('brokerage');

      if (!brokerageAddress) {
        throw new Error('No brokerage found. Did you deploy a brokerage?');
      }

      const brokerage = provider.open(Brokerage.fromAddress(Address.parse(brokerageAddress)));

      await brokerage.send(
        $sender,
        {
          value: BRG_DEPLOY_ACCOUNT_DEPOSIT
        },
        { $$type: 'BRGDeployAccount', queryId: args.queryId }
      );
    };

    set({
      getOwner,
      getStorageReserve,
      getBroker,
      getAccount,
      deploy,
      deployBroker,
      deployAccount
    });
  });
};

type BrokerMethods = {
  getStorageReserve: () => Promise<bigint>;
  getOptionAddress: (optionId: bigint) => Promise<Address>;
  getStream: () => Promise<Address>;
  getBalance: () => Promise<bigint>;
  getPayout: () => Promise<{
    $$type: 'Fraction';
    nominator: bigint;
    denominator: bigint;
  }>;
  getPayoutRatio: () => Promise<{
    $$type: 'Fraction';
    nominator: bigint;
    denominator: bigint;
  }>;
  getNextOptionId: () => Promise<bigint>;
  deploy: (args: { queryId: bigint }) => Promise<void>;
  deposit: (args: { queryId: bigint; deposit: bigint }) => Promise<void>;
  withdraw: (args: { queryId: bigint }) => Promise<void>;
  deployOption: (args: {
    queryId: bigint;
    draft: Omit<CashOrNothingOptionDraftAgreement, '$$type'>;
  }) => Promise<void>;
};

export const useBroker = (brokerAddress: Writable<string>): Readable<BrokerMethods> => {
  const provider = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: '9e557d76a302f31496f5fe90a62cb4f90ed4ef97a0e8aa08d310080f30f6263c'
  });

  return derived(
    [sender, tonConnectUI, brokerAddress],
    ([$sender, $tonConnectUI, $brokerAddress], set) => {
      const getBalance = async () => {
        const broker = provider.open(Broker.fromAddress(Address.parse($brokerAddress)));

        return await broker.getBalance();
      };

      const getStorageReserve = async () => {
        const broker = provider.open(Broker.fromAddress(Address.parse($brokerAddress)));

        return await broker.getStorageReserve();
      };

      const getOptionAddress = async (optionId: bigint) => {
        const broker = provider.open(Broker.fromAddress(Address.parse($brokerAddress)));

        return await broker.getOptionAddress(optionId);
      };

      const getStream = async () => {
        const broker = provider.open(Broker.fromAddress(Address.parse($brokerAddress)));

        return await broker.getStream();
      };

      const getPayout = async () => {
        const broker = provider.open(Broker.fromAddress(Address.parse($brokerAddress)));

        return await broker.getPayout();
      };

      const getPayoutRatio = async () => {
        const broker = provider.open(Broker.fromAddress(Address.parse($brokerAddress)));

        return await broker.getPayoutRatio();
      };

      const getNextOptionId = async () => {
        const broker = provider.open(Broker.fromAddress(Address.parse($brokerAddress)));

        return await broker.getNextOptionId();
      };

      const deploy = async (args: { queryId: bigint }) => {
        const owner = $tonConnectUI.account?.address;

        if (!owner) {
          throw new Error('No account connected. Did you connect to the wallet?');
        }

        const broker = provider.open(Broker.fromAddress(Address.parse($brokerAddress)));

        await broker.send(
          $sender,
          {
            value: toNano('0.2')
          },
          { $$type: 'BRKDeploy', queryId: args.queryId }
        );
      };

      const deposit = async (args: { queryId: bigint; deposit: bigint }) => {
        const owner = $tonConnectUI.account?.address;

        if (!owner) {
          throw new Error('No account connected. Did you connect to the wallet?');
        }

        const broker = provider.open(Broker.fromAddress(Address.parse($brokerAddress)));

        console.log("toNano('0.05') + toNano(args.deposit)", toNano('0.05') + args.deposit);

        await broker.send(
          $sender,
          {
            value: toNano('0.05') + args.deposit
          },
          { $$type: 'BRKDeposit', queryId: args.queryId }
        );
      };

      const withdraw = async (args: { queryId: bigint }) => {
        const owner = $tonConnectUI.account?.address;

        if (!owner) {
          throw new Error('No account connected. Did you connect to the wallet?');
        }

        const broker = provider.open(Broker.fromAddress(Address.parse($brokerAddress)));

        await broker.send(
          $sender,
          {
            value: toNano('0.2')
          },
          { $$type: 'BRKWithdraw', queryId: args.queryId }
        );
      };

      const deployOption = async (args: {
        queryId: bigint;
        draft: Omit<CashOrNothingOptionDraftAgreement, '$$type'>;
      }) => {
        const deployer = $tonConnectUI.account?.address;

        if (!deployer) {
          throw new Error('No account connected. Did you connect to the wallet?');
        }

        const broker = provider.open(Broker.fromAddress(Address.parse($brokerAddress)));

        const message = {
          address: broker.address.toString(),
          amount: (args.draft.investment + toNano('2')).toString(),
          payload: beginCell()
            .store(
              storeBrokerDeployOption({
                $$type: 'BrokerDeployOption',
                queryId: args.queryId,
                draft: {
                  $$type: 'CashOrNothingOptionDraftAgreement',
                  ...args.draft
                }
              })
            )
            .endCell()
            .toBoc()
            .toString('base64')
        };

        await $tonConnectUI.sendTransaction({
          validUntil: Math.floor(Date.now() / 1000) + 360,
          messages: [message],
          network: CHAIN.TESTNET
        });
      };

      set({
        getStorageReserve,
        deploy,
        withdraw,
        deposit,
        getStream,
        getPayout,
        getPayoutRatio,
        getNextOptionId,
        getOptionAddress,
        deployOption,
        getBalance
      });
    }
  );
};

type BrokerageAccountMethods = {
  getStorageReserve: () => Promise<bigint>;
  getTrader: () => Promise<Address>;
  getBrokerage: () => Promise<Address>;
};

export const useBrokerageAccount = (
  brokerageAddress: Writable<string>
): Readable<BrokerageAccountMethods> => {
  const provider = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: '9e557d76a302f31496f5fe90a62cb4f90ed4ef97a0e8aa08d310080f30f6263c'
  });

  return derived([tonConnectUI, brokerageAddress], ([$tonConnectUI, $brokerageAddress], set) => {
    const getStorageReserve = async () => {
      const brokerageAddress = localStorage.getItem('brokerage');

      if (!brokerageAddress) {
        throw new Error('No brokerage found. Did you deploy a brokerage?');
      }

      const brokerageAccount = provider.open(
        await BrokerageAccount.fromInit(
          $brokerageAddress ? Address.parse($brokerageAddress) : Address.parse(brokerageAddress),
          Address.parse($tonConnectUI.account?.address!)
        )
      );

      return await brokerageAccount.getStorageReserve();
    };

    const getBrokerage = async () => {
      const brokerageAddress = localStorage.getItem('brokerage');

      if (!brokerageAddress) {
        throw new Error('No brokerage found. Did you deploy a brokerage?');
      }

      const brokerageAccount = provider.open(
        await BrokerageAccount.fromInit(
          $brokerageAddress ? Address.parse($brokerageAddress) : Address.parse(brokerageAddress),
          Address.parse($tonConnectUI.account?.address!)
        )
      );

      return await brokerageAccount.getBrokerage();
    };

    const getTrader = async () => {
      const brokerageAddress = localStorage.getItem('brokerage');

      if (!brokerageAddress) {
        throw new Error('No brokerage found. Did you deploy a brokerage?');
      }

      const brokerageAccount = provider.open(
        await BrokerageAccount.fromInit(
          $brokerageAddress ? Address.parse($brokerageAddress) : Address.parse(brokerageAddress),
          Address.parse($tonConnectUI.account?.address!)
        )
      );

      return await brokerageAccount.getTrader();
    };

    set({
      getStorageReserve,
      getTrader,
      getBrokerage
    });
  });
};

function saveOptionAddress(option: OpenedContract<CashOrNothingOption> | string) {
  try {
    const storageKey = OPTIONS_STORAGE_KEY.toString();
    const options = JSON.parse(localStorage.getItem(storageKey) || '{}');
    let optionAddress: string;

    if (typeof option === 'string') {
      optionAddress = option;
    } else {
      optionAddress = option.address.toString({ testOnly: true });
    }

    localStorage.setItem(LATEST_OPTION_STORAGE_KEY.toString(), optionAddress);
    localStorage.setItem(storageKey, JSON.stringify({ ...options, [storageKey]: optionAddress }));
  } catch (e) {
    console.error(e);
    throw e;
  }
}

/**
 * Gets the latest option address from the local storage.
 * @throws {Error} If no latest option address is found in local storage.
 */
function getOptionContract(publicClient: TonClient4) {
  const optionAddress = localStorage.getItem(LATEST_OPTION_STORAGE_KEY.toString());

  if (!optionAddress) {
    throw new Error('No option found. Did you deploy an option?');
  }

  return publicClient.open(CashOrNothingOption.fromAddress(Address.parse(optionAddress)));
}

export type TCashOrNothingOption = Readable<CashOrNothingOptionMethods>;

type CashOrNothingOptionMethods = {
  deploy: (args: {
    optionId: bigint;
    queryId: bigint;
    agreement: Omit<CashOrNothingOptionAgreement, '$$type'>;
  }) => Promise<void>;
  checkTimeout: (args: { queryId: bigint }) => Promise<void>;
  getOptionId: () => Promise<bigint>;
  getAgreement: () => Promise<CashOrNothingOptionAgreement | null>;
  getStrikePrice: () => Promise<bigint | null>;
  getLatestCandlestick: () => Promise<Candlestick | null>;
  getBalance: () => Promise<bigint>;
  getDeployerAddress: () => Promise<Address>;
  getStreamAddress: () => Promise<Address | null>;
  getNotificationsCount: () => Promise<bigint | null>;
  getExpiration: () => Promise<bigint | null>;
  getSessionAddress: () => Promise<Address | null>;
};

export const createCashOrNothingOption = (
  streamAddress: Writable<string>
): Readable<CashOrNothingOptionMethods> =>
  derived(
    [publicClient, tonConnectUI, sender, streamAddress],
    ([$publicClient, $tonConnectUI, $sender, $streamAddress], set) => {
      const deploy = async (args: {
        optionId: bigint;
        queryId: bigint;
        agreement: Omit<CashOrNothingOptionAgreement, '$$type'>;
      }) => {
        const owner = $tonConnectUI.account?.address;

        if (!owner) {
          throw new Error('No account connected. Did you connect to the wallet?');
        }

        const option = $publicClient.open(
          await CashOrNothingOption.fromInit(Address.parse(owner), args.optionId)
        );
        saveOptionAddress(option);

        $tonConnectUI.sendTransaction({
          validUntil: Math.floor(Date.now() / 1000) + 360,
          messages: [
            {
              address: option.address.toString(),
              amount: (args.agreement.investment + args.agreement.payout + toNano('1')).toString(),
              payload: beginCell()
                .store(
                  storeCashOrNothingOptionDeploy({
                    $$type: 'CashOrNothingOptionDeploy',
                    queryId: args.queryId,
                    agreement: {
                      ...args.agreement,
                      $$type: 'CashOrNothingOptionAgreement'
                    },
                    stream: Address.parse($streamAddress)
                  })
                )
                .endCell()
                .toBoc()
                .toString('base64'),
              stateInit: beginCell()
                .store(
                  storeStateInit({
                    $$type: 'StateInit',
                    ...option.init!
                  })
                )
                .endCell()
                .toBoc()
                .toString('base64')
            }
          ]
        });
      };

      const checkTimeout = async (args: { queryId: bigint }) => {
        const option = getOptionContract($publicClient);

        await option.send(
          $sender,
          {
            value: toNano('0.05')
          },
          {
            $$type: 'SubscriberCheckTimeout',
            queryId: args.queryId
          }
        );
      };

      const getOptionId = async () => await getOptionContract($publicClient).getOptionId();

      const getAgreement = async () => await getOptionContract($publicClient).getAgreement();

      const getStrikePrice = async () => await getOptionContract($publicClient).getStrikePrice();

      const getLatestCandlestick = async () =>
        await getOptionContract($publicClient).getLatestCandlestick();

      const getDeployerAddress = async () =>
        await getOptionContract($publicClient).getDeployerAddress();

      const getBalance = async () => await getOptionContract($publicClient).getBalance();

      const getStreamAddress = async () =>
        await getOptionContract($publicClient).getStreamAddress();

      const getNotificationsCount = async () =>
        await getOptionContract($publicClient).getNotificationsCount();

      const getExpiration = async () => await getOptionContract($publicClient).getExpiration();

      const getSessionAddress = async () =>
        await getOptionContract($publicClient).getSessionAddress();

      set({
        deploy,
        checkTimeout,
        getOptionId,
        getAgreement,
        getStrikePrice,
        getLatestCandlestick,
        getBalance,
        getDeployerAddress,
        getStreamAddress,
        getNotificationsCount,
        getExpiration,
        getSessionAddress
      });
    }
  );
