import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import { toNano } from "@ton/core";
import { SimpleSubscriber } from "../wrappers/SimpleSubscriber";
import "@ton/test-utils";
import { Candlestick, DataStream } from "../wrappers/DataStream";
import { ShrekLogger } from "./utils";
import {
  ERR_TIMEOUT_NOT_EXCEEDED,
  THE_GREAT_CONJUCTION_2077,
} from "../wrappers/constants";

/**
 * Core Assessment Test Suite
 */
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

  /**
   * Sets up the blockchain and contracts before running tests.
   */
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

    stream = blockchain.openContract(
      await DataStream.fromInit(
        publisher.address,
        "candlestick.1.BTCUSDT",
      ),
    );
    logger.addContract(stream, "Data Stream");

    const dstDeployResult = await stream.send(
      publisher.getSender(),
      { value: DST_DEPLOY_DEPOSIT },
      { $$type: "DSTDeploy", queryId: 0n },
    );
    await logger.logTransactions(dstDeployResult.transactions);

    for (let index = 0; index < BATCH_LIMIT; index++) {
      const batchId = await stream.getNextBatchId();
      const batchAddress = await stream.getBatchAddress(batchId);
      logger.addContract(batchAddress, `Subscription Batch #${batchId}`);

      const dstDeployBatchResult = await stream.send(
        publisher.getSender(),
        { value: toNano("70") },
        { $$type: "DSTDeployBatch", queryId: BigInt(index) },
      );
      await logger.logTransactions(dstDeployBatchResult.transactions);
    }
  });

  /**
   * Tests deployment and behavior of Alice's Simple Subscriber.
   */
  it("(1) Deploys Alice's Simple Subscriber #1 and verifies candlestick handling and destruction", async () => {
    const aliceSubscriber = blockchain.openContract(
      await SimpleSubscriber.fromInit(alice.address, 1n),
    );
    logger.addContract(aliceSubscriber, "Alice's Simple Subscriber #1");

    const aliceSessionAddress = await stream.getSessionAddress(
      aliceSubscriber.address,
    );
    logger.addContract(aliceSessionAddress, `Alice's Subscriber #1 Session`);

    const SimpleSubscriberDeployResult = await aliceSubscriber.send(
      alice.getSender(),
      {
        value: toNano("1"),
      },
      {
        $$type: "SimpleSubscriberDeploy",
        queryId: 200n,
        stream: stream.address,
        notificationsCount: 4n,
        expiration: 100n,
      },
    );
    await logger.logTransactions(SimpleSubscriberDeployResult.transactions);

    expect(await aliceSubscriber.getExpiration()).toBe(100n);
    expect(await aliceSubscriber.getNotificationsCount()).toBe(4n);

    const expectedCandlestick1: Candlestick = {
      $$type: "Candlestick",
      start: 7n,
      end: 7n,
      open: 7n,
      close: 7n,
      high: 7n,
      low: 7n,
    };

    const DSTPublishCandlestick1Result = await stream.send(
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
    await logger.logTransactions(DSTPublishCandlestick1Result.transactions);

    expect(await aliceSubscriber.getLatestCandlestick()).toMatchObject(
      expectedCandlestick1,
    );

    const expectedCandlestick2: Candlestick = {
      $$type: "Candlestick",
      start: 8n,
      end: 8n,
      open: 8n,
      close: 8n,
      high: 8n,
      low: 8n,
    };

    const DSTPublishCandlestick2Result = await stream.send(
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
    await logger.logTransactions(DSTPublishCandlestick2Result.transactions);

    expect(await aliceSubscriber.getLatestCandlestick()).toMatchObject(
      expectedCandlestick2,
    );

    const expectedCandlestick3: Candlestick = {
      $$type: "Candlestick",
      start: 9n,
      end: 9n,
      open: 9n,
      close: 9n,
      high: 9n,
      low: 9n,
    };

    const DSTPublishCandlestick3Result = await stream.send(
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
    await logger.logTransactions(DSTPublishCandlestick3Result.transactions);

    expect(DSTPublishCandlestick3Result.transactions).toHaveTransaction({
      from: aliceSessionAddress,
      to: aliceSubscriber.address,
      success: true,
      destroyed: true,
    });

    expect(DSTPublishCandlestick3Result.transactions).toHaveTransaction({
      from: aliceSubscriber.address,
      to: alice.address,
      success: true,
    });
  });

  /**
   * Tests deployment and behavior of Bob's Simple Subscriber.
   */
  it("(2) Deploys Bob's Simple Subscriber #2 and verifies timeout handling", async () => {
    const bobSubscriber = blockchain.openContract(
      await SimpleSubscriber.fromInit(bob.address, 2n),
    );
    logger.addContract(bobSubscriber, "Bob's Simple Subscriber #2");

    const bobSessionAddress = await stream.getSessionAddress(
      bobSubscriber.address,
    );
    logger.addContract(bobSessionAddress, `Bob's Subscriber #2 Session`);

    const SimpleSubscriberDeployResult = await bobSubscriber.send(
      bob.getSender(),
      {
        value: toNano("1"),
      },
      {
        $$type: "SimpleSubscriberDeploy",
        queryId: 200n,
        stream: stream.address,
        notificationsCount: 10n,
        expiration: BigInt(THE_GREAT_CONJUCTION_2077 + 90),
      },
    );
    await logger.logTransactions(SimpleSubscriberDeployResult.transactions);

    // Check timeout before expiration
    blockchain.now = THE_GREAT_CONJUCTION_2077 + 180;

    const SubscriberCheckTimeout1Result = await bobSubscriber.send(
      carol.getSender(),
      {
        value: toNano("1"),
      },
      {
        $$type: "SubscriberCheckTimeout",
        queryId: 301n,
      },
    );
    await logger.logTransactions(SubscriberCheckTimeout1Result.transactions);

    expect(SubscriberCheckTimeout1Result.transactions).toHaveTransaction({
      from: carol.address,
      to: bobSubscriber.address,
      success: false,
      exitCode: ERR_TIMEOUT_NOT_EXCEEDED,
    });

    // Check timeout after expiration
    blockchain.now = THE_GREAT_CONJUCTION_2077 + 7200;

    const SubscriberCheckTimeout2Result = await bobSubscriber.send(
      carol.getSender(),
      {
        value: toNano("1"),
      },
      {
        $$type: "SubscriberCheckTimeout",
        queryId: 301n,
      },
    );
    await logger.logTransactions(SubscriberCheckTimeout2Result.transactions);

    expect(SubscriberCheckTimeout2Result.transactions).toHaveTransaction({
      from: carol.address,
      to: bobSubscriber.address,
      success: true,
    });

    expect(SubscriberCheckTimeout2Result.transactions).toHaveTransaction({
      from: bobSubscriber.address,
      to: carol.address,
      success: true,
    });
  });
});
