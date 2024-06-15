import { 
    Cell,
    Slice, 
    Address, 
    Builder, 
    beginCell, 
    ComputeError, 
    TupleItem, 
    TupleReader, 
    Dictionary, 
    contractAddress, 
    ContractProvider, 
    Sender, 
    Contract, 
    ContractABI, 
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
    let builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Cell;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw);
    };
}

export function loadContext(slice: Slice) {
    let sc_0 = slice;
    let _bounced = sc_0.loadBit();
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _raw = sc_0.loadRef();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function storeTupleContext(source: Context) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounced);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw);
    return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounce);
        b_0.storeAddress(src.to);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
    };
}

export function loadSendParameters(slice: Slice) {
    let sc_0 = slice;
    let _bounce = sc_0.loadBit();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _mode = sc_0.loadIntBig(257);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function storeTupleSendParameters(source: SendParameters) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounce);
    builder.writeAddress(source.to);
    builder.writeNumber(source.value);
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type DSTDeploy = {
    $$type: 'DSTDeploy';
    queryId: bigint;
}

export function storeDSTDeploy(src: DSTDeploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3524136291, 32);
        b_0.storeInt(src.queryId, 257);
    };
}

export function loadDSTDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3524136291) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    return { $$type: 'DSTDeploy' as const, queryId: _queryId };
}

function loadTupleDSTDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DSTDeploy' as const, queryId: _queryId };
}

function storeTupleDSTDeploy(source: DSTDeploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDSTDeploy(): DictionaryValue<DSTDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDSTDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDSTDeploy(src.loadRef().beginParse());
        }
    }
}

export type DSTDeploySuccess = {
    $$type: 'DSTDeploySuccess';
    queryId: bigint;
}

export function storeDSTDeploySuccess(src: DSTDeploySuccess) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3293073783, 32);
        b_0.storeInt(src.queryId, 257);
    };
}

export function loadDSTDeploySuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3293073783) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    return { $$type: 'DSTDeploySuccess' as const, queryId: _queryId };
}

function loadTupleDSTDeploySuccess(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DSTDeploySuccess' as const, queryId: _queryId };
}

function storeTupleDSTDeploySuccess(source: DSTDeploySuccess) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDSTDeploySuccess(): DictionaryValue<DSTDeploySuccess> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDSTDeploySuccess(src)).endCell());
        },
        parse: (src) => {
            return loadDSTDeploySuccess(src.loadRef().beginParse());
        }
    }
}

export type DSTDeployBatch = {
    $$type: 'DSTDeployBatch';
    queryId: bigint;
}

export function storeDSTDeployBatch(src: DSTDeployBatch) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2656587996, 32);
        b_0.storeInt(src.queryId, 257);
    };
}

export function loadDSTDeployBatch(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2656587996) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    return { $$type: 'DSTDeployBatch' as const, queryId: _queryId };
}

function loadTupleDSTDeployBatch(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DSTDeployBatch' as const, queryId: _queryId };
}

function storeTupleDSTDeployBatch(source: DSTDeployBatch) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDSTDeployBatch(): DictionaryValue<DSTDeployBatch> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDSTDeployBatch(src)).endCell());
        },
        parse: (src) => {
            return loadDSTDeployBatch(src.loadRef().beginParse());
        }
    }
}

export type DSTDeployBatchSuccess = {
    $$type: 'DSTDeployBatchSuccess';
    queryId: bigint;
    batch: Address;
}

export function storeDSTDeployBatchSuccess(src: DSTDeployBatchSuccess) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1712881333, 32);
        b_0.storeInt(src.queryId, 257);
        b_0.storeAddress(src.batch);
    };
}

export function loadDSTDeployBatchSuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1712881333) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    let _batch = sc_0.loadAddress();
    return { $$type: 'DSTDeployBatchSuccess' as const, queryId: _queryId, batch: _batch };
}

function loadTupleDSTDeployBatchSuccess(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _batch = source.readAddress();
    return { $$type: 'DSTDeployBatchSuccess' as const, queryId: _queryId, batch: _batch };
}

function storeTupleDSTDeployBatchSuccess(source: DSTDeployBatchSuccess) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.batch);
    return builder.build();
}

function dictValueParserDSTDeployBatchSuccess(): DictionaryValue<DSTDeployBatchSuccess> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDSTDeployBatchSuccess(src)).endCell());
        },
        parse: (src) => {
            return loadDSTDeployBatchSuccess(src.loadRef().beginParse());
        }
    }
}

export type DSTDeploySession = {
    $$type: 'DSTDeploySession';
    queryId: bigint;
}

export function storeDSTDeploySession(src: DSTDeploySession) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3841442478, 32);
        b_0.storeInt(src.queryId, 257);
    };
}

export function loadDSTDeploySession(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3841442478) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    return { $$type: 'DSTDeploySession' as const, queryId: _queryId };
}

function loadTupleDSTDeploySession(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DSTDeploySession' as const, queryId: _queryId };
}

function storeTupleDSTDeploySession(source: DSTDeploySession) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDSTDeploySession(): DictionaryValue<DSTDeploySession> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDSTDeploySession(src)).endCell());
        },
        parse: (src) => {
            return loadDSTDeploySession(src.loadRef().beginParse());
        }
    }
}

export type DSTDeploySessionSuccess = {
    $$type: 'DSTDeploySessionSuccess';
    queryId: bigint;
    session: Address;
}

export function storeDSTDeploySessionSuccess(src: DSTDeploySessionSuccess) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3450176327, 32);
        b_0.storeInt(src.queryId, 257);
        b_0.storeAddress(src.session);
    };
}

export function loadDSTDeploySessionSuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3450176327) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    let _session = sc_0.loadAddress();
    return { $$type: 'DSTDeploySessionSuccess' as const, queryId: _queryId, session: _session };
}

function loadTupleDSTDeploySessionSuccess(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _session = source.readAddress();
    return { $$type: 'DSTDeploySessionSuccess' as const, queryId: _queryId, session: _session };
}

function storeTupleDSTDeploySessionSuccess(source: DSTDeploySessionSuccess) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.session);
    return builder.build();
}

function dictValueParserDSTDeploySessionSuccess(): DictionaryValue<DSTDeploySessionSuccess> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDSTDeploySessionSuccess(src)).endCell());
        },
        parse: (src) => {
            return loadDSTDeploySessionSuccess(src.loadRef().beginParse());
        }
    }
}

export type DSTSubscribe = {
    $$type: 'DSTSubscribe';
    queryId: bigint;
    subscriber: Address;
    notificationsCount: bigint;
}

export function storeDSTSubscribe(src: DSTSubscribe) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(463946169, 32);
        b_0.storeInt(src.queryId, 257);
        b_0.storeAddress(src.subscriber);
        b_0.storeInt(src.notificationsCount, 257);
    };
}

export function loadDSTSubscribe(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 463946169) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    let _subscriber = sc_0.loadAddress();
    let _notificationsCount = sc_0.loadIntBig(257);
    return { $$type: 'DSTSubscribe' as const, queryId: _queryId, subscriber: _subscriber, notificationsCount: _notificationsCount };
}

function loadTupleDSTSubscribe(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _subscriber = source.readAddress();
    let _notificationsCount = source.readBigNumber();
    return { $$type: 'DSTSubscribe' as const, queryId: _queryId, subscriber: _subscriber, notificationsCount: _notificationsCount };
}

function storeTupleDSTSubscribe(source: DSTSubscribe) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.subscriber);
    builder.writeNumber(source.notificationsCount);
    return builder.build();
}

