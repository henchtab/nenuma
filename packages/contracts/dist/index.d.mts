import { Builder, Address, Slice, Contract, Cell, ContractABI, ContractProvider, Sender, Dictionary } from '@ton/core';

type BRGDeploy$1 = {
    $$type: 'BRGDeploy';
    queryId: bigint;
};
declare function storeBRGDeploy(src: BRGDeploy$1): (builder: Builder) => void;
type BRKDeploy = {
    $$type: 'BRKDeploy';
    queryId: bigint;
};
type BRKDeposit = {
    $$type: 'BRKDeposit';
    queryId: bigint;
};
type BRKWithdraw = {
    $$type: 'BRKWithdraw';
    queryId: bigint;
};
type CashOrNothingOptionDraftAgreement = {
    $$type: 'CashOrNothingOptionDraftAgreement';
    holder: Address;
    initiation: bigint;
    expiration: bigint;
    optionType: boolean;
    investment: bigint;
};
type BrokerDeployOption = {
    $$type: 'BrokerDeployOption';
    queryId: bigint;
    draft: CashOrNothingOptionDraftAgreement;
};
declare function storeBrokerDeployOption(src: BrokerDeployOption): (builder: Builder) => void;
declare function loadCashOrNothingOptionDeploy(slice: Slice): {
    $$type: "CashOrNothingOptionDeploy";
    queryId: bigint;
    stream: Address;
    agreement: {
        $$type: "CashOrNothingOptionAgreement";
        holder: Address;
        writer: Address;
        initiation: bigint;
        expiration: bigint;
        optionType: boolean;
        investment: bigint;
        payout: bigint;
    };
};
type CashOrNothingOptionDeploySuccess = {
    $$type: 'CashOrNothingOptionDeploySuccess';
    queryId: bigint;
    optionId: bigint;
    holder: Address;
};
type CashOrNothingOptionSettledInMoneyNotification = {
    $$type: 'CashOrNothingOptionSettledInMoneyNotification';
    queryId: bigint;
};
type CashOrNothingOptionSettledOutMoneyNotification = {
    $$type: 'CashOrNothingOptionSettledOutMoneyNotification';
    queryId: bigint;
};
type CashOrNothingOptionSettledAtMoneyNotification = {
    $$type: 'CashOrNothingOptionSettledAtMoneyNotification';
    queryId: bigint;
};
type SubscriberDestroyedNotification = {
    $$type: 'SubscriberDestroyedNotification';
    queryId: bigint;
};
declare class Broker implements Contract {
    static init(owner: Address, stream: Address): Promise<{
        code: Cell;
        data: Cell;
    }>;
    static fromInit(owner: Address, stream: Address): Promise<Broker>;
    static fromAddress(address: Address): Broker;
    readonly address: Address;
    readonly init?: {
        code: Cell;
        data: Cell;
    };
    readonly abi: ContractABI;
    private constructor();
    send(provider: ContractProvider, via: Sender, args: {
        value: bigint;
        bounce?: boolean | null | undefined;
    }, message: BRKDeploy | BRKDeposit | BRKWithdraw | BrokerDeployOption | CashOrNothingOptionDeploySuccess | CashOrNothingOptionSettledInMoneyNotification | CashOrNothingOptionSettledOutMoneyNotification | CashOrNothingOptionSettledAtMoneyNotification | SubscriberDestroyedNotification): Promise<void>;
    getBalance(provider: ContractProvider): Promise<bigint>;
    getStorageReserve(provider: ContractProvider): Promise<bigint>;
    getDepositDeposit(provider: ContractProvider): Promise<bigint>;
    getOwner(provider: ContractProvider): Promise<Address>;
    getStream(provider: ContractProvider): Promise<Address>;
    getPayout(provider: ContractProvider): Promise<{
        $$type: "Fraction";
        nominator: bigint;
        denominator: bigint;
    }>;
    getPayoutRatio(provider: ContractProvider): Promise<{
        $$type: "Fraction";
        nominator: bigint;
        denominator: bigint;
    }>;
    getNextOptionId(provider: ContractProvider): Promise<bigint>;
    getOptionAddress(provider: ContractProvider, optionId: bigint): Promise<Address>;
}

