import { Builder, toNano } from '@ton/core';
import { Blockchain, SandboxContract, TreasuryContract, printTransactionFees } from '@ton/sandbox';
import '@ton/test-utils';
import { Session } from '../build/DataStream/tact_Session';
import { DataStream, storeDSTDeployBatchSuccess, storeSESSubscribeSuccess } from '../wrappers/DataStream';
import { printTransactions } from './utils';
import { SubscriptionBatch } from '../build/DataStream/tact_SubscriptionBatch';

const BATCH_LIMIT = 10;

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

    it('(2B) Should bounce with exit code ERR_BATCH_LIMIT_EXCEEDED', async () => {
        const DSTDeployBatch = await dataStream.send(
            publisher.getSender(),
            {
                value: toNano('10'),
            },
            {
                $$type: 'DSTDeployBatch',
                queryId: 100n,
            },
        );

        expect(DSTDeployBatch.transactions).toHaveTransaction({
            from: publisher.address,
            to: dataStream.address,
            exitCode: 402, // ERR_BATCH_LIMIT_EXCEEDED
        });
    });

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

        // printTransactions('SESDeploy', SESDeploy.transactions);

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
                notificationsCount: 10n,
            },
        );

        const body = new Builder();
        storeSESSubscribeSuccess({
            $$type: 'SESSubscribeSuccess',
            queryId: 0n,
            remainingNotificationsCount: 10n,
        })(body);

        console.log(await dataStream.getBatches());

        const subscriptionBatchAddress = await session.getBatch();

        expect(subscriptionBatchAddress).toBeDefined();

        const subscriptionBatch = blockchain.openContract(SubscriptionBatch.fromAddress(subscriptionBatchAddress!));
        const subscriptionInfo = (await subscriptionBatch.getSubscriptions()).get(session.address);

        console.log('subscriptionInfo', subscriptionInfo);

        expect(subscriptionInfo).toMatchObject({
            $$type: 'SubscriptionInfo',
            remainingNotificationsCount: 10n,
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
                notificationsCount: 77n,
            },
        );

        console.log(await dataStream.getBatches());

        const subscriptionBatchAddress = await session.getBatch();

        expect(subscriptionBatchAddress).toBeDefined();

        const subscriptionBatch = blockchain.openContract(SubscriptionBatch.fromAddress(subscriptionBatchAddress!));
        const subscriptionInfo = (await subscriptionBatch.getSubscriptions()).get(session.address);

        console.log('subscriptionInfo', subscriptionInfo);

        expect(subscriptionInfo).toMatchObject({
            $$type: 'SubscriptionInfo',
            remainingNotificationsCount: 87n,
        });
    });

    it('(4C) Should add more messages to the subscription among multiple sessions', async () => {
        // Spawn multiple sessions
        const sessionsCount = 99;
        for (let index = 0; index < sessionsCount; index++) {
            const sender = await blockchain.treasury(index.toString());
            const DSTDeploySession = await dataStream.send(
                sender.getSender(),
                {
                    value: toNano('1000'),
                },
                {
                    $$type: 'DSTDeploySession',
                    queryId: BigInt(index),
                },
            );

            expect(DSTDeploySession.transactions).toHaveTransaction({
                from: dataStream.address,
                success: true,
                deploy: true,
            });

            const sessionAddress = await dataStream.getSession(sender.address);
            const session = blockchain.openContract(Session.fromAddress(sessionAddress));

            const SESSubscribe = await session.send(
                sender.getSender(),
                {
                    value: toNano('5000'),
                },
                {
                    $$type: 'SESSubscribe',
                    queryId: BigInt(index),
                    notificationsCount: 100n,
                },
            );

            const body = new Builder();
            storeSESSubscribeSuccess({
                $$type: 'SESSubscribeSuccess',
                queryId: BigInt(index),
                remainingNotificationsCount: 100n,
            })(body);
            const SESSubscribeSuccess = body.endCell();

            expect(SESSubscribe.transactions).toHaveTransaction({
                from: session.address,
                to: sender.address,
                success: true,
                body: SESSubscribeSuccess,
            });
        }

        console.log(await dataStream.getBatches());

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
                notificationsCount: 77n,
            },
        );
        const body = new Builder();
        storeSESSubscribeSuccess({
            $$type: 'SESSubscribeSuccess',
            queryId: 0n,
            remainingNotificationsCount: 164n,
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

        const subscriptionBatch = blockchain.openContract(SubscriptionBatch.fromAddress(subscriptionBatchAddress!));
        const subscriptionInfo = (await subscriptionBatch.getSubscriptions()).get(session.address);

        console.log('subscriptionInfo', subscriptionInfo);

        expect(subscriptionInfo).toMatchObject({
            $$type: 'SubscriptionInfo',
            remainingNotificationsCount: 164n,
        });
    });
});