function dictValueParserDSTSubscribe(): DictionaryValue<DSTSubscribe> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDSTSubscribe(src)).endCell());
        },
        parse: (src) => {
            return loadDSTSubscribe(src.loadRef().beginParse());
        }
    }
}

export type DSTSubscribeSuccess = {
    $$type: 'DSTSubscribeSuccess';
    queryId: bigint;
    batch: Address;
    remainingNotificationsCount: bigint;
}

export function storeDSTSubscribeSuccess(src: DSTSubscribeSuccess) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(989465183, 32);
        b_0.storeInt(src.queryId, 257);
        b_0.storeAddress(src.batch);
        b_0.storeInt(src.remainingNotificationsCount, 257);
    };
}

export function loadDSTSubscribeSuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 989465183) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    let _batch = sc_0.loadAddress();
    let _remainingNotificationsCount = sc_0.loadIntBig(257);
    return { $$type: 'DSTSubscribeSuccess' as const, queryId: _queryId, batch: _batch, remainingNotificationsCount: _remainingNotificationsCount };
}

function loadTupleDSTSubscribeSuccess(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _batch = source.readAddress();
    let _remainingNotificationsCount = source.readBigNumber();
    return { $$type: 'DSTSubscribeSuccess' as const, queryId: _queryId, batch: _batch, remainingNotificationsCount: _remainingNotificationsCount };
}

function storeTupleDSTSubscribeSuccess(source: DSTSubscribeSuccess) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.batch);
    builder.writeNumber(source.remainingNotificationsCount);
    return builder.build();
}

function dictValueParserDSTSubscribeSuccess(): DictionaryValue<DSTSubscribeSuccess> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDSTSubscribeSuccess(src)).endCell());
        },
        parse: (src) => {
            return loadDSTSubscribeSuccess(src.loadRef().beginParse());
        }
    }
}

export type Candlestick = {
    $$type: 'Candlestick';
    start: bigint;
    end: bigint;
    open: bigint;
    close: bigint;
    high: bigint;
    low: bigint;
}

export function storeCandlestick(src: Candlestick) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.start, 257);
        b_0.storeInt(src.end, 257);
        b_0.storeInt(src.open, 257);
        let b_1 = new Builder();
        b_1.storeInt(src.close, 257);
        b_1.storeInt(src.high, 257);
        b_1.storeInt(src.low, 257);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadCandlestick(slice: Slice) {
    let sc_0 = slice;
    let _start = sc_0.loadIntBig(257);
    let _end = sc_0.loadIntBig(257);
    let _open = sc_0.loadIntBig(257);
    let sc_1 = sc_0.loadRef().beginParse();
    let _close = sc_1.loadIntBig(257);
    let _high = sc_1.loadIntBig(257);
    let _low = sc_1.loadIntBig(257);
    return { $$type: 'Candlestick' as const, start: _start, end: _end, open: _open, close: _close, high: _high, low: _low };
}

function loadTupleCandlestick(source: TupleReader) {
    let _start = source.readBigNumber();
    let _end = source.readBigNumber();
    let _open = source.readBigNumber();
    let _close = source.readBigNumber();
    let _high = source.readBigNumber();
    let _low = source.readBigNumber();
    return { $$type: 'Candlestick' as const, start: _start, end: _end, open: _open, close: _close, high: _high, low: _low };
}

function storeTupleCandlestick(source: Candlestick) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.start);
    builder.writeNumber(source.end);
    builder.writeNumber(source.open);
    builder.writeNumber(source.close);
    builder.writeNumber(source.high);
    builder.writeNumber(source.low);
    return builder.build();
}

function dictValueParserCandlestick(): DictionaryValue<Candlestick> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCandlestick(src)).endCell());
        },
        parse: (src) => {
            return loadCandlestick(src.loadRef().beginParse());
        }
    }
}

export type DSTPublishCandlestick = {
    $$type: 'DSTPublishCandlestick';
    queryId: bigint;
    candlestick: Candlestick;
}

export function storeDSTPublishCandlestick(src: DSTPublishCandlestick) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3817608170, 32);
        b_0.storeInt(src.queryId, 257);
        let b_1 = new Builder();
        b_1.store(storeCandlestick(src.candlestick));
        b_0.storeRef(b_1.endCell());
    };
}

export function loadDSTPublishCandlestick(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3817608170) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    let sc_1 = sc_0.loadRef().beginParse();
    let _candlestick = loadCandlestick(sc_1);
    return { $$type: 'DSTPublishCandlestick' as const, queryId: _queryId, candlestick: _candlestick };
}

function loadTupleDSTPublishCandlestick(source: TupleReader) {
    let _queryId = source.readBigNumber();
    const _candlestick = loadTupleCandlestick(source.readTuple());
    return { $$type: 'DSTPublishCandlestick' as const, queryId: _queryId, candlestick: _candlestick };
}

function storeTupleDSTPublishCandlestick(source: DSTPublishCandlestick) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeTuple(storeTupleCandlestick(source.candlestick));
    return builder.build();
}

function dictValueParserDSTPublishCandlestick(): DictionaryValue<DSTPublishCandlestick> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDSTPublishCandlestick(src)).endCell());
        },
        parse: (src) => {
            return loadDSTPublishCandlestick(src.loadRef().beginParse());
        }
    }
}

export type DSTPublishCandlestickSuccess = {
    $$type: 'DSTPublishCandlestickSuccess';
    queryId: bigint;
}

export function storeDSTPublishCandlestickSuccess(src: DSTPublishCandlestickSuccess) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2992211220, 32);
        b_0.storeInt(src.queryId, 257);
    };
}

export function loadDSTPublishCandlestickSuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2992211220) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    return { $$type: 'DSTPublishCandlestickSuccess' as const, queryId: _queryId };
}

function loadTupleDSTPublishCandlestickSuccess(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DSTPublishCandlestickSuccess' as const, queryId: _queryId };
}

function storeTupleDSTPublishCandlestickSuccess(source: DSTPublishCandlestickSuccess) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDSTPublishCandlestickSuccess(): DictionaryValue<DSTPublishCandlestickSuccess> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDSTPublishCandlestickSuccess(src)).endCell());
        },
        parse: (src) => {
            return loadDSTPublishCandlestickSuccess(src.loadRef().beginParse());
        }
    }
}

export type DSTUnsubscribedNotification = {
    $$type: 'DSTUnsubscribedNotification';
    queryId: bigint;
    remainingNotificationsCount: bigint;
}

export function storeDSTUnsubscribedNotification(src: DSTUnsubscribedNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2982918748, 32);
        b_0.storeInt(src.queryId, 257);
        b_0.storeInt(src.remainingNotificationsCount, 257);
    };
}

export function loadDSTUnsubscribedNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2982918748) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    let _remainingNotificationsCount = sc_0.loadIntBig(257);
    return { $$type: 'DSTUnsubscribedNotification' as const, queryId: _queryId, remainingNotificationsCount: _remainingNotificationsCount };
}

function loadTupleDSTUnsubscribedNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _remainingNotificationsCount = source.readBigNumber();
    return { $$type: 'DSTUnsubscribedNotification' as const, queryId: _queryId, remainingNotificationsCount: _remainingNotificationsCount };
}

function storeTupleDSTUnsubscribedNotification(source: DSTUnsubscribedNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.remainingNotificationsCount);
    return builder.build();
}

function dictValueParserDSTUnsubscribedNotification(): DictionaryValue<DSTUnsubscribedNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDSTUnsubscribedNotification(src)).endCell());
        },
        parse: (src) => {
            return loadDSTUnsubscribedNotification(src.loadRef().beginParse());
        }
    }
}

export type SBDeploy = {
    $$type: 'SBDeploy';
    queryId: bigint;
}