type BRGDeploy = {
    $$type: 'BRGDeploy';
    queryId: bigint;
};
type BRGDeployBroker = {
    $$type: 'BRGDeployBroker';
    queryId: bigint;
    stream: Address;
};
type BRKDeploySuccess = {
    $$type: 'BRKDeploySuccess';
    queryId: bigint;
    stream: Address;
};
type BRGDeployAccount = {
    $$type: 'BRGDeployAccount';
    queryId: bigint;
};
type BRADeploySuccess = {
    $$type: 'BRADeploySuccess';
    queryId: bigint;
    trader: Address;
};
declare class Brokerage implements Contract {
    static init(owner: Address): Promise<{
        code: Cell;
        data: Cell;
    }>;
    static fromInit(owner: Address): Promise<Brokerage>;
    static fromAddress(address: Address): Brokerage;
    readonly address: Address;
    readonly init?: {
        code: Cell;
        data: Cell;
    };
    readonly abi: ContractABI;
    private constructor();
    send(provider: ContractProvider, via: Sender, args: {
        value: bigint;
        bounce?: boolean | null | undefined;
    }, message: BRGDeploy | BRGDeployBroker | BRKDeploySuccess | BRGDeployAccount | BRADeploySuccess): Promise<void>;
    getStorageReserve(provider: ContractProvider): Promise<bigint>;
    getOwner(provider: ContractProvider): Promise<Address>;
    getBroker(provider: ContractProvider, stream: Address): Promise<Address>;
    getAccount(provider: ContractProvider, trader: Address): Promise<Address>;
}

type BRADeploy = {
    $$type: 'BRADeploy';
    queryId: bigint;
};
declare class BrokerageAccount implements Contract {
    static init(brokerage: Address, trader: Address): Promise<{
        code: Cell;
        data: Cell;
    }>;
    static fromInit(brokerage: Address, trader: Address): Promise<BrokerageAccount>;
    static fromAddress(address: Address): BrokerageAccount;
    readonly address: Address;
    readonly init?: {
        code: Cell;
        data: Cell;
    };
    readonly abi: ContractABI;
    private constructor();
    send(provider: ContractProvider, via: Sender, args: {
        value: bigint;
        bounce?: boolean | null | undefined;
    }, message: BRADeploy): Promise<void>;
    getStorageReserve(provider: ContractProvider): Promise<bigint>;
    getBrokerage(provider: ContractProvider): Promise<Address>;
    getTrader(provider: ContractProvider): Promise<Address>;
}

