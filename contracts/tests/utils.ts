import { Transaction } from "@ton/core";

const decimalCount = 9;
const decimal = pow10(decimalCount);

function pow10(n: number): bigint {
    let v = 1n;
    for (let i = 0; i < n; i++) {
        v *= 10n;
    }
    return v;
}

function formatCoinsPure(value: bigint, precision = 6): string {
    let whole = value / decimal;

    let frac = value % decimal;
    const precisionDecimal = pow10(decimalCount - precision);
    if (frac % precisionDecimal > 0n) {
        // round up
        frac += precisionDecimal;
        if (frac >= decimal) {
            frac -= decimal;
            whole += 1n;
        }
    }
    frac /= precisionDecimal;

    return `${whole.toString()}${frac !== 0n ? '.' + frac.toString().padStart(precision, '0').replace(/0+$/, '') : ''}`;
}

function formatCoins(value: bigint | undefined, precision = 6): string {
    if (value === undefined) return 'N/A';

    return formatCoinsPure(value, precision) + ' TON';
}

export function printTransactions(resultName: string, transactions: Transaction[]) {
    console.info(resultName);
    console.table(
        transactions
            .map((tx) => {
                if (tx.description.type !== 'generic') return undefined;

                const body = tx.inMessage?.info.type === 'internal' ? tx.inMessage?.body.beginParse() : undefined;
                const op = body === undefined ? 'N/A' : body.remainingBits >= 32 ? body.preloadUint(32) : 'no body';

                const totalFees = formatCoins(tx.totalFees.coins);

                const computeFees = formatCoins(
                    tx.description.computePhase.type === 'vm' ? tx.description.computePhase.gasFees : undefined,
                );

                const totalFwdFees = formatCoins(tx.description.actionPhase?.totalFwdFees ?? undefined);

                const valueIn = formatCoins(
                    tx.inMessage?.info.type === 'internal' ? tx.inMessage.info.value.coins : undefined,
                );

                const valuesOut = tx.outMessages
                    .values()
                    .filter((message) => message.info.type === 'internal')
                    // @ts-ignore
                    .map((message) => formatCoins(message.info.value.coins));

                const forwardIn = formatCoins(
                    tx.inMessage?.info.type === 'internal' ? tx.inMessage.info.forwardFee : undefined,
                );

                // bounced: boolean;
                // src: Address;
                // dest: Address;

                // expect(resolveResult.transactions[5].inMessage?.info.dest?.toString())
                //   .toMatch(
                //     alice.address.toString(),
                //   );

                // console.log("tx.description", tx.description);

                return {
                    src: tx.inMessage?.info.src ?? 'Tooth Fairy',
                    dest: tx.inMessage?.info.dest,
                    type: tx.inMessage?.info.type,
                    op: typeof op === 'number' ? '0x' + op.toString(16) : op,
                    valueIn,
                    valuesOut: valuesOut.join('; '),
                    totalFees: totalFees,
                    // inForwardFee: forwardIn,
                    // outForwardFee: totalFwdFees,
                    outActions: tx.description.actionPhase?.totalActions ?? 'N/A',
                    // computeFee: computeFees,
                    exitCode: tx.description.computePhase.type === 'vm' ? tx.description.computePhase.exitCode : 'N/A',
                    actionCode: tx.description.actionPhase?.resultCode ?? 'N/A',
                };
            })
            .filter((v) => v !== undefined),
    );
}