export function storeSBDeploy(src: SBDeploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1599636199, 32);
        b_0.storeInt(src.queryId, 257);
    };
}

export function loadSBDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1599636199) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    return { $$type: 'SBDeploy' as const, queryId: _queryId };
}

function loadTupleSBDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'SBDeploy' as const, queryId: _queryId };
}

function storeTupleSBDeploy(source: SBDeploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserSBDeploy(): DictionaryValue<SBDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSBDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadSBDeploy(src.loadRef().beginParse());
        }
    }
}

export type SBDeploySuccess = {
    $$type: 'SBDeploySuccess';
    queryId: bigint;
    batchId: bigint;
}

export function storeSBDeploySuccess(src: SBDeploySuccess) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3719915174, 32);
        b_0.storeInt(src.queryId, 257);
        b_0.storeInt(src.batchId, 257);
    };
}

export function loadSBDeploySuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3719915174) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    let _batchId = sc_0.loadIntBig(257);
    return { $$type: 'SBDeploySuccess' as const, queryId: _queryId, batchId: _batchId };
}

function loadTupleSBDeploySuccess(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _batchId = source.readBigNumber();
    return { $$type: 'SBDeploySuccess' as const, queryId: _queryId, batchId: _batchId };
}

function storeTupleSBDeploySuccess(source: SBDeploySuccess) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.batchId);
    return builder.build();
}

function dictValueParserSBDeploySuccess(): DictionaryValue<SBDeploySuccess> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSBDeploySuccess(src)).endCell());
        },
        parse: (src) => {
            return loadSBDeploySuccess(src.loadRef().beginParse());
        }
    }
}

export type SBSubscribe = {
    $$type: 'SBSubscribe';
    queryId: bigint;
    session: Address;
    notificationsCount: bigint;
}

export function storeSBSubscribe(src: SBSubscribe) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3584015583, 32);
        b_0.storeInt(src.queryId, 257);
        b_0.storeAddress(src.session);
        b_0.storeInt(src.notificationsCount, 257);
    };
}

export function loadSBSubscribe(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3584015583) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    let _session = sc_0.loadAddress();
    let _notificationsCount = sc_0.loadIntBig(257);
    return { $$type: 'SBSubscribe' as const, queryId: _queryId, session: _session, notificationsCount: _notificationsCount };
}

function loadTupleSBSubscribe(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _session = source.readAddress();
    let _notificationsCount = source.readBigNumber();
    return { $$type: 'SBSubscribe' as const, queryId: _queryId, session: _session, notificationsCount: _notificationsCount };
}

function storeTupleSBSubscribe(source: SBSubscribe) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.session);
    builder.writeNumber(source.notificationsCount);
    return builder.build();
}

function dictValueParserSBSubscribe(): DictionaryValue<SBSubscribe> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSBSubscribe(src)).endCell());
        },
        parse: (src) => {
            return loadSBSubscribe(src.loadRef().beginParse());
        }
    }
}

export type SBSubscribeSuccess = {
    $$type: 'SBSubscribeSuccess';
    queryId: bigint;
    session: Address;
    remainingNotificationsCount: bigint;
}

export function storeSBSubscribeSuccess(src: SBSubscribeSuccess) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(376773611, 32);
        b_0.storeInt(src.queryId, 257);
        b_0.storeAddress(src.session);
        b_0.storeInt(src.remainingNotificationsCount, 257);
    };
}

export function loadSBSubscribeSuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 376773611) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    let _session = sc_0.loadAddress();
    let _remainingNotificationsCount = sc_0.loadIntBig(257);
    return { $$type: 'SBSubscribeSuccess' as const, queryId: _queryId, session: _session, remainingNotificationsCount: _remainingNotificationsCount };
}

function loadTupleSBSubscribeSuccess(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _session = source.readAddress();
    let _remainingNotificationsCount = source.readBigNumber();
    return { $$type: 'SBSubscribeSuccess' as const, queryId: _queryId, session: _session, remainingNotificationsCount: _remainingNotificationsCount };
}

function storeTupleSBSubscribeSuccess(source: SBSubscribeSuccess) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.session);
    builder.writeNumber(source.remainingNotificationsCount);
    return builder.build();
}

function dictValueParserSBSubscribeSuccess(): DictionaryValue<SBSubscribeSuccess> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSBSubscribeSuccess(src)).endCell());
        },
        parse: (src) => {
            return loadSBSubscribeSuccess(src.loadRef().beginParse());
        }
    }
}

export type SBPublishCandlestick = {
    $$type: 'SBPublishCandlestick';
    queryId: bigint;
    candlestick: Candlestick;
    publisher: Address;
}

export function storeSBPublishCandlestick(src: SBPublishCandlestick) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3122546640, 32);
        b_0.storeInt(src.queryId, 257);
        let b_1 = new Builder();
        b_1.store(storeCandlestick(src.candlestick));
        let b_2 = new Builder();
        b_2.storeAddress(src.publisher);
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadSBPublishCandlestick(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3122546640) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    let sc_1 = sc_0.loadRef().beginParse();
    let _candlestick = loadCandlestick(sc_1);
    let sc_2 = sc_1.loadRef().beginParse();
    let _publisher = sc_2.loadAddress();
    return { $$type: 'SBPublishCandlestick' as const, queryId: _queryId, candlestick: _candlestick, publisher: _publisher };
}

function loadTupleSBPublishCandlestick(source: TupleReader) {
    let _queryId = source.readBigNumber();
    const _candlestick = loadTupleCandlestick(source.readTuple());
    let _publisher = source.readAddress();
    return { $$type: 'SBPublishCandlestick' as const, queryId: _queryId, candlestick: _candlestick, publisher: _publisher };
}

function storeTupleSBPublishCandlestick(source: SBPublishCandlestick) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeTuple(storeTupleCandlestick(source.candlestick));
    builder.writeAddress(source.publisher);
    return builder.build();
}

function dictValueParserSBPublishCandlestick(): DictionaryValue<SBPublishCandlestick> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSBPublishCandlestick(src)).endCell());
        },
        parse: (src) => {
            return loadSBPublishCandlestick(src.loadRef().beginParse());
        }
    }
}

export type SBCandlestickPublishedNotification = {
    $$type: 'SBCandlestickPublishedNotification';
    queryId: bigint;
    candlestick: Candlestick;
    remainingNotificationsCount: bigint;
}

export function storeSBCandlestickPublishedNotification(src: SBCandlestickPublishedNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2999531292, 32);
        b_0.storeInt(src.queryId, 257);
        let b_1 = new Builder();
        b_1.store(storeCandlestick(src.candlestick));
        let b_2 = new Builder();
        b_2.storeInt(src.remainingNotificationsCount, 257);
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadSBCandlestickPublishedNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2999531292) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    let sc_1 = sc_0.loadRef().beginParse();
    let _candlestick = loadCandlestick(sc_1);
    let sc_2 = sc_1.loadRef().beginParse();
    let _remainingNotificationsCount = sc_2.loadIntBig(257);
    return { $$type: 'SBCandlestickPublishedNotification' as const, queryId: _queryId, candlestick: _candlestick, remainingNotificationsCount: _remainingNotificationsCount };
}

function loadTupleSBCandlestickPublishedNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    const _candlestick = loadTupleCandlestick(source.readTuple());
    let _remainingNotificationsCount = source.readBigNumber();
    return { $$type: 'SBCandlestickPublishedNotification' as const, queryId: _queryId, candlestick: _candlestick, remainingNotificationsCount: _remainingNotificationsCount };
}

function storeTupleSBCandlestickPublishedNotification(source: SBCandlestickPublishedNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeTuple(storeTupleCandlestick(source.candlestick));
    builder.writeNumber(source.remainingNotificationsCount);
    return builder.build();
}

