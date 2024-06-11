// BEGIN Subscription Batch

const BS_STORAGE_RESERVE: Int = ton("1.00");

message SBDeploy {
  queryId: Int;
}

message SBDeploySuccess {
  queryId: Int;
  batchId: Int;
}

contract SubscriptionBatch {
  storageReserve: Int;

  stream: Address;
  batchId: Int;

  init(stream: Address, batchId: Int) {
    self.storageReserve = BS_STORAGE_RESERVE;
    self.stream = stream;
    self.batchId = batchId;
  }

  receive(request: SBDeploy) {
    let ctx: Context = context();

    // TODO: ERR_ACCESS_DENIED
    nativeThrowUnless(400, ctx.sender == self.stream);

    self.notify(SBDeploySuccess { queryId: request.queryId, batchId: self.batchId }.toCell());
  }
}

// END Subscription Batch