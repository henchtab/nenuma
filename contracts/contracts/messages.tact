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

// END Data Stream


// BEGIN Subsription Batch

message SBDeploy {
  queryId: Int;
}

message SBDeploySuccess {
  queryId: Int;
  batchId: Int;
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

message DSTSubscribe {
  queryId: Int;
  subscriber: Address;
  notificationsCount: Int;
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

message DSTSubscribeSuccess {
  queryId: Int;
  batch: Address;
  remainingNotificationsCount: Int;
}

message SESSubscribeSuccess {
  queryId: Int;
  remainingNotificationsCount: Int;
}

// END Session