function dictValueParserSBCandlestickPublishedNotification(): DictionaryValue<SBCandlestickPublishedNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSBCandlestickPublishedNotification(src)).endCell());
        },
        parse: (src) => {
            return loadSBCandlestickPublishedNotification(src.loadRef().beginParse());
        }
    }
}

export type SBUnsubscribedNotification = {
    $$type: 'SBUnsubscribedNotification';
    queryId: bigint;
    session: Address;
    remainingNotificationsCount: bigint;
}

export function storeSBUnsubscribedNotification(src: SBUnsubscribedNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2190235549, 32);
        b_0.storeInt(src.queryId, 257);
        b_0.storeAddress(src.session);
        b_0.storeInt(src.remainingNotificationsCount, 257);
    };
}

export function loadSBUnsubscribedNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2190235549) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    let _session = sc_0.loadAddress();
    let _remainingNotificationsCount = sc_0.loadIntBig(257);
    return { $$type: 'SBUnsubscribedNotification' as const, queryId: _queryId, session: _session, remainingNotificationsCount: _remainingNotificationsCount };
}

function loadTupleSBUnsubscribedNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _session = source.readAddress();
    let _remainingNotificationsCount = source.readBigNumber();
    return { $$type: 'SBUnsubscribedNotification' as const, queryId: _queryId, session: _session, remainingNotificationsCount: _remainingNotificationsCount };
}

function storeTupleSBUnsubscribedNotification(source: SBUnsubscribedNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.session);
    builder.writeNumber(source.remainingNotificationsCount);
    return builder.build();
}

function dictValueParserSBUnsubscribedNotification(): DictionaryValue<SBUnsubscribedNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSBUnsubscribedNotification(src)).endCell());
        },
        parse: (src) => {
            return loadSBUnsubscribedNotification(src.loadRef().beginParse());
        }
    }
}

export type SBPublishCandlestickSuccess = {
    $$type: 'SBPublishCandlestickSuccess';
    queryId: bigint;
}

export function storeSBPublishCandlestickSuccess(src: SBPublishCandlestickSuccess) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2101442610, 32);
        b_0.storeInt(src.queryId, 257);
    };
}

export function loadSBPublishCandlestickSuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2101442610) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    return { $$type: 'SBPublishCandlestickSuccess' as const, queryId: _queryId };
}

function loadTupleSBPublishCandlestickSuccess(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'SBPublishCandlestickSuccess' as const, queryId: _queryId };
}

function storeTupleSBPublishCandlestickSuccess(source: SBPublishCandlestickSuccess) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserSBPublishCandlestickSuccess(): DictionaryValue<SBPublishCandlestickSuccess> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSBPublishCandlestickSuccess(src)).endCell());
        },
        parse: (src) => {
            return loadSBPublishCandlestickSuccess(src.loadRef().beginParse());
        }
    }
}

export type SESDeploy = {
    $$type: 'SESDeploy';
    queryId: bigint;
}

export function storeSESDeploy(src: SESDeploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3106659465, 32);
        b_0.storeInt(src.queryId, 257);
    };
}

export function loadSESDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3106659465) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    return { $$type: 'SESDeploy' as const, queryId: _queryId };
}

function loadTupleSESDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'SESDeploy' as const, queryId: _queryId };
}

function storeTupleSESDeploy(source: SESDeploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserSESDeploy(): DictionaryValue<SESDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSESDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadSESDeploy(src.loadRef().beginParse());
        }
    }
}

export type SESDeploySuccess = {
    $$type: 'SESDeploySuccess';
    queryId: bigint;
    subscriber: Address;
}

export function storeSESDeploySuccess(src: SESDeploySuccess) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2845333598, 32);
        b_0.storeInt(src.queryId, 257);
        b_0.storeAddress(src.subscriber);
    };
}

export function loadSESDeploySuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2845333598) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    let _subscriber = sc_0.loadAddress();
    return { $$type: 'SESDeploySuccess' as const, queryId: _queryId, subscriber: _subscriber };
}

function loadTupleSESDeploySuccess(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _subscriber = source.readAddress();
    return { $$type: 'SESDeploySuccess' as const, queryId: _queryId, subscriber: _subscriber };
}

function storeTupleSESDeploySuccess(source: SESDeploySuccess) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.subscriber);
    return builder.build();
}

function dictValueParserSESDeploySuccess(): DictionaryValue<SESDeploySuccess> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSESDeploySuccess(src)).endCell());
        },
        parse: (src) => {
            return loadSESDeploySuccess(src.loadRef().beginParse());
        }
    }
}

export type SESSubscribe = {
    $$type: 'SESSubscribe';
    queryId: bigint;
    notificationsCount: bigint;
}

export function storeSESSubscribe(src: SESSubscribe) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2347424105, 32);
        b_0.storeInt(src.queryId, 257);
        b_0.storeInt(src.notificationsCount, 257);
    };
}

export function loadSESSubscribe(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2347424105) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    let _notificationsCount = sc_0.loadIntBig(257);
    return { $$type: 'SESSubscribe' as const, queryId: _queryId, notificationsCount: _notificationsCount };
}

function loadTupleSESSubscribe(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _notificationsCount = source.readBigNumber();
    return { $$type: 'SESSubscribe' as const, queryId: _queryId, notificationsCount: _notificationsCount };
}

function storeTupleSESSubscribe(source: SESSubscribe) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.notificationsCount);
    return builder.build();
}

function dictValueParserSESSubscribe(): DictionaryValue<SESSubscribe> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSESSubscribe(src)).endCell());
        },
        parse: (src) => {
            return loadSESSubscribe(src.loadRef().beginParse());
        }
    }
}

export type DSTTopUpSubscription = {
    $$type: 'DSTTopUpSubscription';
    queryId: bigint;
    subscriber: Address;
    batch: Address;
    notificationsCount: bigint;
}

export function storeDSTTopUpSubscription(src: DSTTopUpSubscription) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3639371301, 32);
        b_0.storeInt(src.queryId, 257);
        b_0.storeAddress(src.subscriber);
        b_0.storeAddress(src.batch);
        let b_1 = new Builder();
        b_1.storeInt(src.notificationsCount, 257);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadDSTTopUpSubscription(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3639371301) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    let _subscriber = sc_0.loadAddress();
    let _batch = sc_0.loadAddress();
    let sc_1 = sc_0.loadRef().beginParse();
    let _notificationsCount = sc_1.loadIntBig(257);
    return { $$type: 'DSTTopUpSubscription' as const, queryId: _queryId, subscriber: _subscriber, batch: _batch, notificationsCount: _notificationsCount };
}

function loadTupleDSTTopUpSubscription(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _subscriber = source.readAddress();
    let _batch = source.readAddress();
    let _notificationsCount = source.readBigNumber();
    return { $$type: 'DSTTopUpSubscription' as const, queryId: _queryId, subscriber: _subscriber, batch: _batch, notificationsCount: _notificationsCount };
}

function storeTupleDSTTopUpSubscription(source: DSTTopUpSubscription) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.subscriber);
    builder.writeAddress(source.batch);
    builder.writeNumber(source.notificationsCount);
    return builder.build();
}

function dictValueParserDSTTopUpSubscription(): DictionaryValue<DSTTopUpSubscription> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDSTTopUpSubscription(src)).endCell());
        },
        parse: (src) => {
            return loadDSTTopUpSubscription(src.loadRef().beginParse());
        }
    }
}

export type SBTopUpSubscription = {
    $$type: 'SBTopUpSubscription';
    queryId: bigint;
    session: Address;
    notificationsCount: bigint;
}

