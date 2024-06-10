// BEGIN Session

const SESSTORAGE_RESERVE: Int = ton("1.00");

message SESDeploy {
  queryId: Int;
}

message SESDeploySuccess {
  queryId: Int;
  subscriber: Address;
}

contract Session {
  storageReserve: Int;

  stream: Address;
  subscriber: Address;

  init(stream: Address, subscriber: Address) {
    self.storageReserve = SESSTORAGE_RESERVE;
    self.stream = stream;
    self.subscriber = subscriber;
  }

  fun requireStream() {
    // TODO: Substitute the 100 with a meaningful constant name.
    nativeThrowUnless(100, sender() == self.stream);
  }

  receive(deploy: BSDeploy) {
    self.requireStream();
    self.notify((SESDeploySuccess{ queryId: deploy.queryId, subscriber: self.subscriber }).toCell());
  }
}

// END Session