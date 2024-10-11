import {
  DATA_STREAM_STORAGE_KEY,
  SESSION_STORAGE_KEY,
  SES_SUBSCRIBE_DEPOSIT,
} from "$lib/constants";
import { getValidUntil } from "$lib/utils";
import { Address, beginCell, type TonClient4 } from "@ton/ton";
import { CHAIN, type TonConnectUI } from "@tonconnect/ui";
import { Session, storeSESDestroy, storeSESSubscribe, storeSESUnsubscribe } from "nenuma-contracts";
import type { OpenContract } from ".";
import { loadData, saveContractAddress, type AddressData } from "./utils";

export default class SessionWrapper implements OpenContract<Session> {
  private readonly publicClient: TonClient4;
  private readonly tonConnectUI: TonConnectUI;

  private readonly subscriberAddress: string;

  constructor(publicClient: TonClient4, tonConnectUI: TonConnectUI, subscriberAddress: string) {
    this.publicClient = publicClient;
    this.tonConnectUI = tonConnectUI;

    this.subscriberAddress = subscriberAddress;
  }

  async getOpenedContract() {
    const streamAddress = loadData<AddressData>(DATA_STREAM_STORAGE_KEY)?.address;

    if (!streamAddress) {
      throw new Error("No stream address found. Did you deploy the data stream?");
    }

    const sessionAddress = loadData<AddressData>(SESSION_STORAGE_KEY)?.address;
    let session: Session;

    if (sessionAddress) {
      session = Session.fromAddress(Address.parse(sessionAddress));
    } else {
      session = await Session.fromInit(
        Address.parse(streamAddress),
        Address.parse(this.subscriberAddress),
      );
      saveContractAddress(session, SESSION_STORAGE_KEY);
    }

    return this.publicClient.open(session);
  }

  async subscribe(args: { queryId: bigint; notificationsCount: bigint }) {
    const contract = await this.getOpenedContract();

    const message = {
      address: contract.address.toString(),
      amount: SES_SUBSCRIBE_DEPOSIT.toString(),
      payload: beginCell()
        .store(
          storeSESSubscribe({
            $$type: "SESSubscribe",
            notificationsCount: args.notificationsCount,
            queryId: args.queryId,
          }),
        )
        .endCell()
        .toBoc()
        .toString("base64"),
    };

    await this.tonConnectUI.sendTransaction({
      validUntil: getValidUntil(),
      messages: [message],
      network: CHAIN.TESTNET,
    });

    return this;
  }

  async unsubscribe(args: { queryId: bigint }) {
    const contract = await this.getOpenedContract();

    const message = {
      address: contract.address.toString(),
      amount: SES_SUBSCRIBE_DEPOSIT.toString(),
      payload: beginCell()
        .store(
          storeSESUnsubscribe({
            $$type: "SESUnsubscribe",
            queryId: args.queryId,
          }),
        )
        .endCell()
        .toBoc()
        .toString("base64"),
    };

    await this.tonConnectUI.sendTransaction({
      validUntil: getValidUntil(),
      messages: [message],
      network: CHAIN.TESTNET,
    });

    return this;
  }

  async destroy(args: { queryId: bigint }) {
    const contract = await this.getOpenedContract();

    const message = {
      address: contract.address.toString(),
      amount: "0",
      payload: beginCell()
        .store(
          storeSESDestroy({
            $$type: "SESDestroy",
            queryId: args.queryId,
          }),
        )
        .endCell()
        .toBoc()
        .toString("base64"),
    };

    await this.tonConnectUI.sendTransaction({
      validUntil: getValidUntil(),
      messages: [message],
      network: CHAIN.TESTNET,
    });

    return this;
  }

  async getBalance() {
    return (await this.getOpenedContract()).getBalance();
  }

  async getStreamAddress() {
    return (await this.getOpenedContract()).getStreamAddress();
  }

  async getSubscriberAddress() {
    return (await this.getOpenedContract()).getSubscriberAddress();
  }

  async getBatchAddress() {
    return (await this.getOpenedContract()).getBatchAddress();
  }
}
