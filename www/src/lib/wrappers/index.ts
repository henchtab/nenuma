import { browser } from '$app/environment';
import { Address, Dictionary, TonClient, beginCell } from '@ton/ton';
import { toast } from 'svelte-sonner';
import { derived, readable, type Readable, type Writable } from 'svelte/store';
import {
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
import { DataStream, storeDSTDeploy, storeStateInit, type Candlestick } from './tact_DataStream';
import { Session } from './tact_Session';
import { SubscriptionBatch, type SBInfo, type SubscriptionInfo } from './tact_SubscriptionBatch';

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
