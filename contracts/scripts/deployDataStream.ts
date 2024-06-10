import { toNano } from '@ton/core';
import { DataStream } from '../wrappers/DataStream';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const dataStream = provider.open(await DataStream.fromInit());

    await dataStream.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(dataStream.address);

    // run methods on `dataStream`
}
