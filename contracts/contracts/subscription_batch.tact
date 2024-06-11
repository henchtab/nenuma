// BEGIN Subscription Batch

import "./constants";
import "./messages";

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

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.stream);

    self.notify(SBDeploySuccess { queryId: request.queryId, batchId: self.batchId }.toCell());
  }
}

// END Subscription Batch