// BEGIN Subscription Batch

import "./constants";
import "./messages";

struct SubscriptionInfo {
  // TODO: implement 'start: Int' to make the notifications pricing predictable; if the publisher publish a bunch of candlesticks at once (e.g., 1-minute candlesticks for 11:50, 11:51, ..., 12:00), then subscribers who subscribed at 12:00 for 5 minutes will get candlesticks 11:50 to 11:55. This can be either because of the TON blockchain network congestion due to increased demand in the short-run. It also enables users to delay the start of their subscription by paying a relatively smaller fee rather than the fee for receiving the SESCandlestickPublishedNotification. This is extremely useful when issuing derivatives which initiation time is in the future. Moreover, it encourages publisher to publish candlesticks as soon as possible to avoid paying fees to the larger number of subscribers. This is because subscribers pay the 'waiting time' fee for the time difference (subscription.start - now()). Therefore, publishers have to cover the cost of 'waiting time' for the period (now() - candlestick.start) for every lately published candlestick.
  remainingNotificationsCount: Int;
}

contract SubscriptionBatch {
  stream: Address;
  batchId: Int;
  subscriptions: map<Address, SubscriptionInfo>;
  subscriptionsCount: Int;

  init(stream: Address, batchId: Int) {
    self.stream = stream;
    self.batchId = batchId;
    self.subscriptionsCount = 0;
  }

  get fun balance(): Int {
    return myBalance();
  }

  get fun storageReserve(): Int {
    return SB_STORAGE_RESERVE;
  }

  get fun streamAddress(): Address {
    return self.stream;
  }

  get fun batchId(): Int {
    return self.batchId;
  }

  get fun subscriptions(): map<Address, SubscriptionInfo> {
    return self.subscriptions;
  }

  get fun subscriptionsCount(): Int {
    return self.subscriptionsCount;
  }

  receive(request: SBDeploy) {
    let ctx: Context = context();

    nativeReserve(SB_STORAGE_RESERVE, ReserveExact | ReserveAddOriginalBalance);

    send(SendParameters {
      to: ctx.sender,
      value: 0,
      mode: SendRemainingBalance,
      body: SBDeploySuccess { queryId: request.queryId, batchId: self.batchId }.toCell(),
    });
  }

  receive(request: SBSubscribe) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.stream);

    dump("KAKA");
    dump(self.subscriptionsCount);

    nativeThrowUnless(ERR_SUBSCRIPTION_LIMIT_EXCEEDED, self.subscriptionsCount < SUBSCRIPTION_LIMIT);
    self.subscriptionsCount += 1;

    nativeThrowUnless(ERR_INVALID_ARGUMENT, request.notificationsCount >= 2);
    
    nativeReserve(NOTIFICATION_DEPOSIT * request.notificationsCount, ReserveExact | ReserveAddOriginalBalance);

    let session: Address = request.session;
    let info: SubscriptionInfo? = self.subscriptions.get(session);

    // TODO: ERR_INVALID_ARGUMENT --> ERR_SESSION_ALREADY_EXISTS;
    nativeThrowUnless(ERR_INVALID_ARGUMENT, info == null);

    let remainingNotificationsCount: Int = request.notificationsCount;
    
    self.subscriptions.set(session, SubscriptionInfo { remainingNotificationsCount });

    send(SendParameters {
      to: ctx.sender,
      value: 0,
      mode: SendRemainingBalance,
      body: (SBSubscribeSuccess { queryId: request.queryId, session, remainingNotificationsCount }).toCell(),
    });
  }

  receive(request: SBTopUpSubscription) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.stream);

    nativeThrowUnless(ERR_INVALID_ARGUMENT, request.notificationsCount >= 1);
    
    nativeReserve(NOTIFICATION_DEPOSIT * request.notificationsCount, ReserveExact | ReserveAddOriginalBalance);

    let session: Address = request.session;
    let info: SubscriptionInfo? = self.subscriptions.get(session);

    // TODO: ERR_INVALID_ARGUMENT --> ERR_SESSION_NOT_FOUND;
    nativeThrowUnless(ERR_INVALID_ARGUMENT, info != null);

    let remainingNotificationsCount: Int = info!!.remainingNotificationsCount + request.notificationsCount;
    
    self.subscriptions.set(session, SubscriptionInfo { remainingNotificationsCount });

    send(SendParameters {
      to: ctx.sender,
      value: 0,
      mode: SendRemainingBalance,
      body: (SBSubscribeSuccess { queryId: request.queryId, session, remainingNotificationsCount }).toCell(),
    });
  }

  receive(request: SBPublishCandlestick) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.stream);
    // nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= SB_PUBLISH_CANDLESTICK_DEPOSIT);

    let subscriptions: map<Address, SubscriptionInfo> = self.subscriptions;
    let notificationsCount: Int = 0;

    foreach (session, info in subscriptions) {
      notificationsCount += 1;

      send(SendParameters { 
        to: session, 
        value: NOTIFICATION_DEPOSIT, 
        mode: SendIgnoreErrors, 
        body: (SBCandlestickPublishedNotification { queryId: request.queryId, candlestick: request.candlestick, remainingNotificationsCount: (info.remainingNotificationsCount - 1) }).toCell(),
      });

      self.subscriptions.set(session, SubscriptionInfo { remainingNotificationsCount: (info.remainingNotificationsCount - 1) });

      if (info.remainingNotificationsCount == 2) {
        notificationsCount += 1;

        send(SendParameters { 
          to: self.stream, 
          value: NOTIFICATION_DEPOSIT, 
          mode: SendIgnoreErrors, 
          body: (SBUnsubscribedNotification { queryId: request.queryId, session, remainingNotificationsCount: 0 }).toCell(),
        });

        self.subscriptions.set(session, null);
        self.subscriptionsCount -= 1;
      }
    }

    nativeReserve(NOTIFICATION_DEPOSIT * notificationsCount, ReserveExact | ReserveInvertSign | ReserveAddOriginalBalance);

    send(SendParameters {
      to: request.publisher,
      value: 0,
      mode: SendRemainingBalance,
      body: (SBPublishCandlestickSuccess { queryId: request.queryId }).toCell(),
    });
  }

  receive(request: SBUnsubscribe) {
    let ctx: Context = context();

    let session: Address = ctx.sender;
    let info: SubscriptionInfo? = self.subscriptions.get(session);

    nativeThrowUnless(ERR_ACCESS_DENIED, info != null);

    self.subscriptionsCount -= 1;
    self.subscriptions.set(session, null);

    nativeReserve(NOTIFICATION_DEPOSIT * info!!.remainingNotificationsCount, ReserveExact | ReserveInvertSign | ReserveAddOriginalBalance);

    send(SendParameters { 
      to: self.stream, 
      value: NOTIFICATION_DEPOSIT * info!!.remainingNotificationsCount, 
      mode: SendRemainingBalance, 
      body: (SBUnsubscribedNotification { queryId: request.queryId, session, remainingNotificationsCount: info!!.remainingNotificationsCount }).toCell(),
    });
  }
}

// END Subscription Batch