// BEGIN Session

const SES_STORAGE_RESERVE: Int = ton("1.00");

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
    self.storageReserve = SES_STORAGE_RESERVE;
    self.stream = stream;
    self.subscriber = subscriber;
  }

  receive(request: SESDeploy) {
    let ctx: Context = context();

    // TODO: ERR_ACCESS_DENIED
    nativeThrowUnless(400, ctx.sender == self.stream);

    self.notify((SESDeploySuccess{ queryId: request.queryId, subscriber: self.subscriber }).toCell());
  }
}

// END Session