export function storeSBTopUpSubscription(src: SBTopUpSubscription) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(150102477, 32);
        b_0.storeInt(src.queryId, 257);
        b_0.storeAddress(src.session);
        b_0.storeInt(src.notificationsCount, 257);
    };
}

export function loadSBTopUpSubscription(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 150102477) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    let _session = sc_0.loadAddress();
    let _notificationsCount = sc_0.loadIntBig(257);
    return { $$type: 'SBTopUpSubscription' as const, queryId: _queryId, session: _session, notificationsCount: _notificationsCount };
}

function loadTupleSBTopUpSubscription(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _session = source.readAddress();
    let _notificationsCount = source.readBigNumber();
    return { $$type: 'SBTopUpSubscription' as const, queryId: _queryId, session: _session, notificationsCount: _notificationsCount };
}

function storeTupleSBTopUpSubscription(source: SBTopUpSubscription) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.session);
    builder.writeNumber(source.notificationsCount);
    return builder.build();
}

function dictValueParserSBTopUpSubscription(): DictionaryValue<SBTopUpSubscription> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSBTopUpSubscription(src)).endCell());
        },
        parse: (src) => {
            return loadSBTopUpSubscription(src.loadRef().beginParse());
        }
    }
}

export type SESSubscribeSuccess = {
    $$type: 'SESSubscribeSuccess';
    queryId: bigint;
    remainingNotificationsCount: bigint;
}

export function storeSESSubscribeSuccess(src: SESSubscribeSuccess) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3368135549, 32);
        b_0.storeInt(src.queryId, 257);
        b_0.storeInt(src.remainingNotificationsCount, 257);
    };
}

export function loadSESSubscribeSuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3368135549) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    let _remainingNotificationsCount = sc_0.loadIntBig(257);
    return { $$type: 'SESSubscribeSuccess' as const, queryId: _queryId, remainingNotificationsCount: _remainingNotificationsCount };
}

function loadTupleSESSubscribeSuccess(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _remainingNotificationsCount = source.readBigNumber();
    return { $$type: 'SESSubscribeSuccess' as const, queryId: _queryId, remainingNotificationsCount: _remainingNotificationsCount };
}

function storeTupleSESSubscribeSuccess(source: SESSubscribeSuccess) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.remainingNotificationsCount);
    return builder.build();
}

function dictValueParserSESSubscribeSuccess(): DictionaryValue<SESSubscribeSuccess> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSESSubscribeSuccess(src)).endCell());
        },
        parse: (src) => {
            return loadSESSubscribeSuccess(src.loadRef().beginParse());
        }
    }
}

export type SESCandlestickPublishedNotification = {
    $$type: 'SESCandlestickPublishedNotification';
    queryId: bigint;
    candlestick: Candlestick;
    remainingNotificationsCount: bigint;
}

export function storeSESCandlestickPublishedNotification(src: SESCandlestickPublishedNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(4161171741, 32);
        b_0.storeInt(src.queryId, 257);
        let b_1 = new Builder();
        b_1.store(storeCandlestick(src.candlestick));
        let b_2 = new Builder();
        b_2.storeInt(src.remainingNotificationsCount, 257);
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadSESCandlestickPublishedNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 4161171741) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    let sc_1 = sc_0.loadRef().beginParse();
    let _candlestick = loadCandlestick(sc_1);
    let sc_2 = sc_1.loadRef().beginParse();
    let _remainingNotificationsCount = sc_2.loadIntBig(257);
    return { $$type: 'SESCandlestickPublishedNotification' as const, queryId: _queryId, candlestick: _candlestick, remainingNotificationsCount: _remainingNotificationsCount };
}

function loadTupleSESCandlestickPublishedNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    const _candlestick = loadTupleCandlestick(source.readTuple());
    let _remainingNotificationsCount = source.readBigNumber();
    return { $$type: 'SESCandlestickPublishedNotification' as const, queryId: _queryId, candlestick: _candlestick, remainingNotificationsCount: _remainingNotificationsCount };
}

function storeTupleSESCandlestickPublishedNotification(source: SESCandlestickPublishedNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeTuple(storeTupleCandlestick(source.candlestick));
    builder.writeNumber(source.remainingNotificationsCount);
    return builder.build();
}

function dictValueParserSESCandlestickPublishedNotification(): DictionaryValue<SESCandlestickPublishedNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSESCandlestickPublishedNotification(src)).endCell());
        },
        parse: (src) => {
            return loadSESCandlestickPublishedNotification(src.loadRef().beginParse());
        }
    }
}

export type SESUnsubscribedNotification = {
    $$type: 'SESUnsubscribedNotification';
    queryId: bigint;
    remainingNotificationsCount: bigint;
}

export function storeSESUnsubscribedNotification(src: SESUnsubscribedNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(929502243, 32);
        b_0.storeInt(src.queryId, 257);
        b_0.storeInt(src.remainingNotificationsCount, 257);
    };
}

export function loadSESUnsubscribedNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 929502243) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    let _remainingNotificationsCount = sc_0.loadIntBig(257);
    return { $$type: 'SESUnsubscribedNotification' as const, queryId: _queryId, remainingNotificationsCount: _remainingNotificationsCount };
}

function loadTupleSESUnsubscribedNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _remainingNotificationsCount = source.readBigNumber();
    return { $$type: 'SESUnsubscribedNotification' as const, queryId: _queryId, remainingNotificationsCount: _remainingNotificationsCount };
}

function storeTupleSESUnsubscribedNotification(source: SESUnsubscribedNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.remainingNotificationsCount);
    return builder.build();
}

function dictValueParserSESUnsubscribedNotification(): DictionaryValue<SESUnsubscribedNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSESUnsubscribedNotification(src)).endCell());
        },
        parse: (src) => {
            return loadSESUnsubscribedNotification(src.loadRef().beginParse());
        }
    }
}

export type SESUnsubscribe = {
    $$type: 'SESUnsubscribe';
    queryId: bigint;
}

export function storeSESUnsubscribe(src: SESUnsubscribe) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(4076456827, 32);
        b_0.storeInt(src.queryId, 257);
    };
}

export function loadSESUnsubscribe(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 4076456827) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    return { $$type: 'SESUnsubscribe' as const, queryId: _queryId };
}

function loadTupleSESUnsubscribe(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'SESUnsubscribe' as const, queryId: _queryId };
}

function storeTupleSESUnsubscribe(source: SESUnsubscribe) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserSESUnsubscribe(): DictionaryValue<SESUnsubscribe> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSESUnsubscribe(src)).endCell());
        },
        parse: (src) => {
            return loadSESUnsubscribe(src.loadRef().beginParse());
        }
    }
}

export type SBUnsubscribe = {
    $$type: 'SBUnsubscribe';
    queryId: bigint;
}

export function storeSBUnsubscribe(src: SBUnsubscribe) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3994015984, 32);
        b_0.storeInt(src.queryId, 257);
    };
}

export function loadSBUnsubscribe(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3994015984) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    return { $$type: 'SBUnsubscribe' as const, queryId: _queryId };
}

function loadTupleSBUnsubscribe(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'SBUnsubscribe' as const, queryId: _queryId };
}

function storeTupleSBUnsubscribe(source: SBUnsubscribe) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserSBUnsubscribe(): DictionaryValue<SBUnsubscribe> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSBUnsubscribe(src)).endCell());
        },
        parse: (src) => {
            return loadSBUnsubscribe(src.loadRef().beginParse());
        }
    }
}

export type SESDestroy = {
    $$type: 'SESDestroy';
    queryId: bigint;
}

export function storeSESDestroy(src: SESDestroy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2168802995, 32);
        b_0.storeInt(src.queryId, 257);
    };
}

