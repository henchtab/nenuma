import { browser } from '$app/environment';
import { Address, Dictionary, TonClient, beginCell, toNano } from '@ton/ton';
import { toast } from 'svelte-sonner';
import { derived, readable, type Readable, type Writable } from 'svelte/store';
import {
  BRG_DEPLOY_ACCOUNT_DEPOSIT,
  BRG_DEPLOY_BROKER_DEPOSIT,
  DST_DEPLOY_BATCH_DEPOSIT,
  DST_DEPLOY_DEPOSIT,
  DST_DEPLOY_SESSION_DEPOSIT,
  DST_PUBLISH_CANDLESTICK_DEPOSIT,
  NOTIFICATION_DEPOSIT,
  NOTIFICATION_PREMIUM,
  SES_DESTROY_DEPOSIT,
  SES_SUBSCRIBE_DEPOSIT,
  SES_UNSUBSCRIBE_DEPOSIT
} from '../constants';
import { sender, tonConnectUI } from '../ton-connect';
import { Broker, storeBRGDeploy } from './tact_Broker';
import { Brokerage, storeStateInit as bStoreStateInit } from './tact_Brokerage';
import { DataStream, storeDSTDeploy, storeStateInit, type Candlestick } from './tact_DataStream';
import { Session } from './tact_Session';
import { SubscriptionBatch, type SBInfo, type SubscriptionInfo } from './tact_SubscriptionBatch';
import { BrokerageAccount } from './tact_BrokerageAccount';

type DataStreamMethods = {
  deploy: (args: { topic: string; queryId: bigint }) => Promise<void>;
  deployBatch: (args: { queryId: bigint }) => Promise<void>;
  deploySession: (args: { queryId: bigint }) => Promise<void>;
  publishCandlestick: (args: {
    queryId: bigint;
    candlestick: Omit<Candlestick, '$$type'>;
  }) => Promise<void>;
  getBalance: () => Promise<bigint>;
  getPublisherAddress: () => Promise<Address>;
  getTopic: () => Promise<string>;
  getBatches: () => Promise<Dictionary<Address, SBInfo>>;
  getNextBatchId: () => Promise<bigint>;
  getBatchAddress: (batchId: bigint) => Promise<Address>;
  getSessionAddress: (subscriberAddress: Address) => Promise<Address>;
};