type DSTDeploySessionSuccess$1 = {
    $$type: 'DSTDeploySessionSuccess';
    queryId: bigint;
    session: Address;
};
type Candlestick$4 = {
    $$type: 'Candlestick';
    start: bigint;
    end: bigint;
    open: bigint;
    close: bigint;
    high: bigint;
    low: bigint;
};
type SESSubscribeSuccess$1 = {
    $$type: 'SESSubscribeSuccess';
    queryId: bigint;
    remainingNotificationsCount: bigint;
};
type SESCandlestickPublishedNotification$1 = {
    $$type: 'SESCandlestickPublishedNotification';
    queryId: bigint;
    candlestick: Candlestick$4;
    remainingNotificationsCount: bigint;
};
type SESUnsubscribedNotification$1 = {
    $$type: 'SESUnsubscribedNotification';
    queryId: bigint;
    remainingNotificationsCount: bigint;
};
type SESDestroySuccess$1 = {
    $$type: 'SESDestroySuccess';
    queryId: bigint;
};
type SubscriberCheckTimeout$1 = {
    $$type: 'SubscriberCheckTimeout';
    queryId: bigint;
};
type CashOrNothingOptionDeploy = {
    $$type: 'CashOrNothingOptionDeploy';
    queryId: bigint;
    stream: Address;
    agreement: CashOrNothingOptionAgreement;
};
declare function storeCashOrNothingOptionDeploy(src: CashOrNothingOptionDeploy): (builder: Builder) => void;
type CashOrNothingOptionAgreement = {
    $$type: 'CashOrNothingOptionAgreement';
    holder: Address;
    writer: Address;
    initiation: bigint;
    expiration: bigint;
    optionType: boolean;
    investment: bigint;
    payout: bigint;
};
declare class CashOrNothingOption implements Contract {
    static init(deployer: Address, optionId: bigint): Promise<{
        code: Cell;
        data: Cell;
    }>;
    static fromInit(deployer: Address, optionId: bigint): Promise<CashOrNothingOption>;
    static fromAddress(address: Address): CashOrNothingOption;
    readonly address: Address;
    readonly init?: {
        code: Cell;
        data: Cell;
    };
    readonly abi: ContractABI;
    private constructor();
    send(provider: ContractProvider, via: Sender, args: {
        value: bigint;
        bounce?: boolean | null | undefined;
    }, message: CashOrNothingOptionDeploy | DSTDeploySessionSuccess$1 | SESSubscribeSuccess$1 | SESCandlestickPublishedNotification$1 | SESUnsubscribedNotification$1 | SESDestroySuccess$1 | SubscriberCheckTimeout$1): Promise<void>;
    getOptionId(provider: ContractProvider): Promise<bigint>;
    getAgreement(provider: ContractProvider): Promise<{
        $$type: "CashOrNothingOptionAgreement";
        holder: Address;
        writer: Address;
        initiation: bigint;
        expiration: bigint;
        optionType: boolean;
        investment: bigint;
        payout: bigint;
    } | null>;
    getStrikePrice(provider: ContractProvider): Promise<bigint | null>;
    getLatestCandlestick(provider: ContractProvider): Promise<{
        $$type: "Candlestick";
        start: bigint;
        end: bigint;
        open: bigint;
        close: bigint;
        high: bigint;
        low: bigint;
    } | null>;
    getBalance(provider: ContractProvider): Promise<bigint>;
    getDeployerAddress(provider: ContractProvider): Promise<Address>;
    getStreamAddress(provider: ContractProvider): Promise<Address | null>;
    getNotificationsCount(provider: ContractProvider): Promise<bigint | null>;
    getExpiration(provider: ContractProvider): Promise<bigint | null>;
    getSessionAddress(provider: ContractProvider): Promise<Address | null>;
}