export function loadSESDestroy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2168802995) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    return { $$type: 'SESDestroy' as const, queryId: _queryId };
}

function loadTupleSESDestroy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'SESDestroy' as const, queryId: _queryId };
}

function storeTupleSESDestroy(source: SESDestroy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserSESDestroy(): DictionaryValue<SESDestroy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSESDestroy(src)).endCell());
        },
        parse: (src) => {
            return loadSESDestroy(src.loadRef().beginParse());
        }
    }
}

export type SESDestroySuccess = {
    $$type: 'SESDestroySuccess';
    queryId: bigint;
}

export function storeSESDestroySuccess(src: SESDestroySuccess) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3617812652, 32);
        b_0.storeInt(src.queryId, 257);
    };
}

export function loadSESDestroySuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3617812652) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    return { $$type: 'SESDestroySuccess' as const, queryId: _queryId };
}

function loadTupleSESDestroySuccess(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'SESDestroySuccess' as const, queryId: _queryId };
}

function storeTupleSESDestroySuccess(source: SESDestroySuccess) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserSESDestroySuccess(): DictionaryValue<SESDestroySuccess> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSESDestroySuccess(src)).endCell());
        },
        parse: (src) => {
            return loadSESDestroySuccess(src.loadRef().beginParse());
        }
    }
}

export type BRGDeploy = {
    $$type: 'BRGDeploy';
    queryId: bigint;
}

export function storeBRGDeploy(src: BRGDeploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1630960727, 32);
        b_0.storeInt(src.queryId, 257);
    };
}

export function loadBRGDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1630960727) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    return { $$type: 'BRGDeploy' as const, queryId: _queryId };
}

function loadTupleBRGDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'BRGDeploy' as const, queryId: _queryId };
}

function storeTupleBRGDeploy(source: BRGDeploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserBRGDeploy(): DictionaryValue<BRGDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBRGDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadBRGDeploy(src.loadRef().beginParse());
        }
    }
}

export type BRGDeploySuccess = {
    $$type: 'BRGDeploySuccess';
    queryId: bigint;
}

export function storeBRGDeploySuccess(src: BRGDeploySuccess) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1083939646, 32);
        b_0.storeInt(src.queryId, 257);
    };
}

export function loadBRGDeploySuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1083939646) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    return { $$type: 'BRGDeploySuccess' as const, queryId: _queryId };
}

function loadTupleBRGDeploySuccess(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'BRGDeploySuccess' as const, queryId: _queryId };
}

function storeTupleBRGDeploySuccess(source: BRGDeploySuccess) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserBRGDeploySuccess(): DictionaryValue<BRGDeploySuccess> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBRGDeploySuccess(src)).endCell());
        },
        parse: (src) => {
            return loadBRGDeploySuccess(src.loadRef().beginParse());
        }
    }
}

export type BRGDeployBroker = {
    $$type: 'BRGDeployBroker';
    queryId: bigint;
    stream: Address;
}

export function storeBRGDeployBroker(src: BRGDeployBroker) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2865719921, 32);
        b_0.storeInt(src.queryId, 257);
        b_0.storeAddress(src.stream);
    };
}

export function loadBRGDeployBroker(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2865719921) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    let _stream = sc_0.loadAddress();
    return { $$type: 'BRGDeployBroker' as const, queryId: _queryId, stream: _stream };
}

function loadTupleBRGDeployBroker(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _stream = source.readAddress();
    return { $$type: 'BRGDeployBroker' as const, queryId: _queryId, stream: _stream };
}

function storeTupleBRGDeployBroker(source: BRGDeployBroker) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.stream);
    return builder.build();
}

function dictValueParserBRGDeployBroker(): DictionaryValue<BRGDeployBroker> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBRGDeployBroker(src)).endCell());
        },
        parse: (src) => {
            return loadBRGDeployBroker(src.loadRef().beginParse());
        }
    }
}

export type BRKDeploy = {
    $$type: 'BRKDeploy';
    queryId: bigint;
}

export function storeBRKDeploy(src: BRKDeploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2837042894, 32);
        b_0.storeInt(src.queryId, 257);
    };
}

export function loadBRKDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2837042894) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    return { $$type: 'BRKDeploy' as const, queryId: _queryId };
}

function loadTupleBRKDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'BRKDeploy' as const, queryId: _queryId };
}

function storeTupleBRKDeploy(source: BRKDeploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserBRKDeploy(): DictionaryValue<BRKDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBRKDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadBRKDeploy(src.loadRef().beginParse());
        }
    }
}

export type BRKDeploySuccess = {
    $$type: 'BRKDeploySuccess';
    queryId: bigint;
    stream: Address;
}

export function storeBRKDeploySuccess(src: BRKDeploySuccess) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2409362171, 32);
        b_0.storeInt(src.queryId, 257);
        b_0.storeAddress(src.stream);
    };
}

export function loadBRKDeploySuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2409362171) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    let _stream = sc_0.loadAddress();
    return { $$type: 'BRKDeploySuccess' as const, queryId: _queryId, stream: _stream };
}

function loadTupleBRKDeploySuccess(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _stream = source.readAddress();
    return { $$type: 'BRKDeploySuccess' as const, queryId: _queryId, stream: _stream };
}

function storeTupleBRKDeploySuccess(source: BRKDeploySuccess) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.stream);
    return builder.build();
}

function dictValueParserBRKDeploySuccess(): DictionaryValue<BRKDeploySuccess> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBRKDeploySuccess(src)).endCell());
        },
        parse: (src) => {
            return loadBRKDeploySuccess(src.loadRef().beginParse());
        }
    }
}

export type BRGDeployBrokerSuccess = {
    $$type: 'BRGDeployBrokerSuccess';
    queryId: bigint;
    broker: Address;
}

export function storeBRGDeployBrokerSuccess(src: BRGDeployBrokerSuccess) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(4135730918, 32);
        b_0.storeInt(src.queryId, 257);
        b_0.storeAddress(src.broker);
    };
}

export function loadBRGDeployBrokerSuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 4135730918) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    let _broker = sc_0.loadAddress();
    return { $$type: 'BRGDeployBrokerSuccess' as const, queryId: _queryId, broker: _broker };
}

function loadTupleBRGDeployBrokerSuccess(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _broker = source.readAddress();
    return { $$type: 'BRGDeployBrokerSuccess' as const, queryId: _queryId, broker: _broker };
}

function storeTupleBRGDeployBrokerSuccess(source: BRGDeployBrokerSuccess) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.broker);
    return builder.build();
}

function dictValueParserBRGDeployBrokerSuccess(): DictionaryValue<BRGDeployBrokerSuccess> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBRGDeployBrokerSuccess(src)).endCell());
        },
        parse: (src) => {
            return loadBRGDeployBrokerSuccess(src.loadRef().beginParse());
        }
    }
}

export type BRGDeployAccount = {
    $$type: 'BRGDeployAccount';
    queryId: bigint;
}

export function storeBRGDeployAccount(src: BRGDeployAccount) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2334222543, 32);
        b_0.storeInt(src.queryId, 257);
    };
}

export function loadBRGDeployAccount(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2334222543) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    return { $$type: 'BRGDeployAccount' as const, queryId: _queryId };
}

function loadTupleBRGDeployAccount(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'BRGDeployAccount' as const, queryId: _queryId };
}

function storeTupleBRGDeployAccount(source: BRGDeployAccount) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserBRGDeployAccount(): DictionaryValue<BRGDeployAccount> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBRGDeployAccount(src)).endCell());
        },
        parse: (src) => {
            return loadBRGDeployAccount(src.loadRef().beginParse());
        }
    }
}

export type BRADeploy = {
    $$type: 'BRADeploy';
    queryId: bigint;
}

