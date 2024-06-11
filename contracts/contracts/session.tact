// BEGIN Session

import "./constants";
import "./messages";

contract Session {
  storageReserve: Int;

  stream: Address;
  subscriber: Address;
  batch: Address?;

  init(stream: Address, subscriber: Address) {
    self.storageReserve = SES_STORAGE_RESERVE;
    self.stream = stream;
    self.subscriber = subscriber;
  }

  get fun storageReserve(): Int {
    return self.storageReserve;
  }

  get fun stream(): Address {
    return self.stream;
  }

  get fun subscriber(): Address {
    return self.subscriber;
  }

  get fun batch(): Address? {
    return self.batch;
  }

  receive(request: SESDeploy) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.stream);

    self.notify((SESDeploySuccess { queryId: request.queryId, subscriber: self.subscriber }).toCell());
  }

  receive(request: SESSubscribe) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.subscriber);
    nativeThrowUnless(ERR_INVALID_ARGUMENT, request.notificationsCount > 0);
    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= SES_SUBSCRIBE_DEPOSIT + (request.notificationsCount) * NOTIFICATION_PREMIUM + (request.notificationsCount + 1) * NOTIFICATION_DEPOSIT);

    self.forward(self.stream, (DSTSubscribe { queryId: request.queryId, subscriber: self.subscriber, notificationsCount: request.notificationsCount }).toCell(), true, null);
  }

  // TODO: Implement bounced(request: SESSubscribe);

  receive(response: DSTSubscribeSuccess) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.stream);

    self.batch = response.batch;

    // self.remainingNotificationsCount = response.remainingNotificationsCount;

    self.forward(self.subscriber, (SESSubscribeSuccess { queryId: response.queryId, remainingNotificationsCount: response.remainingNotificationsCount }).toCell(), false, null);
  }
}

// END Session