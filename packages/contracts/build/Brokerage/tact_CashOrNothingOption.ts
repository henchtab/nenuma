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
        b_0.storeUint(306133030, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDSTDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 306133030) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(3957924127, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDSTDeploySuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3957924127) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(3012477066, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDSTDeployBatch(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3012477066) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(1261138638, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.batch);
    };
}

export function loadDSTDeployBatchSuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1261138638) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(1658160529, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDSTDeploySession(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1658160529) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(3452518278, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.session);
    };
}

export function loadDSTDeploySessionSuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3452518278) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(3216336466, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.subscriber);
        b_0.storeInt(src.notificationsCount, 257);
    };
}

export function loadDSTSubscribe(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3216336466) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(3770107736, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.batch);
        b_0.storeInt(src.remainingNotificationsCount, 257);
    };
}

export function loadDSTSubscribeSuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3770107736) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(990592317, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.store(storeCandlestick(src.candlestick));
    };
}

export function loadDSTPublishCandlestick(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 990592317) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _candlestick = loadCandlestick(sc_0);
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
        b_0.storeUint(215123525, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDSTPublishCandlestickSuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 215123525) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(1287102660, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeInt(src.remainingNotificationsCount, 257);
    };
}

export function loadDSTUnsubscribedNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1287102660) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(4267613765, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadSBDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 4267613765) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(1031311118, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeInt(src.batchId, 257);
    };
}

export function loadSBDeploySuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1031311118) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(2001551522, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.session);
        b_0.storeInt(src.notificationsCount, 257);
    };
}

export function loadSBSubscribe(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2001551522) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(4082513223, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.session);
        b_0.storeInt(src.remainingNotificationsCount, 257);
    };
}

export function loadSBSubscribeSuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 4082513223) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(4051052066, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.store(storeCandlestick(src.candlestick));
        let b_1 = new Builder();
        b_1.storeAddress(src.publisher);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadSBPublishCandlestick(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 4051052066) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _candlestick = loadCandlestick(sc_0);
    let sc_1 = sc_0.loadRef().beginParse();
    let _publisher = sc_1.loadAddress();
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
        b_0.storeUint(4175431181, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.store(storeCandlestick(src.candlestick));
        let b_1 = new Builder();
        b_1.storeInt(src.remainingNotificationsCount, 257);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadSBCandlestickPublishedNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 4175431181) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _candlestick = loadCandlestick(sc_0);
    let sc_1 = sc_0.loadRef().beginParse();
    let _remainingNotificationsCount = sc_1.loadIntBig(257);
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
        b_0.storeUint(1003141156, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.session);
        b_0.storeInt(src.remainingNotificationsCount, 257);
    };
}

export function loadSBUnsubscribedNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1003141156) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(1027631690, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadSBPublishCandlestickSuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1027631690) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(1372687436, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadSESDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1372687436) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(269942218, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.subscriber);
    };
}

export function loadSESDeploySuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 269942218) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(1533823831, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeInt(src.notificationsCount, 257);
    };
}

export function loadSESSubscribe(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1533823831) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(495971614, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.subscriber);
        b_0.storeAddress(src.batch);
        b_0.storeInt(src.notificationsCount, 257);
    };
}

export function loadDSTTopUpSubscription(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 495971614) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _subscriber = sc_0.loadAddress();
    let _batch = sc_0.loadAddress();
    let _notificationsCount = sc_0.loadIntBig(257);
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
        b_0.storeUint(267884312, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.session);
        b_0.storeInt(src.notificationsCount, 257);
    };
}

export function loadSBTopUpSubscription(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 267884312) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(1400038355, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeInt(src.remainingNotificationsCount, 257);
    };
}

export function loadSESSubscribeSuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1400038355) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(3200926804, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.store(storeCandlestick(src.candlestick));
        let b_1 = new Builder();
        b_1.storeInt(src.remainingNotificationsCount, 257);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadSESCandlestickPublishedNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3200926804) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _candlestick = loadCandlestick(sc_0);
    let sc_1 = sc_0.loadRef().beginParse();
    let _remainingNotificationsCount = sc_1.loadIntBig(257);
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
        b_0.storeUint(4092566650, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeInt(src.remainingNotificationsCount, 257);
    };
}

