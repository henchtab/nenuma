import { browser } from '$app/environment';
import { PUBLIC_RPC_PROVIDER_API_KEY } from '$env/static/public';
import {
  Address,
  Contract,
  Dictionary,
  OpenedContract,
  TonClient,
  TonClient4,
  TupleBuilder,
  beginCell,
  toNano
} from '@ton/ton';
import { toast } from 'svelte-sonner';
import { derived, readable, writable, type Readable, type Writable } from 'svelte/store';
import {
  BRG_DEPLOY_ACCOUNT_DEPOSIT,
  BRG_DEPLOY_BROKER_DEPOSIT,
  DST_DEPLOY_BATCH_DEPOSIT,
  DST_DEPLOY_DEPOSIT,
  DST_DEPLOY_SESSION_DEPOSIT,
  DST_PUBLISH_CANDLESTICK_DEPOSIT,
  LATEST_OPTION_STORAGE_KEY,
  NOTIFICATION_DEPOSIT,
  NOTIFICATION_PREMIUM,
  OPTIONS_STORAGE_KEY,
  SES_DESTROY_DEPOSIT,
  SES_SUBSCRIBE_DEPOSIT,
  SES_UNSUBSCRIBE_DEPOSIT
} from '../constants';
import { sender, tonConnectUI } from '../stores/ton-connect';
import {
  SubscriptionBatch,
  type SBInfo,
  type SubscriptionInfo,
  DataStream,
  storeDSTDeploy,
  storeStateInit,
  type Candlestick,
  SimpleSubscriber,
  storeSimpleSubscriberDeploy,
  Session,
  BrokerageAccount,
  Brokerage,
  Broker,
  storeBRGDeploy,
  CashOrNothingOption,
  CashOrNothingOptionAgreement,
  storeCashOrNothingOptionDeploy
} from 'nenuma-contracts';
import DataStreamWrapper from './data-stream';

export const publicClient = readable<TonClient4>(undefined, (set) => {
  set(
    new TonClient4({
      endpoint: 'https://testnet-v4.tonhubapi.com/'
    })
  );
});

export interface OpenContract<C> {
  getOpenedContract: () => OpenedContract<C>;
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

type SubscriptionBatchMethods = {
  getBalance: () => Promise<bigint>;
  getStreamAddress: () => Promise<Address>;
  getBatchId: () => Promise<bigint>;
  getSubscriptions: () => Promise<Dictionary<Address, SubscriptionInfo>>;
  getSubscriptionsCount: () => Promise<bigint>;
};

export const useSubscriptioBatch = (
  batchId: Writable<number | bigint>
): Readable<SubscriptionBatchMethods> => {
  const provider = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: '9e557d76a302f31496f5fe90a62cb4f90ed4ef97a0e8aa08d310080f30f6263c'
  });

  return derived(batchId, ($batchId, set) => {
    $batchId = BigInt($batchId);

    const getBalance = async () => {
      console.log('getBalance', $batchId);

      const streamAddress = localStorage.getItem('stream');

      if (!streamAddress) {
        throw new Error('No stream found. Did you deploy a stream?');
      }

      const batch = provider.open(
        await SubscriptionBatch.fromInit(Address.parse(streamAddress), BigInt($batchId))
      );

      console.log(batch.address.toString({ testOnly: true, bounceable: false }));

      return await batch.getBalance();
    };

    const getStreamAddress = async () => {
      const streamAddress = localStorage.getItem('stream');

      if (!streamAddress) {
        throw new Error('No stream found. Did you deploy a stream?');
      }

      const batch = provider.open(
        await SubscriptionBatch.fromInit(Address.parse(streamAddress), $batchId)
      );

      return await batch.getStreamAddress();
    };

    const getBatchId = async () => {
      const streamAddress = localStorage.getItem('stream');

      if (!streamAddress) {
        throw new Error('No stream found. Did you deploy a stream?');
      }

      const batch = provider.open(
        await SubscriptionBatch.fromInit(Address.parse(streamAddress), $batchId)
      );

      return await batch.getBatchId();
    };

    const getSubscriptions = async () => {
      const streamAddress = localStorage.getItem('stream');

      if (!streamAddress) {
        throw new Error('No stream found. Did you deploy a stream?');
      }

      const batch = provider.open(
        await SubscriptionBatch.fromInit(Address.parse(streamAddress), $batchId)
      );

      return await batch.getSubscriptions();
    };

    const getSubscriptionsCount = async () => {
      const streamAddress = localStorage.getItem('stream');

      if (!streamAddress) {
        throw new Error('No stream found. Did you deploy a stream?');
      }

      const batch = provider.open(
        await SubscriptionBatch.fromInit(Address.parse(streamAddress), $batchId)
      );

      return await batch.getSubscriptionsCount();
    };

    set({
      getBalance,
      getStreamAddress,
      getBatchId,
      getSubscriptions,
      getSubscriptionsCount
    });
  });
};

