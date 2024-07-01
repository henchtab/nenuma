import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import { toNano } from "@ton/core";
import "@ton/test-utils";
import { Candlestick, DataStream } from "../wrappers/DataStream";
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
import { Broker, CashOrNothingOptionDraftAgreement } from "../wrappers/Broker";

import { Logger } from "@henchtab/shrek";
import { Session } from "../wrappers/Session";

/**
 * Tests related to Core Assessment using Cash-or-Nothing options and DataStream contracts.
 */
describe("Core Assessment", () => {
  const BATCH_LIMIT = 3;
  const DST_DEPLOY_DEPOSIT = toNano("20");

  let blockchain: Blockchain;
  let logger: Logger;

  let publisher: SandboxContract<TreasuryContract>;
  let stream: SandboxContract<DataStream>;

  let broker: SandboxContract<Broker>;

  let alice: SandboxContract<TreasuryContract>;
  let bob: SandboxContract<TreasuryContract>;
  let carol: SandboxContract<TreasuryContract>;

  /**
   * Set up contracts and initial conditions before each test case.
   */
  beforeAll(async () => {
    blockchain = await Blockchain.create();
    logger = new Logger(blockchain);

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

    // Initialize the Broker contract and log it
    broker = blockchain.openContract(
      await Broker.fromInit(alice.address, stream.address),
    );
    logger.addContract(broker, "Broker");

    // DEPOSIT

    // Perform a deposit to the broker
    const BRKDeposit = await broker.send(
      alice.getSender(),
      {
        value: toNano("100") + toNano("0.05"),
      },
      {
        $$type: "BRKDeposit",
        queryId: 0n,
      },
    );
    await logger.logTransactions(BRKDeposit.transactions, "BRKDepositResult");
  });

  /**
   * Test case to deploy Bob's Option #770.
   */
  it("Should deploy Bob's Option #0", async () => {
    blockchain.now = THE_GREAT_CONJUCTION_2077;

    const expectedOptionAddress = await broker.getOptionAddress(0n);

    // Deploy Cash-or-Nothing option for Alice and Bob by Broker
    const option = blockchain.openContract(
      await CashOrNothingOption.fromAddress(expectedOptionAddress),
    );
    logger.addContract(option, "Bob's Option #0");

    const expectedSessionAddress = await stream.getSessionAddress(
      option.address,
    );

    // Deploy Cash-or-Nothing option for Alice and Bob by Broker
    const session = blockchain.openContract(
      await Session.fromAddress(expectedSessionAddress),
    );
    logger.addContract(session, "Bob's Option #0's Session");

    const draft: CashOrNothingOptionDraftAgreement = {
      $$type: "CashOrNothingOptionDraftAgreement",
      holder: bob.address,
      initiation: BigInt(THE_GREAT_CONJUCTION_2077 + 300),
      expiration: BigInt(THE_GREAT_CONJUCTION_2077 + 300 + 300),
      optionType: CashOrNothingOptionType.Call,
      investment: toNano("10"),
    };

    await logger.logContracts();

    // Deploy the Cash-or-Nothing Option contract and log transactions
    const BrokerDeployOptionResult = await broker.send(bob.getSender(), {
      value: toNano("5") + toNano("10"),
    }, {
      $$type: "BrokerDeployOption",
      queryId: 300n,
      draft,
    });
    await logger.logTransactions(
      BrokerDeployOptionResult.transactions,
      "BrokerDeployOptionResult",
    );

    await logger.logContracts();

    expect(await option.getDeployerAddress()).toEqualAddress(broker.address);
    expect(await option.getExpiration()).toBe(
      BigInt(THE_GREAT_CONJUCTION_2077 + 300 + 300),
    );
    expect(await option.getNotificationsCount()).toBe(12n);
    expect(await option.getOptionId()).toBe(0n);

    const agreement = await option.getAgreement();

    expect(agreement).not.toBeNull();
    expect(agreement?.holder).toEqualAddress(bob.address);
    expect(agreement?.writer).toEqualAddress(broker.address);
    expect(agreement?.investment).toBe(toNano("10"));
    expect(agreement?.payout).toBe(toNano("7.4"));

    // Publish 12 candlesticks
    for (let index = 0; index < 10; index++) {
      blockchain.now = THE_GREAT_CONJUCTION_2077 + 60 * index;

      // Simulate candlestick data
      const candlestick: Candlestick = {
        $$type: "Candlestick",
        start: BigInt(THE_GREAT_CONJUCTION_2077 + 60 * index),
        end: BigInt(THE_GREAT_CONJUCTION_2077 + 60 * (index + 1)),
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

      logger.logTransactions(
        DSTPublishCandlestickResult.transactions,
        "index=" + index,
      );
    }

    await logger.logContracts();
  });
});