export function loadSESUnsubscribedNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 4092566650) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(2668625285, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadSESUnsubscribe(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2668625285) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(1095850324, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadSBUnsubscribe(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1095850324) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(2226780297, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadSESDestroy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2226780297) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(21916563, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadSESDestroySuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 21916563) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(4195386677, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadBRGDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 4195386677) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(3142995347, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadBRGDeploySuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3142995347) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(298971134, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.stream);
    };
}

export function loadBRGDeployBroker(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 298971134) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(1366331229, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadBRKDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1366331229) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(2536416450, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.stream);
    };
}

export function loadBRKDeploySuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2536416450) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(4042145317, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.broker);
    };
}

export function loadBRGDeployBrokerSuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 4042145317) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(3233956202, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadBRGDeployAccount(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3233956202) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(1181556865, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadBRADeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1181556865) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(3517832790, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.trader);
    };
}

export function loadBRADeploySuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3517832790) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(1962963078, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.account);
    };
}

export function loadBRGDeployAccountSuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1962963078) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(2141827764, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadBRKDeposit(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2141827764) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(2064422216, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadBRKDepositSuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2064422216) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(550691255, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadBRKWithdraw(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 550691255) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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
        b_0.storeUint(2654800410, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadBRKWithdrawSuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2654800410) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
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

export type Fraction = {
    $$type: 'Fraction';
    nominator: bigint;
    denominator: bigint;
}

export function storeFraction(src: Fraction) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.nominator, 257);
        b_0.storeInt(src.denominator, 257);
    };
}

export function loadFraction(slice: Slice) {
    let sc_0 = slice;
    let _nominator = sc_0.loadIntBig(257);
    let _denominator = sc_0.loadIntBig(257);
    return { $$type: 'Fraction' as const, nominator: _nominator, denominator: _denominator };
}

function loadTupleFraction(source: TupleReader) {
    let _nominator = source.readBigNumber();
    let _denominator = source.readBigNumber();
    return { $$type: 'Fraction' as const, nominator: _nominator, denominator: _denominator };
}

function storeTupleFraction(source: Fraction) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.nominator);
    builder.writeNumber(source.denominator);
    return builder.build();
}

function dictValueParserFraction(): DictionaryValue<Fraction> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFraction(src)).endCell());
        },
        parse: (src) => {
            return loadFraction(src.loadRef().beginParse());
        }
    }
}

export type CashOrNothingOptionDraftAgreement = {
    $$type: 'CashOrNothingOptionDraftAgreement';
    holder: Address;
    initiation: bigint;
    expiration: bigint;
    optionType: boolean;
    investment: bigint;
}

export function storeCashOrNothingOptionDraftAgreement(src: CashOrNothingOptionDraftAgreement) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.holder);
        b_0.storeInt(src.initiation, 257);
        b_0.storeInt(src.expiration, 257);
        b_0.storeBit(src.optionType);
        let b_1 = new Builder();
        b_1.storeInt(src.investment, 257);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadCashOrNothingOptionDraftAgreement(slice: Slice) {
    let sc_0 = slice;
    let _holder = sc_0.loadAddress();
    let _initiation = sc_0.loadIntBig(257);
    let _expiration = sc_0.loadIntBig(257);
    let _optionType = sc_0.loadBit();
    let sc_1 = sc_0.loadRef().beginParse();
    let _investment = sc_1.loadIntBig(257);
    return { $$type: 'CashOrNothingOptionDraftAgreement' as const, holder: _holder, initiation: _initiation, expiration: _expiration, optionType: _optionType, investment: _investment };
}

function loadTupleCashOrNothingOptionDraftAgreement(source: TupleReader) {
    let _holder = source.readAddress();
    let _initiation = source.readBigNumber();
    let _expiration = source.readBigNumber();
    let _optionType = source.readBoolean();
    let _investment = source.readBigNumber();
    return { $$type: 'CashOrNothingOptionDraftAgreement' as const, holder: _holder, initiation: _initiation, expiration: _expiration, optionType: _optionType, investment: _investment };
}

