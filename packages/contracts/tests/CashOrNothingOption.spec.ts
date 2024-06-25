import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import { toNano } from "@ton/core";
import "@ton/test-utils";
import { Candlestick, DataStream } from "../wrappers/DataStream";
import { ShrekLogger } from "./utils";
import {
  DAY,
  ERR_TIMEOUT_NOT_EXCEEDED,
  THE_GREAT_CONJUCTION_2077,
} from "../wrappers/constants";
import {
  CashOrNothingOption,
  CashOrNothingOptionAgreement,
  CashOrNothingOptionType,
} from "../wrappers/CashOrNothingOption";
import { SUBSCRIBER_TIMEOUT } from "../wrappers/SimpleSubscriber.compile";

/**
 * Tests related to Core Assessment using Cash-or-Nothing options and DataStream contracts.
 */
describe("Core Assessment", () => {
  const BATCH_LIMIT = 3;
  const DST_DEPLOY_DEPOSIT = toNano("20");

  let blockchain: Blockchain;
  let logger: ShrekLogger;

  let publisher: SandboxContract<TreasuryContract>;
  let stream: SandboxContract<DataStream>;

  let broker: SandboxContract<TreasuryContract>;

  let alice: SandboxContract<TreasuryContract>;
  let bob: SandboxContract<TreasuryContract>;
  let carol: SandboxContract<TreasuryContract>;

  /**
   * Set up contracts and initial conditions before each test case.
   */
  beforeAll(async () => {
    blockchain = await Blockchain.create();
    logger = new ShrekLogger(blockchain);

    blockchain.now = THE_GREAT_CONJUCTION_2077;

    publisher = await blockchain.treasury("publisher");
    logger.addContract(publisher, "Publisher");

    broker = await blockchain.treasury("broker");
    logger.addContract(broker, "Broker");

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

  /**
   * Test case to deploy Broker's Option #1 and ensure graceful destruction after successful SUBCheckTimeout.
   */
  it("(1) Should deploy Broker's Option #1 and destroy gracefully after SUBCheckTimeout is successful", async () => {
    blockchain.now = THE_GREAT_CONJUCTION_2077;

    // Deploy Cash-or-Nothing option for Alice and Bob by Broker
    const option = blockchain.openContract(
      await CashOrNothingOption.fromInit(broker.address, 21n),
    );
    logger.addContract(option, "Broker's Option #1");

    const expectedSessionAddress = await stream.getSessionAddress(
      option.address,
    );
    logger.addContract(expectedSessionAddress, `Broker's Option #1's Session`);

    const agreement: CashOrNothingOptionAgreement = {
      $$type: "CashOrNothingOptionAgreement",
      holder: alice.address,
      writer: bob.address,
      initiation: BigInt(THE_GREAT_CONJUCTION_2077 + 120 + 59),
      expiration: BigInt(THE_GREAT_CONJUCTION_2077 + 720 + 59),
      optionType: CashOrNothingOptionType.Call,
      investment: toNano("10"),
      payout: toNano("7.4"),
    };

    // Deploy the Cash-or-Nothing Option contract and log transactions
    const CNODeployResult = await option.send(broker.getSender(), {
      value: toNano("10") + toNano("7.4") + toNano("1"),
    }, {
      $$type: "CashOrNothingOptionDeploy",
      queryId: 300n,
      stream: stream.address,
      agreement,
    });
    await logger.logTransactions(CNODeployResult.transactions);

    // Verify expiration and notifications count
    expect(await option.getExpiration()).toBe(
      BigInt(THE_GREAT_CONJUCTION_2077 + 720 + 59),
    );
    expect(await option.getNotificationsCount()).toBe(14n);

    await logger.logContracts();

    // Check SUBCheckTimeout before expiration
    blockchain.now = THE_GREAT_CONJUCTION_2077 + 180;

    const SUBCheckTimeout1 = await option.send(carol.getSender(), {
      value: toNano("20"),
    }, {
      $$type: "SubscriberCheckTimeout",
      queryId: 301n,
    });
    await logger.logTransactions(
      SUBCheckTimeout1.transactions,
      "(2) SUBCheckTimeout1",
    );

    // Verify SUBCheckTimeout behavior
    expect(SUBCheckTimeout1.transactions).toHaveTransaction({
      from: carol.address,
      to: option.address,
      success: false,
      exitCode: ERR_TIMEOUT_NOT_EXCEEDED,
    });

    // Check SUBCheckTimeout after expiration
    blockchain.now = THE_GREAT_CONJUCTION_2077 + 720 + SUBSCRIBER_TIMEOUT + 60;

    const SUBCheckTimeout2 = await option.send(carol.getSender(), {
      value: toNano("30"),
    }, {
      $$type: "SubscriberCheckTimeout",
      queryId: 301n,
    });
    await logger.logTransactions(
      SUBCheckTimeout2.transactions,
      "(2) SUBCheckTimeout2",
    );

    // Verify SUBCheckTimeout behavior post-expiration
    expect(SUBCheckTimeout2.transactions).toHaveTransaction({
      from: carol.address,
      to: option.address,
      success: true,
    });

    expect(SUBCheckTimeout2.transactions).toHaveTransaction({
      from: option.address,
      to: carol.address,
      success: true,
    });
  });

  /**
   * Test case to deploy Broker's Option #2 and settle in the money after the 12th candlestick is published.
   */
  it("(2) Should deploy Broker's Option #2 and settle in the money after the 12th candlestick is published", async () => {
    blockchain.now = THE_GREAT_CONJUCTION_2077 + DAY;

    // Deploy Cash-or-Nothing option for Alice and Bob by Broker
    const option = blockchain.openContract(
      await CashOrNothingOption.fromInit(broker.address, 22n),
    );
    logger.addContract(option, "Broker's Option #2");

    const expectedSessionAddress = await stream.getSessionAddress(
      option.address,
    );
    logger.addContract(expectedSessionAddress, `Broker's Option #2's Session`);

    const agreement: CashOrNothingOptionAgreement = {
      $$type: "CashOrNothingOptionAgreement",
      holder: alice.address,
      writer: bob.address,
      initiation: BigInt(THE_GREAT_CONJUCTION_2077 + DAY + 120),
      expiration: BigInt(THE_GREAT_CONJUCTION_2077 + DAY + 720),
      optionType: CashOrNothingOptionType.Call,
      investment: toNano("10"),
      payout: toNano("7.4"),
    };

    // Deploy the Cash-or-Nothing Option contract and log transactions
    const DSTDeployResult = await option.send(broker.getSender(), {
      value: toNano("10") + toNano("7.4") + toNano("1"),
    }, {
      $$type: "CashOrNothingOptionDeploy",
      queryId: 300n,
      stream: stream.address,
      agreement,
    });
    await logger.logTransactions(DSTDeployResult.transactions);

    // Verify expiration and notifications count
    expect(await option.getExpiration()).toBe(
      BigInt(THE_GREAT_CONJUCTION_2077 + DAY + 720),
    );
    expect(await option.getNotificationsCount()).toBe(14n);

    await logger.logContracts();

    // Publish 12 candlesticks
    for (let index = 0; index < 12; index++) {
      blockchain.now = THE_GREAT_CONJUCTION_2077 + DAY + 60 * index;

      // Simulate candlestick data
      const candlestick: Candlestick = {
        $$type: "Candlestick",
        start: BigInt(THE_GREAT_CONJUCTION_2077 + DAY + 60 * index),
        end: BigInt(THE_GREAT_CONJUCTION_2077 + DAY + 60 * (index + 1)),
        open: BigInt(10 + index * 1),
        close: BigInt(10 + index * 2),
        high: BigInt(5 + index * 1),
        low: BigInt(15 + index * 3),
      };

      // Publish candlestick and log transactions
      const DSTPublishCandlestickResult = await stream.send(
        publisher.getSender(),
        {
          value: await stream.getPublishCandlestickDeposit(),
        },
        {
          $$type: "DSTPublishCandlestick",
          queryId: BigInt(400 + index),
          candlestick,
        },
      );
    }
  });

  /**
   * Test case to deploy Broker's Option #3 and settle in the money after the 12th candlestick is published.
   */
  it("(3) Should deploy Broker's Option #3 and settle in the money after the 12th candlestick is published", async () => {
    blockchain.now = THE_GREAT_CONJUCTION_2077 + 2 * DAY;

    // Deploy Cash-or-Nothing option for Alice and Bob by Broker
    const option = blockchain.openContract(
      await CashOrNothingOption.fromInit(broker.address, 23n),
    );
    logger.addContract(option, "Broker's Option #3");

    const expectedSessionAddress = await stream.getSessionAddress(
      option.address,
    );
    logger.addContract(expectedSessionAddress, `Broker's Option #3's Session`);

    /**
     * Agreement details for the Cash-or-Nothing option.
     * @type {CashOrNothingOptionAgreement}
     */
    const agreement: CashOrNothingOptionAgreement = {
      $$type: "CashOrNothingOptionAgreement",
      holder: alice.address,
      writer: bob.address,
      initiation: BigInt(THE_GREAT_CONJUCTION_2077 + 2 * DAY + 120),
      expiration: BigInt(THE_GREAT_CONJUCTION_2077 + 2 * DAY + 720),
      optionType: CashOrNothingOptionType.Put,
      investment: toNano("5"),
      payout: toNano("2"),
    };

    // Deploy the Cash-or-Nothing Option contract and log transactions
    const DSTDeployResult = await option.send(broker.getSender(), {
      value: toNano("5") + toNano("2") + toNano("1"),
    }, {
      $$type: "CashOrNothingOptionDeploy",
      queryId: 300n,
      stream: stream.address,
      agreement,
    });
    await logger.logTransactions(DSTDeployResult.transactions);

    // Verify expiration and notifications count
    expect(await option.getExpiration()).toBe(
      BigInt(THE_GREAT_CONJUCTION_2077 + 2 * DAY + 720),
    );
    expect(await option.getNotificationsCount()).toBe(14n);

    await logger.logContracts();

    // Publish 12 candlesticks
    for (let index = 0; index < 12; index++) {
      blockchain.now = THE_GREAT_CONJUCTION_2077 + 2 * DAY + 60 * index;

      // Simulate candlestick data
      const candlestick: Candlestick = {
        $$type: "Candlestick",
        start: BigInt(THE_GREAT_CONJUCTION_2077 + 2 * DAY + 60 * index),
        end: BigInt(THE_GREAT_CONJUCTION_2077 + 2 * DAY + 60 * (index + 1)),
        open: BigInt(1000 - index * 1),
        close: BigInt(1000 - index * 2),
        high: BigInt(500 - index * 1),
        low: BigInt(1500 - index * 3),
      };

      // Publish candlestick and log transactions
      const DSTPublishCandlestickResult = await stream.send(
        publisher.getSender(),
        {
          value: await stream.getPublishCandlestickDeposit(),
        },
        {
          $$type: "DSTPublishCandlestick",
          queryId: BigInt(400 + index),
          candlestick,
        },
      );

      await logger.logTransactions(DSTPublishCandlestickResult.transactions);

      // Check settlement transactions after 12th candlestick
      if (index === 11) {
        expect(DSTPublishCandlestickResult.transactions).toHaveTransaction({
          from: option.address,
          to: alice.address,
          value: toNano("7.02"),
          success: true,
        });

        expect(DSTPublishCandlestickResult.transactions).toHaveTransaction({
          from: option.address,
          to: bob.address,
          value: toNano("0.02"),
          success: true,
        });
      }
    }
  });

  /**
   * Test case to deploy Broker's Option #4 and settle out of the money after the 12th candlestick is published.
   */
  it("(4) Should deploy Broker's Option #4 and settle out of the money after the 12th candlestick is published", async () => {
    blockchain.now = THE_GREAT_CONJUCTION_2077 + 3 * DAY;

    // Deploy Cash-or-Nothing option for Bob and Carol by Broker
    const option = blockchain.openContract(
      await CashOrNothingOption.fromInit(broker.address, 24n),
    );
    logger.addContract(option, "Broker's Option #4");

    const expectedSessionAddress = await stream.getSessionAddress(
      option.address,
    );
    logger.addContract(expectedSessionAddress, `Broker's Option #4's Session`);

    /**
     * Agreement details for the Cash-or-Nothing option.
     * @type {CashOrNothingOptionAgreement}
     */
    const agreement: CashOrNothingOptionAgreement = {
      $$type: "CashOrNothingOptionAgreement",
      holder: bob.address,
      writer: carol.address,
      initiation: BigInt(THE_GREAT_CONJUCTION_2077 + 3 * DAY + 120),
      expiration: BigInt(THE_GREAT_CONJUCTION_2077 + 3 * DAY + 720),
      optionType: CashOrNothingOptionType.Call,
      investment: toNano("5"),
      payout: toNano("2"),
    };

    // Deploy the Cash-or-Nothing Option contract and log transactions
    const DSTDeployResult = await option.send(broker.getSender(), {
      value: toNano("5") + toNano("2") + toNano("1"),
    }, {
      $$type: "CashOrNothingOptionDeploy",
      queryId: 300n,
      stream: stream.address,
      agreement,
    });
    await logger.logTransactions(DSTDeployResult.transactions);

    // Verify expiration and notifications count
    expect(await option.getExpiration()).toBe(
      BigInt(THE_GREAT_CONJUCTION_2077 + 3 * DAY + 720),
    );
    expect(await option.getNotificationsCount()).toBe(14n);

    await logger.logContracts();

    // Publish 12 candlesticks
    for (let index = 0; index < 12; index++) {
      blockchain.now = THE_GREAT_CONJUCTION_2077 + 3 * DAY + 60 * index;

      // Simulate candlestick data
      const candlestick: Candlestick = {
        $$type: "Candlestick",
        start: BigInt(THE_GREAT_CONJUCTION_2077 + 3 * DAY + 60 * index),
        end: BigInt(THE_GREAT_CONJUCTION_2077 + 3 * DAY + 60 * (index + 1)),
        open: BigInt(1000 - index * 1),
        close: BigInt(1000 - index * 2),
        high: BigInt(500 - index * 1),
        low: BigInt(1500 - index * 3),
      };

      // Publish candlestick and log transactions
      const DSTPublishCandlestickResult = await stream.send(
        publisher.getSender(),
        {
          value: await stream.getPublishCandlestickDeposit(),
        },
        {
          $$type: "DSTPublishCandlestick",
          queryId: BigInt(400 + index),
          candlestick,
        },
      );

      await logger.logTransactions(DSTPublishCandlestickResult.transactions);

      // Check settlement transactions after 12th candlestick
      if (index === 11) {
        expect(DSTPublishCandlestickResult.transactions).toHaveTransaction({
          from: option.address,
          to: bob.address,
          value: toNano("0.02"),
          success: true,
        });

        expect(DSTPublishCandlestickResult.transactions).toHaveTransaction({
          from: option.address,
          to: carol.address,
          value: toNano("7.02"),
          success: true,
        });
      }
    }
  });

  /**
   * Test case to deploy Broker's Option #5 and settle out the money after the 12th candlestick is published.
   */
  it("(5) Should deploy Broker's Option #5 and settle out the money after the 12th candlestick is published", async () => {
    blockchain.now = THE_GREAT_CONJUCTION_2077 + 4 * DAY;

    // Deploy Cash-or-Nothing option for Bob and Carol by Broker
    const option = blockchain.openContract(
      await CashOrNothingOption.fromInit(broker.address, 25n),
    );
    logger.addContract(option, "Broker's Option #5");

    const expectedSessionAddress = await stream.getSessionAddress(
      option.address,
    );
    logger.addContract(expectedSessionAddress, `Broker's Option #5's Session`);

    const agreement: CashOrNothingOptionAgreement = {
      $$type: "CashOrNothingOptionAgreement",
      holder: bob.address,
      writer: carol.address,
      initiation: BigInt(THE_GREAT_CONJUCTION_2077 + 4 * DAY + 120),
      expiration: BigInt(THE_GREAT_CONJUCTION_2077 + 4 * DAY + 720),
      optionType: CashOrNothingOptionType.Put,
      investment: toNano("5"),
      payout: toNano("2"),
    };

    // Deploy the Cash-or-Nothing Option contract and log transactions
    const DSTDeployResult = await option.send(broker.getSender(), {
      value: toNano("5") + toNano("2") + toNano("1"),
    }, {
      $$type: "CashOrNothingOptionDeploy",
      queryId: 300n,
      stream: stream.address,
      agreement,
    });
    await logger.logTransactions(DSTDeployResult.transactions);

    // Verify expiration and notifications count
    expect(await option.getExpiration()).toBe(
      BigInt(THE_GREAT_CONJUCTION_2077 + 4 * DAY + 720),
    );
    expect(await option.getNotificationsCount()).toBe(14n);

    await logger.logContracts();

    for (let index = 0; index < 12; index++) {
      blockchain.now = THE_GREAT_CONJUCTION_2077 + 4 * DAY + 60 * index;

      // Simulate candlestick data
      const candlestick: Candlestick = {
        $$type: "Candlestick",
        start: BigInt(THE_GREAT_CONJUCTION_2077 + 4 * DAY + 60 * index),
        end: BigInt(THE_GREAT_CONJUCTION_2077 + 4 * DAY + 60 * (index + 1)),
        open: BigInt(10 + index * 1),
        close: BigInt(10 + index * 2),
        high: BigInt(5 + index * 1),
        low: BigInt(15 + index * 3),
      };

      // Publish candlestick and log transactions
      const DSTPublishCandlestickResult = await stream.send(
        publisher.getSender(),
        {
          value: await stream.getPublishCandlestickDeposit(),
        },
        {
          $$type: "DSTPublishCandlestick",
          queryId: BigInt(400 + index),
          candlestick,
        },
      );

      await logger.logTransactions(DSTPublishCandlestickResult.transactions);

      console.warn(
        "strikePrice=",
        await option.getStrikePrice(),
        "latestCandlestick=",
        await option.getLatestCandlestick(),
      );

      // Check settlement transactions after 12th candlestick
      if (index === 11) {
        expect(DSTPublishCandlestickResult.transactions).toHaveTransaction({
          from: option.address,
          to: bob.address,
          value: toNano("0.02"),
          success: true,
        });

        expect(DSTPublishCandlestickResult.transactions).toHaveTransaction({
          from: option.address,
          to: carol.address,
          value: toNano("7.02"),
          success: true,
        });
      }
    }
  });

  /**
   * Test case to deploy Broker's Option #6 and settle at the money after the 7th candlestick is published.
   */
  it("(6) Should deploy Broker's Option #6 and settle at the money after the 7th candlestick is published because the strike price candlestick was not published", async () => {
    blockchain.now = THE_GREAT_CONJUCTION_2077 + 5 * DAY;

    // Deploy Cash-or-Nothing option for Bob and Carol by Broker
    const option = blockchain.openContract(
      await CashOrNothingOption.fromInit(broker.address, 26n),
    );
    logger.addContract(option, "Broker's Option #6");

    const expectedSessionAddress = await stream.getSessionAddress(
      option.address,
    );
    logger.addContract(expectedSessionAddress, `Broker's Option #6's Session`);

    const agreement: CashOrNothingOptionAgreement = {
      $$type: "CashOrNothingOptionAgreement",
      holder: bob.address,
      writer: carol.address,
      initiation: BigInt(THE_GREAT_CONJUCTION_2077 + 5 * DAY + 120),
      expiration: BigInt(THE_GREAT_CONJUCTION_2077 + 5 * DAY + 720),
      optionType: CashOrNothingOptionType.Put,
      investment: toNano("5"),
      payout: toNano("2"),
    };

    // Deploy the Cash-or-Nothing Option contract and log transactions
    const DSTDeployResult = await option.send(broker.getSender(), {
      value: toNano("5") + toNano("2") + toNano("1"),
    }, {
      $$type: "CashOrNothingOptionDeploy",
      queryId: 301n,
      stream: stream.address,
      agreement,
    });
    await logger.logTransactions(DSTDeployResult.transactions);

    // Verify expiration and notifications count
    expect(await option.getExpiration()).toBe(
      BigInt(THE_GREAT_CONJUCTION_2077 + 5 * DAY + 720),
    );
    expect(await option.getNotificationsCount()).toBe(14n);

    await logger.logContracts();

    for (let index = 5; index < 12; index++) {
      blockchain.now = THE_GREAT_CONJUCTION_2077 + 5 * DAY + 60 * index;

      // Simulate candlestick data
      const candlestick: Candlestick = {
        $$type: "Candlestick",
        start: BigInt(THE_GREAT_CONJUCTION_2077 + 5 * DAY + 60 * index),
        end: BigInt(THE_GREAT_CONJUCTION_2077 + 5 * DAY + 60 * (index + 1)),
        open: BigInt(10 + index * 1),
        close: BigInt(10 + index * 2),
        high: BigInt(5 + index * 1),
        low: BigInt(15 + index * 3),
      };

      // Publish candlestick and log transactions
      const DSTPublishCandlestickResult = await stream.send(
        publisher.getSender(),
        {
          value: await stream.getPublishCandlestickDeposit(),
        },
        {
          $$type: "DSTPublishCandlestick",
          queryId: BigInt(400 + index),
          candlestick,
        },
      );

      await logger.logTransactions(DSTPublishCandlestickResult.transactions);

      if (index < 11) {
        console.warn(
          "strikePrice=",
          await option.getStrikePrice(),
          "latestCandlestick=",
          await option.getLatestCandlestick(),
        );
      }

      // Check settlement transactions after 7th candlestick
      if (index === 11) {
        expect(DSTPublishCandlestickResult.transactions).toHaveTransaction({
          from: option.address,
          to: bob.address,
          value: toNano("5.02"),
          success: true,
        });

        expect(DSTPublishCandlestickResult.transactions).toHaveTransaction({
          from: option.address,
          to: carol.address,
          value: toNano("2.02"),
          success: true,
        });
      }
    }
  });
});
