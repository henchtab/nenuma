// BEGIN Data Stream

message DSTDeploy {
  queryId: Int;
}

message DSTDeploySuccess {
  queryId: Int;
}

message DSTDeployBatch {
  queryId: Int;
}

message DSTDeployBatchSuccess {
  queryId: Int;
  batch: Address; 
}

message DSTDeploySession {
  queryId: Int;
}

message DSTDeploySessionSuccess {
  queryId: Int;
  session: Address; 
}

message DSTSubscribe {
  queryId: Int;
  subscriber: Address;
  notificationsCount: Int;
  batch: Address?;
}

message DSTSubscribeSuccess {
  queryId: Int;
  batch: Address;
  remainingNotificationsCount: Int;
}

struct Candlestick {
  start: Int;
  end: Int;
  open: Int;
  close: Int;
  high: Int;
  low: Int;
}

message DSTPublishCandlestick { 
  queryId: Int; 
  candlestick: Candlestick;
}

message DSTPublishCandlestickSuccess {
  queryId: Int;
}

message DSTUnsubscribedNotification {
  queryId: Int;
  remainingNotificationsCount: Int;
}

// END Data Stream


// BEGIN Subsription Batch

message SBDeploy {
  queryId: Int;
}

message SBDeploySuccess {
  queryId: Int;
  batchId: Int;
}

message SBSubscribe {
  queryId: Int;
  session: Address;
  notificationsCount: Int;
}

message SBSubscribeSuccess {
  queryId: Int;
  session: Address;
  remainingNotificationsCount: Int;
}

message SBPublishCandlestick {
  queryId: Int;
  candlestick: Candlestick;
  publisher: Address;
}

message SBCandlestickPublishedNotification {
  queryId: Int;
  candlestick: Candlestick;
  remainingNotificationsCount: Int;
}

message SBUnsubscribedNotification {
  queryId: Int;
  session: Address;
  remainingNotificationsCount: Int;
}

message SBPublishCandlestickSuccess {
  queryId: Int;
}

// END Subscription Batch


// BEGIN Session

message SESDeploy {
  queryId: Int;
}

message SESDeploySuccess {
  queryId: Int;
  subscriber: Address;
}

message SESSubscribe {
  queryId: Int;
  notificationsCount: Int;
}

message SESSubscribeSuccess {
  queryId: Int;
  remainingNotificationsCount: Int;
}

message SESCandlestickPublishedNotification {
  queryId: Int;
  candlestick: Candlestick;
  remainingNotificationsCount: Int;
}

message SESUnsubscribedNotification {
  queryId: Int;
  remainingNotificationsCount: Int;
}

// END Session


message SESUnsubscribe { 
  queryId: Int;
}

message SBUnsubscribe {
  queryId: Int;
}

message SESDestroy {
  queryId: Int;
}

message SESDestroySuccess {
  queryId: Int;
}

// message SBUnsubscribeSuccess {
//   queryId: Int;
//   session: Address;
//   remainingNotificationsCount: Int;
// }

// message DSTUnsubscribeSuccess {
//   queryId: Int;
//   remainingNotificationsCount: Int;
// }

// message SESUnsubscribeSuccess { 
//   queryId: Int;
//   remainingNotificationsCount: Int;
// }

// BEGIN Brokerage

// Step 1

// message BRGDeploy {
//   queryId: Int;
// }

// message BRGDeploySuccess {
//   queryId: Int;
// }

// // Step 2

// message BRGDeployBroker {
//   queryId: Int;
//   stream: Address;
// }

// message BRKDeploy {
//   queryId: Int;
// }

// message BRKDeploySuccess {
//   queryId: Int;
//   stream: Address;
// }

// message BRGDeployBrokerSuccess {
//   queryId: Int;
//   broker: Address;
// }

// // Step 4

// message BRGDeployAccount {
//   queryId: Int;
// }

// message BRADeploy {
//   queryId: Int;
// }

// message BRADeploySuccess {
//   queryId: Int;
//   trader: Address;
// }

// message BRGDeployAccountSuccess {
//   queryId: Int;
//   account: Address;
// }

// // Step 3

// // Deposits the value
// message BRKDeposit {
//   queryId: Int;
//   deposit: Int;
// }

// message BRKDepositSuccess {
//   queryId: Int;
// }

// // Step 7

// // Withdraws the value
// message BRKWithdraw {
//   queryId: Int;
// }

// message BRKWithdrawSuccess {
//   queryId: Int;
// }

// // END Brokerage