type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
};
declare function storeStateInit(src: StateInit): (builder: Builder) => void;
declare function loadStateInit(slice: Slice): {
    $$type: "StateInit";
    code: Cell;
    data: Cell;
};
type DSTDeploy = {
    $$type: 'DSTDeploy';
    queryId: bigint;
};
declare function storeDSTDeploy(src: DSTDeploy): (builder: Builder) => void;
type DSTDeployBatch = {
    $$type: 'DSTDeployBatch';
    queryId: bigint;
};
declare function storeDSTDeployBatch(src: DSTDeployBatch): (builder: Builder) => void;
type DSTDeploySession = {
    $$type: 'DSTDeploySession';
    queryId: bigint;
};
declare function storeDSTDeploySession(src: DSTDeploySession): (builder: Builder) => void;
type DSTSubscribe = {
    $$type: 'DSTSubscribe';
    queryId: bigint;
    subscriber: Address;
    notificationsCount: bigint;
};
type Candlestick$3 = {
    $$type: 'Candlestick';
    start: bigint;
    end: bigint;
    open: bigint;
    close: bigint;
    high: bigint;
    low: bigint;
};
type DSTPublishCandlestick = {
    $$type: 'DSTPublishCandlestick';
    queryId: bigint;
    candlestick: Candlestick$3;
};
declare function storeDSTPublishCandlestick(src: DSTPublishCandlestick): (builder: Builder) => void;
type SBDeploySuccess = {
    $$type: 'SBDeploySuccess';
    queryId: bigint;
    batchId: bigint;
};
type SBSubscribeSuccess = {
    $$type: 'SBSubscribeSuccess';
    queryId: bigint;
    session: Address;
    remainingNotificationsCount: bigint;
};
type SBUnsubscribedNotification = {
    $$type: 'SBUnsubscribedNotification';
    queryId: bigint;
    session: Address;
    remainingNotificationsCount: bigint;
};
type SESDeploySuccess = {
    $$type: 'SESDeploySuccess';
    queryId: bigint;
    subscriber: Address;
};
type SESSubscribe$1 = {
    $$type: 'SESSubscribe';
    queryId: bigint;
    notificationsCount: bigint;
};
declare function storeSESSubscribe(src: SESSubscribe$1): (builder: Builder) => void;
type DSTTopUpSubscription = {
    $$type: 'DSTTopUpSubscription';
    queryId: bigint;
    subscriber: Address;
    batch: Address;
    notificationsCount: bigint;
};
type SESUnsubscribe$1 = {
    $$type: 'SESUnsubscribe';
    queryId: bigint;
};
declare function storeSESUnsubscribe(src: SESUnsubscribe$1): (builder: Builder) => void;
type SESDestroy$1 = {
    $$type: 'SESDestroy';
    queryId: bigint;
};
declare function storeSESDestroy(src: SESDestroy$1): (builder: Builder) => void;
type SBInfo$1 = {
    $$type: 'SBInfo';
    subscriptionsCount: bigint;
};
declare class DataStream implements Contract {
    static init(publisher: Address, topic: string): Promise<{
        code: Cell;
        data: Cell;
    }>;
    static fromInit(publisher: Address, topic: string): Promise<DataStream>;
    static fromAddress(address: Address): DataStream;
    readonly address: Address;
    readonly init?: {
        code: Cell;
        data: Cell;
    };
    readonly abi: ContractABI;
    private constructor();
    send(provider: ContractProvider, via: Sender, args: {
        value: bigint;
        bounce?: boolean | null | undefined;
    }, message: DSTDeploy | DSTDeployBatch | SBDeploySuccess | DSTDeploySession | SESDeploySuccess | DSTSubscribe | DSTTopUpSubscription | SBSubscribeSuccess | DSTPublishCandlestick | SBUnsubscribedNotification): Promise<void>;
    getBalance(provider: ContractProvider): Promise<bigint>;
    getStorageReserve(provider: ContractProvider): Promise<bigint>;
    getDeployBatchDeposit(provider: ContractProvider): Promise<bigint>;
    getDeploySessionDeposit(provider: ContractProvider): Promise<bigint>;
    getPublishCandlestickDeposit(provider: ContractProvider): Promise<bigint>;
    getNotificationDeposit(provider: ContractProvider): Promise<bigint>;
    getNotificationPremium(provider: ContractProvider): Promise<bigint>;
    getPublisherAddress(provider: ContractProvider): Promise<Address>;
    getTopic(provider: ContractProvider): Promise<string>;
    getBatches(provider: ContractProvider): Promise<Dictionary<Address, SBInfo$1>>;
    getNextBatchId(provider: ContractProvider): Promise<bigint>;
    getBatchAddress(provider: ContractProvider, batchId: bigint): Promise<Address>;
    getSessionAddress(provider: ContractProvider, subscriber: Address): Promise<Address>;
}