export function storeBRADeploy(src: BRADeploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(73450152, 32);
        b_0.storeInt(src.queryId, 257);
    };
}

export function loadBRADeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 73450152) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    return { $$type: 'BRADeploy' as const, queryId: _queryId };
}

function loadTupleBRADeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'BRADeploy' as const, queryId: _queryId };
}

function storeTupleBRADeploy(source: BRADeploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserBRADeploy(): DictionaryValue<BRADeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBRADeploy(src)).endCell());
        },
        parse: (src) => {
            return loadBRADeploy(src.loadRef().beginParse());
        }
    }
}

export type BRADeploySuccess = {
    $$type: 'BRADeploySuccess';
    queryId: bigint;
    trader: Address;
}

export function storeBRADeploySuccess(src: BRADeploySuccess) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(599700487, 32);
        b_0.storeInt(src.queryId, 257);
        b_0.storeAddress(src.trader);
    };
}

export function loadBRADeploySuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 599700487) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    let _trader = sc_0.loadAddress();
    return { $$type: 'BRADeploySuccess' as const, queryId: _queryId, trader: _trader };
}

function loadTupleBRADeploySuccess(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _trader = source.readAddress();
    return { $$type: 'BRADeploySuccess' as const, queryId: _queryId, trader: _trader };
}

function storeTupleBRADeploySuccess(source: BRADeploySuccess) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.trader);
    return builder.build();
}

function dictValueParserBRADeploySuccess(): DictionaryValue<BRADeploySuccess> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBRADeploySuccess(src)).endCell());
        },
        parse: (src) => {
            return loadBRADeploySuccess(src.loadRef().beginParse());
        }
    }
}

export type BRGDeployAccountSuccess = {
    $$type: 'BRGDeployAccountSuccess';
    queryId: bigint;
    account: Address;
}

export function storeBRGDeployAccountSuccess(src: BRGDeployAccountSuccess) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(764808800, 32);
        b_0.storeInt(src.queryId, 257);
        b_0.storeAddress(src.account);
    };
}

export function loadBRGDeployAccountSuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 764808800) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    let _account = sc_0.loadAddress();
    return { $$type: 'BRGDeployAccountSuccess' as const, queryId: _queryId, account: _account };
}

function loadTupleBRGDeployAccountSuccess(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _account = source.readAddress();
    return { $$type: 'BRGDeployAccountSuccess' as const, queryId: _queryId, account: _account };
}

function storeTupleBRGDeployAccountSuccess(source: BRGDeployAccountSuccess) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.account);
    return builder.build();
}

function dictValueParserBRGDeployAccountSuccess(): DictionaryValue<BRGDeployAccountSuccess> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBRGDeployAccountSuccess(src)).endCell());
        },
        parse: (src) => {
            return loadBRGDeployAccountSuccess(src.loadRef().beginParse());
        }
    }
}

export type BRKDeposit = {
    $$type: 'BRKDeposit';
    queryId: bigint;
}

export function storeBRKDeposit(src: BRKDeposit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3498530468, 32);
        b_0.storeInt(src.queryId, 257);
    };
}

export function loadBRKDeposit(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3498530468) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    return { $$type: 'BRKDeposit' as const, queryId: _queryId };
}

function loadTupleBRKDeposit(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'BRKDeposit' as const, queryId: _queryId };
}

function storeTupleBRKDeposit(source: BRKDeposit) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserBRKDeposit(): DictionaryValue<BRKDeposit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBRKDeposit(src)).endCell());
        },
        parse: (src) => {
            return loadBRKDeposit(src.loadRef().beginParse());
        }
    }
}

export type BRKDepositSuccess = {
    $$type: 'BRKDepositSuccess';
    queryId: bigint;
}

export function storeBRKDepositSuccess(src: BRKDepositSuccess) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2868320522, 32);
        b_0.storeInt(src.queryId, 257);
    };
}

export function loadBRKDepositSuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2868320522) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    return { $$type: 'BRKDepositSuccess' as const, queryId: _queryId };
}

function loadTupleBRKDepositSuccess(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'BRKDepositSuccess' as const, queryId: _queryId };
}

function storeTupleBRKDepositSuccess(source: BRKDepositSuccess) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserBRKDepositSuccess(): DictionaryValue<BRKDepositSuccess> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBRKDepositSuccess(src)).endCell());
        },
        parse: (src) => {
            return loadBRKDepositSuccess(src.loadRef().beginParse());
        }
    }
}

export type BRKWithdraw = {
    $$type: 'BRKWithdraw';
    queryId: bigint;
}

export function storeBRKWithdraw(src: BRKWithdraw) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2878426153, 32);
        b_0.storeInt(src.queryId, 257);
    };
}

export function loadBRKWithdraw(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2878426153) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    return { $$type: 'BRKWithdraw' as const, queryId: _queryId };
}

function loadTupleBRKWithdraw(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'BRKWithdraw' as const, queryId: _queryId };
}

function storeTupleBRKWithdraw(source: BRKWithdraw) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserBRKWithdraw(): DictionaryValue<BRKWithdraw> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBRKWithdraw(src)).endCell());
        },
        parse: (src) => {
            return loadBRKWithdraw(src.loadRef().beginParse());
        }
    }
}

export type BRKWithdrawSuccess = {
    $$type: 'BRKWithdrawSuccess';
    queryId: bigint;
}

export function storeBRKWithdrawSuccess(src: BRKWithdrawSuccess) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1253199812, 32);
        b_0.storeInt(src.queryId, 257);
    };
}

export function loadBRKWithdrawSuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1253199812) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    return { $$type: 'BRKWithdrawSuccess' as const, queryId: _queryId };
}

function loadTupleBRKWithdrawSuccess(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'BRKWithdrawSuccess' as const, queryId: _queryId };
}

function storeTupleBRKWithdrawSuccess(source: BRKWithdrawSuccess) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserBRKWithdrawSuccess(): DictionaryValue<BRKWithdrawSuccess> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBRKWithdrawSuccess(src)).endCell());
        },
        parse: (src) => {
            return loadBRKWithdrawSuccess(src.loadRef().beginParse());
        }
    }
}

export type SubscriptionInfo = {
    $$type: 'SubscriptionInfo';
    remainingNotificationsCount: bigint;
}

export function storeSubscriptionInfo(src: SubscriptionInfo) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.remainingNotificationsCount, 257);
    };
}

export function loadSubscriptionInfo(slice: Slice) {
    let sc_0 = slice;
    let _remainingNotificationsCount = sc_0.loadIntBig(257);
    return { $$type: 'SubscriptionInfo' as const, remainingNotificationsCount: _remainingNotificationsCount };
}

function loadTupleSubscriptionInfo(source: TupleReader) {
    let _remainingNotificationsCount = source.readBigNumber();
    return { $$type: 'SubscriptionInfo' as const, remainingNotificationsCount: _remainingNotificationsCount };
}

function storeTupleSubscriptionInfo(source: SubscriptionInfo) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.remainingNotificationsCount);
    return builder.build();
}

function dictValueParserSubscriptionInfo(): DictionaryValue<SubscriptionInfo> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSubscriptionInfo(src)).endCell());
        },
        parse: (src) => {
            return loadSubscriptionInfo(src.loadRef().beginParse());
        }
    }
}

export type SBInfo = {
    $$type: 'SBInfo';
    subscriptionsCount: bigint;
}

export function storeSBInfo(src: SBInfo) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.subscriptionsCount, 257);
    };
}

export function loadSBInfo(slice: Slice) {
    let sc_0 = slice;
    let _subscriptionsCount = sc_0.loadIntBig(257);
    return { $$type: 'SBInfo' as const, subscriptionsCount: _subscriptionsCount };
}

