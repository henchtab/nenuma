import { toNano } from '@ton/core';
import { Broker } from '../wrappers/Broker';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const broker = provider.open(await Broker.fromInit());

    await broker.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(broker.address);

    // run methods on `broker`
}