export const createDataStream = (streamAddress?: Writable<string>): Readable<DataStreamMethods> => {
  const provider = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: '9e557d76a302f31496f5fe90a62cb4f90ed4ef97a0e8aa08d310080f30f6263c'
  });

  return derived(
    [tonConnectUI, sender, streamAddress ? streamAddress : readable('')],
    ([$tonConnectUI, $sender, streamAddress], set) => {
      if (streamAddress && browser) {
        localStorage.setItem('stream', Address.parse(streamAddress).toString({ testOnly: true }));
      }

      const deploy = async (args: { topic: string; queryId: bigint }) => {
        const publisher = $tonConnectUI.account?.address;

        if (!publisher) {
          throw new Error('No account connected. Did you connect to the wallet?');
        }

        const stream = provider.open(
          await DataStream.fromInit(Address.parse(publisher), args.topic)
        );
        localStorage.setItem('stream', stream.address.toString({ testOnly: true }));

        await $tonConnectUI?.sendTransaction({
          validUntil: Math.floor(Date.now() / 1000) + 360,
          messages: [
            {
              address: stream.address.toString(),
              amount: DST_DEPLOY_DEPOSIT.toString(),
              payload: beginCell()
                .store(
                  storeDSTDeploy({
                    $$type: 'DSTDeploy',
                    queryId: args.queryId
                  })
                )
                .endCell()
                .toBoc()
                .toString('base64'),
              stateInit: beginCell()
                .store(
                  storeStateInit({
                    $$type: 'StateInit',
                    ...stream.init!
                  })
                )
                .endCell()
                .toBoc()
                .toString('base64')
            }
          ]
        });
      };

      const deployBatch = async (args: { queryId: bigint }) => {
        const streamAddress = localStorage.getItem('stream');

        if (!streamAddress) {
          throw new Error('No stream found. Did you deploy a stream?');
        }

        const stream = provider.open(DataStream.fromAddress(Address.parse(streamAddress)));

        await stream.send(
          $sender,
          {
            value: DST_DEPLOY_BATCH_DEPOSIT
          },
          {
            $$type: 'DSTDeployBatch',
            queryId: args.queryId
          }
        );
      };

      const deploySession = async (args: { queryId: bigint }) => {
        const streamAddress = localStorage.getItem('stream');

        if (!streamAddress) {
          throw new Error('No stream found. Did you deploy a stream?');
        }

        const stream = provider.open(DataStream.fromAddress(Address.parse(streamAddress)));

        await stream.send(
          $sender,
          {
            value: DST_DEPLOY_SESSION_DEPOSIT
          },
          {
            $$type: 'DSTDeploySession',
            queryId: args.queryId
          }
        );
      };

      const publishCandlestick = async (args: {
        queryId: bigint;
        candlestick: Omit<Candlestick, '$$type'>;
      }) => {
        const streamAddress = localStorage.getItem('stream');

        if (!streamAddress) {
          throw new Error('No stream found. Did you deploy a stream?');
        }

        const stream = provider.open(DataStream.fromAddress(Address.parse(streamAddress)));

        await stream.send(
          $sender,
          {
            value: DST_PUBLISH_CANDLESTICK_DEPOSIT
          },
          {
            $$type: 'DSTPublishCandlestick',
            queryId: args.queryId,
            candlestick: {
              ...args.candlestick,
              $$type: 'Candlestick'
            }
          }
        );
      };

      const getBalance = async () => {
        const streamAddress = localStorage.getItem('stream');

        if (!streamAddress) {
          throw new Error('No stream found. Did you deploy a stream?');
        }

        const stream = provider.open(DataStream.fromAddress(Address.parse(streamAddress)));

        return await stream.getBalance();
      };

      const getPublisherAddress = async () => {
        const streamAddress = localStorage.getItem('stream');

        if (!streamAddress) {
          throw new Error('No stream found. Did you deploy a stream?');
        }

        const stream = provider.open(DataStream.fromAddress(Address.parse(streamAddress)));

        return await stream.getPublisherAddress();
      };

      const getTopic = async () => {
        const streamAddress = localStorage.getItem('stream');

        if (!streamAddress) {
          throw new Error('No stream found. Did you deploy a stream?');
        }

        const stream = provider.open(DataStream.fromAddress(Address.parse(streamAddress)));

        return await stream.getTopic();
      };

      const getBatches = async () => {
        const streamAddress = localStorage.getItem('stream');

        if (!streamAddress) {
          throw new Error('No stream found. Did you deploy a stream?');
        }

        const stream = provider.open(DataStream.fromAddress(Address.parse(streamAddress)));

        return await stream.getBatches();
      };

      const getNextBatchId = async () => {
        const streamAddress = localStorage.getItem('stream');

        if (!streamAddress) {
          throw new Error('No stream found. Did you deploy a stream?');
        }

        const stream = provider.open(DataStream.fromAddress(Address.parse(streamAddress)));

        return await stream.getNextBatchId();
      };

      const getBatchAddress = async (batchId: bigint) => {
        const streamAddress = localStorage.getItem('stream');

        if (!streamAddress) {
          throw new Error('No stream found. Did you deploy a stream?');
        }

        const stream = provider.open(DataStream.fromAddress(Address.parse(streamAddress)));

        return await stream.getBatchAddress(batchId);
      };

      const getSessionAddress = async (subscriberAddress: Address) => {
        const streamAddress = localStorage.getItem('stream');

        if (!streamAddress) {
          throw new Error('No stream found. Did you deploy a stream?');
        }

        const stream = provider.open(DataStream.fromAddress(Address.parse(streamAddress)));

        return await stream.getSessionAddress(subscriberAddress);
      };

      set({
        deploy,
        deployBatch,
        deploySession,
        publishCandlestick,
        getBalance,
        getPublisherAddress,
        getTopic,
        getBatches,
        getNextBatchId,
        getBatchAddress,
        getSessionAddress
      });
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
            amount: toNano('0.05').toString(),
            stateInit: beginCell()
              .store(
                bStoreStateInit({
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

export const useBroker = (streamAddress: Writable<string>): Readable<BrokerMethods> => {
  const provider = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: '9e557d76a302f31496f5fe90a62cb4f90ed4ef97a0e8aa08d310080f30f6263c'
  });

  return derived(
    [sender, tonConnectUI, streamAddress],
    ([$sender, $tonConnectUI, $streamAddress], set) => {
      const getBalance = async () => {
        const brokerageAddress = localStorage.getItem('brokerage');

        if (!brokerageAddress) {
          throw new Error('No brokerage found. Did you deploy a brokerage?');
        }

        const broker = provider.open(
          await Broker.fromInit(Address.parse(brokerageAddress), Address.parse($streamAddress))
        );

        return await broker.getBalance();
      };

      const getStorageReserve = async () => {
        const brokerageAddress = localStorage.getItem('brokerage');

        if (!brokerageAddress) {
          throw new Error('No brokerage found. Did you deploy a brokerage?');
        }

        const broker = provider.open(
          await Broker.fromInit(Address.parse(brokerageAddress), Address.parse($streamAddress))
        );

        return await broker.getStorageReserve();
      };

      const getBrokerage = async () => {
        const brokerageAddress = localStorage.getItem('brokerage');

        if (!brokerageAddress) {
          throw new Error('No brokerage found. Did you deploy a brokerage?');
        }

        const broker = provider.open(
          await Broker.fromInit(Address.parse(brokerageAddress), Address.parse($streamAddress))
        );

        return await broker.getBrokerage();
      };

      const getStream = async () => {
        const brokerageAddress = localStorage.getItem('brokerage');

        if (!brokerageAddress) {
          throw new Error('No brokerage found. Did you deploy a brokerage?');
        }

        const broker = provider.open(
          await Broker.fromInit(Address.parse(brokerageAddress), Address.parse($streamAddress))
        );

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

        const broker = provider.open(
          await Broker.fromInit(Address.parse(brokerageAddress), Address.parse($streamAddress))
        );

        await broker.send(
          $sender,
          {
            value: toNano('0.05')
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

        const broker = provider.open(
          await Broker.fromInit(Address.parse(brokerageAddress), Address.parse($streamAddress))
        );

        await broker.send(
          $sender,
          {
            value: toNano('0.05') + toNano(args.deposit)
          },
          { $$type: 'BRKDeposit', queryId: args.queryId }
        );
      };

      const withdraw = async (args: { queryId: bigint; amount: bigint }) => {
        const owner = $tonConnectUI.account?.address;

        if (!owner) {
          throw new Error('No account connected. Did you connect to the wallet?');
        }

        const brokerageAddress = localStorage.getItem('brokerage');

        if (!brokerageAddress) {
          throw new Error('No brokerage found. Did you deploy a brokerage?');
        }

        const broker = provider.open(
          await Broker.fromInit(Address.parse(brokerageAddress), Address.parse($streamAddress))
        );

        await broker.send(
          $sender,
          {
            value: toNano('0.05')
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

export const useBrokerageAccount = (): Readable<BrokerageAccountMethods> => {
  const provider = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: '9e557d76a302f31496f5fe90a62cb4f90ed4ef97a0e8aa08d310080f30f6263c'
  });

  return derived([tonConnectUI], ([$tonConnectUI], set) => {
    const getStorageReserve = async () => {
      const brokerageAddress = localStorage.getItem('brokerage');

      if (!brokerageAddress) {
        throw new Error('No brokerage found. Did you deploy a brokerage?');
      }

      const brokerageAccount = provider.open(
        await BrokerageAccount.fromInit(
          Address.parse(brokerageAddress),
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
          Address.parse(brokerageAddress),
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
          Address.parse(brokerageAddress),
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