type DSTSubscribeSuccess = {
    $$type: 'DSTSubscribeSuccess';
    queryId: bigint;
    batch: Address;
    remainingNotificationsCount: bigint;
};
type Candlestick$2 = {
    $$type: 'Candlestick';
    start: bigint;
    end: bigint;
    open: bigint;
    close: bigint;
    high: bigint;
    low: bigint;
};
type DSTUnsubscribedNotification = {
    $$type: 'DSTUnsubscribedNotification';
    queryId: bigint;
    remainingNotificationsCount: bigint;
};
type SBCandlestickPublishedNotification = {
    $$type: 'SBCandlestickPublishedNotification';
    queryId: bigint;
    candlestick: Candlestick$2;
    remainingNotificationsCount: bigint;
};
type SESDeploy = {
    $$type: 'SESDeploy';
    queryId: bigint;
};
type SESSubscribe = {
    $$type: 'SESSubscribe';
    queryId: bigint;
    notificationsCount: bigint;
};
type SESUnsubscribe = {
    $$type: 'SESUnsubscribe';
    queryId: bigint;
};
type SESDestroy = {
    $$type: 'SESDestroy';
    queryId: bigint;
};
declare class Session implements Contract {
    static init(stream: Address, subscriber: Address): Promise<{
        code: Cell;
        data: Cell;
    }>;
    static fromInit(stream: Address, subscriber: Address): Promise<Session>;
    static fromAddress(address: Address): Session;
    readonly address: Address;
    readonly init?: {
        code: Cell;
        data: Cell;
    };
    readonly abi: ContractABI;
    private constructor();
    send(provider: ContractProvider, via: Sender, args: {
        value: bigint;
        bounce?: boolean | null | undefined;
    }, message: SESDeploy | SESSubscribe | DSTSubscribeSuccess | SBCandlestickPublishedNotification | DSTUnsubscribedNotification | SESUnsubscribe | SESDestroy): Promise<void>;
    getBalance(provider: ContractProvider): Promise<bigint>;
    getStorageReserve(provider: ContractProvider): Promise<bigint>;
    getSubscribeDeposit(provider: ContractProvider): Promise<bigint>;
    getUnsubscribeDeposit(provider: ContractProvider): Promise<bigint>;
    getDestroyDeposit(provider: ContractProvider): Promise<bigint>;
    getStreamAddress(provider: ContractProvider): Promise<Address>;
    getSubscriberAddress(provider: ContractProvider): Promise<Address>;
    getBatchAddress(provider: ContractProvider): Promise<Address | null>;
}