function storeTupleCashOrNothingOptionDraftAgreement(source: CashOrNothingOptionDraftAgreement) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.holder);
    builder.writeNumber(source.initiation);
    builder.writeNumber(source.expiration);
    builder.writeBoolean(source.optionType);
    builder.writeNumber(source.investment);
    return builder.build();
}

function dictValueParserCashOrNothingOptionDraftAgreement(): DictionaryValue<CashOrNothingOptionDraftAgreement> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCashOrNothingOptionDraftAgreement(src)).endCell());
        },
        parse: (src) => {
            return loadCashOrNothingOptionDraftAgreement(src.loadRef().beginParse());
        }
    }
}

export type BrokerDeployOption = {
    $$type: 'BrokerDeployOption';
    queryId: bigint;
    draft: CashOrNothingOptionDraftAgreement;
}

export function storeBrokerDeployOption(src: BrokerDeployOption) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1174791129, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.store(storeCashOrNothingOptionDraftAgreement(src.draft));
    };
}

export function loadBrokerDeployOption(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1174791129) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _draft = loadCashOrNothingOptionDraftAgreement(sc_0);
    return { $$type: 'BrokerDeployOption' as const, queryId: _queryId, draft: _draft };
}

function loadTupleBrokerDeployOption(source: TupleReader) {
    let _queryId = source.readBigNumber();
    const _draft = loadTupleCashOrNothingOptionDraftAgreement(source.readTuple());
    return { $$type: 'BrokerDeployOption' as const, queryId: _queryId, draft: _draft };
}

function storeTupleBrokerDeployOption(source: BrokerDeployOption) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeTuple(storeTupleCashOrNothingOptionDraftAgreement(source.draft));
    return builder.build();
}

function dictValueParserBrokerDeployOption(): DictionaryValue<BrokerDeployOption> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBrokerDeployOption(src)).endCell());
        },
        parse: (src) => {
            return loadBrokerDeployOption(src.loadRef().beginParse());
        }
    }
}

export type BrokerDeployOptionSuccess = {
    $$type: 'BrokerDeployOptionSuccess';
    queryId: bigint;
    stream: Address;
    option: Address;
}

export function storeBrokerDeployOptionSuccess(src: BrokerDeployOptionSuccess) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2438374427, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.stream);
        b_0.storeAddress(src.option);
    };
}

export function loadBrokerDeployOptionSuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2438374427) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _stream = sc_0.loadAddress();
    let _option = sc_0.loadAddress();
    return { $$type: 'BrokerDeployOptionSuccess' as const, queryId: _queryId, stream: _stream, option: _option };
}

function loadTupleBrokerDeployOptionSuccess(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _stream = source.readAddress();
    let _option = source.readAddress();
    return { $$type: 'BrokerDeployOptionSuccess' as const, queryId: _queryId, stream: _stream, option: _option };
}

function storeTupleBrokerDeployOptionSuccess(source: BrokerDeployOptionSuccess) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.stream);
    builder.writeAddress(source.option);
    return builder.build();
}

function dictValueParserBrokerDeployOptionSuccess(): DictionaryValue<BrokerDeployOptionSuccess> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBrokerDeployOptionSuccess(src)).endCell());
        },
        parse: (src) => {
            return loadBrokerDeployOptionSuccess(src.loadRef().beginParse());
        }
    }
}

export type CashOrNothingOptionDeploy = {
    $$type: 'CashOrNothingOptionDeploy';
    queryId: bigint;
    stream: Address;
    agreement: CashOrNothingOptionAgreement;
}

export function storeCashOrNothingOptionDeploy(src: CashOrNothingOptionDeploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3343868548, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.stream);
        let b_1 = new Builder();
        b_1.store(storeCashOrNothingOptionAgreement(src.agreement));
        b_0.storeRef(b_1.endCell());
    };
}

export function loadCashOrNothingOptionDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3343868548) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _stream = sc_0.loadAddress();
    let sc_1 = sc_0.loadRef().beginParse();
    let _agreement = loadCashOrNothingOptionAgreement(sc_1);
    return { $$type: 'CashOrNothingOptionDeploy' as const, queryId: _queryId, stream: _stream, agreement: _agreement };
}

function loadTupleCashOrNothingOptionDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _stream = source.readAddress();
    const _agreement = loadTupleCashOrNothingOptionAgreement(source.readTuple());
    return { $$type: 'CashOrNothingOptionDeploy' as const, queryId: _queryId, stream: _stream, agreement: _agreement };
}

