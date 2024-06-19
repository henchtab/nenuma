import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import { address, openContract, toNano } from "@ton/core";
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
  const DST_DEPLOY_DEPOSIT = toNano("20");

  let blockchain: Blockchain;
  let logger: ShrekLogger;

  let publisher: SandboxContract<TreasuryContract>;
  let stream: SandboxContract<DataStream>;

  let alice: SandboxContract<TreasuryContract>;
  let bob: SandboxContract<TreasuryContract>;
  let carol: SandboxContract<TreasuryContract>;

  beforeAll(async () => {
    blockchain = await Blockchain.create();
    logger = new ShrekLogger(blockchain);

    blockchain.now = THE_GREAT_CONJUCTION_2077;

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
    await logger.logTransactions(DSTDeployResult.transactions);

    // Deploy 3 subscription batches
    for (let index = 0; index < BATCH_LIMIT; index++) {
      const batchId = await stream.getNextBatchId();

      const batchAddress = await stream.getBatchAddress(batchId);
      logger.addContract(batchAddress, `Subscription Batch #${batchId}`);

      const DSTDeployBatchResult = await stream.send(
        publisher.getSender(),
        {
          value: toNano("70"),
        },
        {
          $$type: "DSTDeployBatch",
          queryId: BigInt(index),
        },
      );

      await logger.logTransactions(DSTDeployBatchResult.transactions);
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
        value: toNano("100"),
      },
      {
        $$type: "SUSDeploy",
        queryId: 200n,
        stream: stream.address,
        notificationsCount: 4n,
        timeout: 100n,
      },
    );
    await logger.logTransactions(DSTDeployResult.transactions);

    expect(await subscriber.getTimeout()).toBe(100n);
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
    await logger.logTransactions(DSTPublishCandlestick1.transactions);

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
    await logger.logTransactions(DSTPublishCandlestick2.transactions);

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
    await logger.logTransactions(DSTPublishCandlestick3.transactions);

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

  it("(2) Should deploy Bob's Simple Subscriber #2 (notificationsCount = 10) that does not receive SESCandlestickPublishedNotification notifications and destroys gracefully after SUBCheckTimeout is successful", async () => {
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
    const SUSDeployResult = await subscriber.send(
      bob.getSender(),
      {
        value: toNano("100"),
      },
      {
        $$type: "SUSDeploy",
        queryId: 200n,
        stream: stream.address,
        notificationsCount: 10n,
        // FIXME: this is not timeout, but expiration
        timeout: BigInt(THE_GREAT_CONJUCTION_2077 + 90),
      },
    );
    await logger.logTransactions(
      SUSDeployResult.transactions,
      "(2) SUSDeployResult",
    );

    // Check timeout before expiration
    blockchain.now = THE_GREAT_CONJUCTION_2077 + 180;

    const SUBCheckTimeout1 = await subscriber.send(
      carol.getSender(),
      {
        value: toNano("20"),
      },
      {
        $$type: "SUBCheckTimeout",
        queryId: 301n,
      },
    );
    await logger.logTransactions(
      SUBCheckTimeout1.transactions,
      "(2) SUBCheckTimeout1",
    );

    expect(SUBCheckTimeout1.transactions).toHaveTransaction({
      from: carol.address,
      to: subscriber.address,
      success: false,
      exitCode: ERR_TIMEOUT_NOT_EXCEEDED,
    });

    // Check timeout after expiration
    blockchain.now = THE_GREAT_CONJUCTION_2077 + 7200;

    const SUBCheckTimeout2 = await subscriber.send(
      carol.getSender(),
      {
        value: toNano("30"),
      },
      {
        $$type: "SUBCheckTimeout",
        queryId: 301n,
      },
    );
    await logger.logTransactions(
      SUBCheckTimeout2.transactions,
      "(2) SUBCheckTimeout2",
    );

    // FIXME: This expect may be unnecessary
    expect(SUBCheckTimeout2.transactions).toHaveTransaction({
      from: subscriber.address,
      to: carol.address,
      success: true,
    });

    expect(SUBCheckTimeout2.transactions).toHaveTransaction({
      from: subscriber.address,
      to: carol.address,
      success: true,
    });
  });
});
