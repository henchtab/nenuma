import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/simple_subscriber.tact',
    options: {
        debug: true,
    },
};
