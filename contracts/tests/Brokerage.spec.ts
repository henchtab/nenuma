import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import { Builder, toNano } from "@ton/core";
import { Brokerage, storeBRGDeploySuccess } from "../wrappers/Brokerage";
import "@ton/test-utils";
import { formatCoins, ShrekLogger } from "./utils";
import { DataStream } from "../wrappers/DataStream";
import { Broker } from "../wrappers/Broker";

describe("Brokerage", () => {
  const DST_DEPLOY_DEPOSIT = toNano(0.06);

  let blockchain: Blockchain;
  let logger: ShrekLogger;

  let owner: SandboxContract<TreasuryContract>;
  let brokerage: SandboxContract<Brokerage>;

  let publisher: SandboxContract<TreasuryContract>;
  let stream: SandboxContract<DataStream>;

  let alice: SandboxContract<TreasuryContract>;
  let bob: SandboxContract<TreasuryContract>;

  beforeAll(async () => {
    blockchain = await Blockchain.create();
    logger = new ShrekLogger();

    owner = await blockchain.treasury("owner");
    logger.addContract(owner, "Owner");

    publisher = await blockchain.treasury("publisher");
    logger.addContract(publisher, "Publisher");

    alice = await blockchain.treasury("alice");
    logger.addContract(alice, "Alice");

    bob = await blockchain.treasury("bob");
    logger.addContract(bob, "Bob");

    stream = blockchain.openContract(
      await DataStream.fromInit(publisher.address, "candlestick.1.BTCUSDT"),
    );
    logger.addContract(stream, "Data Stream");

    const DSTDeployResult = await stream.send(
      publisher.getSender(),
      {
        value: DST_DEPLOY_DEPOSIT,
      },
      {
        $$type: "DSTDeploy",
        queryId: 0n,
      },
    );
    logger.logTransactions(DSTDeployResult.transactions);

    expect(DSTDeployResult.transactions).toHaveTransaction({
      from: publisher.address,
      to: stream.address,
      deploy: true,
      success: true,
      exitCode: 0,
    });

    expect(await stream.getBalance()).toBe(await stream.getStorageReserve());
  });

  it("(1) Should deploy a brokerage", async () => {
    brokerage = blockchain.openContract(
      await Brokerage.fromInit(owner.address),
    );
    logger.addContract(brokerage, "Brokerage"); // Step 3

    const BRGDeploy = await brokerage.send(
      owner.getSender(),
      {
        value: toNano("70.00"),
      },
      {
        $$type: "BRGDeploy",
        queryId: 0n,
      },
    );
    logger.logTransactions(BRGDeploy.transactions); // Step 4

    expect(BRGDeploy.transactions).toHaveTransaction({
      from: owner.address,
      to: brokerage.address,
      deploy: true,
      success: true,
      exitCode: 0,
    });
  });

  it("(2) Should deploy a broker", async () => {
    const BRGDeployBroker = await brokerage.send(
      owner.getSender(),
      {
        value: toNano("100.00"),
      },
      {
        $$type: "BRGDeployBroker",
        queryId: 0n,
        stream: stream.address,
      },
    );
    logger.logTransactions(BRGDeployBroker.transactions, "Broker Deploy");

    expect(BRGDeployBroker.transactions).toHaveTransaction({
      from: brokerage.address,
      deploy: true,
      success: true,
      exitCode: 0,
    });
  });

  it("(3) Should deposit 100 Toncoins to the broker; should withdraw all Toncoins from the broker; should deposit 100 Toncoins to the broker again", async () => {
    const brokerAddress = await brokerage.getBroker(stream.address);
    const broker = blockchain.openContract(Broker.fromAddress(brokerAddress));
    logger.addContract(broker, "Broker");

    expect(await broker.getBalance()).toBe(await broker.getStorageReserve());

    const BRKDeposit = await broker.send(
      owner.getSender(),
      {
        value: toNano("100.00"),
      },
      {
        $$type: "BRKDeposit",
        queryId: 0n,
      },
    );
    logger.logTransactions(BRKDeposit.transactions, "Broker Deposit");

    expect(BRKDeposit.transactions).toHaveTransaction({
      from: owner.address,
      to: broker.address,
      success: true,
      exitCode: 0,
    });

    expect(await broker.getBalance()).toBeLessThanOrEqual(
      (await broker.getStorageReserve()) + toNano("100.00") -
        (await broker.getDepositDeposit()),
    );

    const BRKWithdraw = await broker.send(
      owner.getSender(),
      {
        value: toNano("50.00"),
      },
      {
        $$type: "BRKWithdraw",
        queryId: 1n,
      },
    );
    logger.logTransactions(BRKWithdraw.transactions, "Broker Withdraw");

    expect(BRKWithdraw.transactions).toHaveTransaction({
      from: owner.address,
      to: broker.address,
      success: true,
      exitCode: 0,
    });

    expect(await broker.getBalance()).toBe(await broker.getStorageReserve());

    const BRKDeposit2 = await broker.send(
      owner.getSender(),
      {
        value: toNano("100.00"),
      },
      {
        $$type: "BRKDeposit",
        queryId: 2n,
      },
    );
    logger.logTransactions(BRKDeposit2.transactions, "Broker Deposit 2");

    expect(BRKDeposit2.transactions).toHaveTransaction({
      from: owner.address,
      to: broker.address,
      success: true,
      exitCode: 0,
    });

    expect(await broker.getBalance()).toBeLessThanOrEqual(
      (await broker.getStorageReserve()) + toNano("100.00") -
        (await broker.getDepositDeposit()),
    );
  });

  it("(4) Should deploy a brokerage account", async () => {
    const BRGDeployAccount = await brokerage.send(
      alice.getSender(),
      {
        value: toNano("100.00"),
      },
      {
        $$type: "BRGDeployAccount",
        queryId: 0n,
      },
    );

    const accountAddress = await brokerage.getAccount(alice.address);
    const brokerageAccount = blockchain.openContract(
      Brokerage.fromAddress(accountAddress),
    );
    logger.addContract(brokerageAccount, "Brokerage Account");

    expect(BRGDeployAccount.transactions).toHaveTransaction({
      from: brokerage.address,
      deploy: true,
      success: true,
      exitCode: 0,
    });

    logger.logTransactions(BRGDeployAccount.transactions, "Account Deploy");
  });
});
