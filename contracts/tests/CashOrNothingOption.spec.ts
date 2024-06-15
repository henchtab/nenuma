import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import { toNano } from "@ton/core";

import "@ton/test-utils";
import { ShrekLogger } from "./utils";

import { DataStream } from "../wrappers/DataStream";

import {
  Agreement,
  CashOrNothingOption,
  CNO_OPERATIONAL_DEPOSIT,
  CNO_STORAGE_RESERVE,
  OptionType,
} from "../wrappers/CashOrNothingOption";

import {
  CNO_STATE_DEPLOYED,
  CNO_STATE_INITIATED,
  CNO_STATE_SETTLED,
  ERR_INSUFFICIENT_DEPOSIT,
  ERR_INVALID_ARGUMENT,
  NOTIFICATION_DEPOSIT,
} from "../wrappers/constants";
import { Session } from "../wrappers/Session";
import { SubscriptionBatch } from "../wrappers/SubscriptionBatch";
import { randomAddress } from "@ton/test-utils";

// This could refer to a spectacular alignment of planets, stars, or other celestial bodies, creating a breathtaking astronomical event visible from Earth.
const THE_GREAT_CONJUCTION_2077 = 3407270400;

describe("Core Assesment", () => {
  const BATCH_LIMIT = 2;
  const DST_DEPLOY_DEPOSIT = toNano("0.02");

  let blockchain: Blockchain;
  let logger: ShrekLogger;

  let publisher: SandboxContract<TreasuryContract>;
  let stream: SandboxContract<DataStream>;

  let broker: SandboxContract<TreasuryContract>;
  let option: SandboxContract<CashOrNothingOption>;

  let alice: SandboxContract<TreasuryContract>;
  let bob: SandboxContract<TreasuryContract>;

  beforeAll(async () => {
    blockchain = await Blockchain.create();
    logger = new ShrekLogger();

    publisher = await blockchain.treasury("publisher");
    logger.addContract(publisher, "Publisher");

    broker = await blockchain.treasury("broker");
    logger.addContract(broker, "Broker");

    alice = await blockchain.treasury("alice");
    logger.addContract(alice, "Alice");

    bob = await blockchain.treasury("bob");
    logger.addContract(bob, "Bob");
  });

  beforeEach(async () => {
    blockchain.now = THE_GREAT_CONJUCTION_2077;

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
    }
  });

  it("(2) Should deploy Option #700 (initiation=120, expiration=300, type=Call, investment=100, payout=74)", async () => {
    blockchain.now = THE_GREAT_CONJUCTION_2077;

    const agreement: Agreement = {
      $$type: "Agreement",
      holder: bob.address,
      writer: alice.address,
      stream: stream.address,
      initiation: BigInt(THE_GREAT_CONJUCTION_2077) + 120n,
      expiration: BigInt(THE_GREAT_CONJUCTION_2077) + 300n,
      type: OptionType.Call,
      investment: toNano("10"),
      payout: toNano("7.4"),
    };

    option = blockchain.openContract(
      await CashOrNothingOption.fromInit(
        broker.address,
        700n,
      ),
    );
    logger.addContract(option, "Option #700");

    const sessionAddress = await stream.getSessionAddress(option.address);
    logger.addContract(sessionAddress, `Option #700's Session`);

    const CNODeployResult = await option.send(broker.getSender(), {
      value: toNano("1000"),
    }, {
      $$type: "CNODeploy",
      queryId: 100n,
      agreement,
    });
    logger.logTransactions(
      CNODeployResult.transactions,
      "(1)(a) CNODeployResult",
    );

    // console.warn(alice.address);
    // // @ts-ignore
    // console.warn(logger.contractLabels);

    expect(await option.getBroker()).toEqualAddress(broker.address);
    expect(await option.getState()).toBe(CNO_STATE_INITIATED);

    expect((await option.getAgreement())?.expiration).toBe(
      BigInt(THE_GREAT_CONJUCTION_2077) + 300n,
    );

    expect(await option.getSession()).toEqualAddress(sessionAddress);
    expect(await option.getStrikePrice()).toBeNull();

    const session = blockchain.openContract(
      await Session.fromAddress(sessionAddress),
    );

    const batchAddress = await session.getBatchAddress();

    expect(batchAddress).not.toBeNull();

    const batch = blockchain.openContract(
      await SubscriptionBatch.fromAddress(batchAddress!!),
    );

    const subscriptions = await batch.getSubscriptions();
    expect(subscriptions.get(sessionAddress)?.remainingNotificationsCount).toBe(
      6n,
    );
  });

  it("(2) Call Option #700 should settle in the money", async () => {
    const DSTPublishCandlestick060 = await stream.send(
      publisher.getSender(),
      {
        value: await stream.getPublishCandlestickDeposit(),
      },
      {
        $$type: "DSTPublishCandlestick",
        queryId: BigInt(200n),
        candlestick: {
          $$type: "Candlestick",
          start: BigInt(THE_GREAT_CONJUCTION_2077),
          end: BigInt(THE_GREAT_CONJUCTION_2077) + 60n,
          open: 100n,
          close: 150n,
          high: 160n,
          low: 90n,
        },
      },
    );
    logger.logTransactions(
      DSTPublishCandlestick060.transactions,
      "(2)(a) DSTPublishCandlestick060",
    );

    const CNODestroyResult = await option.send(
      publisher.getSender(),
      {
        value: toNano("10"),
      },
      {
        $$type: "CNODestroy",
        queryId: BigInt(786n),
      },
    );
    logger.logTransactions(
      DSTPublishCandlestick060.transactions,
      "(2)(b) CNODestroyResult",
    );

    expect(CNODestroyResult.transactions).toHaveTransaction({
      from: option.address,
      to: alice.address,
      success: true,
    });

    expect(CNODestroyResult.transactions).toHaveTransaction({
      from: option.address,
      to: bob.address,
      success: true,
    });

    expect(CNODestroyResult.transactions).toHaveTransaction({
      from: option.address,
      to: broker.address,
      success: true,
    });
  });

  it(
    "(3) Should bounce Option #800 CNODeploy 6 times with invalid argument and 1 with insufficient balance",
    async () => {
      blockchain.now = THE_GREAT_CONJUCTION_2077 + 150;

      const agreement2: Agreement = {
        $$type: "Agreement",
        holder: bob.address,
        writer: alice.address,
        stream: stream.address,
        initiation: BigInt(THE_GREAT_CONJUCTION_2077) + 60n,
        expiration: BigInt(THE_GREAT_CONJUCTION_2077) + 600n,
        type: OptionType.Call,
        investment: toNano("10"),
        payout: toNano("7.4"),
      };

      option = blockchain.openContract(
        await CashOrNothingOption.fromInit(
          broker.address,
          800n,
        ),
      );
      logger.addContract(option, "Option #800");

      const sessionAddress = await stream.getSessionAddress(option.address);
      logger.addContract(sessionAddress, `Option #700's Session`);

      const CNODeployResult1 = await option.send(broker.getSender(), {
        value: toNano("1000"),
      }, {
        $$type: "CNODeploy",
        queryId: 801n,
        agreement: agreement2,
      });
      logger.logTransactions(
        CNODeployResult1.transactions,
        "(3)(a) CNODeployResult initiation > now()",
      );

      expect(CNODeployResult1.transactions).toHaveTransaction({
        from: broker.address,
        to: option.address,
        exitCode: Number(ERR_INVALID_ARGUMENT),
      });

      const agreement3: Agreement = {
        $$type: "Agreement",
        holder: bob.address,
        writer: alice.address,
        stream: stream.address,
        initiation: BigInt(THE_GREAT_CONJUCTION_2077) + 600n,
        expiration: BigInt(THE_GREAT_CONJUCTION_2077) + 60n,
        type: OptionType.Call,
        investment: toNano("10"),
        payout: toNano("7.4"),
      };

      option = blockchain.openContract(
        await CashOrNothingOption.fromInit(
          broker.address,
          800n,
        ),
      );
      logger.addContract(option, "Option #800");

      const CNODeployResult2 = await option.send(broker.getSender(), {
        value: toNano("1000"),
      }, {
        $$type: "CNODeploy",
        queryId: 801n,
        agreement: agreement3,
      });
      logger.logTransactions(
        CNODeployResult2.transactions,
        "(3)(b) CNODeployResult expiration > initiation",
      );

      expect(CNODeployResult2.transactions).toHaveTransaction({
        from: broker.address,
        to: option.address,
        exitCode: Number(ERR_INVALID_ARGUMENT),
      });

      const agreement4: Agreement = {
        $$type: "Agreement",
        holder: bob.address,
        writer: alice.address,
        stream: stream.address,
        initiation: BigInt(THE_GREAT_CONJUCTION_2077) + 454n,
        expiration: BigInt(THE_GREAT_CONJUCTION_2077) + 600n,
        type: OptionType.Call,
        investment: toNano("10"),
        payout: toNano("7.4"),
      };

      option = blockchain.openContract(
        await CashOrNothingOption.fromInit(
          broker.address,
          800n,
        ),
      );
      logger.addContract(option, "Option #800");

      const CNODeployResult4 = await option.send(broker.getSender(), {
        value: toNano("1000"),
      }, {
        $$type: "CNODeploy",
        queryId: 801n,
        agreement: agreement4,
      });
      logger.logTransactions(
        CNODeployResult4.transactions,
        "(3)(c) CNODeployResult initiation % 60 == 0",
      );

      expect(CNODeployResult4.transactions).toHaveTransaction({
        from: broker.address,
        to: option.address,
        exitCode: Number(ERR_INVALID_ARGUMENT),
      });

      const agreement5: Agreement = {
        $$type: "Agreement",
        holder: bob.address,
        writer: alice.address,
        stream: stream.address,
        initiation: BigInt(THE_GREAT_CONJUCTION_2077) + 480n,
        expiration: BigInt(THE_GREAT_CONJUCTION_2077) + 6325n,
        type: OptionType.Call,
        investment: toNano("10"),
        payout: toNano("7.4"),
      };

      option = blockchain.openContract(
        await CashOrNothingOption.fromInit(
          broker.address,
          800n,
        ),
      );
      logger.addContract(option, "Option #800");

      const CNODeployResult5 = await option.send(broker.getSender(), {
        value: toNano("1000"),
      }, {
        $$type: "CNODeploy",
        queryId: 801n,
        agreement: agreement5,
      });
      logger.logTransactions(
        CNODeployResult5.transactions,
        "(3)(d) CNODeployResult expiration % 60 == 0",
      );

      expect(CNODeployResult5.transactions).toHaveTransaction({
        from: broker.address,
        to: option.address,
        exitCode: Number(ERR_INVALID_ARGUMENT),
      });

      const agreement6: Agreement = {
        $$type: "Agreement",
        holder: bob.address,
        writer: alice.address,
        stream: stream.address,
        initiation: BigInt(THE_GREAT_CONJUCTION_2077) + 480n,
        expiration: BigInt(THE_GREAT_CONJUCTION_2077) + 600n,
        type: OptionType.Call,
        investment: 0n,
        payout: toNano("7.4"),
      };

      option = blockchain.openContract(
        await CashOrNothingOption.fromInit(
          broker.address,
          800n,
        ),
      );
      logger.addContract(option, "Option #800");

      const CNODeployResult6 = await option.send(broker.getSender(), {
        value: toNano("1000"),
      }, {
        $$type: "CNODeploy",
        queryId: 801n,
        agreement: agreement6,
      });
      logger.logTransactions(
        CNODeployResult6.transactions,
        "(3)(e) CNODeployResult investment == 0",
      );

      expect(CNODeployResult6.transactions).toHaveTransaction({
        from: broker.address,
        to: option.address,
        exitCode: Number(ERR_INVALID_ARGUMENT),
      });

      const agreement7: Agreement = {
        $$type: "Agreement",
        holder: bob.address,
        writer: alice.address,
        stream: stream.address,
        initiation: BigInt(THE_GREAT_CONJUCTION_2077) + 480n,
        expiration: BigInt(THE_GREAT_CONJUCTION_2077) + 600n,
        type: OptionType.Call,
        investment: toNano("10.0"),
        payout: toNano(0),
      };

      option = blockchain.openContract(
        await CashOrNothingOption.fromInit(
          broker.address,
          800n,
        ),
      );
      logger.addContract(option, "Option #800");

      const CNODeployResult7 = await option.send(broker.getSender(), {
        value: toNano("1000"),
      }, {
        $$type: "CNODeploy",
        queryId: 801n,
        agreement: agreement7,
      });
      logger.logTransactions(
        CNODeployResult7.transactions,
        "(3)(f) CNODeployResult payout == 0",
      );

      expect(CNODeployResult7.transactions).toHaveTransaction({
        from: broker.address,
        to: option.address,
        exitCode: Number(ERR_INVALID_ARGUMENT),
      });

      const agreement8: Agreement = {
        $$type: "Agreement",
        holder: bob.address,
        writer: alice.address,
        stream: stream.address,
        initiation: BigInt(THE_GREAT_CONJUCTION_2077) + 480n,
        expiration: BigInt(THE_GREAT_CONJUCTION_2077) + 600n,
        type: OptionType.Call,
        investment: toNano("10"),
        payout: toNano("7.4"),
      };

      option = blockchain.openContract(
        await CashOrNothingOption.fromInit(
          broker.address,
          800n,
        ),
      );
      logger.addContract(option, "Option #800");

      const CNODeployResult8 = await option.send(broker.getSender(), {
        value: toNano("0.02"),
      }, {
        $$type: "CNODeploy",
        queryId: 802n,
        agreement: agreement8,
      });
      logger.logTransactions(
        CNODeployResult8.transactions,
        "(3)(g) CNODeployResult value < required",
      );

      expect(CNODeployResult8.transactions).toHaveTransaction({
        from: broker.address,
        to: option.address,
        exitCode: Number(ERR_INSUFFICIENT_DEPOSIT),
      });
    },
  );

  it("(4) Should deploy a put Option #850 (initiation=240, expiration=300, type=Put, investment=200, payout=100) and settle out money", async () => {
    blockchain.now = THE_GREAT_CONJUCTION_2077 + 300;

    const agreement: Agreement = {
      $$type: "Agreement",
      holder: bob.address,
      writer: alice.address,
      stream: stream.address,
      initiation: BigInt(THE_GREAT_CONJUCTION_2077 + 300) + 240n,
      expiration: BigInt(THE_GREAT_CONJUCTION_2077 + 300) + 300n,
      type: OptionType.Call,
      investment: toNano("200"),
      payout: toNano("100"),
    };

    option = blockchain.openContract(
      await CashOrNothingOption.fromInit(
        broker.address,
        850n,
      ),
    );
    logger.addContract(option, "Option #801");

    const sessionAddress = await stream.getSessionAddress(option.address);
    logger.addContract(sessionAddress, `Option #801's Session`);

    const CNODeployResult = await option.send(broker.getSender(), {
      value: toNano("1000"),
    }, {
      $$type: "CNODeploy",
      queryId: 100n,
      agreement,
    });
    logger.logTransactions(
      CNODeployResult.transactions,
      "(4)(a) CNODeployResult",
    );

    const DSTPublishCandlestick060 = await stream.send(
      publisher.getSender(),
      {
        value: await stream.getPublishCandlestickDeposit(),
      },
      {
        $$type: "DSTPublishCandlestick",
        queryId: BigInt(200n),
        candlestick: {
          $$type: "Candlestick",
          start: BigInt(THE_GREAT_CONJUCTION_2077 + 300) + 180n,
          end: BigInt(THE_GREAT_CONJUCTION_2077 + 300) + 240n,
          open: 100n,
          close: 150n,
          high: 160n,
          low: 90n,
        },
      },
    );
    logger.logTransactions(
      DSTPublishCandlestick060.transactions,
      "(4)(b) DSTPublishCandlestick060",
    );
  });
});