function storeTupleCashOrNothingOptionDeploy(source: CashOrNothingOptionDeploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.stream);
    builder.writeTuple(storeTupleCashOrNothingOptionAgreement(source.agreement));
    return builder.build();
}

function dictValueParserCashOrNothingOptionDeploy(): DictionaryValue<CashOrNothingOptionDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCashOrNothingOptionDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadCashOrNothingOptionDeploy(src.loadRef().beginParse());
        }
    }
}

export type CashOrNothingOptionDeploySuccess = {
    $$type: 'CashOrNothingOptionDeploySuccess';
    queryId: bigint;
    optionId: bigint;
    holder: Address;
}

export function storeCashOrNothingOptionDeploySuccess(src: CashOrNothingOptionDeploySuccess) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2669413677, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeInt(src.optionId, 257);
        b_0.storeAddress(src.holder);
    };
}

export function loadCashOrNothingOptionDeploySuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2669413677) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _optionId = sc_0.loadIntBig(257);
    let _holder = sc_0.loadAddress();
    return { $$type: 'CashOrNothingOptionDeploySuccess' as const, queryId: _queryId, optionId: _optionId, holder: _holder };
}

function loadTupleCashOrNothingOptionDeploySuccess(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _optionId = source.readBigNumber();
    let _holder = source.readAddress();
    return { $$type: 'CashOrNothingOptionDeploySuccess' as const, queryId: _queryId, optionId: _optionId, holder: _holder };
}

function storeTupleCashOrNothingOptionDeploySuccess(source: CashOrNothingOptionDeploySuccess) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.optionId);
    builder.writeAddress(source.holder);
    return builder.build();
}

function dictValueParserCashOrNothingOptionDeploySuccess(): DictionaryValue<CashOrNothingOptionDeploySuccess> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCashOrNothingOptionDeploySuccess(src)).endCell());
        },
        parse: (src) => {
            return loadCashOrNothingOptionDeploySuccess(src.loadRef().beginParse());
        }
    }
}

export type CashOrNothingOptionSettledInMoneyNotification = {
    $$type: 'CashOrNothingOptionSettledInMoneyNotification';
    queryId: bigint;
}

export function storeCashOrNothingOptionSettledInMoneyNotification(src: CashOrNothingOptionSettledInMoneyNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(4281832964, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadCashOrNothingOptionSettledInMoneyNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 4281832964) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'CashOrNothingOptionSettledInMoneyNotification' as const, queryId: _queryId };
}

function loadTupleCashOrNothingOptionSettledInMoneyNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'CashOrNothingOptionSettledInMoneyNotification' as const, queryId: _queryId };
}

function storeTupleCashOrNothingOptionSettledInMoneyNotification(source: CashOrNothingOptionSettledInMoneyNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserCashOrNothingOptionSettledInMoneyNotification(): DictionaryValue<CashOrNothingOptionSettledInMoneyNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCashOrNothingOptionSettledInMoneyNotification(src)).endCell());
        },
        parse: (src) => {
            return loadCashOrNothingOptionSettledInMoneyNotification(src.loadRef().beginParse());
        }
    }
}

export type CashOrNothingOptionSettledOutMoneyNotification = {
    $$type: 'CashOrNothingOptionSettledOutMoneyNotification';
    queryId: bigint;
}

export function storeCashOrNothingOptionSettledOutMoneyNotification(src: CashOrNothingOptionSettledOutMoneyNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(402709524, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadCashOrNothingOptionSettledOutMoneyNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 402709524) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'CashOrNothingOptionSettledOutMoneyNotification' as const, queryId: _queryId };
}

function loadTupleCashOrNothingOptionSettledOutMoneyNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'CashOrNothingOptionSettledOutMoneyNotification' as const, queryId: _queryId };
}

function storeTupleCashOrNothingOptionSettledOutMoneyNotification(source: CashOrNothingOptionSettledOutMoneyNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserCashOrNothingOptionSettledOutMoneyNotification(): DictionaryValue<CashOrNothingOptionSettledOutMoneyNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCashOrNothingOptionSettledOutMoneyNotification(src)).endCell());
        },
        parse: (src) => {
            return loadCashOrNothingOptionSettledOutMoneyNotification(src.loadRef().beginParse());
        }
    }
}

