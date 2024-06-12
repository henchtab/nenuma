import { toNano } from '@ton/core';
import { DataStream } from '../wrappers/DataStream';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const publisher = provider.sender();
    const topic = 'philosophy.1.love';
    console.log('Publisher:', publisher.address);

    if (!publisher.address) {
        throw new Error('Publisher address is not set');
    }

    const dataStream = provider.open(await DataStream.fromInit(publisher.address, topic));

    await dataStream.send(
        publisher,
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'DSTDeploy',
            queryId: 0n,
        },
    );

    await provider.waitForDeploy(dataStream.address);

    // run methods on `dataStream`
}
