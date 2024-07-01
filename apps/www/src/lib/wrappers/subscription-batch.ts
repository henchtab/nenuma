import { Address, type TonClient4 } from '@ton/ton';
import { SubscriptionBatch } from 'nenuma-contracts';
import type { OpenContract } from '.';
import { DATA_STREAM_STORAGE_KEY, SUBSCRIPTION_BATCHES_STORAGE_KEY } from '../constants';
import { loadData, type AddressData } from './utils';

export default class SubscriptionBatchWrapper implements OpenContract<SubscriptionBatch> {
  private readonly publicClient: TonClient4;
  private readonly batchId: bigint;

  constructor(publicClient: TonClient4, batchId: bigint) {
    this.publicClient = publicClient;
    this.batchId = batchId;
  }

  async getOpenedContract() {
    const streamAddress = loadData<AddressData>(DATA_STREAM_STORAGE_KEY)?.address;

    if (!streamAddress) {
      throw new Error('No stream address found. Did you deploy the data stream?');
    }

    const subscriptionBatch = await SubscriptionBatch.fromInit(
      Address.parse(streamAddress),
      this.batchId
    );

    const batches = loadData<AddressData[]>(SUBSCRIPTION_BATCHES_STORAGE_KEY) || [];

    if (
      batches.findIndex(
        (batch) =>
          batch.address ===
          subscriptionBatch.address.toString({ testOnly: true, bounceable: false })
      ) !== -1
    ) {
      batches.push({
        address: subscriptionBatch.address.toString({ testOnly: true, bounceable: false }),
        timestamp: Date.now()
      });
      localStorage.setItem(SUBSCRIPTION_BATCHES_STORAGE_KEY, JSON.stringify(batches));
    }

    return this.publicClient.open(subscriptionBatch);
  }

  async getBalance() {
    return (await this.getOpenedContract()).getBalance();
  }

  async getStreamAddress() {
    return (await this.getOpenedContract()).getStreamAddress();
  }

  async getBatchId() {
    return (await this.getOpenedContract()).getBatchId();
  }

  async getSubscriptions() {
    return (await this.getOpenedContract()).getSubscriptions();
  }

  async getSubscriptionsCount() {
    return (await this.getOpenedContract()).getSubscriptionsCount();
  }
}
