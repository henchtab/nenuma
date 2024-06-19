import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/cash_or_nothing_option.tact',
    options: {
        debug: true,
    },
};
