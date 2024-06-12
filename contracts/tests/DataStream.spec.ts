import { Builder, toNano } from '@ton/core';
import { Blockchain, SandboxContract, TreasuryContract, printTransactionFees } from '@ton/sandbox';
import '@ton/test-utils';
import { Session } from '../build/DataStream/tact_Session';
import { SubscriptionBatch } from '../build/DataStream/tact_SubscriptionBatch';
import {
    Candlestick,
    DataStream,
    loadSESCandlestickPublishedNotification,
    storeDSTDeployBatchSuccess,
    storeDSTSubscribe,
    storeSESCandlestickPublishedNotification,
    storeSESDestroy,
    storeSESDestroySuccess,
    storeSESSubscribeSuccess,
    storeSESUnsubscribedNotification,
} from '../wrappers/DataStream';
import { printTransactions } from './utils';
import { formatCoinsPure } from '@ton/sandbox/dist/utils/printTransactionFees';

// TODO:
const BATCH_LIMIT = 3;

describe('DataStream', () => {
    let blockchain: Blockchain;
    let publisher: SandboxContract<TreasuryContract>;
    let dataStream: SandboxContract<DataStream>;
    let alice: SandboxContract<TreasuryContract>;
    let bob: SandboxContract<TreasuryContract>;
    let carol: SandboxContract<TreasuryContract>;

    beforeAll(async () => {
        blockchain = await Blockchain.create();

        publisher = await blockchain.treasury('publisher');
        alice = await blockchain.treasury('alice');
        bob = await blockchain.treasury('bob');
        carol = await blockchain.treasury('carol');
    });

    it('(1) Should deploy a data stream', async () => {
        dataStream = blockchain.openContract(await DataStream.fromInit(publisher.address, 'candlestick.1.BTCUSDT'));

        const DSTDeploy = await dataStream.send(
            publisher.getSender(),
            {
                value: toNano('7.00'),
            },
            {
                $$type: 'DSTDeploy',
                queryId: 0n,
            },
        );

        printTransactionFees(DSTDeploy.transactions);

        expect(DSTDeploy.transactions).toHaveTransaction({
            from: publisher.address,
            to: dataStream.address,
            deploy: true,
            success: true,
        });
    });

    it('(2A) Should deploy subscription batches', async () => {
        for (let index = 0; index < BATCH_LIMIT; index++) {
            const DSTDeployBatch = await dataStream.send(
                publisher.getSender(),
                {
                    value: toNano('10'),
                },
                {
                    $$type: 'DSTDeployBatch',
                    queryId: BigInt(index),
                },
            );

            const nextBatchId = await dataStream.getNextBatchId();
            const batchAddress = await dataStream.getBatch(nextBatchId - 1n);

            const body = new Builder();
            storeDSTDeployBatchSuccess({
                $$type: 'DSTDeployBatchSuccess',
                queryId: BigInt(index),
                batch: batchAddress,
            })(body);
            const DSTDeployBatchSuccess = body.endCell();

            // Check that data stream sent DSTDeployBatchSuccess to publisher.
            expect(DSTDeployBatch.transactions).toHaveTransaction({
                from: dataStream.address,
                to: publisher.address,
                success: true,
                body: DSTDeployBatchSuccess,
            });
        }
        expect((await dataStream.getBatches()).size).toEqual(BATCH_LIMIT);
    });

    // it('(2B) Should bounce with exit code ERR_BATCH_LIMIT_EXCEEDED', async () => {
    //     const DSTDeployBatch = await dataStream.send(
    //         publisher.getSender(),
    //         {
    //             value: toNano('10'),
    //         },
    //         {
    //             $$type: 'DSTDeployBatch',
    //             queryId: 100n,
    //         },
    //     );

    //     expect(DSTDeployBatch.transactions).toHaveTransaction({
    //         from: publisher.address,
    //         to: dataStream.address,
    //         exitCode: 402, // ERR_BATCH_LIMIT_EXCEEDED
    //     });
    // });

    it('(3) Should deploy a session', async () => {
        const DSTDeploySession = await dataStream.send(
            alice.getSender(),
            {
                value: toNano('1000'),
            },
            {
                $$type: 'DSTDeploySession',
                queryId: 0n,
            },
        );

        expect(DSTDeploySession.transactions).toHaveTransaction({
            from: dataStream.address,
            success: true,
            deploy: true,
        });
    });

    it('(4A) Should subscribe to the data stream for a desired messages amount', async () => {
        const sessionAddress = await dataStream.getSession(alice.address);
        const session = blockchain.openContract(Session.fromAddress(sessionAddress));

        const SESSubscribe = await session.send(
            alice.getSender(),
            {
                value: toNano('200'),
            },
            {
                $$type: 'SESSubscribe',
                queryId: 0n,
                notificationsCount: 6n,
            },
        );

        const body = new Builder();
        storeSESSubscribeSuccess({
            $$type: 'SESSubscribeSuccess',
            queryId: 0n,
            remainingNotificationsCount: 6n,
        })(body);

        expect(SESSubscribe.transactions).toHaveTransaction({
            from: session.address,
            to: alice.address,
            success: true,
            body: body.endCell(),
        });

        const subscriptionBatchAddress = await session.getBatch();

        expect(subscriptionBatchAddress).toBeDefined();

        const subscriptionBatch = blockchain.openContract(SubscriptionBatch.fromAddress(subscriptionBatchAddress!));
        const subscriptionInfo = (await subscriptionBatch.getSubscriptions()).get(session.address);

        expect(subscriptionInfo).toMatchObject({
            $$type: 'SubscriptionInfo',
            remainingNotificationsCount: 6n,
        });

        const batchesInfo = (await dataStream.getBatches()).values();
        expect(batchesInfo.at(-1)).toMatchObject({
            $$type: 'SBInfo',
            subscriptionsCount: 1n,
        });
    });

    it('(4B) Should add more messages to the subscription', async () => {
        const sessionAddress = await dataStream.getSession(alice.address);
        const session = blockchain.openContract(Session.fromAddress(sessionAddress));

        const SESSubscribe = await session.send(
            alice.getSender(),
            {
                value: toNano('1000'),
            },
            {
                $$type: 'SESSubscribe',
                queryId: 0n,
                notificationsCount: 5n,
            },
        );

        const body = new Builder();
        storeSESSubscribeSuccess({
            $$type: 'SESSubscribeSuccess',
            queryId: 0n,
            remainingNotificationsCount: 11n,
        })(body);
        const SESSubscribeSuccess = body.endCell();

        expect(SESSubscribe.transactions).toHaveTransaction({
            from: session.address,
            to: alice.address,
            success: true,
            body: SESSubscribeSuccess,
        });

        const subscriptionBatchAddress = await session.getBatch();

        expect(subscriptionBatchAddress).toBeDefined();

        const body1 = new Builder();
        storeDSTSubscribe({
            $$type: 'DSTSubscribe',
            batch: subscriptionBatchAddress!,
            notificationsCount: 5n,
            queryId: 0n,
            subscriber: alice.address,
        })(body1);
        const DSTSubscribe = body1.endCell();

        expect(SESSubscribe.transactions).toHaveTransaction({
            from: session.address,
            to: dataStream.address,
            success: true,
            body: DSTSubscribe,
        });

        const subscriptionBatch = blockchain.openContract(SubscriptionBatch.fromAddress(subscriptionBatchAddress!));
        const subscriptionInfo = (await subscriptionBatch.getSubscriptions()).get(session.address);

        expect(subscriptionInfo).toMatchObject({
            $$type: 'SubscriptionInfo',
            remainingNotificationsCount: 11n,
        });

        const batchesInfo = (await dataStream.getBatches()).values();
        expect(batchesInfo.at(-1)).toMatchObject({
            $$type: 'SBInfo',
            subscriptionsCount: 1n,
        });
    });

    // it('(4C) Should add more messages to the subscription among multiple sessions', async () => {
    //     // Spawn multiple sessions
    //     const sessionsCount = 99;
    //     for (let index = 0; index < sessionsCount; index++) {
    //         const sender = await blockchain.treasury(index.toString());
    //         const DSTDeploySession = await dataStream.send(
    //             sender.getSender(),
    //             {
    //                 value: toNano('1000'),
    //             },
    //             {
    //                 $$type: 'DSTDeploySession',
    //                 queryId: BigInt(index),
    //             },
    //         );

    //         expect(DSTDeploySession.transactions).toHaveTransaction({
    //             from: dataStream.address,
    //             success: true,
    //             deploy: true,
    //         });

    //         const sessionAddress = await dataStream.getSession(sender.address);
    //         const session = blockchain.openContract(Session.fromAddress(sessionAddress));

    //         const SESSubscribe = await session.send(
    //             sender.getSender(),
    //             {
    //                 value: toNano('5000'),
    //             },
    //             {
    //                 $$type: 'SESSubscribe',
    //                 queryId: BigInt(index),
    //                 notificationsCount: 100n,
    //             },
    //         );

    //         const body = new Builder();
    //         storeSESSubscribeSuccess({
    //             $$type: 'SESSubscribeSuccess',
    //             queryId: BigInt(index),
    //             remainingNotificationsCount: 100n,
    //         })(body);
    //         const SESSubscribeSuccess = body.endCell();

    //         expect(SESSubscribe.transactions).toHaveTransaction({
    //             from: session.address,
    //             to: sender.address,
    //             success: true,
    //             body: SESSubscribeSuccess,
    //         });
    //     }

    //     const sessionAddress = await dataStream.getSession(alice.address);
    //     const session = blockchain.openContract(Session.fromAddress(sessionAddress));

    //     const SESSubscribe = await session.send(
    //         alice.getSender(),
    //         {
    //             value: toNano('1000'),
    //         },
    //         {
    //             $$type: 'SESSubscribe',
    //             queryId: 0n,
    //             notificationsCount: 77n,
    //         },
    //     );
    //     const body = new Builder();
    //     storeSESSubscribeSuccess({
    //         $$type: 'SESSubscribeSuccess',
    //         queryId: 0n,
    //         remainingNotificationsCount: 164n,
    //     })(body);
    //     const SESSubscribeSuccess = body.endCell();

    //     expect(SESSubscribe.transactions).toHaveTransaction({
    //         from: session.address,
    //         to: alice.address,
    //         success: true,
    //         body: SESSubscribeSuccess,
    //     });

    //     const subscriptionBatchAddress = await session.getBatch();

    //     expect(subscriptionBatchAddress).toBeDefined();

    //     const subscriptionBatch = blockchain.openContract(SubscriptionBatch.fromAddress(subscriptionBatchAddress!));
    //     const subscriptionInfo = (await subscriptionBatch.getSubscriptions()).get(session.address);

    //     expect(subscriptionInfo).toMatchObject({
    //         $$type: 'SubscriptionInfo',
    //         remainingNotificationsCount: 164n,
    //     });
    // });

    it('(5A) Should publish a new message containing candlestick as publisher', async () => {
        const candlestick: Candlestick = {
            $$type: 'Candlestick',
            start: 1718207640000n,
            end: 1718207699999n,
            open: 6969709n,
            close: 6969774n,
            high: 6970129n,
            low: 6966979n,
        };

        const sessionAddress = await dataStream.getSession(alice.address);

        for (let index = 10; index >= 1; index--) {
            const DSTPublishCandlestick = await dataStream.send(
                publisher.getSender(),
                {
                    value: toNano('1000'),
                },
                {
                    $$type: 'DSTPublishCandlestick',
                    queryId: 0n,
                    candlestick,
                },
            );

            const body = new Builder();
            storeSESCandlestickPublishedNotification({
                $$type: 'SESCandlestickPublishedNotification',
                candlestick,
                queryId: 0n,
                remainingNotificationsCount: BigInt(index),
            })(body);
            const SESCandlestickPublishedNotification = body.endCell();

            expect(DSTPublishCandlestick.transactions).toHaveTransaction({
                from: sessionAddress,
                to: alice.address,
                success: true,
                body: SESCandlestickPublishedNotification,
            });

            if (index === 1) {
                const body = new Builder();
                storeSESUnsubscribedNotification({
                    $$type: 'SESUnsubscribedNotification',
                    queryId: 0n,
                    remainingNotificationsCount: 0n,
                })(body);
                const SESUnsubscribedNotification = body.endCell();

                expect(DSTPublishCandlestick.transactions).toHaveTransaction({
                    from: sessionAddress,
                    to: alice.address,
                    success: true,
                    body: SESUnsubscribedNotification,
                });
            }
        }
    });

    // it('(5B) Should unsubscribe Alice when she runs out of messages', async () => {
    //     const candlestick: Candlestick = {
    //         $$type: 'Candlestick',
    //         start: 1718207640000n,
    //         end: 1718207699999n,
    //         open: 6969709n,
    //         close: 6969774n,
    //         high: 6970129n,
    //         low: 6966979n,
    //     };

    //     const sessionAddress = await dataStream.getSession(alice.address);
    //     const session = blockchain.openContract(Session.fromAddress(sessionAddress));

    //     const batchAddress = await session.getBatch();
    //     const batch = blockchain.openContract(SubscriptionBatch.fromAddress(batchAddress!));

    //     for (let index = 11; index >= 1; index--) {
    //         const DSTPublishCandlestick = await dataStream.send(
    //             publisher.getSender(),
    //             {
    //                 value: toNano('1000'),
    //             },
    //             {
    //                 $$type: 'DSTPublishCandlestick',
    //                 queryId: 0n,
    //                 candlestick,
    //             },
    //         );

    //         const body = new Builder();
    //         storeSESCandlestickPublishedNotification({
    //             $$type: 'SESCandlestickPublishedNotification',
    //             candlestick,
    //             queryId: 0n,
    //             remainingNotificationsCount: BigInt(index),
    //         })(body);
    //         const SESCandlestickPublishedNotification = body.endCell();

    //         expect(DSTPublishCandlestick.transactions).toHaveTransaction({
    //             from: sessionAddress,
    //             to: alice.address,
    //             success: true,
    //             body: SESCandlestickPublishedNotification,
    //         });
    //     }
    // });

    it('(6) Should send a message to unsubscribe Bob from the data stream and refund her', async () => {
        const DSTDeploySession = await dataStream.send(
            bob.getSender(),
            {
                value: toNano('100'),
            },
            {
                $$type: 'DSTDeploySession',
                queryId: 0n,
            },
        );

        const sessionAddress = await dataStream.getSession(bob.address);
        const session = blockchain.openContract(Session.fromAddress(sessionAddress));

        const SESSubscribe = await session.send(
            bob.getSender(),
            {
                value: toNano('100'),
            },
            {
                $$type: 'SESSubscribe',
                queryId: 0n,
                notificationsCount: 5n,
            },
        );

        const body1 = new Builder();
        storeSESSubscribeSuccess({
            $$type: 'SESSubscribeSuccess',
            queryId: 0n,
            remainingNotificationsCount: 5n,
        })(body1);
        const SESSubscribeSuccess = body1.endCell();

        expect(SESSubscribe.transactions).toHaveTransaction({
            from: session.address,
            to: bob.address,
            success: true,
            body: SESSubscribeSuccess,
        });

        printTransactions('SESSubscribe', SESSubscribe.transactions);

        // Publish 2 candlesticks
        for (let index = 5; index > 3; index--) {
            const candlestick: Candlestick = {
                $$type: 'Candlestick',
                start: 1718207640000n,
                end: 1718207699999n,
                open: 6969709n,
                close: 6969774n,
                high: 6970129n,
                low: 6966979n,
            };

            const DSTPublishCandlestick = await dataStream.send(
                publisher.getSender(),
                {
                    value: toNano('1000'),
                },
                {
                    $$type: 'DSTPublishCandlestick',
                    queryId: 1n,
                    candlestick,
                },
            );

            printTransactions(`DSTPublishCandlestick ${index}`, DSTPublishCandlestick.transactions);

            const body = new Builder();
            storeSESCandlestickPublishedNotification({
                $$type: 'SESCandlestickPublishedNotification',
                candlestick,
                queryId: 1n,
                remainingNotificationsCount: BigInt(index) - 1n,
            })(body);
            const SESCandlestickPublishedNotification = body.endCell();

            expect(DSTPublishCandlestick.transactions).toHaveTransaction({
                from: session.address,
                to: bob.address,
                success: true,
                body: SESCandlestickPublishedNotification,
            });
        }

        const batchAddress = await session.getBatch();
        console.log('batchAddress', batchAddress);

        const batch = blockchain.openContract(SubscriptionBatch.fromAddress(batchAddress!));
        console.log(await batch.getSubscriptions());

        const SESUnsubscribe = await session.send(
            bob.getSender(),
            {
                value: toNano('100'),
            },
            {
                $$type: 'SESUnsubscribe',
                queryId: 0n,
            },
        );

        printTransactions('SESUnsubscribe', SESUnsubscribe.transactions);

        console.log(await batch.getSubscriptions());

        const body2 = new Builder();
        storeSESUnsubscribedNotification({
            $$type: 'SESUnsubscribedNotification',
            queryId: 0n,
            remainingNotificationsCount: 3n,
        })(body2);
        const SESUnsubscribedNotification = body2.endCell();

        expect(SESUnsubscribe.transactions).toHaveTransaction({
            from: session.address,
            to: bob.address,
            success: true,
            body: SESUnsubscribedNotification,
        });
    });

    it('(7) Should destroy a session', async () => {
        const sessionAddress = await dataStream.getSession(alice.address);
        const session = blockchain.openContract(Session.fromAddress(sessionAddress));

        const DSTDestroySession = await session.send(
            alice.getSender(),
            {
                value: toNano('1'),
            },
            {
                $$type: 'SESDestroy',
                queryId: 0n,
            },
        );

        const body = new Builder();
        storeSESDestroySuccess({
            $$type: 'SESDestroySuccess',
            queryId: 0n,
        })(body);
        const SESDestroySuccess = body.endCell();

        expect(DSTDestroySession.transactions).toHaveTransaction({
            from: alice.address,
            to: session.address,
            success: true,
            exitCode: 0,
            destroyed: true,
        });

        expect(DSTDestroySession.transactions).toHaveTransaction({
            from: session.address,
            to: alice.address,
            success: true,
            body: SESDestroySuccess,
        });
    });
});