type SessionMethods = {
  getBalance: () => Promise<bigint>;
  getStreamAddress: () => Promise<Address>;
  getSubscriberAddress: () => Promise<Address>;
  getBatchAddress: () => Promise<Address | null>;
  subscribe: (args: { queryId: bigint; notificationsCount: bigint }) => Promise<void>;
  unsubscribe: (args: { queryId: bigint }) => Promise<void>;
  destroy: (args: { queryId: bigint }) => Promise<void>;
};

export const useSession = (subscriberAddress: Writable<string>): Readable<SessionMethods> => {
  const provider = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: '9e557d76a302f31496f5fe90a62cb4f90ed4ef97a0e8aa08d310080f30f6263c'
  });

  return derived([subscriberAddress, sender], ([$subscriberAddress, $sender], set) => {
    if (!$subscriberAddress) {
      toast.error('No subscriber address found. Did you forget to fill in the subscriber address?');
    }

    const getBalance = async () => {
      const streamAddress = localStorage.getItem('stream');

      if (!streamAddress) {
        throw new Error('No stream found. Did you deploy a stream?');
      }

      const session = provider.open(
        await Session.fromInit(Address.parse(streamAddress!), Address.parse($subscriberAddress))
      );

      return await session.getBalance();
    };

    const getStreamAddress = async () => {
      const streamAddress = localStorage.getItem('stream');

      if (!streamAddress) {
        throw new Error('No stream found. Did you deploy a stream?');
      }

      const session = provider.open(
        await Session.fromInit(Address.parse(streamAddress!), Address.parse($subscriberAddress))
      );

      return await session.getStreamAddress();
    };

    const getSubscriberAddress = async () => {
      const streamAddress = localStorage.getItem('stream');

      if (!streamAddress) {
        throw new Error('No stream found. Did you deploy a stream?');
      }

      const session = provider.open(
        await Session.fromInit(Address.parse(streamAddress!), Address.parse($subscriberAddress))
      );

      return await session.getSubscriberAddress();
    };

    const getBatchAddress = async () => {
      const streamAddress = localStorage.getItem('stream');

      if (!streamAddress) {
        throw new Error('No stream found. Did you deploy a stream?');
      }

      const session = provider.open(
        await Session.fromInit(Address.parse(streamAddress!), Address.parse($subscriberAddress))
      );

      return await session.getBatchAddress();
    };

    const subscribe = async (args: { queryId: bigint; notificationsCount: bigint }) => {
      const streamAddress = localStorage.getItem('stream');

      if (!streamAddress) {
        throw new Error('No stream found. Did you deploy a stream?');
      }

      const session = provider.open(
        await Session.fromInit(Address.parse(streamAddress!), Address.parse($subscriberAddress))
      );

      await session.send(
        $sender,
        {
          value:
            SES_SUBSCRIBE_DEPOSIT +
            NOTIFICATION_DEPOSIT * args.notificationsCount +
            NOTIFICATION_PREMIUM * args.notificationsCount
        },
        {
          $$type: 'SESSubscribe',
          queryId: args.queryId,
          notificationsCount: args.notificationsCount
        }
      );
    };

    const unsubscribe = async (args: { queryId: bigint }) => {
      const streamAddress = localStorage.getItem('stream');

      if (!streamAddress) {
        throw new Error('No stream found. Did you deploy a stream?');
      }

      const session = provider.open(
        await Session.fromInit(Address.parse(streamAddress!), Address.parse($subscriberAddress))
      );

      await session.send(
        $sender,
        {
          value: SES_UNSUBSCRIBE_DEPOSIT
        },
        {
          $$type: 'SESUnsubscribe',
          queryId: args.queryId
        }
      );
    };

    const destroy = async (args: { queryId: bigint }) => {
      const streamAddress = localStorage.getItem('stream');

      if (!streamAddress) {
        throw new Error('No stream found. Did you deploy a stream?');
      }

      const session = provider.open(
        await Session.fromInit(Address.parse(streamAddress!), Address.parse($subscriberAddress))
      );

      await session.send(
        $sender,
        {
          value: SES_DESTROY_DEPOSIT
        },
        {
          $$type: 'SESDestroy',
          queryId: args.queryId
        }
      );
    };

    set({
      getBalance,
      getStreamAddress,
      getSubscriberAddress,
      getBatchAddress,
      subscribe,
      unsubscribe,
      destroy
    });
  });
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
  getBrokerage: () => Promise<Address>;
  getStream: () => Promise<Address>;
  getBalance: () => Promise<bigint>;
  deploy: (args: { queryId: bigint }) => Promise<void>;
  deposit: (args: { queryId: bigint; deposit: bigint }) => Promise<void>;
  withdraw: (args: { queryId: bigint }) => Promise<void>;
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
        const brokerageAddress = localStorage.getItem('brokerage');

        if (!brokerageAddress) {
          throw new Error('No brokerage found. Did you deploy a brokerage?');
        }

        const broker = provider.open(Broker.fromAddress(Address.parse($brokerAddress)));

        return await broker.getBalance();
      };

      const getStorageReserve = async () => {
        const brokerageAddress = localStorage.getItem('brokerage');

        if (!brokerageAddress) {
          throw new Error('No brokerage found. Did you deploy a brokerage?');
        }

        const broker = provider.open(Broker.fromAddress(Address.parse($brokerAddress)));

        return await broker.getStorageReserve();
      };

      const getBrokerage = async () => {
        const brokerageAddress = localStorage.getItem('brokerage');

        if (!brokerageAddress) {
          throw new Error('No brokerage found. Did you deploy a brokerage?');
        }

        const broker = provider.open(Broker.fromAddress(Address.parse($brokerAddress)));

        return await broker.getBrokerage();
      };

      const getStream = async () => {
        const brokerageAddress = localStorage.getItem('brokerage');

        if (!brokerageAddress) {
          throw new Error('No brokerage found. Did you deploy a brokerage?');
        }

        const broker = provider.open(Broker.fromAddress(Address.parse($brokerAddress)));

        return await broker.getStream();
      };

      const deploy = async (args: { queryId: bigint }) => {
        const owner = $tonConnectUI.account?.address;

        if (!owner) {
          throw new Error('No account connected. Did you connect to the wallet?');
        }

        const brokerageAddress = localStorage.getItem('brokerage');

        if (!brokerageAddress) {
          throw new Error('No brokerage found. Did you deploy a brokerage?');
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

        const brokerageAddress = localStorage.getItem('brokerage');

        if (!brokerageAddress) {
          throw new Error('No brokerage found. Did you deploy a brokerage?');
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

        const brokerageAddress = localStorage.getItem('brokerage');

        if (!brokerageAddress) {
          throw new Error('No brokerage found. Did you deploy a brokerage?');
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

      set({
        getStorageReserve,
        deploy,
        withdraw,
        deposit,
        getStream,
        getBrokerage,
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

type SimpleSubscriberMethods = {
  deploy: (args: {
    subscriberId: bigint;
    notificationsCount: bigint;
    stream: string;
    expiresAt: bigint;
  }) => Promise<void>;
  checkTimeout: (args: { queryId: bigint }) => Promise<void>;
  getBalance: () => Promise<bigint>;
  getOwnerAddress: () => Promise<Address>;
  getNotificationsCount: () => Promise<bigint | null>;
  getExpiresAt: () => Promise<bigint | null>;
  getStreamAddress: () => Promise<Address | null>;
  getSessionAddress: () => Promise<Address | null>;
  getLatestCandlestick: () => Promise<Candlestick | null>;
};

export const createSimpleSubscriber = (
  subscriberAddress?: Writable<string>
): Readable<SimpleSubscriberMethods> => {
  const provider = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: '9e557d76a302f31496f5fe90a62cb4f90ed4ef97a0e8aa08d310080f30f6263c'
  });

  return derived(
    [tonConnectUI, sender, subscriberAddress ? subscriberAddress : readable('')],
    ([$tonConnectUI, $sender, subscriberAddress], set) => {
      if (subscriberAddress && browser) {
        localStorage.setItem(
          'subscriber',
          Address.parse(subscriberAddress).toString({ testOnly: true })
        );
      }

      const deploy = async (args: {
        subscriberId: bigint;
        notificationsCount: bigint;
        stream: string;
        expiresAt: bigint;
      }) => {
        const owner = $tonConnectUI.account?.address;

        if (!owner) {
          throw new Error('No account connected. Did you connect to the wallet?');
        }

        const subscriber = provider.open(
          await SimpleSubscriber.fromInit(Address.parse(owner), args.subscriberId)
        );
        localStorage.setItem('subscriber', subscriber.address.toString({ testOnly: true }));

        await $tonConnectUI?.sendTransaction({
          validUntil: Math.floor(Date.now() / 1000) + 360,
          messages: [
            {
              address: subscriber.address.toString(),
              amount: (
                toNano('2.05') +
                NOTIFICATION_DEPOSIT * args.notificationsCount +
                NOTIFICATION_PREMIUM * args.notificationsCount
              ).toString(),
              payload: beginCell()
                .store(
                  storeSimpleSubscriberDeploy({
                    $$type: 'SimpleSubscriberDeploy',
                    queryId: args.subscriberId,
                    stream: Address.parse(args.stream),
                    notificationsCount: args.notificationsCount,
                    expiration: args.expiresAt
                  })
                )
                .endCell()
                .toBoc()
                .toString('base64'),
              stateInit: beginCell()
                .store(
                  storeStateInit({
                    $$type: 'StateInit',
                    ...subscriber.init!
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
        const owner = $tonConnectUI.account?.address;

        if (!owner) {
          throw new Error('No account connected. Did you connect to the wallet?');
        }

        const subscriberAddress = localStorage.getItem('subscriber');

        if (!subscriberAddress) {
          throw new Error('No subscriber found. Did you deploy a subscriber?');
        }

        const subscriber = provider.open(
          SimpleSubscriber.fromAddress(Address.parse(subscriberAddress))
        );

        await subscriber.send(
          $sender,
          {
            value: toNano('0.2')
          },
          {
            $$type: 'SubscriberCheckTimeout',
            queryId: args.queryId
          }
        );
      };

      const getBalance = async () => {
        const subscriberAddress = localStorage.getItem('subscriber');

        if (!subscriberAddress) {
          throw new Error('No subscriber found. Did you deploy a subscriber?');
        }

        const subscriber = provider.open(
          SimpleSubscriber.fromAddress(Address.parse(subscriberAddress))
        );

        return await subscriber.getBalance();
      };

      const getOwnerAddress = async () => {
        const subscriberAddress = localStorage.getItem('subscriber');

        if (!subscriberAddress) {
          throw new Error('No subscriber found. Did you deploy a subscriber?');
        }

        const subscriber = provider.open(
          SimpleSubscriber.fromAddress(Address.parse(subscriberAddress))
        );

        return await subscriber.getDeployerAddress();
      };

      const getNotificationsCount = async () => {
        const subscriberAddress = localStorage.getItem('subscriber');

        if (!subscriberAddress) {
          throw new Error('No subscriber found. Did you deploy a subscriber?');
        }

        const subscriber = provider.open(
          SimpleSubscriber.fromAddress(Address.parse(subscriberAddress))
        );

        return await subscriber.getNotificationsCount();
      };

      const getExpiresAt = async () => {
        const subscriberAddress = localStorage.getItem('subscriber');

        if (!subscriberAddress) {
          throw new Error('No subscriber found. Did you deploy a subscriber?');
        }

        const subscriber = provider.open(
          SimpleSubscriber.fromAddress(Address.parse(subscriberAddress))
        );

        return await subscriber.getExpiration();
      };

      const getStreamAddress = async () => {
        const subscriberAddress = localStorage.getItem('subscriber');

        if (!subscriberAddress) {
          throw new Error('No subscriber found. Did you deploy a subscriber?');
        }

        const subscriber = provider.open(
          SimpleSubscriber.fromAddress(Address.parse(subscriberAddress))
        );

        return await subscriber.getStreamAddress();
      };

      const getSessionAddress = async () => {
        const subscriberAddress = localStorage.getItem('subscriber');

        if (!subscriberAddress) {
          throw new Error('No subscriber found. Did you deploy a subscriber?');
        }

        const subscriber = provider.open(
          SimpleSubscriber.fromAddress(Address.parse(subscriberAddress))
        );

        return await subscriber.getSessionAddress();
      };

      const getLatestCandlestick = async () => {
        const subscriberAddress = localStorage.getItem('subscriber');

        if (!subscriberAddress) {
          throw new Error('No subscriber found. Did you deploy a subscriber?');
        }

        const subscriber = provider.open(
          SimpleSubscriber.fromAddress(Address.parse(subscriberAddress))
        );

        return await subscriber.getLatestCandlestick();
      };

      set({
        deploy,
        getBalance,
        getOwnerAddress,
        checkTimeout,
        getNotificationsCount,
        getExpiresAt,
        getStreamAddress,
        getSessionAddress,
        getLatestCandlestick
      });
    }
  );
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
