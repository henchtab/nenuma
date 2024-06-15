import { toNano } from '@ton/core';
import { CashOrNothingOption } from '../wrappers/CashOrNothingOption';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const cashOrNothingOption = provider.open(await CashOrNothingOption.fromInit());

    await cashOrNothingOption.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(cashOrNothingOption.address);

    // run methods on `cashOrNothingOption`
}
