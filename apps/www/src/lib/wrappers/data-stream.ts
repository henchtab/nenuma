import {
  DATA_STREAM_STORAGE_KEY,
  DST_DEPLOY_BATCH_DEPOSIT,
  DST_DEPLOY_DEPOSIT,
  DST_DEPLOY_SESSION_DEPOSIT,
  DST_PUBLISH_CANDLESTICK_DEPOSIT
} from '$lib/constants';
import { getValidUntil } from '$lib/utils';
import { Address, beginCell, type TonClient4 } from '@ton/ton';
import { CHAIN, type TonConnectUI } from '@tonconnect/ui';
import {
  type Candlestick,
  DataStream,
  storeDSTDeploy,
  storeDSTDeployBatch,
  storeDSTDeploySession,
  storeDSTPublishCandlestick,
  storeStateInit
} from 'nenuma-contracts';
import { OpenContract } from '.';
import { loadData, saveContractAddress } from './utils';

export default class DataStreamWrapper implements OpenContract<DataStream> {
  private readonly publicClient: TonClient4;
  private readonly tonConnectUI: TonConnectUI;

  private streamAddress?: string;

  constructor(publicClient: TonClient4, tonConnectUI: TonConnectUI, streamAddress?: string) {
    this.publicClient = publicClient;
    this.tonConnectUI = tonConnectUI;

    if (streamAddress) {
      this.streamAddress = streamAddress;
      saveContractAddress(streamAddress, DATA_STREAM_STORAGE_KEY);
    }
  }

  getOpenedContract() {
    let contractAddress = this.streamAddress;

    if (!contractAddress) {
      contractAddress = loadData(DATA_STREAM_STORAGE_KEY)?.address;

      if (!contractAddress) {
        throw new Error('No stream address found. Did you deploy the data stream?');
      }
    }

    const contractAddressParsed = Address.parse(contractAddress);
    return this.publicClient.open(DataStream.fromAddress(contractAddressParsed));
  }

  async deploy(args: { topic: string; queryId: bigint }) {
    const publisher = this.tonConnectUI.account?.address;

    if (!publisher) {
      throw new Error('No account connected. Did you connect to the wallet?');
    }

    const stream = this.publicClient.open(
      await DataStream.fromInit(Address.parse(publisher), args.topic)
    );

    const message = {
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
    };

    await this.tonConnectUI.sendTransaction({
      validUntil: Math.floor(Date.now() / 1000) + 360,
      messages: [message],
      network: CHAIN.TESTNET
    });

    this.streamAddress = stream.address.toString();
    saveContractAddress(stream, DATA_STREAM_STORAGE_KEY);

    return this;
  }

  async deploySubscriptionBatch(args: { queryId: bigint }) {
    const stream = this.getOpenedContract();

    const message = {
      address: stream.address.toString(),
      amount: DST_DEPLOY_BATCH_DEPOSIT.toString(),
      payload: beginCell()
        .store(
          storeDSTDeployBatch({
            $$type: 'DSTDeployBatch',
            queryId: args.queryId
          })
        )
        .endCell()
        .toBoc()
        .toString('base64')
    };

    // Using `sendTransaction` from `TonConnectUI` because it gives us the boc of the transaction
    // Later will be used to wait for the transaction to be confirmed
    await this.tonConnectUI.sendTransaction({
      validUntil: getValidUntil(),
      messages: [message],
      network: CHAIN.TESTNET
    });

    return this;
  }

  async deploySession(args: { queryId: bigint }) {
    const stream = this.getOpenedContract();

    const message = {
      address: stream.address.toString(),
      amount: DST_DEPLOY_SESSION_DEPOSIT.toString(),
      payload: beginCell()
        .store(
          storeDSTDeploySession({
            $$type: 'DSTDeploySession',
            queryId: args.queryId
          })
        )
        .endCell()
        .toBoc()
        .toString('base64')
    };

    await this.tonConnectUI.sendTransaction({
      validUntil: getValidUntil(),
      messages: [message],
      network: CHAIN.TESTNET
    });

    return this;
  }

  async publishCandlestick(args: { queryId: bigint; candlestick: Omit<Candlestick, '$$type'> }) {
    const stream = this.getOpenedContract();

    const message = {
      address: stream.address.toString(),
      amount: DST_PUBLISH_CANDLESTICK_DEPOSIT.toString(),
      payload: beginCell()
        .store(
          storeDSTPublishCandlestick({
            $$type: 'DSTPublishCandlestick',
            queryId: args.queryId,
            candlestick: {
              $$type: 'Candlestick',
              ...args.candlestick
            }
          })
        )
        .endCell()
        .toBoc()
        .toString('base64')
    };

    await this.tonConnectUI.sendTransaction({
      validUntil: getValidUntil(),
      messages: [message],
      network: CHAIN.TESTNET
    });

    return this;
  }

  async getBalance() {
    return await this.getOpenedContract().getBalance();
  }

  async getPublisherAddress() {
    return (await this.getOpenedContract().getPublisherAddress()).toString({
      testOnly: true,
      bounceable: false
    });
  }

  async getTopic() {
    return await this.getOpenedContract().getTopic();
  }

  async getBatches() {
    return await this.getOpenedContract().getBatches();
  }

  async getNextBatchId() {
    return await this.getOpenedContract().getNextBatchId();
  }

  async getBatchAddress(batchId: bigint) {
    return (await this.getOpenedContract().getBatchAddress(batchId)).toString({
      testOnly: true,
      bounceable: false
    });
  }

  async getSessionAddress(subscriberAddress: Address) {
    return (await this.getOpenedContract().getSessionAddress(subscriberAddress)).toString({
      testOnly: true,
      bounceable: false
    });
  }
}