export type CashOrNothingOptionSettledAtMoneyNotification = {
    $$type: 'CashOrNothingOptionSettledAtMoneyNotification';
    queryId: bigint;
}

export function storeCashOrNothingOptionSettledAtMoneyNotification(src: CashOrNothingOptionSettledAtMoneyNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1344539513, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadCashOrNothingOptionSettledAtMoneyNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1344539513) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'CashOrNothingOptionSettledAtMoneyNotification' as const, queryId: _queryId };
}

function loadTupleCashOrNothingOptionSettledAtMoneyNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'CashOrNothingOptionSettledAtMoneyNotification' as const, queryId: _queryId };
}

function storeTupleCashOrNothingOptionSettledAtMoneyNotification(source: CashOrNothingOptionSettledAtMoneyNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserCashOrNothingOptionSettledAtMoneyNotification(): DictionaryValue<CashOrNothingOptionSettledAtMoneyNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCashOrNothingOptionSettledAtMoneyNotification(src)).endCell());
        },
        parse: (src) => {
            return loadCashOrNothingOptionSettledAtMoneyNotification(src.loadRef().beginParse());
        }
    }
}

export type CashOrNothingOptionAgreement = {
    $$type: 'CashOrNothingOptionAgreement';
    holder: Address;
    writer: Address;
    initiation: bigint;
    expiration: bigint;
    optionType: boolean;
    investment: bigint;
    payout: bigint;
}

export function storeCashOrNothingOptionAgreement(src: CashOrNothingOptionAgreement) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.holder);
        b_0.storeAddress(src.writer);
        b_0.storeUint(src.initiation, 32);
        b_0.storeUint(src.expiration, 32);
        b_0.storeBit(src.optionType);
        b_0.storeCoins(src.investment);
        b_0.storeCoins(src.payout);
    };
}

export function loadCashOrNothingOptionAgreement(slice: Slice) {
    let sc_0 = slice;
    let _holder = sc_0.loadAddress();
    let _writer = sc_0.loadAddress();
    let _initiation = sc_0.loadUintBig(32);
    let _expiration = sc_0.loadUintBig(32);
    let _optionType = sc_0.loadBit();
    let _investment = sc_0.loadCoins();
    let _payout = sc_0.loadCoins();
    return { $$type: 'CashOrNothingOptionAgreement' as const, holder: _holder, writer: _writer, initiation: _initiation, expiration: _expiration, optionType: _optionType, investment: _investment, payout: _payout };
}

function loadTupleCashOrNothingOptionAgreement(source: TupleReader) {
    let _holder = source.readAddress();
    let _writer = source.readAddress();
    let _initiation = source.readBigNumber();
    let _expiration = source.readBigNumber();
    let _optionType = source.readBoolean();
    let _investment = source.readBigNumber();
    let _payout = source.readBigNumber();
    return { $$type: 'CashOrNothingOptionAgreement' as const, holder: _holder, writer: _writer, initiation: _initiation, expiration: _expiration, optionType: _optionType, investment: _investment, payout: _payout };
}

function storeTupleCashOrNothingOptionAgreement(source: CashOrNothingOptionAgreement) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.holder);
    builder.writeAddress(source.writer);
    builder.writeNumber(source.initiation);
    builder.writeNumber(source.expiration);
    builder.writeBoolean(source.optionType);
    builder.writeNumber(source.investment);
    builder.writeNumber(source.payout);
    return builder.build();
}

function dictValueParserCashOrNothingOptionAgreement(): DictionaryValue<CashOrNothingOptionAgreement> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCashOrNothingOptionAgreement(src)).endCell());
        },
        parse: (src) => {
            return loadCashOrNothingOptionAgreement(src.loadRef().beginParse());
        }
    }
}

export type SubscriberDestroyedNotification = {
    $$type: 'SubscriberDestroyedNotification';
    queryId: bigint;
}

export function storeSubscriberDestroyedNotification(src: SubscriberDestroyedNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2253786793, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadSubscriberDestroyedNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2253786793) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'SubscriberDestroyedNotification' as const, queryId: _queryId };
}

function loadTupleSubscriberDestroyedNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'SubscriberDestroyedNotification' as const, queryId: _queryId };
}

function storeTupleSubscriberDestroyedNotification(source: SubscriberDestroyedNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserSubscriberDestroyedNotification(): DictionaryValue<SubscriberDestroyedNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSubscriberDestroyedNotification(src)).endCell());
        },
        parse: (src) => {
            return loadSubscriberDestroyedNotification(src.loadRef().beginParse());
        }
    }
}

export type SubscriberCheckTimeout = {
    $$type: 'SubscriberCheckTimeout';
    queryId: bigint;
}

export function storeSubscriberCheckTimeout(src: SubscriberCheckTimeout) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1397988627, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadSubscriberCheckTimeout(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1397988627) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'SubscriberCheckTimeout' as const, queryId: _queryId };
}

function loadTupleSubscriberCheckTimeout(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'SubscriberCheckTimeout' as const, queryId: _queryId };
}

function storeTupleSubscriberCheckTimeout(source: SubscriberCheckTimeout) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserSubscriberCheckTimeout(): DictionaryValue<SubscriberCheckTimeout> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSubscriberCheckTimeout(src)).endCell());
        },
        parse: (src) => {
            return loadSubscriberCheckTimeout(src.loadRef().beginParse());
        }
    }
}

export type SubscriberTimeoutExceeded = {
    $$type: 'SubscriberTimeoutExceeded';
    queryId: bigint;
}

export function storeSubscriberTimeoutExceeded(src: SubscriberTimeoutExceeded) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2857706980, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadSubscriberTimeoutExceeded(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2857706980) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'SubscriberTimeoutExceeded' as const, queryId: _queryId };
}

function loadTupleSubscriberTimeoutExceeded(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'SubscriberTimeoutExceeded' as const, queryId: _queryId };
}

function storeTupleSubscriberTimeoutExceeded(source: SubscriberTimeoutExceeded) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserSubscriberTimeoutExceeded(): DictionaryValue<SubscriberTimeoutExceeded> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSubscriberTimeoutExceeded(src)).endCell());
        },
        parse: (src) => {
            return loadSubscriberTimeoutExceeded(src.loadRef().beginParse());
        }
    }
}

 type CashOrNothingOption_init_args = {
    $$type: 'CashOrNothingOption_init_args';
    deployer: Address;
    optionId: bigint;
}

function initCashOrNothingOption_init_args(src: CashOrNothingOption_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.deployer);
        b_0.storeInt(src.optionId, 257);
    };
}

