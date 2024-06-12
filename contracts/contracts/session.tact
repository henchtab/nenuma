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

    if (self.batch == null) {
      nativeThrowUnless(ERR_INVALID_ARGUMENT, request.notificationsCount >= 2);
    } else {
      nativeThrowUnless(ERR_INVALID_ARGUMENT, request.notificationsCount >= 1);
    }

    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= (SES_SUBSCRIBE_DEPOSIT + NOTIFICATION_PREMIUM) + request.notificationsCount);

    self.forward(self.stream, (DSTSubscribe { queryId: request.queryId, subscriber: self.subscriber, notificationsCount: request.notificationsCount, batch: self.batch }).toCell(), true, null);
  }

  // TODO: bounced(request: SESSubscribe);

  receive(response: DSTSubscribeSuccess) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.stream);

    self.batch = response.batch;

    self.forward(self.subscriber, (SESSubscribeSuccess { queryId: response.queryId, remainingNotificationsCount: response.remainingNotificationsCount }).toCell(), false, null);
  }

  receive(notification: SBCandlestickPublishedNotification) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.batch);

    self.forward(self.subscriber, (SESCandlestickPublishedNotification { queryId: notification.queryId, candlestick: notification.candlestick, remainingNotificationsCount: notification.remainingNotificationsCount }).toCell(), false, null);
  }

  receive(notification: DSTUnsubscribedNotification) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.stream);

    self.batch = null;

    self.forward(self.subscriber, (SESUnsubscribedNotification { queryId: notification.queryId, remainingNotificationsCount: notification.remainingNotificationsCount }).toCell(), false, null);
  }

  receive(request: SESUnsubscribe) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.subscriber);
    nativeThrowUnless(ERR_STREAM_NOT_SUBSCRIBED, self.batch != null);
    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= SES_UNSUBSCRIBE_DEPOSIT);

    self.forward(self.batch!!, (SBUnsubscribe { queryId: request.queryId }).toCell(), true, null);
  }

  // TODO: bounced(request: SESUnsubscribe);

  receive(request: SESDestroy) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.subscriber);
    nativeThrowUnless(ERR_STREAM_SUBSCRIBED, self.batch == null);

    send(SendParameters { 
      to: self.subscriber, 
      value: NOTIFICATION_DEPOSIT, 
      mode: SendRemainingBalance + SendDestroyIfZero, 
      body: (SESDestroySuccess { queryId: request.queryId }).toCell(),
    });
  }
}

// END Session