function loadTupleSBInfo(source: TupleReader) {
    let _subscriptionsCount = source.readBigNumber();
    return { $$type: 'SBInfo' as const, subscriptionsCount: _subscriptionsCount };
}

function storeTupleSBInfo(source: SBInfo) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.subscriptionsCount);
    return builder.build();
}

function dictValueParserSBInfo(): DictionaryValue<SBInfo> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSBInfo(src)).endCell());
        },
        parse: (src) => {
            return loadSBInfo(src.loadRef().beginParse());
        }
    }
}

 type SubscriptionBatch_init_args = {
    $$type: 'SubscriptionBatch_init_args';
    stream: Address;
    batchId: bigint;
}

function initSubscriptionBatch_init_args(src: SubscriptionBatch_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.stream);
        b_0.storeInt(src.batchId, 257);
    };
}

async function SubscriptionBatch_init(stream: Address, batchId: bigint) {
    const __code = Cell.fromBase64('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');
    const __system = Cell.fromBase64('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');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initSubscriptionBatch_init_args({ $$type: 'SubscriptionBatch_init_args', stream, batchId })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const SubscriptionBatch_errors: { [key: number]: { message: string } } = {
    2: { message: `Stack underflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    13: { message: `Out of gas error` },
    32: { message: `Method ID not found` },
    34: { message: `Action is invalid or not supported` },
    37: { message: `Not enough TON` },
    38: { message: `Not enough extra-currencies` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    135: { message: `Code of a contract was not found` },
    136: { message: `Invalid address` },
    137: { message: `Masterchain support is not enabled for this contract` },
}

const SubscriptionBatch_types: ABIType[] = [
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounced","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"DSTDeploy","header":3524136291,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"DSTDeploySuccess","header":3293073783,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"DSTDeployBatch","header":2656587996,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"DSTDeployBatchSuccess","header":1712881333,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"batch","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"DSTDeploySession","header":3841442478,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"DSTDeploySessionSuccess","header":3450176327,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"session","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"DSTSubscribe","header":463946169,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"subscriber","type":{"kind":"simple","type":"address","optional":false}},{"name":"notificationsCount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"DSTSubscribeSuccess","header":989465183,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"batch","type":{"kind":"simple","type":"address","optional":false}},{"name":"remainingNotificationsCount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"Candlestick","header":null,"fields":[{"name":"start","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"end","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"open","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"close","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"high","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"low","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"DSTPublishCandlestick","header":3817608170,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"candlestick","type":{"kind":"simple","type":"Candlestick","optional":false}}]},
    {"name":"DSTPublishCandlestickSuccess","header":2992211220,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"DSTUnsubscribedNotification","header":2982918748,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"remainingNotificationsCount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SBDeploy","header":1599636199,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SBDeploySuccess","header":3719915174,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"batchId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SBSubscribe","header":3584015583,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"session","type":{"kind":"simple","type":"address","optional":false}},{"name":"notificationsCount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SBSubscribeSuccess","header":376773611,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"session","type":{"kind":"simple","type":"address","optional":false}},{"name":"remainingNotificationsCount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SBPublishCandlestick","header":3122546640,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"candlestick","type":{"kind":"simple","type":"Candlestick","optional":false}},{"name":"publisher","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"SBCandlestickPublishedNotification","header":2999531292,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"candlestick","type":{"kind":"simple","type":"Candlestick","optional":false}},{"name":"remainingNotificationsCount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SBUnsubscribedNotification","header":2190235549,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"session","type":{"kind":"simple","type":"address","optional":false}},{"name":"remainingNotificationsCount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SBPublishCandlestickSuccess","header":2101442610,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SESDeploy","header":3106659465,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SESDeploySuccess","header":2845333598,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"subscriber","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"SESSubscribe","header":2347424105,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"notificationsCount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"DSTTopUpSubscription","header":3639371301,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"subscriber","type":{"kind":"simple","type":"address","optional":false}},{"name":"batch","type":{"kind":"simple","type":"address","optional":false}},{"name":"notificationsCount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SBTopUpSubscription","header":150102477,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"session","type":{"kind":"simple","type":"address","optional":false}},{"name":"notificationsCount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SESSubscribeSuccess","header":3368135549,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"remainingNotificationsCount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SESCandlestickPublishedNotification","header":4161171741,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"candlestick","type":{"kind":"simple","type":"Candlestick","optional":false}},{"name":"remainingNotificationsCount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SESUnsubscribedNotification","header":929502243,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"remainingNotificationsCount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SESUnsubscribe","header":4076456827,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SBUnsubscribe","header":3994015984,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SESDestroy","header":2168802995,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SESDestroySuccess","header":3617812652,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"BRGDeploy","header":1630960727,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"BRGDeploySuccess","header":1083939646,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"BRGDeployBroker","header":2865719921,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"stream","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"BRKDeploy","header":2837042894,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"BRKDeploySuccess","header":2409362171,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"stream","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"BRGDeployBrokerSuccess","header":4135730918,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"broker","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"BRGDeployAccount","header":2334222543,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"BRADeploy","header":73450152,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"BRADeploySuccess","header":599700487,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"trader","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"BRGDeployAccountSuccess","header":764808800,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"account","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"BRKDeposit","header":3498530468,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"BRKDepositSuccess","header":2868320522,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"BRKWithdraw","header":2878426153,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"BRKWithdrawSuccess","header":1253199812,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SubscriptionInfo","header":null,"fields":[{"name":"remainingNotificationsCount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SBInfo","header":null,"fields":[{"name":"subscriptionsCount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
]

const SubscriptionBatch_getters: ABIGetter[] = [
    {"name":"balance","arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"storageReserve","arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"streamAddress","arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
    {"name":"batchId","arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"subscriptions","arguments":[],"returnType":{"kind":"dict","key":"address","value":"SubscriptionInfo","valueFormat":"ref"}},
    {"name":"subscriptionsCount","arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
]

const SubscriptionBatch_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"SBDeploy"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SBSubscribe"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SBTopUpSubscription"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SBPublishCandlestick"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SBUnsubscribe"}},
]

export class SubscriptionBatch implements Contract {
    
    static async init(stream: Address, batchId: bigint) {
        return await SubscriptionBatch_init(stream, batchId);
    }
    
    static async fromInit(stream: Address, batchId: bigint) {
        const init = await SubscriptionBatch_init(stream, batchId);
        const address = contractAddress(0, init);
        return new SubscriptionBatch(address, init);
    }
    
    static fromAddress(address: Address) {
        return new SubscriptionBatch(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  SubscriptionBatch_types,
        getters: SubscriptionBatch_getters,
        receivers: SubscriptionBatch_receivers,
        errors: SubscriptionBatch_errors,
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: SBDeploy | SBSubscribe | SBTopUpSubscription | SBPublishCandlestick | SBUnsubscribe) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SBDeploy') {
            body = beginCell().store(storeSBDeploy(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SBSubscribe') {
            body = beginCell().store(storeSBSubscribe(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SBTopUpSubscription') {
            body = beginCell().store(storeSBTopUpSubscription(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SBPublishCandlestick') {
            body = beginCell().store(storeSBPublishCandlestick(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SBUnsubscribe') {
            body = beginCell().store(storeSBUnsubscribe(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getBalance(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('balance', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getStorageReserve(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('storageReserve', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getStreamAddress(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('streamAddress', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }
    
    async getBatchId(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('batchId', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getSubscriptions(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('subscriptions', builder.build())).stack;
        let result = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserSubscriptionInfo(), source.readCellOpt());
        return result;
    }
    
    async getSubscriptionsCount(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('subscriptionsCount', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
}