type DSTDeploySessionSuccess = {
    $$type: 'DSTDeploySessionSuccess';
    queryId: bigint;
    session: Address;
};
type Candlestick$1 = {
    $$type: 'Candlestick';
    start: bigint;
    end: bigint;
    open: bigint;
    close: bigint;
    high: bigint;
    low: bigint;
};
type SESSubscribeSuccess = {
    $$type: 'SESSubscribeSuccess';
    queryId: bigint;
    remainingNotificationsCount: bigint;
};
type SESCandlestickPublishedNotification = {
    $$type: 'SESCandlestickPublishedNotification';
    queryId: bigint;
    candlestick: Candlestick$1;
    remainingNotificationsCount: bigint;
};
type SESUnsubscribedNotification = {
    $$type: 'SESUnsubscribedNotification';
    queryId: bigint;
    remainingNotificationsCount: bigint;
};
type SESDestroySuccess = {
    $$type: 'SESDestroySuccess';
    queryId: bigint;
};
type SubscriberCheckTimeout = {
    $$type: 'SubscriberCheckTimeout';
    queryId: bigint;
};
declare function storeSubscriberCheckTimeout(src: SubscriberCheckTimeout): (builder: Builder) => void;
type SimpleSubscriberDeploy = {
    $$type: 'SimpleSubscriberDeploy';
    queryId: bigint;
    stream: Address;
    notificationsCount: bigint;
    expiration: bigint;
};
declare function storeSimpleSubscriberDeploy(src: SimpleSubscriberDeploy): (builder: Builder) => void;
declare class SimpleSubscriber implements Contract {
    static init(deployer: Address, subscriberId: bigint): Promise<{
        code: Cell;
        data: Cell;
    }>;
    static fromInit(deployer: Address, subscriberId: bigint): Promise<SimpleSubscriber>;
    static fromAddress(address: Address): SimpleSubscriber;
    readonly address: Address;
    readonly init?: {
        code: Cell;
        data: Cell;
    };
    readonly abi: ContractABI;
    private constructor();
    send(provider: ContractProvider, via: Sender, args: {
        value: bigint;
        bounce?: boolean | null | undefined;
    }, message: SimpleSubscriberDeploy | DSTDeploySessionSuccess | SESSubscribeSuccess | SESCandlestickPublishedNotification | SESUnsubscribedNotification | SESDestroySuccess | SubscriberCheckTimeout): Promise<void>;
    getLatestCandlestick(provider: ContractProvider): Promise<{
        $$type: "Candlestick";
        start: bigint;
        end: bigint;
        open: bigint;
        close: bigint;
        high: bigint;
        low: bigint;
    } | null>;
    getBalance(provider: ContractProvider): Promise<bigint>;
    getDeployerAddress(provider: ContractProvider): Promise<Address>;
    getStreamAddress(provider: ContractProvider): Promise<Address | null>;
    getNotificationsCount(provider: ContractProvider): Promise<bigint | null>;
    getExpiration(provider: ContractProvider): Promise<bigint | null>;
    getSessionAddress(provider: ContractProvider): Promise<Address | null>;
}

type Candlestick = {
    $$type: 'Candlestick';
    start: bigint;
    end: bigint;
    open: bigint;
    close: bigint;
    high: bigint;
    low: bigint;
};
type SBDeploy = {
    $$type: 'SBDeploy';
    queryId: bigint;
};
type SBSubscribe = {
    $$type: 'SBSubscribe';
    queryId: bigint;
    session: Address;
    notificationsCount: bigint;
};
type SBPublishCandlestick = {
    $$type: 'SBPublishCandlestick';
    queryId: bigint;
    candlestick: Candlestick;
    publisher: Address;
};
type SBTopUpSubscription = {
    $$type: 'SBTopUpSubscription';
    queryId: bigint;
    session: Address;
    notificationsCount: bigint;
};
type SBUnsubscribe = {
    $$type: 'SBUnsubscribe';
    queryId: bigint;
};
type SubscriptionInfo = {
    $$type: 'SubscriptionInfo';
    remainingNotificationsCount: bigint;
};
type SBInfo = {
    $$type: 'SBInfo';
    subscriptionsCount: bigint;
};
declare class SubscriptionBatch implements Contract {
    static init(stream: Address, batchId: bigint): Promise<{
        code: Cell;
        data: Cell;
    }>;
    static fromInit(stream: Address, batchId: bigint): Promise<SubscriptionBatch>;
    static fromAddress(address: Address): SubscriptionBatch;
    readonly address: Address;
    readonly init?: {
        code: Cell;
        data: Cell;
    };
    readonly abi: ContractABI;
    private constructor();
    send(provider: ContractProvider, via: Sender, args: {
        value: bigint;
        bounce?: boolean | null | undefined;
    }, message: SBDeploy | SBSubscribe | SBTopUpSubscription | SBPublishCandlestick | SBUnsubscribe): Promise<void>;
    getBalance(provider: ContractProvider): Promise<bigint>;
    getStorageReserve(provider: ContractProvider): Promise<bigint>;
    getStreamAddress(provider: ContractProvider): Promise<Address>;
    getBatchId(provider: ContractProvider): Promise<bigint>;
    getSubscriptions(provider: ContractProvider): Promise<Dictionary<Address, SubscriptionInfo>>;
    getSubscriptionsCount(provider: ContractProvider): Promise<bigint>;
}

