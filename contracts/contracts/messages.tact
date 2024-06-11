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

// END Session


// struct Candlestick {
//   start: Int as uint32;
//   end: Int as uint32;
//   open: Int as uint32;
//   close: Int as uint32;
//   high: Int as uint32;
//   low: Int as uint32;
// }

// message DSTPublishCandlestick { 
//   queryId: Int; 
//   candlestick: Candlestick;
// }

// message SBPublishCandlestick {
//   queryId: Int;
//   candlestick: Candlestick;
//   publisher: Address;
// }

// message DSTPublishCandlestickSuccess {
//   queryId: Int;
// }

// message SBCandlestickPublishedNotification {
//   queryId: Int;
//   candlestick: Candlestick;
//   remainingNotificationsCount: Int;
// }

// message SBUnsubscribedNotification {
//   queryId: Int;
//   session: Address;
//   // remainingNotificationsCount: Int; = 0
// }

// message DSTUnsubscribedNotification {
//   queryId: Int;
//   // batch: Address;
//   // remainingNotificationsCount: Int; = 0
// }

// message SESCandlestickPublishedNotification {
//   queryId: Int;
//   candlestick: Candlestick;
//   remainingNotificationsCount: Int;
// }

// message SESUnsubscribedNotification {
//   queryId: Int;
//   candlestick: Candlestick;
//   // remainingNotificationsCount: Int; = 0
// }