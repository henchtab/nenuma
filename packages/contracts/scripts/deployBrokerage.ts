import { toNano } from '@ton/core';
import { Brokerage } from '../wrappers/Brokerage';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const brokerage = provider.open(await Brokerage.fromInit());

    await brokerage.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(brokerage.address);

    // run methods on `brokerage`
}