declare const ERR_ACCESS_DENIED: bigint;
declare const ERR_INSUFFICIENT_DEPOSIT: bigint;
declare const ERR_BATCH_LIMIT_EXCEEDED: bigint;
declare const ERR_SUBSCRIPTION_LIMIT_EXCEEDED: bigint;
declare const ERR_INVALID_ARGUMENT: bigint;
declare const ERR_STREAM_NOT_SUBSCRIBED: bigint;
declare const ERR_STREAM_SUBSCRIBED: bigint;
declare const ERR_BATCH_NOT_FOUND: bigint;
declare const ERR_OPTION_NOT_EXPIRED: bigint;
declare const ERR_INVALID_STATE: bigint;
declare const ERR_NOT_DEPLOYED = 410;
declare const ERR_TIMEOUT_NOT_EXCEEDED = 411;
declare const NOTIFICATION_DEPOSIT: bigint;
declare const NOTIFICATION_PREMIUM: bigint;
declare const SUS_STORAGE_RESERVE: bigint;
declare const SUS_OPERATIONAL_RESERVE: bigint;
declare const THE_GREAT_CONJUCTION_2077: number;
declare const DAY: number;
declare const THE_CELESTIAL_CONVERGENCE: number;
declare const CNO_STATE_DEPLOYED: bigint;
declare const CNO_STATE_PENDING_DEPLOY_SESSION: bigint;
declare const CNO_STATE_PENDING_SUBSCRIBE_STREAM: bigint;
declare const CNO_STATE_INITIATED: bigint;
declare const CNO_STATE_SETTLED: bigint;
declare const CNO_STATE_PENDING_UNSUBSCRIBE_STREAM: bigint;
declare const CNO_STATE_PENDING_DESTROY_SESSION: bigint;

export { Broker, Brokerage, BrokerageAccount, CNO_STATE_DEPLOYED, CNO_STATE_INITIATED, CNO_STATE_PENDING_DEPLOY_SESSION, CNO_STATE_PENDING_DESTROY_SESSION, CNO_STATE_PENDING_SUBSCRIBE_STREAM, CNO_STATE_PENDING_UNSUBSCRIBE_STREAM, CNO_STATE_SETTLED, type Candlestick$3 as Candlestick, CashOrNothingOption, type CashOrNothingOptionAgreement, type CashOrNothingOptionDraftAgreement, DAY, DataStream, ERR_ACCESS_DENIED, ERR_BATCH_LIMIT_EXCEEDED, ERR_BATCH_NOT_FOUND, ERR_INSUFFICIENT_DEPOSIT, ERR_INVALID_ARGUMENT, ERR_INVALID_STATE, ERR_NOT_DEPLOYED, ERR_OPTION_NOT_EXPIRED, ERR_STREAM_NOT_SUBSCRIBED, ERR_STREAM_SUBSCRIBED, ERR_SUBSCRIPTION_LIMIT_EXCEEDED, ERR_TIMEOUT_NOT_EXCEEDED, NOTIFICATION_DEPOSIT, NOTIFICATION_PREMIUM, type SBInfo, SUS_OPERATIONAL_RESERVE, SUS_STORAGE_RESERVE, Session, SimpleSubscriber, SubscriptionBatch, type SubscriptionInfo, THE_CELESTIAL_CONVERGENCE, THE_GREAT_CONJUCTION_2077, loadCashOrNothingOptionDeploy, loadStateInit, storeBRGDeploy, storeBrokerDeployOption, storeCashOrNothingOptionDeploy, storeDSTDeploy, storeDSTDeployBatch, storeDSTDeploySession, storeDSTPublishCandlestick, storeSESDestroy, storeSESSubscribe, storeSESUnsubscribe, storeSimpleSubscriberDeploy, storeStateInit, storeSubscriberCheckTimeout };
