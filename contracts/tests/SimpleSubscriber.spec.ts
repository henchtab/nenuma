import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import { toNano } from "@ton/core";
import { SimpleSubscriber } from "../wrappers/SimpleSubscriber";
import "@ton/test-utils";
import { Candlestick, DataStream } from "../wrappers/DataStream";
import { ShrekLogger } from "./utils";
import {
  ERR_TIMEOUT_NOT_EXCEEDED,
  NOTIFICATION_DEPOSIT,
  NOTIFICATION_PREMIUM,
  SUS_OPERATIONAL_RESERVE,
  SUS_STORAGE_RESERVE,
  THE_GREAT_CONJUCTION_2077,
} from "../wrappers/constants";

describe("Core Assessment", () => {
  const BATCH_LIMIT = 3;
  const DST_DEPLOY_DEPOSIT = toNano("0.02");

  let blockchain: Blockchain;
  let logger: ShrekLogger;

  let publisher: SandboxContract<TreasuryContract>;
  let stream: SandboxContract<DataStream>;

  let alice: SandboxContract<TreasuryContract>;
  let bob: SandboxContract<TreasuryContract>;
  let carol: SandboxContract<TreasuryContract>;

  beforeAll(async () => {
    blockchain = await Blockchain.create();
    logger = new ShrekLogger();

    publisher = await blockchain.treasury("publisher");
    logger.addContract(publisher, "Publisher");

    alice = await blockchain.treasury("alice");
    logger.addContract(alice, "Alice");

    bob = await blockchain.treasury("bob");
    logger.addContract(bob, "Bob");

    carol = await blockchain.treasury("carol");
    logger.addContract(carol, "Carol");

    // Initialize the DataStream contract and log it
    stream = blockchain.openContract(
      await DataStream.fromInit(publisher.address, "candlestick.1.BTCUSDT"),
    );
    logger.addContract(stream, "Data Stream");

    // Deploy the DataStream contract and log the transactions
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

    // Deploy 3 subscription batches
    for (let index = 0; index < BATCH_LIMIT; index++) {
      const batchId = await stream.getNextBatchId();

      const batchAddress = await stream.getBatchAddress(batchId);
      logger.addContract(batchAddress, `Subscription Batch #${batchId}`);

      const DSTDeployBatchResult = await stream.send(
        publisher.getSender(),
        {
          value: await stream.getDeployBatchDeposit(),
        },
        {
          $$type: "DSTDeployBatch",
          queryId: BigInt(index),
        },
      );
      logger.logTransactions(DSTDeployBatchResult.transactions);
    }
  });

  it("(1) Should deploy Alice's Simple Subscriber #1 (notificationsCount = 3) that gracefully destroys after receiving the 3rd candlestick", async () => {
    // Deploy a simple subscriber for Alice
    const subscriber = blockchain.openContract(
      await SimpleSubscriber.fromInit(
        alice.address,
        1n,
      ),
    );
    logger.addContract(subscriber, "Alice's Simple Subscriber #1");

    const expectedSessionAddress = await stream.getSessionAddress(
      subscriber.address,
    );
    logger.addContract(
      expectedSessionAddress,
      `Alice's Simple Subscriber #1's Session`,
    );

    // Deploy the Simple Subscriber contract and log the transactions
    const DSTDeployResult = await subscriber.send(
      alice.getSender(),
      {
        value: SUS_STORAGE_RESERVE + SUS_OPERATIONAL_RESERVE +
          (NOTIFICATION_DEPOSIT + NOTIFICATION_PREMIUM) * 4n,
      },
      {
        $$type: "SUSDeploy",
        queryId: 200n,
        stream: stream.address,
        notificationsCount: 4n,
        expiresAt: 100n,
      },
    );
    logger.logTransactions(DSTDeployResult.transactions);

    expect(await subscriber.getExpiresAt()).toBe(100n);
    expect(await subscriber.getNotificationsCount()).toBe(4n);

    // Publish and verify the 1st candlestick
    const expectedCandlestick1: Candlestick = {
      $$type: "Candlestick",
      start: 7n,
      end: 7n,
      open: 7n,
      close: 7n,
      high: 7n,
      low: 7n,
    };

    const DSTPublishCandlestick1 = await stream.send(
      publisher.getSender(),
      {
        value: await stream.getPublishCandlestickDeposit(),
      },
      {
        $$type: "DSTPublishCandlestick",
        queryId: 301n,
        candlestick: expectedCandlestick1,
      },
    );
    logger.logTransactions(DSTPublishCandlestick1.transactions);

    expect(await subscriber.getLatestCandlestick()).toMatchObject(
      expectedCandlestick1,
    );

    // Publish and verify the 2nd candlestick
    const expectedCandlestick2: Candlestick = {
      $$type: "Candlestick",
      start: 8n,
      end: 8n,
      open: 8n,
      close: 8n,
      high: 8n,
      low: 8n,
    };

    const DSTPublishCandlestick2 = await stream.send(
      publisher.getSender(),
      {
        value: await stream.getPublishCandlestickDeposit(),
      },
      {
        $$type: "DSTPublishCandlestick",
        queryId: 302n,
        candlestick: expectedCandlestick2,
      },
    );
    logger.logTransactions(DSTPublishCandlestick2.transactions);

    expect(await subscriber.getLatestCandlestick()).toMatchObject(
      expectedCandlestick2,
    );

    // Publish and verify the 3rd candlestick, and check for the destruction of the subscriber
    const expectedCandlestick3: Candlestick = {
      $$type: "Candlestick",
      start: 9n,
      end: 9n,
      open: 9n,
      close: 9n,
      high: 9n,
      low: 9n,
    };

    const DSTPublishCandlestick3 = await stream.send(
      publisher.getSender(),
      {
        value: await stream.getPublishCandlestickDeposit(),
      },
      {
        $$type: "DSTPublishCandlestick",
        queryId: 303n,
        candlestick: expectedCandlestick3,
      },
    );
    logger.logTransactions(DSTPublishCandlestick3.transactions);

    expect(DSTPublishCandlestick3.transactions).toHaveTransaction({
      from: expectedSessionAddress,
      to: subscriber.address,
      success: true,
      destroyed: true,
    });

    expect(DSTPublishCandlestick3.transactions).toHaveTransaction({
      from: subscriber.address,
      to: alice.address,
      success: true,
    });
  });

  it("(2) Should deploy Bob's Simple Subscriber #2 (notificationsCount = 10) that does not receive SESCandlestickPublishedNotification notifications and destroys gracefully after SUSCheckTimeout is successful", async () => {
    // Deploy a simple subscriber for Bob
    const subscriber = blockchain.openContract(
      await SimpleSubscriber.fromInit(
        bob.address,
        2n,
      ),
    );
    logger.addContract(subscriber, "Bob's Simple Subscriber #2");

    const expectedSessionAddress = await stream.getSessionAddress(
      subscriber.address,
    );
    logger.addContract(
      expectedSessionAddress,
      `Bob's Simple Subscriber #2's Session`,
    );

    // Deploy the Simple Subscriber contract and log the transactions
    const DSTDeployResult = await subscriber.send(
      publisher.getSender(),
      {
        value: SUS_STORAGE_RESERVE + SUS_OPERATIONAL_RESERVE +
          (NOTIFICATION_DEPOSIT + NOTIFICATION_PREMIUM) * 10n,
      },
      {
        $$type: "SUSDeploy",
        queryId: 200n,
        stream: stream.address,
        notificationsCount: 10n,
        expiresAt: BigInt(THE_GREAT_CONJUCTION_2077 + 90),
      },
    );
    logger.logTransactions(DSTDeployResult.transactions, "(2) DSTDeployResult");

    // Check timeout before expiration
    blockchain.now = THE_GREAT_CONJUCTION_2077 + 60;

    const SUSCheckTimeout1 = await subscriber.send(
      carol.getSender(),
      {
        value: toNano("1"),
      },
      {
        $$type: "SUSCheckTimeout",
        queryId: 301n,
      },
    );
    logger.logTransactions(
      SUSCheckTimeout1.transactions,
      "(2) SUSCheckTimeout1",
    );

    expect(SUSCheckTimeout1.transactions).toHaveTransaction({
      from: carol.address,
      to: subscriber.address,
      success: false,
      exitCode: ERR_TIMEOUT_NOT_EXCEEDED,
    });

    // Check timeout after expiration
    blockchain.now = THE_GREAT_CONJUCTION_2077 + 7200;

    const SUSCheckTimeout2 = await subscriber.send(
      carol.getSender(),
      {
        value: toNano("1"),
      },
      {
        $$type: "SUSCheckTimeout",
        queryId: 301n,
      },
    );
    logger.logTransactions(
      SUSCheckTimeout2.transactions,
      "(2) SUSCheckTimeout2",
    );

    expect(SUSCheckTimeout2.transactions).toHaveTransaction({
      from: carol.address,
      to: subscriber.address,
      success: true,
    });

    expect(SUSCheckTimeout2.transactions).toHaveTransaction({
      from: subscriber.address,
      to: carol.address,
      value: toNano("1"),
      success: true,
    });
  });
});
