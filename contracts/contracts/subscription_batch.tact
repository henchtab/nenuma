// BEGIN Subscription Batch

const BSSTORAGE_RESERVE: Int = ton("1.00");

message BSDeploy {
  queryId: Int;
}

message BSDeploySuccess {
  queryId: Int;
  batchId: Int;
}

contract SubscriptionBatch {
  storageReserve: Int;

  stream: Address;
  batchId: Int;

  init(stream: Address, batchId: Int) {
    self.storageReserve = BSSTORAGE_RESERVE;
    self.stream = stream;
    self.batchId = batchId;
  }

  fun requireStream() {
    // TODO: Substitute the 100 with a meaningful constant name.
    nativeThrowUnless(100, sender() == self.stream);
  }

  receive(deploy: BSDeploy) {
    self.requireStream();
    self.notify((BSDeploySuccess{ queryId: deploy.queryId, batchId: self.batchId }).toCell());
  }
}

// END Subscription Batch