import { Builder, toNano } from "@ton/core";
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

import { formatCoins, ShrekLogger } from "./utils";

const BATCH_LIMIT = 10; // FIXME: BATCH_LIMIT = 10;
const ERR_BATCH_LIMIT_EXCEEDED = 402;

describe("Core Assesment", () => {
  const BATCH_LIMIT = 3;
  const DST_DEPLOY_DEPOSIT = toNano(0.06);

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
  });

  it("(1) Should deploy a data stream", async () => {
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
    });

    expect(await stream.getBalance()).toBe(
      await stream.getStorageReserve(),
    );
  });

  it("(2) Should deploy 3 subscription batches", async () => {
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

    // TODO: log batches...

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

  it("(3) Should deploy a session for Alice", async () => {
    const sessionAddress = await stream.getSessionAddress(alice.address);
    logger.addContract(sessionAddress, `Alice's Session`);

    const DSTDeploySessionResult = await stream.send(
      alice.getSender(),
      {
        value: await stream.getDeploySessionDeposit(),
      },
      {
        $$type: "DSTDeploySession",
        queryId: 0n,
      },
    );
    logger.logTransactions(DSTDeploySessionResult.transactions);

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
        value: await session.getSubscribeDeposit(4n),
      },
      {
        $$type: "SESSubscribe",
        queryId: 0n,
        notificationsCount: 4n,
      },
    );
    logger.logTransactions(SESSubscribe.transactions);

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

    expect(await stream.getBalance()).toBe(
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

    expect(await batch.getBalance()).toBe(
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
        value: await session.getSubscribeDeposit(2n),
      },
      {
        $$type: "SESSubscribe",
        queryId: 0n,
        notificationsCount: 2n,
      },
    );
    logger.logTransactions(SESSubscribe.transactions);

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

    expect(await stream.getBalance()).toBe(
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

    expect(await batch.getBalance()).toBe(
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
          value: toNano("1000"),
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
      logger.logTransactions(DSTPublishCandlestick.transactions);

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
          value: toNano("1000"),
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
      logger.logTransactions(DSTPublishCandlestick.transactions);

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
        value: toNano("1000"),
      },
      {
        $$type: "DSTDeploySession",
        queryId: 0n,
      },
    );
    logger.logTransactions(DSTDeploySessionResult.transactions);

    const session = blockchain.openContract(
      Session.fromAddress(sessionAddress),
    );

    const SESSubscribe = await session.send(
      bob.getSender(),
      {
        value: toNano("200"),
      },
      {
        $$type: "SESSubscribe",
        queryId: 0n,
        notificationsCount: 3n,
      },
    );
    logger.logTransactions(SESSubscribe.transactions);

    const DSTPublishCandlestick = await stream.send(
      publisher.getSender(),
      {
        value: toNano("1000"),
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
    logger.logTransactions(DSTPublishCandlestick.transactions);

    const batchAddress = await session.getBatchAddress();

    const SESUnsubscribe = await session.send(
      bob.getSender(),
      {
        value: toNano("200"),
      },
      {
        $$type: "SESUnsubscribe",
        queryId: 0n,
      },
    );
    logger.logTransactions(SESUnsubscribe.transactions);

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
    expect(subscriptions.size).toBe(0);

    expect(await batch.getBalance()).toBe(await batch.getStorageReserve());
    expect(await stream.getBalance()).toBe(await stream.getStorageReserve());
  });

  it("(8) Should destroy Alice and Bob's sessions", async () => {
    const sessionAddress0 = await stream.getSessionAddress(alice.address);
    const session0 = blockchain.openContract(
      Session.fromAddress(sessionAddress0),
    );

    const DSTDestroySessionResult0 = await session0.send(
      alice.getSender(),
      {
        value: toNano("1"),
      },
      {
        $$type: "SESDestroy",
        queryId: 0n,
      },
    );
    logger.logTransactions(DSTDestroySessionResult0.transactions);

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
        value: toNano("1"),
      },
      {
        $$type: "SESDestroy",
        queryId: 0n,
      },
    );
    logger.logTransactions(DSTDestroySessionResult1.transactions);

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

// describe("Penetration Test", () => {
//   // TODO:
// });

// describe("Robustness Trial", () => {
//   // TODO:

//   // TODO: Test BATCH_LIMIT = 200
//   // TODO: Test SUBSCRIPTION_LIMIT = 200
//   // TODO: Test SESSubscribe fees
//   // TODO: Test DSTPublishCandlestick fees
//   // TODO: Test SESUnsubscribe fees
// });

// describe("DataStream", () => {
//   let blockchain: Blockchain;
//   let publisher: SandboxContract<TreasuryContract>;
//   let dataStream: SandboxContract<DataStream>;
//   let alice: SandboxContract<TreasuryContract>;
//   let bob: SandboxContract<TreasuryContract>;
//   let carol: SandboxContract<TreasuryContract>;

//   beforeAll(async () => {
//     blockchain = await Blockchain.create();

//     publisher = await blockchain.treasury("publisher");
//     alice = await blockchain.treasury("alice");
//     bob = await blockchain.treasury("bob");
//     carol = await blockchain.treasury("carol");
//   });

//   it("(1) Should deploy a data stream", async () => {
//     dataStream = blockchain.openContract(
//       await DataStream.fromInit(publisher.address, "candlestick.1.BTCUSDT"),
//     );

//     const DSTDeploy = await dataStream.send(
//       publisher.getSender(),
//       {
//         value: toNano("7.00"),
//       },
//       {
//         $$type: "DSTDeploy",
//         queryId: 0n,
//       },
//     );

//     printTransactionFees(DSTDeploy.transactions);

//     expect(DSTDeploy.transactions).toHaveTransaction({
//       from: publisher.address,
//       to: dataStream.address,
//       deploy: true,
//       success: true,
//     });
//   });

//   it("(2A) Should deploy subscription batches", async () => {
// for (let index = 0; index < BATCH_LIMIT; index++) {
//   const DSTDeployBatch = await dataStream.send(
//     publisher.getSender(),
//     {
//       value: toNano("10"),
//     },
//     {
//       $$type: "DSTDeployBatch",
//       queryId: BigInt(index),
//     },
//   );

//   const nextBatchId = await dataStream.getNextBatchId();
//   const batchAddress = await dataStream.getBatch(nextBatchId - 1n);

//   const body = new Builder();
//   storeDSTDeployBatchSuccess({
//     $$type: "DSTDeployBatchSuccess",
//     queryId: BigInt(index),
//     batch: batchAddress,
//   })(body);
//   const DSTDeployBatchSuccess = body.endCell();

//   // Check that data stream sent DSTDeployBatchSuccess to publisher.
//   expect(DSTDeployBatch.transactions).toHaveTransaction({
//     from: dataStream.address,
//     to: publisher.address,
//     success: true,
//     body: DSTDeployBatchSuccess,
//   });
// }
// expect((await dataStream.getBatches()).size).toEqual(BATCH_LIMIT);
//   });

//   // it('(2B) Should bounce with exit code ERR_BATCH_LIMIT_EXCEEDED', async () => {
//   //     const DSTDeployBatch = await dataStream.send(
//   //         publisher.getSender(),
//   //         {
//   //             value: toNano('10'),
//   //         },
//   //         {
//   //             $$type: 'DSTDeployBatch',
//   //             queryId: 100n,
//   //         },
//   //     );

//   //     expect(DSTDeployBatch.transactions).toHaveTransaction({
//   //         from: publisher.address,
//   //         to: dataStream.address,
//   //         exitCode: 402, // ERR_BATCH_LIMIT_EXCEEDED
//   //     });
//   // });

//   it("(3) Should deploy a session", async () => {
//     const DSTDeploySession = await dataStream.send(
//       alice.getSender(),
//       {
//         value: toNano("1000"),
//       },
//       {
//         $$type: "DSTDeploySession",
//         queryId: 0n,
//       },
//     );

//     expect(DSTDeploySession.transactions).toHaveTransaction({
//       from: dataStream.address,
//       success: true,
//       deploy: true,
//     });
//   });

//   it("(4A) Should subscribe to the data stream for a desired messages amount", async () => {
//     const sessionAddress = await dataStream.getSession(alice.address);
//     const session = blockchain.openContract(
//       Session.fromAddress(sessionAddress),
//     );

//     const SESSubscribe = await session.send(
//       alice.getSender(),
//       {
//         value: toNano("200"),
//       },
//       {
//         $$type: "SESSubscribe",
//         queryId: 0n,
//         notificationsCount: 6n,
//       },
//     );

//     const body = new Builder();
//     storeSESSubscribeSuccess({
//       $$type: "SESSubscribeSuccess",
//       queryId: 0n,
//       remainingNotificationsCount: 6n,
//     })(body);

//     expect(SESSubscribe.transactions).toHaveTransaction({
//       from: session.address,
//       to: alice.address,
//       success: true,
//       body: body.endCell(),
//     });

//     const subscriptionBatchAddress = await session.getBatch();

//     expect(subscriptionBatchAddress).toBeDefined();

//     const subscriptionBatch = blockchain.openContract(
//       SubscriptionBatch.fromAddress(subscriptionBatchAddress!),
//     );
//     const subscriptionInfo = (await subscriptionBatch.getSubscriptions()).get(
//       session.address,
//     );

//     expect(subscriptionInfo).toMatchObject({
//       $$type: "SubscriptionInfo",
//       remainingNotificationsCount: 6n,
//     });

//     const batchesInfo = (await dataStream.getBatches()).values();
//     expect(batchesInfo.at(-1)).toMatchObject({
//       $$type: "SBInfo",
//       subscriptionsCount: 1n,
//     });
//   });

//   it("(4B) Should add more messages to the subscription", async () => {
//     const sessionAddress = await dataStream.getSession(alice.address);
//     const session = blockchain.openContract(
//       Session.fromAddress(sessionAddress),
//     );

//     const SESSubscribe = await session.send(
//       alice.getSender(),
//       {
//         value: toNano("1000"),
//       },
//       {
//         $$type: "SESSubscribe",
//         queryId: 0n,
//         notificationsCount: 5n,
//       },
//     );

//     const body = new Builder();
//     storeSESSubscribeSuccess({
//       $$type: "SESSubscribeSuccess",
//       queryId: 0n,
//       remainingNotificationsCount: 11n,
//     })(body);
//     const SESSubscribeSuccess = body.endCell();

//     expect(SESSubscribe.transactions).toHaveTransaction({
//       from: session.address,
//       to: alice.address,
//       success: true,
//       body: SESSubscribeSuccess,
//     });

//     const subscriptionBatchAddress = await session.getBatch();

//     expect(subscriptionBatchAddress).toBeDefined();

//     const body1 = new Builder();
//     storeDSTSubscribe({
//       $$type: "DSTSubscribe",
//       batch: subscriptionBatchAddress!,
//       notificationsCount: 5n,
//       queryId: 0n,
//       subscriber: alice.address,
//     })(body1);
//     const DSTSubscribe = body1.endCell();

//     expect(SESSubscribe.transactions).toHaveTransaction({
//       from: session.address,
//       to: dataStream.address,
//       success: true,
//       body: DSTSubscribe,
//     });

//     const subscriptionBatch = blockchain.openContract(
//       SubscriptionBatch.fromAddress(subscriptionBatchAddress!),
//     );
//     const subscriptionInfo = (await subscriptionBatch.getSubscriptions()).get(
//       session.address,
//     );

//     expect(subscriptionInfo).toMatchObject({
//       $$type: "SubscriptionInfo",
//       remainingNotificationsCount: 11n,
//     });

//     const batchesInfo = (await dataStream.getBatches()).values();
//     expect(batchesInfo.at(-1)).toMatchObject({
//       $$type: "SBInfo",
//       subscriptionsCount: 1n,
//     });
//   });

//   // it('(4C) Should add more messages to the subscription among multiple sessions', async () => {
//   //     // Spawn multiple sessions
//   //     const sessionsCount = 99;
//   //     for (let index = 0; index < sessionsCount; index++) {
//   //         const sender = await blockchain.treasury(index.toString());
//   //         const DSTDeploySession = await dataStream.send(
//   //             sender.getSender(),
//   //             {
//   //                 value: toNano('1000'),
//   //             },
//   //             {
//   //                 $$type: 'DSTDeploySession',
//   //                 queryId: BigInt(index),
//   //             },
//   //         );

//   //         expect(DSTDeploySession.transactions).toHaveTransaction({
//   //             from: dataStream.address,
//   //             success: true,
//   //             deploy: true,
//   //         });

//   //         const sessionAddress = await dataStream.getSession(sender.address);
//   //         const session = blockchain.openContract(Session.fromAddress(sessionAddress));

//   //         const SESSubscribe = await session.send(
//   //             sender.getSender(),
//   //             {
//   //                 value: toNano('5000'),
//   //             },
//   //             {
//   //                 $$type: 'SESSubscribe',
//   //                 queryId: BigInt(index),
//   //                 notificationsCount: 100n,
//   //             },
//   //         );

//   //         const body = new Builder();
//   //         storeSESSubscribeSuccess({
//   //             $$type: 'SESSubscribeSuccess',
//   //             queryId: BigInt(index),
//   //             remainingNotificationsCount: 100n,
//   //         })(body);
//   //         const SESSubscribeSuccess = body.endCell();

//   //         expect(SESSubscribe.transactions).toHaveTransaction({
//   //             from: session.address,
//   //             to: sender.address,
//   //             success: true,
//   //             body: SESSubscribeSuccess,
//   //         });
//   //     }

//   //     const sessionAddress = await dataStream.getSession(alice.address);
//   //     const session = blockchain.openContract(Session.fromAddress(sessionAddress));

//   //     const SESSubscribe = await session.send(
//   //         alice.getSender(),
//   //         {
//   //             value: toNano('1000'),
//   //         },
//   //         {
//   //             $$type: 'SESSubscribe',
//   //             queryId: 0n,
//   //             notificationsCount: 77n,
//   //         },
//   //     );
//   //     const body = new Builder();
//   //     storeSESSubscribeSuccess({
//   //         $$type: 'SESSubscribeSuccess',
//   //         queryId: 0n,
//   //         remainingNotificationsCount: 164n,
//   //     })(body);
//   //     const SESSubscribeSuccess = body.endCell();

//   //     expect(SESSubscribe.transactions).toHaveTransaction({
//   //         from: session.address,
//   //         to: alice.address,
//   //         success: true,
//   //         body: SESSubscribeSuccess,
//   //     });

//   //     const subscriptionBatchAddress = await session.getBatch();

//   //     expect(subscriptionBatchAddress).toBeDefined();

//   //     const subscriptionBatch = blockchain.openContract(SubscriptionBatch.fromAddress(subscriptionBatchAddress!));
//   //     const subscriptionInfo = (await subscriptionBatch.getSubscriptions()).get(session.address);

//   //     expect(subscriptionInfo).toMatchObject({
//   //         $$type: 'SubscriptionInfo',
//   //         remainingNotificationsCount: 164n,
//   //     });
//   // });

//   it("(5A) Should publish a new message containing candlestick as publisher", async () => {
//     const candlestick: Candlestick = {
//       $$type: "Candlestick",
//       start: 1718207640000n,
//       end: 1718207699999n,
//       open: 6969709n,
//       close: 6969774n,
//       high: 6970129n,
//       low: 6966979n,
//     };

//     const sessionAddress = await dataStream.getSession(alice.address);

//     for (let index = 10; index >= 1; index--) {
//       const DSTPublishCandlestick = await dataStream.send(
//         publisher.getSender(),
//         {
//           value: toNano("1000"),
//         },
//         {
//           $$type: "DSTPublishCandlestick",
//           queryId: 0n,
//           candlestick,
//         },
//       );

//       const body = new Builder();
//       storeSESCandlestickPublishedNotification({
//         $$type: "SESCandlestickPublishedNotification",
//         candlestick,
//         queryId: 0n,
//         remainingNotificationsCount: BigInt(index),
//       })(body);
//       const SESCandlestickPublishedNotification = body.endCell();

//       expect(DSTPublishCandlestick.transactions).toHaveTransaction({
//         from: sessionAddress,
//         to: alice.address,
//         success: true,
//         body: SESCandlestickPublishedNotification,
//       });

//       if (index === 1) {
//         const body = new Builder();
//         storeSESUnsubscribedNotification({
//           $$type: "SESUnsubscribedNotification",
//           queryId: 0n,
//           remainingNotificationsCount: 0n,
//         })(body);
//         const SESUnsubscribedNotification = body.endCell();

//         expect(DSTPublishCandlestick.transactions).toHaveTransaction({
//           from: sessionAddress,
//           to: alice.address,
//           success: true,
//           body: SESUnsubscribedNotification,
//         });
//       }
//     }
//   });

//   // it('(5B) Should unsubscribe Alice when she runs out of messages', async () => {
//   //     const candlestick: Candlestick = {
//   //         $$type: 'Candlestick',
//   //         start: 1718207640000n,
//   //         end: 1718207699999n,
//   //         open: 6969709n,
//   //         close: 6969774n,
//   //         high: 6970129n,
//   //         low: 6966979n,
//   //     };

//   //     const sessionAddress = await dataStream.getSession(alice.address);
//   //     const session = blockchain.openContract(Session.fromAddress(sessionAddress));

//   //     const batchAddress = await session.getBatch();
//   //     const batch = blockchain.openContract(SubscriptionBatch.fromAddress(batchAddress!));

//   //     for (let index = 11; index >= 1; index--) {
//   //         const DSTPublishCandlestick = await dataStream.send(
//   //             publisher.getSender(),
//   //             {
//   //                 value: toNano('1000'),
//   //             },
//   //             {
//   //                 $$type: 'DSTPublishCandlestick',
//   //                 queryId: 0n,
//   //                 candlestick,
//   //             },
//   //         );

//   //         const body = new Builder();
//   //         storeSESCandlestickPublishedNotification({
//   //             $$type: 'SESCandlestickPublishedNotification',
//   //             candlestick,
//   //             queryId: 0n,
//   //             remainingNotificationsCount: BigInt(index),
//   //         })(body);
//   //         const SESCandlestickPublishedNotification = body.endCell();

//   //         expect(DSTPublishCandlestick.transactions).toHaveTransaction({
//   //             from: sessionAddress,
//   //             to: alice.address,
//   //             success: true,
//   //             body: SESCandlestickPublishedNotification,
//   //         });
//   //     }
//   // });

//   it("(6) Should send a message to unsubscribe Bob from the data stream and refund her", async () => {
//     const DSTDeploySession = await dataStream.send(
//       bob.getSender(),
//       {
//         value: toNano("100"),
//       },
//       {
//         $$type: "DSTDeploySession",
//         queryId: 0n,
//       },
//     );

//     const sessionAddress = await dataStream.getSession(bob.address);
//     const session = blockchain.openContract(
//       Session.fromAddress(sessionAddress),
//     );

//     const SESSubscribe = await session.send(
//       bob.getSender(),
//       {
//         value: toNano("100"),
//       },
//       {
//         $$type: "SESSubscribe",
//         queryId: 0n,
//         notificationsCount: 5n,
//       },
//     );

//     const body1 = new Builder();
//     storeSESSubscribeSuccess({
//       $$type: "SESSubscribeSuccess",
//       queryId: 0n,
//       remainingNotificationsCount: 5n,
//     })(body1);
//     const SESSubscribeSuccess = body1.endCell();

//     expect(SESSubscribe.transactions).toHaveTransaction({
//       from: session.address,
//       to: bob.address,
//       success: true,
//       body: SESSubscribeSuccess,
//     });

//     printTransactions("SESSubscribe", SESSubscribe.transactions);

//     // Publish 2 candlesticks
//     for (let index = 5; index > 3; index--) {
//       const candlestick: Candlestick = {
//         $$type: "Candlestick",
//         start: 1718207640000n,
//         end: 1718207699999n,
//         open: 6969709n,
//         close: 6969774n,
//         high: 6970129n,
//         low: 6966979n,
//       };

//       const DSTPublishCandlestick = await dataStream.send(
//         publisher.getSender(),
//         {
//           value: toNano("1000"),
//         },
//         {
//           $$type: "DSTPublishCandlestick",
//           queryId: 1n,
//           candlestick,
//         },
//       );

//       printTransactions(
//         `DSTPublishCandlestick ${index}`,
//         DSTPublishCandlestick.transactions,
//       );

//       const body = new Builder();
//       storeSESCandlestickPublishedNotification({
//         $$type: "SESCandlestickPublishedNotification",
//         candlestick,
//         queryId: 1n,
//         remainingNotificationsCount: BigInt(index) - 1n,
//       })(body);
//       const SESCandlestickPublishedNotification = body.endCell();

//       expect(DSTPublishCandlestick.transactions).toHaveTransaction({
//         from: session.address,
//         to: bob.address,
//         success: true,
//         body: SESCandlestickPublishedNotification,
//       });
//     }

//     const batchAddress = await session.getBatch();
//     console.log("batchAddress", batchAddress);

//     const batch = blockchain.openContract(
//       SubscriptionBatch.fromAddress(batchAddress!),
//     );
//     console.log(await batch.getSubscriptions());

//     const SESUnsubscribe = await session.send(
//       bob.getSender(),
//       {
//         value: toNano("100"),
//       },
//       {
//         $$type: "SESUnsubscribe",
//         queryId: 0n,
//       },
//     );

//     printTransactions("SESUnsubscribe", SESUnsubscribe.transactions);

//     console.log(await batch.getSubscriptions());

//     const body2 = new Builder();
//     storeSESUnsubscribedNotification({
//       $$type: "SESUnsubscribedNotification",
//       queryId: 0n,
//       remainingNotificationsCount: 3n,
//     })(body2);
//     const SESUnsubscribedNotification = body2.endCell();

//     expect(SESUnsubscribe.transactions).toHaveTransaction({
//       from: session.address,
//       to: bob.address,
//       success: true,
//       body: SESUnsubscribedNotification,
//     });
//   });

//   it("(7) Should destroy a session", async () => {
// const sessionAddress = await dataStream.getSession(alice.address);
// const session = blockchain.openContract(
//   Session.fromAddress(sessionAddress),
// );

// const DSTDestroySession = await session.send(
//   alice.getSender(),
//   {
//     value: toNano("1"),
//   },
//   {
//     $$type: "SESDestroy",
//     queryId: 0n,
//   },
// );

// const body = new Builder();
// storeSESDestroySuccess({
//   $$type: "SESDestroySuccess",
//   queryId: 0n,
// })(body);
// const SESDestroySuccess = body.endCell();

// expect(DSTDestroySession.transactions).toHaveTransaction({
//   from: alice.address,
//   to: session.address,
//   success: true,
//   exitCode: 0,
//   destroyed: true,
// });

// expect(DSTDestroySession.transactions).toHaveTransaction({
//   from: session.address,
//   to: alice.address,
//   success: true,
//   body: SESDestroySuccess,
// });
//   });
// });
