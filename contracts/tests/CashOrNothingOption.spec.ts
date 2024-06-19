import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import { address, openContract, toNano } from "@ton/core";
import { SimpleSubscriber } from "../wrappers/SimpleSubscriber";
import "@ton/test-utils";
import { Candlestick, DataStream } from "../wrappers/DataStream";
import { ShrekLogger } from "./utils";
import {
  DAY,
  ERR_TIMEOUT_NOT_EXCEEDED,
  SOL,
  THE_CELESTIAL_CONVERGENCE,
  THE_GREAT_CONJUCTION_2077,
} from "../wrappers/constants";
import {
  Agreement,
  CashOrNothingOption,
} from "../wrappers/CashOrNothingOption";

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

  beforeEach(async () => {
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

  it("(1) Should deploy Broker's Option #1 (holder=Alice, writer=Bob, initiation=TGC2077+120, expiration=TGC2077+720, type=Call, investment=10TON; payout=7.4TON) that does not receive SESCandlestickPublishedNotification notifications and destroys gracefully after SUBCheckTimeout is successful", async () => {
    // Deploy a Cash-or-Nothing option for Alice and Bob by Deployer
    const option = blockchain.openContract(
      await CashOrNothingOption.fromInit(
        broker.address,
        21n,
      ),
    );
    logger.addContract(option, "Broker's Option #1");

    const expectedSessionAddress = await stream.getSessionAddress(
      option.address,
    );
    logger.addContract(
      expectedSessionAddress,
      `Broker's Option #1's Session`,
    );

    const agreement: Agreement = {
      $$type: "Agreement",
      holder: alice.address,
      writer: bob.address,
      initiation: BigInt(THE_GREAT_CONJUCTION_2077 + 120),
      expiration: BigInt(THE_GREAT_CONJUCTION_2077 + 720),
      type: true, // FIXME: CASH_OR_NOTHING_OPTION_TYPE_CALL;
      investment: toNano("10"),
      payout: toNano("7.4"),
    };

    // Deploy the Simple Subscriber contract and log the transactions
    const CNODeployResult = await option.send(
      broker.getSender(),
      {
        value: toNano("100"),
      },
      {
        $$type: "CNODeploy",
        queryId: 300n,
        stream: stream.address,
        agreement,
      },
    );
    await logger.logTransactions(CNODeployResult.transactions);

    // FIXME:
    expect(await option.getTimeout()).toBe(
      BigInt(THE_GREAT_CONJUCTION_2077 + 720),
    );

    // FIXME:
    expect(await option.getNotificationsCount()).toBe(13n);

    await logger.logContracts();
    // expect(await option.getNotificationsCount()).toBe(4n);

    // Check timeout before expiration
    blockchain.now = THE_GREAT_CONJUCTION_2077 + 180;

    const SUBCheckTimeout1 = await option.send(
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
      to: option.address,
      success: false,
      exitCode: ERR_TIMEOUT_NOT_EXCEEDED,
    });

    // Check timeout after expiration
    // FIXME: 3600 = SUBSCRIBER_TIMEOUT | DATA_STREAM_TIMEOUT;
    blockchain.now = THE_GREAT_CONJUCTION_2077 + 720 + 3600 + 1;

    const SUBCheckTimeout2 = await option.send(
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
      from: option.address,
      to: carol.address,
      success: true,
    });

    expect(SUBCheckTimeout2.transactions).toHaveTransaction({
      from: option.address,
      to: carol.address,
      success: true,
    });
  });

  it("(2) Should deploy Broker's Option #2 (holder=Alice, writer=Bob, initiation=TGC2077+DAY+120, expiration=TGC2077+DAY+720, type=Put, investment=10TON; payout=7.4TON) and settle in the money after the 12th candlestick is published", async () => {
    blockchain.now = THE_GREAT_CONJUCTION_2077 + 1 * DAY;

    // Deploy a Cash-or-Nothing option for Alice and Bob by Deployer
    const option = blockchain.openContract(
      await CashOrNothingOption.fromInit(
        broker.address,
        22n,
      ),
    );
    logger.addContract(option, "Broker's Option #2");

    const expectedSessionAddress = await stream.getSessionAddress(
      option.address,
    );
    logger.addContract(
      expectedSessionAddress,
      `Broker's Option #2's Session`,
    );

    const agreement: Agreement = {
      $$type: "Agreement",
      holder: alice.address,
      writer: bob.address,
      initiation: BigInt(THE_GREAT_CONJUCTION_2077 + 1 * DAY + 120),
      expiration: BigInt(THE_GREAT_CONJUCTION_2077 + 1 * DAY + 720),
      type: true, // FIXME: CASH_OR_NOTHING_OPTION_TYPE_CALL;
      investment: toNano("10"),
      payout: toNano("7.4"),
    };

    // Deploy the Simple Subscriber contract and log the transactions
    const DSTDeployResult = await option.send(
      broker.getSender(),
      {
        value: toNano("100"),
      },
      {
        $$type: "CNODeploy",
        queryId: 300n,
        stream: stream.address,
        agreement,
      },
    );
    await logger.logTransactions(DSTDeployResult.transactions);

    // FIXME:
    expect(await option.getTimeout()).toBe(
      BigInt(THE_GREAT_CONJUCTION_2077 + 1 * DAY + 720),
    );

    expect(await option.getNotificationsCount()).toBe(13n);

    await logger.logContracts();

    console.warn("!!!", blockchain.now);

    for (let index = 0; index < 12; index++) {
      blockchain.now = THE_GREAT_CONJUCTION_2077 + 1 * DAY + 60 * index;

      const candlestick: Candlestick = {
        $$type: "Candlestick",
        start: BigInt(THE_GREAT_CONJUCTION_2077 + 1 * DAY + 60 * index),
        end: BigInt(THE_GREAT_CONJUCTION_2077 + 1 * DAY + 60 * (index + 1)),
        open: BigInt(10 + index * 1),
        close: BigInt(10 + index * 2),
        high: BigInt(5 + index * 1),
        low: BigInt(15 + index * 3),
      };

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

      if (index === 11) {
        expect(DSTPublishCandlestickResult.transactions).toHaveTransaction({
          from: option.address,
          to: alice.address,
          value: toNano("17.42"),
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

  it("(3) Should deploy Broker's Option #3 (holder=Alice, writer=Bob, initiation=TGC2077+3*DAY+120, expiration=TGC2077+3*DAY+720, type=Put, investment=5TON; payout=2TON) and settle in the money after the 12th candlestick is published", async () => {
    blockchain.now = THE_GREAT_CONJUCTION_2077 + 2 * DAY;

    // Deploy a Cash-or-Nothing option for Alice and Bob by Deployer
    const option = blockchain.openContract(
      await CashOrNothingOption.fromInit(
        broker.address,
        23n,
      ),
    );
    logger.addContract(option, "Broker's Option #3");

    const expectedSessionAddress = await stream.getSessionAddress(
      option.address,
    );
    logger.addContract(
      expectedSessionAddress,
      `Broker's Option #3's Session`,
    );

    const agreement: Agreement = {
      $$type: "Agreement",
      holder: alice.address,
      writer: bob.address,
      initiation: BigInt(THE_GREAT_CONJUCTION_2077 + 2 * DAY + 120),
      expiration: BigInt(THE_GREAT_CONJUCTION_2077 + 2 * DAY + 720),
      type: false, // FIXME: CASH_OR_NOTHING_OPTION_TYPE_CALL;
      investment: toNano("10"),
      payout: toNano("7.4"),
    };

    // Deploy the Simple Subscriber contract and log the transactions
    const DSTDeployResult = await option.send(
      broker.getSender(),
      {
        value: toNano("100"),
      },
      {
        $$type: "CNODeploy",
        queryId: 300n,
        stream: stream.address,
        agreement,
      },
    );
    await logger.logTransactions(DSTDeployResult.transactions);

    // FIXME:
    expect(await option.getTimeout()).toBe(
      BigInt(THE_GREAT_CONJUCTION_2077 + 2 * DAY + 720),
    );

    expect(await option.getNotificationsCount()).toBe(13n);

    await logger.logContracts();

    for (let index = 0; index < 12; index++) {
      blockchain.now = THE_GREAT_CONJUCTION_2077 + 2 * DAY + 60 * index;

      const candlestick: Candlestick = {
        $$type: "Candlestick",
        start: BigInt(THE_GREAT_CONJUCTION_2077 + 2 * DAY + 60 * index),
        end: BigInt(THE_GREAT_CONJUCTION_2077 + 2 * DAY + 60 * (index + 1)),
        open: BigInt(10 - index * 1),
        close: BigInt(10 - index * 2),
        high: BigInt(5 - index * 1),
        low: BigInt(15 - index * 3),
      };

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

      if (index === 11) {
        expect(DSTPublishCandlestickResult.transactions).toHaveTransaction({
          from: option.address,
          to: alice.address,
          value: toNano("17.42"),
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

  it("(4) Should deploy Broker's Option #4 (holder=Bob, writer=Carol, initiation=TGC2077+3*DAY+120, expiration=TGC2077+3*DAY+720, type=Call, investment=5TON; payout=2TON) and settle in the money after the 12th candlestick is published", async () => {
    blockchain.now = THE_GREAT_CONJUCTION_2077 + 2 * DAY;

    // Deploy a Cash-or-Nothing option for Alice and Bob by Deployer
    const option = blockchain.openContract(
      await CashOrNothingOption.fromInit(
        broker.address,
        24n,
      ),
    );
    logger.addContract(option, "Broker's Option #4");

    const expectedSessionAddress = await stream.getSessionAddress(
      option.address,
    );
    logger.addContract(
      expectedSessionAddress,
      `Broker's Option #4's Session`,
    );

    const agreement: Agreement = {
      $$type: "Agreement",
      holder: bob.address,
      writer: carol.address,
      initiation: BigInt(THE_GREAT_CONJUCTION_2077 + 2 * DAY + 120),
      expiration: BigInt(THE_GREAT_CONJUCTION_2077 + 2 * DAY + 720),
      type: true, // FIXME: CASH_OR_NOTHING_OPTION_TYPE_CALL;
      investment: toNano("5"),
      payout: toNano("2"),
    };

    // Deploy the Simple Subscriber contract and log the transactions
    const DSTDeployResult = await option.send(
      broker.getSender(),
      {
        value: toNano("100"),
      },
      {
        $$type: "CNODeploy",
        queryId: 300n,
        stream: stream.address,
        agreement,
      },
    );
    await logger.logTransactions(DSTDeployResult.transactions);

    // FIXME:
    expect(await option.getTimeout()).toBe(
      BigInt(THE_GREAT_CONJUCTION_2077 + 2 * DAY + 720),
    );

    expect(await option.getNotificationsCount()).toBe(13n);

    await logger.logContracts();

    for (let index = 0; index < 12; index++) {
      blockchain.now = THE_GREAT_CONJUCTION_2077 + 2 * DAY + 60 * index;

      const candlestick: Candlestick = {
        $$type: "Candlestick",
        start: BigInt(THE_GREAT_CONJUCTION_2077 + 2 * DAY + 60 * index),
        end: BigInt(THE_GREAT_CONJUCTION_2077 + 2 * DAY + 60 * (index + 1)),
        open: BigInt(10 - index * 1),
        close: BigInt(10 - index * 2),
        high: BigInt(5 - index * 1),
        low: BigInt(15 - index * 3),
      };

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

  it("(5) Should deploy Broker's Option #5 (holder=Bob, writer=Carol, initiation=TGC2077+DAY+120, expiration=TGC2077+DAY+720, type=Put, investment=5TON; payout=2TON) and settle out the money after the 12th candlestick is published", async () => {
    blockchain.now = THE_GREAT_CONJUCTION_2077 + 5 * DAY;

    // Deploy a Cash-or-Nothing option for Alice and Bob by Deployer
    const option = blockchain.openContract(
      await CashOrNothingOption.fromInit(
        broker.address,
        24n,
      ),
    );
    logger.addContract(option, "Broker's Option #5");

    const expectedSessionAddress = await stream.getSessionAddress(
      option.address,
    );
    logger.addContract(
      expectedSessionAddress,
      `Broker's Option #5's Session`,
    );

    const agreement: Agreement = {
      $$type: "Agreement",
      holder: bob.address,
      writer: carol.address,
      initiation: BigInt(THE_GREAT_CONJUCTION_2077 + 5 * DAY + 120),
      expiration: BigInt(THE_GREAT_CONJUCTION_2077 + 5 * DAY + 720),
      type: false, // FIXME: CASH_OR_NOTHING_OPTION_TYPE_CALL;
      investment: toNano("5"),
      payout: toNano("2"),
    };

    // Deploy the Simple Subscriber contract and log the transactions
    const DSTDeployResult = await option.send(
      broker.getSender(),
      {
        value: toNano("100"),
      },
      {
        $$type: "CNODeploy",
        queryId: 300n,
        stream: stream.address,
        agreement,
      },
    );
    await logger.logTransactions(DSTDeployResult.transactions);

    // FIXME:
    expect(await option.getTimeout()).toBe(
      BigInt(THE_GREAT_CONJUCTION_2077 + 5 * DAY + 720),
    );

    expect(await option.getNotificationsCount()).toBe(13n);

    await logger.logContracts();

    console.warn("!!!", blockchain.now);

    for (let index = 0; index < 12; index++) {
      blockchain.now = THE_GREAT_CONJUCTION_2077 + 5 * DAY + 60 * index;

      const candlestick: Candlestick = {
        $$type: "Candlestick",
        start: BigInt(THE_GREAT_CONJUCTION_2077 + 5 * DAY + 60 * index),
        end: BigInt(THE_GREAT_CONJUCTION_2077 + 5 * DAY + 60 * (index + 1)),
        open: BigInt(10 + index * 1),
        close: BigInt(10 + index * 2),
        high: BigInt(5 + index * 1),
        low: BigInt(15 + index * 3),
      };

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

  it("(6) Should deploy Broker's Option #6 (holder=Bob, writer=Carol, initiation=TGC2077+DAY+120, expiration=TGC2077+DAY+720, type=Put, investment=5TON; payout=2TON) and settle at the money after the 7th candlestick is published because the candlestick containing strike price was not published", async () => {
    blockchain.now = THE_GREAT_CONJUCTION_2077 + 6 * DAY;

    // Deploy a Cash-or-Nothing option for Alice and Bob by Deployer
    const option = blockchain.openContract(
      await CashOrNothingOption.fromInit(
        broker.address,
        24n,
      ),
    );
    logger.addContract(option, "Broker's Option #6");

    const expectedSessionAddress = await stream.getSessionAddress(
      option.address,
    );
    logger.addContract(
      expectedSessionAddress,
      `Broker's Option #6's Session`,
    );

    const agreement: Agreement = {
      $$type: "Agreement",
      holder: bob.address,
      writer: carol.address,
      initiation: BigInt(THE_GREAT_CONJUCTION_2077 + 6 * DAY + 120),
      expiration: BigInt(THE_GREAT_CONJUCTION_2077 + 6 * DAY + 720),
      type: false, // FIXME: CASH_OR_NOTHING_OPTION_TYPE_CALL;
      investment: toNano("5"),
      payout: toNano("2"),
    };

    // Deploy the Simple Subscriber contract and log the transactions
    const DSTDeployResult = await option.send(
      broker.getSender(),
      {
        value: toNano("100"),
      },
      {
        $$type: "CNODeploy",
        queryId: 300n,
        stream: stream.address,
        agreement,
      },
    );
    await logger.logTransactions(DSTDeployResult.transactions);

    // FIXME:
    expect(await option.getTimeout()).toBe(
      BigInt(THE_GREAT_CONJUCTION_2077 + 6 * DAY + 720),
    );

    expect(await option.getNotificationsCount()).toBe(13n);

    await logger.logContracts();

    console.warn("!!!", blockchain.now);

    for (let index = 5; index < 12; index++) {
      blockchain.now = THE_GREAT_CONJUCTION_2077 + 6 * DAY + 60 * index;

      const candlestick: Candlestick = {
        $$type: "Candlestick",
        start: BigInt(THE_GREAT_CONJUCTION_2077 + 6 * DAY + 60 * index),
        end: BigInt(THE_GREAT_CONJUCTION_2077 + 6 * DAY + 60 * (index + 1)),
        open: BigInt(10 + index * 1),
        close: BigInt(10 + index * 2),
        high: BigInt(5 + index * 1),
        low: BigInt(15 + index * 3),
      };

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
