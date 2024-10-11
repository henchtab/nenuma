export enum CHAIN {
  MAINNET = "-239",
  TESTNET = "-3",
}

export enum BybitKlineTopic {
  BTCUSDT = "kline.1.BTCUSDT",
  ETHUSDT = "kline.1.ETHUSDT",
  BNBUSDT = "kline.1.BNBUSDT",
  SOLUSDT = "kline.1.SOLUSDT",
  TONUSDT = "kline.1.TONUSDT",
}

export enum RedisKey {
  KlineBTC24H = "kline:BTC:24h",
  KlineBTC1m = "kline:BTC:1m",
  KlineETH24H = "kline:ETH:24h",
  KlineETH1m = "kline:ETH:1m",
  KlineTON24H = "kline:TON:24h",
  KlineTON1m = "kline:TON:1m",
  KlineSOL24H = "kline:SOL:24h",
  KlineSOL1m = "kline:SOL:1m",
  KlineBNB24H = "kline:BNB:24h",
  KlineBNB1m = "kline:BNB:1m",
  SubcribeRequest = "subscribe:request",
  BrokerBTCStartUtime = "broker:BTC:start_utime",
}
