// BEGIN Data Stream

import "./subscription_batch";
import "./session";

const DSTSTORAGE_RESERVE: Int = ton("1.00");

message DSTDeploy {
  queryId: Int;
}

message DSTDeploySuccess {
  queryId: Int;
}

contract DataStream {
  storageReserve: Int;

  publisher: Address;
  topic: String;

  init(publisher: Address, topic: String) {
    self.storageReserve = DSTSTORAGE_RESERVE;
    self.publisher = publisher;
    self.topic = topic;
  }

  fun requirePublisher() {
    // TODO: Substitute the 100 with a meaningful constant name.
    nativeThrowUnless(100, sender() == self.publisher);
  }

  receive(deploy: DSTDeploy) {
    self.requirePublisher();
    self.notify((DSTDeploySuccess { queryId: deploy.queryId }).toCell());
  }
}

// END Data Stream