async function CashOrNothingOption_init(deployer: Address, optionId: bigint) {
    const __code = Cell.fromBase64('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');
    const __system = Cell.fromBase64('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');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initCashOrNothingOption_init_args({ $$type: 'CashOrNothingOption_init_args', deployer, optionId })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const CashOrNothingOption_errors: { [key: number]: { message: string } } = {
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

const CashOrNothingOption_types: ABIType[] = [
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounced","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"DSTDeploy","header":306133030,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DSTDeploySuccess","header":3957924127,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DSTDeployBatch","header":3012477066,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DSTDeployBatchSuccess","header":1261138638,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"batch","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"DSTDeploySession","header":1658160529,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DSTDeploySessionSuccess","header":3452518278,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"session","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"DSTSubscribe","header":3216336466,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"subscriber","type":{"kind":"simple","type":"address","optional":false}},{"name":"notificationsCount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"DSTSubscribeSuccess","header":3770107736,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"batch","type":{"kind":"simple","type":"address","optional":false}},{"name":"remainingNotificationsCount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"Candlestick","header":null,"fields":[{"name":"start","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"end","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"open","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"close","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"high","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"low","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"DSTPublishCandlestick","header":990592317,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"candlestick","type":{"kind":"simple","type":"Candlestick","optional":false}}]},
    {"name":"DSTPublishCandlestickSuccess","header":215123525,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DSTUnsubscribedNotification","header":1287102660,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"remainingNotificationsCount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SBDeploy","header":4267613765,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"SBDeploySuccess","header":1031311118,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"batchId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SBSubscribe","header":2001551522,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"session","type":{"kind":"simple","type":"address","optional":false}},{"name":"notificationsCount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SBSubscribeSuccess","header":4082513223,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"session","type":{"kind":"simple","type":"address","optional":false}},{"name":"remainingNotificationsCount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SBPublishCandlestick","header":4051052066,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"candlestick","type":{"kind":"simple","type":"Candlestick","optional":false}},{"name":"publisher","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"SBCandlestickPublishedNotification","header":4175431181,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"candlestick","type":{"kind":"simple","type":"Candlestick","optional":false}},{"name":"remainingNotificationsCount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SBUnsubscribedNotification","header":1003141156,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"session","type":{"kind":"simple","type":"address","optional":false}},{"name":"remainingNotificationsCount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SBPublishCandlestickSuccess","header":1027631690,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"SESDeploy","header":1372687436,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"SESDeploySuccess","header":269942218,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"subscriber","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"SESSubscribe","header":1533823831,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"notificationsCount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"DSTTopUpSubscription","header":495971614,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"subscriber","type":{"kind":"simple","type":"address","optional":false}},{"name":"batch","type":{"kind":"simple","type":"address","optional":false}},{"name":"notificationsCount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SBTopUpSubscription","header":267884312,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"session","type":{"kind":"simple","type":"address","optional":false}},{"name":"notificationsCount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SESSubscribeSuccess","header":1400038355,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"remainingNotificationsCount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SESCandlestickPublishedNotification","header":3200926804,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"candlestick","type":{"kind":"simple","type":"Candlestick","optional":false}},{"name":"remainingNotificationsCount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SESUnsubscribedNotification","header":4092566650,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"remainingNotificationsCount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SESUnsubscribe","header":2668625285,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"SBUnsubscribe","header":1095850324,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"SESDestroy","header":2226780297,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"SESDestroySuccess","header":21916563,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"BRGDeploy","header":4195386677,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"BRGDeploySuccess","header":3142995347,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"BRGDeployBroker","header":298971134,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"stream","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"BRKDeploy","header":1366331229,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"BRKDeploySuccess","header":2536416450,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"stream","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"BRGDeployBrokerSuccess","header":4042145317,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"broker","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"BRGDeployAccount","header":3233956202,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"BRADeploy","header":1181556865,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"BRADeploySuccess","header":3517832790,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"trader","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"BRGDeployAccountSuccess","header":1962963078,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"account","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"BRKDeposit","header":2141827764,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"BRKDepositSuccess","header":2064422216,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"BRKWithdraw","header":550691255,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"BRKWithdrawSuccess","header":2654800410,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"Fraction","header":null,"fields":[{"name":"nominator","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"denominator","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"CashOrNothingOptionDraftAgreement","header":null,"fields":[{"name":"holder","type":{"kind":"simple","type":"address","optional":false}},{"name":"initiation","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"expiration","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"optionType","type":{"kind":"simple","type":"bool","optional":false}},{"name":"investment","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"BrokerDeployOption","header":1174791129,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"draft","type":{"kind":"simple","type":"CashOrNothingOptionDraftAgreement","optional":false}}]},
    {"name":"BrokerDeployOptionSuccess","header":2438374427,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"stream","type":{"kind":"simple","type":"address","optional":false}},{"name":"option","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"CashOrNothingOptionDeploy","header":3343868548,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"stream","type":{"kind":"simple","type":"address","optional":false}},{"name":"agreement","type":{"kind":"simple","type":"CashOrNothingOptionAgreement","optional":false}}]},
    {"name":"CashOrNothingOptionDeploySuccess","header":2669413677,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"optionId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"holder","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"CashOrNothingOptionSettledInMoneyNotification","header":4281832964,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"CashOrNothingOptionSettledOutMoneyNotification","header":402709524,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"CashOrNothingOptionSettledAtMoneyNotification","header":1344539513,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"CashOrNothingOptionAgreement","header":null,"fields":[{"name":"holder","type":{"kind":"simple","type":"address","optional":false}},{"name":"writer","type":{"kind":"simple","type":"address","optional":false}},{"name":"initiation","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"expiration","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"optionType","type":{"kind":"simple","type":"bool","optional":false}},{"name":"investment","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"payout","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"SubscriberDestroyedNotification","header":2253786793,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"SubscriberCheckTimeout","header":1397988627,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"SubscriberTimeoutExceeded","header":2857706980,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
]

const CashOrNothingOption_getters: ABIGetter[] = [
    {"name":"optionId","arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"agreement","arguments":[],"returnType":{"kind":"simple","type":"CashOrNothingOptionAgreement","optional":true}},
    {"name":"strikePrice","arguments":[],"returnType":{"kind":"simple","type":"int","optional":true,"format":257}},
    {"name":"latestCandlestick","arguments":[],"returnType":{"kind":"simple","type":"Candlestick","optional":true}},
    {"name":"balance","arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"deployerAddress","arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
    {"name":"streamAddress","arguments":[],"returnType":{"kind":"simple","type":"address","optional":true}},
    {"name":"notificationsCount","arguments":[],"returnType":{"kind":"simple","type":"int","optional":true,"format":257}},
    {"name":"expiration","arguments":[],"returnType":{"kind":"simple","type":"int","optional":true,"format":257}},
    {"name":"sessionAddress","arguments":[],"returnType":{"kind":"simple","type":"address","optional":true}},
]

const CashOrNothingOption_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"CashOrNothingOptionDeploy"}},
    {"receiver":"internal","message":{"kind":"typed","type":"DSTDeploySessionSuccess"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SESSubscribeSuccess"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SESCandlestickPublishedNotification"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SESUnsubscribedNotification"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SESDestroySuccess"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SubscriberCheckTimeout"}},
]

export class CashOrNothingOption implements Contract {
    
    static async init(deployer: Address, optionId: bigint) {
        return await CashOrNothingOption_init(deployer, optionId);
    }
    
    static async fromInit(deployer: Address, optionId: bigint) {
        const init = await CashOrNothingOption_init(deployer, optionId);
        const address = contractAddress(0, init);
        return new CashOrNothingOption(address, init);
    }
    
    static fromAddress(address: Address) {
        return new CashOrNothingOption(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  CashOrNothingOption_types,
        getters: CashOrNothingOption_getters,
        receivers: CashOrNothingOption_receivers,
        errors: CashOrNothingOption_errors,
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: CashOrNothingOptionDeploy | DSTDeploySessionSuccess | SESSubscribeSuccess | SESCandlestickPublishedNotification | SESUnsubscribedNotification | SESDestroySuccess | SubscriberCheckTimeout) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'CashOrNothingOptionDeploy') {
            body = beginCell().store(storeCashOrNothingOptionDeploy(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'DSTDeploySessionSuccess') {
            body = beginCell().store(storeDSTDeploySessionSuccess(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SESSubscribeSuccess') {
            body = beginCell().store(storeSESSubscribeSuccess(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SESCandlestickPublishedNotification') {
            body = beginCell().store(storeSESCandlestickPublishedNotification(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SESUnsubscribedNotification') {
            body = beginCell().store(storeSESUnsubscribedNotification(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SESDestroySuccess') {
            body = beginCell().store(storeSESDestroySuccess(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SubscriberCheckTimeout') {
            body = beginCell().store(storeSubscriberCheckTimeout(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getOptionId(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('optionId', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getAgreement(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('agreement', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleCashOrNothingOptionAgreement(result_p) : null;
        return result;
    }
    
    async getStrikePrice(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('strikePrice', builder.build())).stack;
        let result = source.readBigNumberOpt();
        return result;
    }
    
    async getLatestCandlestick(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('latestCandlestick', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleCandlestick(result_p) : null;
        return result;
    }
    
    async getBalance(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('balance', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getDeployerAddress(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('deployerAddress', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }
    
    async getStreamAddress(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('streamAddress', builder.build())).stack;
        let result = source.readAddressOpt();
        return result;
    }
    
    async getNotificationsCount(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('notificationsCount', builder.build())).stack;
        let result = source.readBigNumberOpt();
        return result;
    }
    
    async getExpiration(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('expiration', builder.build())).stack;
        let result = source.readBigNumberOpt();
        return result;
    }
    
    async getSessionAddress(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('sessionAddress', builder.build())).stack;
        let result = source.readAddressOpt();
        return result;
    }
    
}