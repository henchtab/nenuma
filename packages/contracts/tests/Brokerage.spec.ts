import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import { Builder, toNano } from "@ton/core";
import { Brokerage, storeBRGDeploySuccess } from "../wrappers/Brokerage";
import "@ton/test-utils";
import { DataStream } from "../wrappers/DataStream";
import { Broker } from "../wrappers/Broker";

import { Logger } from "@henchtab/shrek";

describe("Brokerage", () => {
  // Constant for DataStream deployment deposit
  const DST_DEPLOY_DEPOSIT = toNano(0.06);

  let blockchain: Blockchain;
  let logger: Logger;

  let owner: SandboxContract<TreasuryContract>;
  let brokerage: SandboxContract<Brokerage>;
  let publisher: SandboxContract<TreasuryContract>;
  let stream: SandboxContract<DataStream>;
  let alice: SandboxContract<TreasuryContract>;
  let bob: SandboxContract<TreasuryContract>;

  // Setup the blockchain environment and initial contracts
  beforeAll(async () => {
    blockchain = await Blockchain.create();
    logger = new Logger(blockchain);

    // Initialize treasury contracts for different roles
    owner = await blockchain.treasury("owner");
    logger.addContract(owner, "Owner");

    publisher = await blockchain.treasury("publisher");
    logger.addContract(publisher, "Publisher");

    alice = await blockchain.treasury("alice");
    logger.addContract(alice, "Alice");

    bob = await blockchain.treasury("bob");
    logger.addContract(bob, "Bob");

    // Open and deploy the DataStream contract
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
    await logger.logTransactions(DSTDeployResult.transactions);

    // Verify the DataStream deployment
    expect(DSTDeployResult.transactions).toHaveTransaction({
      from: publisher.address,
      to: stream.address,
      deploy: true,
      success: true,
      exitCode: 0,
    });

    // Ensure the stream's balance matches its storage reserve
    expect(await stream.getBalance()).toBe(await stream.getStorageReserve());
  });

  // Test case for deploying a brokerage
  it("Should deploy a brokerage", async () => {
    brokerage = blockchain.openContract(
      await Brokerage.fromInit(owner.address),
    );
    logger.addContract(brokerage, "Brokerage");

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
    await logger.logTransactions(BRGDeploy.transactions);

    // Verify the Brokerage deployment
    expect(BRGDeploy.transactions).toHaveTransaction({
      from: owner.address,
      to: brokerage.address,
      deploy: true,
      success: true,
      exitCode: 0,
    });
  });

  // Test case for deploying a broker
  it("Should deploy a broker", async () => {
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
    await logger.logTransactions(BRGDeployBroker.transactions, "Broker Deploy");

    // Verify the Broker deployment
    expect(BRGDeployBroker.transactions).toHaveTransaction({
      from: brokerage.address,
      deploy: true,
      success: true,
      exitCode: 0,
    });
  });

  // Test case for handling broker deposits and withdrawals
  it("Should handle broker deposits and withdrawals", async () => {
    const brokerAddress = await brokerage.getBroker(stream.address);
    const broker = blockchain.openContract(Broker.fromAddress(brokerAddress));
    logger.addContract(broker, "Broker");

    // Verify initial broker balance
    expect(await broker.getBalance()).toBe(await broker.getStorageReserve());

    // Perform a deposit to the broker
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
    await logger.logTransactions(BRKDeposit.transactions, "Broker Deposit");

    // Verify the deposit transaction
    expect(BRKDeposit.transactions).toHaveTransaction({
      from: owner.address,
      to: broker.address,
      success: true,
      exitCode: 0,
    });

    // Check broker balance after deposit
    expect(await broker.getBalance()).toBeLessThanOrEqual(
      (await broker.getStorageReserve()) + toNano("100.00") -
        (await broker.getDepositDeposit()),
    );

    // Perform a withdrawal from the broker
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
    await logger.logTransactions(BRKWithdraw.transactions, "Broker Withdraw");

    // Verify the withdrawal transaction
    expect(BRKWithdraw.transactions).toHaveTransaction({
      from: owner.address,
      to: broker.address,
      success: true,
      exitCode: 0,
    });

    // Ensure broker balance is back to storage reserve after withdrawal
    expect(await broker.getBalance()).toBe(await broker.getStorageReserve());

    // Perform another deposit to the broker
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
    await logger.logTransactions(BRKDeposit2.transactions, "Broker Deposit 2");

    // Verify the second deposit transaction
    expect(BRKDeposit2.transactions).toHaveTransaction({
      from: owner.address,
      to: broker.address,
      success: true,
      exitCode: 0,
    });

    // Check broker balance after second deposit
    expect(await broker.getBalance()).toBeLessThanOrEqual(
      (await broker.getStorageReserve()) + toNano("100.00") -
        (await broker.getDepositDeposit()),
    );
  });

  // Test case for deploying a brokerage account
  it("Should deploy a brokerage account", async () => {
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

    // Verify the Brokerage Account deployment
    expect(BRGDeployAccount.transactions).toHaveTransaction({
      from: brokerage.address,
      deploy: true,
      success: true,
      exitCode: 0,
    });

    await logger.logTransactions(
      BRGDeployAccount.transactions,
      "Account Deploy",
    );
  });
});
