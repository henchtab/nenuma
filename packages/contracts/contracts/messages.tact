// BEGIN Data Stream

// Messages related to Data Stream operations
message DSTDeploy {
  queryId: Int as uint64;
}

message DSTDeploySuccess {
  queryId: Int as uint64;
}

message DSTDeployBatch {
  queryId: Int as uint64;
}

message DSTDeployBatchSuccess {
  queryId: Int as uint64;
  batch: Address; 
}

message DSTDeploySession {
  queryId: Int as uint64;
}

message DSTDeploySessionSuccess {
  queryId: Int as uint64;
  session: Address; 
}

message DSTSubscribe {
  queryId: Int as uint64;
  subscriber: Address;
  notificationsCount: Int;
}

message DSTSubscribeSuccess {
  queryId: Int as uint64;
  batch: Address;
  remainingNotificationsCount: Int;
}

// Candlestick structure
struct Candlestick {
  start: Int;
  end: Int;
  open: Int;
  close: Int;
  high: Int;
  low: Int;
}

message DSTPublishCandlestick { 
  queryId: Int as uint64; 
  candlestick: Candlestick;
}

message DSTPublishCandlestickSuccess {
  queryId: Int as uint64;
}

message DSTUnsubscribedNotification {
  queryId: Int as uint64;
  remainingNotificationsCount: Int;
}

// END Data Stream

// BEGIN Subscription Batch

// Messages related to Subscription Batch operations
message SBDeploy {
  queryId: Int as uint64;
}

message SBDeploySuccess {
  queryId: Int as uint64;
  batchId: Int;
}

message SBSubscribe {
  queryId: Int as uint64;
  session: Address;
  notificationsCount: Int;
}

message SBSubscribeSuccess {
  queryId: Int as uint64;
  session: Address;
  remainingNotificationsCount: Int;
}

message SBPublishCandlestick {
  queryId: Int as uint64;
  candlestick: Candlestick;
  publisher: Address;
}

message SBCandlestickPublishedNotification {
  queryId: Int as uint64;
  candlestick: Candlestick;
  remainingNotificationsCount: Int;
}

message SBUnsubscribedNotification {
  queryId: Int as uint64;
  session: Address;
  remainingNotificationsCount: Int;
}

message SBPublishCandlestickSuccess {
  queryId: Int as uint64;
}

// END Subscription Batch

// BEGIN Session

// Messages related to Session operations
message SESDeploy {
  queryId: Int as uint64;
}

message SESDeploySuccess {
  queryId: Int as uint64;
  subscriber: Address;
}

message SESSubscribe {
  queryId: Int as uint64;
  notificationsCount: Int;
}

message DSTTopUpSubscription {
  queryId: Int as uint64;
  subscriber: Address;
  batch: Address;
  notificationsCount: Int;
}

message SBTopUpSubscription {
  queryId: Int as uint64;
  session: Address;
  notificationsCount: Int;
}

message SESSubscribeSuccess {
  queryId: Int as uint64;
  remainingNotificationsCount: Int;
}

message SESCandlestickPublishedNotification {
  queryId: Int as uint64;
  candlestick: Candlestick;
  remainingNotificationsCount: Int;
}

message SESUnsubscribedNotification {
  queryId: Int as uint64;
  remainingNotificationsCount: Int;
}

message SESUnsubscribe { 
  queryId: Int as uint64;
}

message SBUnsubscribe {
  queryId: Int as uint64;
}

message SESDestroy {
  queryId: Int as uint64;
}

message SESDestroySuccess {
  queryId: Int as uint64;
}

// END Session

// BEGIN Brokerage

// Messages related to Brokerage operations
message BRGDeploy {
  queryId: Int as uint64;
}

message BRGDeploySuccess {
  queryId: Int as uint64;
}

message BRGDeployBroker {
  queryId: Int as uint64;
  stream: Address;
}

message BRKDeploy {
  queryId: Int as uint64;
}

message BRKDeploySuccess {
  queryId: Int as uint64;
  stream: Address;
}

message BRGDeployBrokerSuccess {
  queryId: Int as uint64;
  broker: Address;
}

message BRGDeployAccount {
  queryId: Int as uint64;
}

message BRADeploy {
  queryId: Int as uint64;
}

message BRADeploySuccess {
  queryId: Int as uint64;
  trader: Address;
}

message BRGDeployAccountSuccess {
  queryId: Int as uint64;
  account: Address;
}

message BRKDeposit {
  queryId: Int as uint64;
}

message BRKDepositSuccess {
  queryId: Int as uint64;
}

message BRKWithdraw {
  queryId: Int as uint64;
}

message BRKWithdrawSuccess {
  queryId: Int as uint64;
}

// END Brokerage
