import {
  SimpleSubscriber,
  NOTIFICATION_DEPOSIT,
  NOTIFICATION_PREMIUM,
  storeSimpleSubscriberDeploy,
  storeSubscriberCheckTimeout
} from 'nenuma-contracts';
import type { OpenContract } from '.';
import { Address, beginCell, toNano, type TonClient4 } from '@ton/ton';
import { CHAIN, type TonConnectUI } from '@tonconnect/ui';
import { loadData, saveContractAddress } from './utils';
import { SIMPLE_SUBSCRIBER_STORAGE_KEY, TON_VALID_UNTIL } from '../constants';

export default class SimpleSubscriberWrapper implements OpenContract<SimpleSubscriber> {
  private readonly publicClient: TonClient4;
  private readonly tonConnectUI: TonConnectUI;

  private readonly simpleSubscriberAddress?: string;

  constructor(
    publicClient: TonClient4,
    tonConnectUI: TonConnectUI,
    simpleSubscriberAddress?: string
  ) {
    this.publicClient = publicClient;
    this.tonConnectUI = tonConnectUI;

    if (simpleSubscriberAddress) {
      this.simpleSubscriberAddress = simpleSubscriberAddress;
      saveContractAddress(simpleSubscriberAddress, SIMPLE_SUBSCRIBER_STORAGE_KEY);
    }
  }

  getOpenedContract() {
    let contractAddress = this.simpleSubscriberAddress;

    if (!contractAddress) {
      contractAddress = loadData(SIMPLE_SUBSCRIBER_STORAGE_KEY)?.address;

      if (!contractAddress) {
        throw new Error(
          'No simple subscriber address found. Did you deploy the simple subscriber?'
        );
      }
    }

    const contractAddressParsed = Address.parse(contractAddress);
    return this.publicClient.open(SimpleSubscriber.fromAddress(contractAddressParsed));
  }

  async deploy(args: {
    subscriberId: bigint;
    queryId: bigint;
    notificationsCount: bigint;
    stream: string;
    expiration: bigint;
  }) {
    const deployer = this.tonConnectUI.account?.address;

    if (!deployer) {
      throw new Error('No account connected. Did you connect to the wallet?');
    }

    const simpleSubscriber = await SimpleSubscriber.fromInit(
      Address.parse(deployer),
      args.subscriberId
    );

    const message = {
      address: simpleSubscriber.address.toString(),
      amount: (
        toNano(1) +
        (NOTIFICATION_DEPOSIT + NOTIFICATION_PREMIUM) * args.notificationsCount
      ).toString(),
      payload: beginCell()
        .store(
          storeSimpleSubscriberDeploy({
            $$type: 'SimpleSubscriberDeploy',
            queryId: args.queryId,
            stream: Address.parse(args.stream),
            notificationsCount: args.notificationsCount,
            expiration: args.expiration
          })
        )
        .endCell()
        .toBoc()
        .toString('base64')
    };

    await this.tonConnectUI.sendTransaction({
      validUntil: TON_VALID_UNTIL,
      messages: [message],
      network: CHAIN.TESTNET
    });

    return this;
  }

  async checkTimeout(args: { queryId: bigint }) {
    const checker = this.tonConnectUI.account?.address;

    if (!checker) {
      throw new Error('No account connected. Did you connect to the wallet?');
    }

    const contract = this.getOpenedContract();

    const message = {
      address: contract.address.toString(),
      amount: toNano(1).toString(),
      payload: beginCell()
        .store(
          storeSubscriberCheckTimeout({
            $$type: 'SubscriberCheckTimeout',
            queryId: args.queryId
          })
        )
        .endCell()
        .toBoc()
        .toString('base64')
    };

    await this.tonConnectUI.sendTransaction({
      validUntil: TON_VALID_UNTIL,
      messages: [message],
      network: CHAIN.TESTNET
    });

    return this;
  }

  async getBalance() {
    return this.getOpenedContract().getBalance();
  }

  async getDeployerAddress() {
    return this.getOpenedContract().getDeployerAddress();
  }

  async getNotificationsCount() {
    return this.getOpenedContract().getNotificationsCount();
  }

  async getExpiration() {
    return this.getOpenedContract().getExpiration();
  }

  async getStreamAddress() {
    return this.getOpenedContract().getStreamAddress();
  }

  async getSessionAddress() {
    return this.getOpenedContract().getSessionAddress();
  }

  async getLatestCandlestick() {
    return this.getOpenedContract().getLatestCandlestick();
  }
}
