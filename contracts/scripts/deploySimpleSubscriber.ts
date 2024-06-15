import { toNano } from '@ton/core';
import { SimpleSubscriber } from '../wrappers/SimpleSubscriber';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const simpleSubscriber = provider.open(await SimpleSubscriber.fromInit());

    await simpleSubscriber.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(simpleSubscriber.address);

    // run methods on `simpleSubscriber`
}
