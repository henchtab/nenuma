import { Builder, openContract, toNano } from "@ton/core";
import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import "@ton/test-utils";
import {
  DataStream,
  storeDSTDeployBatchSuccess,
  storeDSTDeploySessionSuccess,
} from "../wrappers/DataStream";

import { SubscriptionBatch } from "../wrappers/SubscriptionBatch";
import {
  Session,
  storeSESCandlestickPublishedNotification,
  storeSESSubscribeSuccess,
  storeSESUnsubscribedNotification,
} from "../wrappers/Session";

import { randomAddress } from "@ton/test-utils";

import { Logger } from "@henchtab/shrek";

const BATCH_LIMIT = 10; // FIXME: BATCH_LIMIT = 10;
const ERR_BATCH_LIMIT_EXCEEDED = 402;

describe("Core Assesment", () => {
  const BATCH_LIMIT = 3;
  const DST_DEPLOY_DEPOSIT = toNano("50");

  let blockchain: Blockchain;
  let logger: Logger;

  let publisher: SandboxContract<TreasuryContract>;
  let stream: SandboxContract<DataStream>;

  let alice: SandboxContract<TreasuryContract>;
  let bob: SandboxContract<TreasuryContract>;
  let carol: SandboxContract<TreasuryContract>;

  beforeAll(async () => {
    blockchain = await Blockchain.create();
    logger = new Logger(blockchain);

    publisher = await blockchain.treasury("publisher");
    logger.addContract(publisher, "Publisher");

    alice = await blockchain.treasury("alice");
    logger.addContract(alice, "Alice");

    bob = await blockchain.treasury("bob");
    logger.addContract(bob, "Bob");

    carol = await blockchain.treasury("carol");
    logger.addContract(carol, "Carol");
  });

  it("(1) Should deploy a data stream", async () => {
    stream = blockchain.openContract(
      await DataStream.fromInit(publisher.address, "candlestick.1.BTCUSDT"),
    );
    logger.addContract(stream, "Data Stream");

    const DSTDeployResult = await stream.send(
      publisher.getSender(),
      {
        value: toNano("6"),
      },
      {
        $$type: "DSTDeploy",
        queryId: 0n,
      },
    );
    await logger.logTransactions(DSTDeployResult.transactions);

    expect(DSTDeployResult.transactions).toHaveTransaction({
      from: publisher.address,
      to: stream.address,
      deploy: true,
      success: true,
    });

    expect(await stream.getBalance()).toBe(
      await stream.getStorageReserve(),
    );
  });

  it("(2) Should deploy 10 subscription batches", async () => {
    for (let index = 0; index < BATCH_LIMIT; index++) {
      const batchId = await stream.getNextBatchId();

      const batchAddress = await stream.getBatchAddress(batchId);
      logger.addContract(batchAddress, `Subscription Batch #${batchId}`);

      const DSTDeployBatchResult = await stream.send(
        publisher.getSender(),
        {
          value: toNano("5"),
        },
        {
          $$type: "DSTDeployBatch",
          queryId: BigInt(index),
        },
      );
      await logger.logTransactions(DSTDeployBatchResult.transactions);

      expect(DSTDeployBatchResult.transactions).toHaveTransaction({
        from: stream.address,
        to: batchAddress,
        success: true,
        deploy: true,
      });

      const body = new Builder();
      storeDSTDeployBatchSuccess({
        $$type: "DSTDeployBatchSuccess",
        queryId: BigInt(index),
        batch: batchAddress,
      })(body);
      const DSTDeployBatchSuccess = body.endCell();

      expect(DSTDeployBatchResult.transactions).toHaveTransaction({
        from: stream.address,
        to: publisher.address,
        success: true,
        body: DSTDeployBatchSuccess,
      });

      expect(await stream.getNextBatchId()).toBe(batchId + 1n);

      const batches = await stream.getBatches();
      expect(batches.size).toBe(index + 1);

      expect(batches.get(batchAddress)).toStrictEqual({
        $$type: "SBInfo",
        subscriptionsCount: 0n,
      });

      const batch = blockchain.openContract(
        await SubscriptionBatch.fromInit(
          stream.address,
          batchId,
        ),
      );

      expect(await batch.getBalance()).toBe(
        await batch.getStorageReserve(),
      );
    }

    // // TODO: This should be tested during Robustness Trial
    // // Try to deploy a batch beyond the BATCH_LIMIT
    // const DSTDeployBatchResult = await stream.send(
    //   publisher.getSender(),
    //   {
    //     value: toNano("10.00"),
    //   },
    //   {
    //     $$type: "DSTDeployBatch",
    //     queryId: BigInt(10),
    //   },
    // );
    // logger.logTransactions(DSTDeployBatchResult.transactions);

    // // Check that data stream sent DSTDeployBatchSuccess to publisher.
    // expect(DSTDeployBatchResult.transactions).toHaveTransaction({
    //   from: publisher.address,
    //   to: stream.address,
    //   success: false,
    //   exitCode: ERR_BATCH_LIMIT_EXCEEDED,
    // });
  });

  // it("(*) Let's make a hustle...", async () => {
  //   for (let i = 0; i <= 990; i++) {
  //     const unknown = await blockchain.treasury(`unknown #${i}`);
  //     logger.addContract(unknown, `Unknown #${i}`);

  //     const DSTDeploySessionResult = await stream.send(
  //       unknown.getSender(),
  //       {
  //         value: await stream.getDeploySessionDeposit(),
  //       },
  //       {
  //         $$type: "DSTDeploySession",
  //         queryId: 0n,
  //       },
  //     );
  //     logger.logTransactions(
  //       DSTDeploySessionResult.transactions,
  //       "DSTDeploySession",
  //     );

  //     const sessionAddress = await stream.getSessionAddress(unknown.address);
  //     logger.addContract(sessionAddress, `Unknown #${i}'s Session`);

  //     const session = blockchain.openContract(
  //       await Session.fromAddress(sessionAddress),
  //     );

  //     const SESSubscribe = await session.send(
  //       unknown.getSender(),
  //       {
  //         value: (await session.getSubscribeDeposit()) +
  //           (await stream.getNotificationDeposit()) * 100n +
  //           (await stream.getNotificationPremium() * 99n),
  //       },
  //       {
  //         $$type: "SESSubscribe",
  //         queryId: 0n,
  //         notificationsCount: 100n,
  //       },
  //     );
  //     logger.logTransactions(SESSubscribe.transactions, "SESSubscribe");

  //     const DSTPublishCandlestick = await stream.send(
  //       publisher.getSender(),
  //       {
  //         value: await stream.getPublishCandlestickDeposit(),
  //       },
  //       {
  //         $$type: "DSTPublishCandlestick",
  //         queryId: BigInt(i),
  //         candlestick: {
  //           $$type: "Candlestick",
  //           start: 1718207640000n,
  //           end: 1718207699999n,
  //           open: 6969709n,
  //           close: 6969774n,
  //           high: 6970129n,
  //           low: 6966979n,
  //         },
  //       },
  //     );
  //     logger.logTransactions(
  //       DSTPublishCandlestick.transactions,
  //       "DSTPublishCandlestick",
  //     );
  //   }
  // });

  it("(3) Should deploy a session for Alice", async () => {
    const sessionAddress = await stream.getSessionAddress(alice.address);
    logger.addContract(sessionAddress, `Alice's Session`);

    const DSTDeploySessionResult = await stream.send(
      alice.getSender(),
      {
        value: toNano("7"),
      },
      {
        $$type: "DSTDeploySession",
        queryId: 0n,
      },
    );
    await logger.logTransactions(DSTDeploySessionResult.transactions);

    expect(DSTDeploySessionResult.transactions).toHaveTransaction({
      from: stream.address,
      to: sessionAddress,
      success: true,
      deploy: true,
    });

    const body = new Builder();
    storeDSTDeploySessionSuccess({
      $$type: "DSTDeploySessionSuccess",
      queryId: 0n,
      session: sessionAddress,
    })(body);
    const DSTDeployBatchSuccess = body.endCell();

    expect(DSTDeploySessionResult.transactions).toHaveTransaction({
      from: stream.address,
      to: alice.address,
      success: true,
      body: DSTDeployBatchSuccess,
    });

    const session = blockchain.openContract(
      await Session.fromInit(
        stream.address,
        alice.address,
      ),
    );

    expect(await session.getBalance()).toBe(
      await session.getStorageReserve(),
    );
  });

  it("(4) Should subscribe Alice to the data stream for 4 notifications, i.e., 3 candlesticks", async () => {
    const sessionAddress = await stream.getSessionAddress(alice.address);
    const session = blockchain.openContract(
      Session.fromAddress(sessionAddress),
    );

    const SESSubscribe = await session.send(
      alice.getSender(),
      {
        value: (await session.getSubscribeDeposit()) +
          (await stream.getNotificationDeposit()) * 4n +
          (await stream.getNotificationPremium() * 3n),
      },
      {
        $$type: "SESSubscribe",
        queryId: 0n,
        notificationsCount: 4n,
      },
    );
    await logger.logTransactions(SESSubscribe.transactions);

    const body = new Builder();
    storeSESSubscribeSuccess({
      $$type: "SESSubscribeSuccess",
      queryId: 0n,
      remainingNotificationsCount: 4n,
    })(body);
    const SESSubscribeSuccess = body.endCell();

    expect(SESSubscribe.transactions).toHaveTransaction({
      from: session.address,
      to: alice.address,
      success: true,
      body: SESSubscribeSuccess,
    });

    const batchAddress = await session.getBatchAddress();
    expect(batchAddress).toBeDefined();

    const batches = await stream.getBatches();
    expect(batches.get(batchAddress!!)).toStrictEqual({
      $$type: "SBInfo",
      subscriptionsCount: 1n,
    });

    expect(await stream.getBalance()).toBeLessThanOrEqual(
      await stream.getStorageReserve() +
        await stream.getNotificationPremium() * 3n,
    );

    const batch = blockchain.openContract(
      SubscriptionBatch.fromAddress(batchAddress!!),
    );

    expect(await batch.getSubscriptionsCount()).toBe(1n);

    const subscriptions = await batch.getSubscriptions();
    expect(subscriptions.get(sessionAddress)).toStrictEqual({
      $$type: "SubscriptionInfo",
      remainingNotificationsCount: 4n,
    });

    expect(await batch.getBalance()).toBeLessThanOrEqual(
      await batch.getStorageReserve() +
        await stream.getNotificationDeposit() * 4n,
    );
  });

  it("(5) Should subscribe Alice to the data stream for 2 additional notifications, i.e., 2 additional candlesticks and 5 candlesticks in total", async () => {
    const sessionAddress = await stream.getSessionAddress(alice.address);
    const session = blockchain.openContract(
      Session.fromAddress(sessionAddress),
    );

    const SESSubscribe = await session.send(
      alice.getSender(),
      {
        value: (await session.getSubscribeDeposit()) +
          (await stream.getNotificationDeposit()) * 2n +
          (await stream.getNotificationPremium() * 2n),
      },
      {
        $$type: "SESSubscribe",
        queryId: 0n,
        notificationsCount: 2n,
      },
    );
    await logger.logTransactions(SESSubscribe.transactions, "SESSubscribe");

    const body = new Builder();
    storeSESSubscribeSuccess({
      $$type: "SESSubscribeSuccess",
      queryId: 0n,
      remainingNotificationsCount: 6n,
    })(body);
    const SESSubscribeSuccess1 = body.endCell();

    expect(SESSubscribe.transactions).toHaveTransaction({
      from: session.address,
      to: alice.address,
      success: true,
      body: SESSubscribeSuccess1,
    });

    expect(await stream.getBalance()).toBeLessThanOrEqual(
      await stream.getStorageReserve() +
        await stream.getNotificationPremium() * 5n,
    );

    const batchAddress = await session.getBatchAddress();
    expect(batchAddress !== null).toBeTruthy();

    const batches = await stream.getBatches();
    for (const [address, info] of batches) {
      if (
        address.toString() !== batchAddress!!.toString() &&
        info.subscriptionsCount > 0
      ) {
        throw new Error("There must be no new subscriptions");
      }
    }

    const batch = blockchain.openContract(
      SubscriptionBatch.fromAddress(batchAddress!!),
    );

    expect(await batch.getSubscriptionsCount()).toBe(1n);

    const subscriptions = await batch.getSubscriptions();
    expect(subscriptions.get(sessionAddress)).toStrictEqual({
      $$type: "SubscriptionInfo",
      remainingNotificationsCount: 6n,
    });

    expect(await batch.getBalance()).toBeLessThanOrEqual(
      await batch.getStorageReserve() +
        await stream.getNotificationDeposit() * 6n,
    );
  });

  it("(6) Should publish 8 candlesticks; Alice should receive only 5 candlesticks", async () => {
    const sessionAddress = await stream.getSessionAddress(alice.address);
    const session = blockchain.openContract(
      Session.fromAddress(sessionAddress),
    );

    const batchAddress = await session.getBatchAddress();
    const batch = blockchain.openContract(
      SubscriptionBatch.fromAddress(batchAddress!!),
    );

    for (let index = 5; index >= 1; index--) {
      const DSTPublishCandlestick = await stream.send(
        publisher.getSender(),
        {
          value: await stream.getPublishCandlestickDeposit(),
        },
        {
          $$type: "DSTPublishCandlestick",
          queryId: BigInt(index),
          candlestick: {
            $$type: "Candlestick",
            start: 1718207640000n,
            end: 1718207699999n,
            open: 6969709n,
            close: 6969774n,
            high: 6970129n,
            low: 6966979n,
          },
        },
      );
      await logger.logTransactions(DSTPublishCandlestick.transactions);

      const body = new Builder();
      storeSESCandlestickPublishedNotification({
        $$type: "SESCandlestickPublishedNotification",
        candlestick: {
          $$type: "Candlestick",
          start: 1718207640000n,
          end: 1718207699999n,
          open: 6969709n,
          close: 6969774n,
          high: 6970129n,
          low: 6966979n,
        },
        queryId: BigInt(index),
        remainingNotificationsCount: BigInt(index),
      })(body);
      const SESCandlestickPublishedNotification = body.endCell();

      expect(DSTPublishCandlestick.transactions).toHaveTransaction({
        from: sessionAddress,
        to: alice.address,
        success: true,
        body: SESCandlestickPublishedNotification,
      });

      const batches = await stream.getBatches();
      for (const [address, info] of batches) {
        if (
          address.toString() !== batchAddress!!.toString() &&
          info.subscriptionsCount > 0
        ) {
          throw new Error("There must be no new subscriptions");
        }
      }

      expect(
        await stream.getStorageReserve() +
            (await stream.getNotificationPremium()) * (BigInt(index) - 1n) -
            await stream.getBalance() <= 10n,
      ).toBeTruthy();

      if (index >= 2) {
        const subscriptions = await batch.getSubscriptions();
        expect(subscriptions.get(sessionAddress)).toStrictEqual({
          $$type: "SubscriptionInfo",
          remainingNotificationsCount: BigInt(index),
        });

        expect(
          await batch.getStorageReserve() +
              (await stream.getNotificationDeposit()) * BigInt(index) -
              await batch.getBalance() <= 10n,
        ).toBeTruthy();
      } else {
        const body = new Builder();
        storeSESUnsubscribedNotification({
          $$type: "SESUnsubscribedNotification",
          queryId: BigInt(index),
          remainingNotificationsCount: 0n,
        })(body);
        const SESUnsubscribedNotification = body.endCell();

        expect(DSTPublishCandlestick.transactions).toHaveTransaction({
          from: sessionAddress,
          to: alice.address,
          success: true,
          body: SESUnsubscribedNotification,
        });

        expect(
          await stream.getStorageReserve() - await stream.getBalance() <= 10n,
        ).toBeTruthy();

        expect(
          await batch.getStorageReserve() - await batch.getBalance() <= 10n,
        ).toBeTruthy();

        const batches = await stream.getBatches();
        for (const [address, info] of batches) {
          if (
            address.toString() !== batchAddress!!.toString() &&
            info.subscriptionsCount > 0
          ) {
            throw new Error("There must be no new subscriptions");
          }
        }
      }
    }

    for (let index = 3; index >= 1; index--) {
      const DSTPublishCandlestick = await stream.send(
        publisher.getSender(),
        {
          value: await stream.getPublishCandlestickDeposit(),
        },
        {
          $$type: "DSTPublishCandlestick",
          queryId: BigInt(index),
          candlestick: {
            $$type: "Candlestick",
            start: 1718207640000n,
            end: 1718207699999n,
            open: 6969709n,
            close: 6969774n,
            high: 6970129n,
            low: 6966979n,
          },
        },
      );
      await logger.logTransactions(DSTPublishCandlestick.transactions);

      expect(DSTPublishCandlestick.transactions).not.toHaveTransaction({
        from: sessionAddress,
        to: alice.address,
      });
    }
  });

  it("(7) Should subscribe Bob to the data stream for 3 notifications, i.e., 2 candlesticks; publish 1 candlestick; Bob should unsubscribe from the data stream and recieve back deposits and premiums for 2 notifications", async () => {
    const sessionAddress = await stream.getSessionAddress(bob.address);
    logger.addContract(sessionAddress, "Bob's Session");

    const DSTDeploySessionResult = await stream.send(
      bob.getSender(),
      {
        value: await stream.getDeploySessionDeposit(),
      },
      {
        $$type: "DSTDeploySession",
        queryId: 0n,
      },
    );
    await logger.logTransactions(DSTDeploySessionResult.transactions);

    const session = blockchain.openContract(
      Session.fromAddress(sessionAddress),
    );

    const SESSubscribe = await session.send(
      bob.getSender(),
      {
        value: await session.getSubscribeDeposit() +
          (await stream.getNotificationDeposit()) * 3n +
          (await stream.getNotificationPremium() * 2n),
      },
      {
        $$type: "SESSubscribe",
        queryId: 0n,
        notificationsCount: 3n,
      },
    );
    await logger.logTransactions(SESSubscribe.transactions, "SESSubscribe");

    const DSTPublishCandlestick = await stream.send(
      publisher.getSender(),
      {
        value: await stream.getPublishCandlestickDeposit(),
      },
      {
        $$type: "DSTPublishCandlestick",
        queryId: 0n,
        candlestick: {
          $$type: "Candlestick",
          start: 1718207640000n,
          end: 1718207699999n,
          open: 6969709n,
          close: 6969774n,
          high: 6970129n,
          low: 6966979n,
        },
      },
    );
    await logger.logTransactions(
      DSTPublishCandlestick.transactions,
      "DSTPublishCandlestick",
    );

    const batchAddress = await session.getBatchAddress();

    const SESUnsubscribe = await session.send(
      bob.getSender(),
      {
        value: await session.getUnsubscribeDeposit(),
      },
      {
        $$type: "SESUnsubscribe",
        queryId: 0n,
      },
    );
    await logger.logTransactions(SESUnsubscribe.transactions, "SESUnsubscribe");

    const body = new Builder();
    storeSESUnsubscribedNotification({
      $$type: "SESUnsubscribedNotification",
      queryId: 0n,
      remainingNotificationsCount: 2n,
    })(body);
    const SESUnsubscribedNotification = body.endCell();

    expect(SESUnsubscribe.transactions).toHaveTransaction({
      from: sessionAddress,
      to: bob.address,
      success: true,
      body: SESUnsubscribedNotification,
    });

    expect(await session.getBatchAddress() === null).toBeTruthy();

    const batches = await stream.getBatches();
    console.warn(batches);
    for (const [_, info] of batches) {
      if (
        info.subscriptionsCount > 0
      ) {
        throw new Error("There must be no subscriptions");
      }
    }

    const batch = blockchain.openContract(
      SubscriptionBatch.fromAddress(batchAddress!!),
    );

    expect(await batch.getSubscriptionsCount()).toBe(0n);

    const subscriptions = await batch.getSubscriptions();
    console.warn(subscriptions);
    expect(subscriptions.size).toBe(0);

    expect(await batch.getStorageReserve() - await batch.getBalance() <= 10n)
      .toBeTruthy();

    expect(await stream.getBalance() - await stream.getStorageReserve() <= 10n)
      .toBeTruthy();
  });

  it("(8) Should destroy Alice and Bob's sessions", async () => {
    const sessionAddress0 = await stream.getSessionAddress(alice.address);
    const session0 = blockchain.openContract(
      Session.fromAddress(sessionAddress0),
    );

    const DSTDestroySessionResult0 = await session0.send(
      alice.getSender(),
      {
        value: await session0.getDestroyDeposit(),
      },
      {
        $$type: "SESDestroy",
        queryId: 0n,
      },
    );
    await logger.logTransactions(DSTDestroySessionResult0.transactions);

    expect(DSTDestroySessionResult0.transactions).toHaveTransaction({
      from: alice.address,
      to: session0.address,
      success: true,
      destroyed: true,
    });

    expect(DSTDestroySessionResult0.transactions).toHaveTransaction({
      from: session0.address,
      to: alice.address,
      success: true,
    });

    const sessionAddress1 = await stream.getSessionAddress(bob.address);
    const session1 = blockchain.openContract(
      Session.fromAddress(sessionAddress1),
    );

    const DSTDestroySessionResult1 = await session1.send(
      bob.getSender(),
      {
        value: await session1.getDestroyDeposit(),
      },
      {
        $$type: "SESDestroy",
        queryId: 0n,
      },
    );
    await logger.logTransactions(DSTDestroySessionResult1.transactions);

    expect(DSTDestroySessionResult1.transactions).toHaveTransaction({
      from: bob.address,
      to: session1.address,
      success: true,
      destroyed: true,
    });

    expect(DSTDestroySessionResult1.transactions).toHaveTransaction({
      from: session1.address,
      to: bob.address,
      success: true,
    });
  });
});
