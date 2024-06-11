// BEGIN Session

import "./constants";
import "./messages";

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

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.stream);

    self.notify((SESDeploySuccess { queryId: request.queryId, subscriber: self.subscriber }).toCell());
  }

  // receive(request: SESSubscribe) {
  //   let ctx: Context = context();

  //   // TODO: ERR_ACCESS_DENIED
  //   nativeThrowUnless(400, ctx.sender == self.subscriber);
  //   nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= SES_SUBSCRIBE_DEPOSIT);

  //   // check number of messages

  //   self.forward(self.stream, (DSTSubscribe { queryId: request.queryId, subscriber: self.subscriber, remainingNotificationsCount: request.remainingNotificationsCount }).toCell(), false, null);
  // }

  // receive(response: DSTSubscribeSuccess) {
  //   let ctx: Context = context();

  //   // TODO: ERR_ACCESS_DENIED
  //   nativeThrowUnless(400, ctx.sender == self.stream);
  //   // nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= SES_SUBSCRIBE_DEPOSIT);

  //   self.forward(self.subscriber, (SESSubscribeSuccess { queryId: request.queryId, batch: response.batch, remainingNotificationsCount: response.remainingNotificationsCount }).toCell(), false, null);
  // }
}

// END Session