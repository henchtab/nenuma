import { DATA_STREAM_STORAGE_KEY, SUBSCRIPTION_BATCHES_STORAGE_KEY } from '$lib/constants';
import { Address, OpenedContract, type TonClient4 } from '@ton/ton';
import { SubscriptionBatch } from 'nenuma-contracts';
import type { OpenContract } from '.';
import { loadData, type AddressData } from './utils';

export default class SubscriptionBatchWrapper implements OpenContract<SubscriptionBatch> {
  private readonly publicClient: TonClient4;
  private readonly batchId: bigint;

  private streamAddress?: Address;
  private subscriptionBatch?: OpenedContract<SubscriptionBatch>;

  constructor(publicClient: TonClient4, batchId: bigint) {
    this.publicClient = publicClient;
    this.batchId = batchId;

    const streamAddress = loadData<AddressData>(DATA_STREAM_STORAGE_KEY)?.address;

    if (streamAddress) {
      this.streamAddress = Address.parse(streamAddress);
    }

    this.saveSubscriptionBatch();
  }

  // FIXME: If a batch is not deployed, we still save it address in the local storage
  // Ideally, we should save the batch only after it is deployed
  async saveSubscriptionBatch() {
    if (!this.streamAddress) {
      return;
    }

    const newSubscriptionBatch = await SubscriptionBatch.fromInit(this.streamAddress, this.batchId);

    const existingBatches = loadData<AddressData[]>(SUBSCRIPTION_BATCHES_STORAGE_KEY) || [];
    const existingBatch = existingBatches.findIndex(
      (batch) => batch.address === newSubscriptionBatch.address.toString()
    );

    if (existingBatch === -1) {
      existingBatches.push({
        address: newSubscriptionBatch.address.toString(),
        timestamp: Date.now()
      });
      localStorage.setItem(SUBSCRIPTION_BATCHES_STORAGE_KEY, JSON.stringify(existingBatches));
    }
  }

  async getOpenedContract() {
    if (this.subscriptionBatch) {
      return this.subscriptionBatch;
    }

    if (!this.streamAddress) {
      throw new Error('No stream address found. Did you deploy the data stream?');
    }

    const subscriptionBatch = await SubscriptionBatch.fromInit(this.streamAddress, this.batchId);

    const openedContract = this.publicClient.open(subscriptionBatch);

    this.subscriptionBatch = openedContract;
    return openedContract;
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
