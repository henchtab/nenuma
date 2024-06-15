import "./constants";
import "./messages";

const SUS_STORAGE_RESERVE: Int = ton("1");
const SUS_OPERATIONAL_RESERVE: Int = ton("1");
const SUS_TIMEOUT: Int = 3600;

contract SimpleSubscriber {
    owner: Address;
    subscriberId: Int;
    stream: Address?;
    notificationsCount: Int?;
    session: Address?;
    latestCandlestick: Candlestick?;
    expiresAt: Int?;

    get fun balance(): Int {
      return myBalance();
    }

    get fun ownerAddress(): Address {
      return self.owner;
    }

    get fun notificationsCount(): Int? {
      return self.notificationsCount;
    }

    get fun expiresAt(): Int? {
      return self.expiresAt;
    }

    get fun streamAddress(): Address? {
      return self.stream;
    }

    get fun sessionAddress(): Address? {
      return self.session;
    }

    get fun latestCandlestick(): Candlestick? {
      return self.latestCandlestick;
    }
    
    init(owner: Address, subscriberId: Int) {
      self.owner = owner;
      self.subscriberId = subscriberId;
    }

    receive(request: SUSDeploy) {
      dump("SUSDeploy");

      let ctx: Context = context();

      nativeThrowUnless(ERR_INVALID_ARGUMENT, request.notificationsCount >= 2);
      nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= SUS_STORAGE_RESERVE + SUS_OPERATIONAL_RESERVE + (NOTIFICATION_DEPOSIT + NOTIFICATION_PREMIUM) * request.notificationsCount);

      self.stream = request.stream;
      self.notificationsCount = request.notificationsCount;
      self.expiresAt = request.expiresAt;

      send(SendParameters {
        to: self.stream!!,
        value: DST_DEPLOY_SESSION_DEPOSIT,
        mode: SendPayGasSeparately | SendBounceIfActionFail,
        body: (DSTDeploySession { queryId: request.queryId }).toCell(),
      });

      nativeReserve(SUS_STORAGE_RESERVE + (SUS_OPERATIONAL_RESERVE - DST_DEPLOY_SESSION_DEPOSIT) + (NOTIFICATION_DEPOSIT + NOTIFICATION_PREMIUM) * request.notificationsCount, ReserveExact);

      send(SendParameters {
        to: self.owner,
        value: 0,
        mode: SendRemainingBalance,
        body: (SUSDeploySuccess { queryId: request.queryId, subscriberId: self.subscriberId }).toCell(),
      });
    }

    receive(response: DSTDeploySessionSuccess) {
      dump("DSTDeploySessionSuccess");

      let ctx: Context = context();

      nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.stream);

      self.session = response.session;

      send(SendParameters {
        to: self.session!!,
        value: SES_SUBSCRIBE_DEPOSIT + (NOTIFICATION_DEPOSIT + NOTIFICATION_PREMIUM) * self.notificationsCount!!,
        mode: SendPayGasSeparately | SendBounceIfActionFail,
        body: (SESSubscribe { queryId: response.queryId, notificationsCount: self.notificationsCount!! }).toCell()
      });
    }
    
    fun destroy(queryId: Int) {
      dump("self.destroy()");

      send(SendParameters {
        to: self.owner,
        value: 0,
        mode: SendRemainingBalance | SendDestroyIfZero,
        body: (SUSDestroyedNotification { queryId }).toCell()
      });
    }

    bounced(request: bounced<SESSubscribe>) {
      dump("bounced<SESSubscribe>");

      self.destroy(request.queryId);
    }

    fun unsubscribeSession(queryId: Int) {
      dump("self.unsubscribeSession()");

      send(SendParameters {
        to: self.owner,
        value: SES_UNSUBSCRIBE_DEPOSIT,
        mode: SendPayGasSeparately | SendBounceIfActionFail,
        body: (SESUnsubscribe { queryId }).toCell()
      });
    }

    fun destroySession(queryId: Int) {
      dump("self.destroySession()");

      send(SendParameters {
        to: self.session!!,
        value: SES_DESTROY_DEPOSIT,
        mode: SendPayGasSeparately | SendBounceIfActionFail,
        body: (SESDestroy { queryId }).toCell()
      });
    }

    receive(response: SESUnsubscribedNotification) {
      dump("SESUnsubscribedNotification");

      let ctx: Context = context();

      nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.session!!);

      dump("self.latestCandlestick!!.start");
      dump(self.latestCandlestick!!.start);

      self.destroySession(response.queryId);
    }

    bounced(request: SESUnsubscribe) {
      dump("bounced<SESUnsubscribe>");
      self.destroy(request.queryId);
    }

    bounced(request: SESDestroy) {
      dump("bounced<SESDestroy>");
      self.destroy(request.queryId);
    }

    receive(response: SESSubscribeSuccess) {
      dump("SESSubscribeSuccess");

      let ctx: Context = context();

      nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.session!!);

      dump("self.notificationsCount");
      dump(self.notificationsCount);

      dump("response.remainingNotificationsCount");
      dump(response.remainingNotificationsCount);

      if (self.notificationsCount != response.remainingNotificationsCount) {
        self.unsubscribeSession(response.queryId);
      }
    }

    receive(notification: SESCandlestickPublishedNotification) {
      dump("SESCandlestickPublishedNotification");

      let ctx: Context = context();

      nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.session!!);

      self.latestCandlestick = notification.candlestick;

      dump("self.latestCandlestick!!.start");
      dump(self.latestCandlestick!!.start);
    }

    receive(response: SESDestroySuccess) {
      dump("SESDestroySuccess");

      let ctx: Context = context();

      nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.session!!);

      self.destroy(response.queryId);
    }

    receive(request: SUSCheckTimeout) {      
      nativeThrowUnless(ERR_NOT_DEPLOYED, self.expiresAt != null);
      nativeThrowUnless(ERR_TIMEOUT_NOT_EXCEEDED, now() > self.expiresAt!! + SUS_TIMEOUT);

      let ctx: Context = context();

      send(SendParameters {
        to: ctx.sender,
        value: ctx.value,
        mode: SendPayGasSeparately | SendBounceIfActionFail,
        body: (SUSTimeoutExceeded { queryId: request.queryId }).toCell(),
      });

      self.unsubscribeSession(request.queryId);
    }
}

message SUSDeploy {
  queryId: Int as uint64;
  stream: Address;
  notificationsCount: Int;
  expiresAt: Int;
}

message SUSDeploySuccess {
  queryId: Int as uint64;
  subscriberId: Int;
}

message SUSDestroyedNotification {
  queryId: Int as uint64;
}

message SUSCheckTimeout {
  queryId: Int as uint64;
}

message SUSTimeoutExceeded {
  queryId: Int as uint64;
}