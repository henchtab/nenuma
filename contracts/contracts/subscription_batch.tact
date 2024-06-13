// BEGIN Subscription Batch

import "./constants";
import "./messages";

struct SubscriptionInfo {
  // TODO: implement 'start: Int' to make the notifications pricing predictable; if the publisher publish a bunch of candlesticks at once (e.g., 1-minute candlesticks for 11:50, 11:51, ..., 12:00), then subscribers who subscribed at 12:00 for 5 minutes will get candlesticks 11:50 to 11:55. This can be either because of the TON blockchain network congestion due to increased demand in the short-run. It also enables users to delay the start of their subscription by paying a relatively smaller fee rather than the fee for receiving the SESCandlestickPublishedNotification. This is extremely useful when issuing derivatives which initiation time is in the future. Moreover, it encourages publisher to publish candlesticks as soon as possible to avoid paying fees to the larger number of subscribers. This is because subscribers pay the 'waiting time' fee for the time difference (subscription.start - now()). Therefore, publishers have to cover the cost of 'waiting time' for the period (now() - candlestick.start) for every lately published candlestick.
  remainingNotificationsCount: Int;
}

contract SubscriptionBatch {
  storageReserve: Int;

  stream: Address;
  batchId: Int;
  subscriptions: map<Address, SubscriptionInfo>;
  subscriptionsCount: Int;

  init(stream: Address, batchId: Int) {
    self.storageReserve = SB_STORAGE_RESERVE;
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

  get fun subscribeDeposit(notificationsCount: Int): Int {
    return SB_SUBSCRIBE_DEPOSIT + NOTIFICATION_DEPOSIT * notificationsCount;
  }

  get fun publishCandlestickDeposit(): Int {
    return SB_PUBLISH_CANDLESTICK_DEPOSIT;
  }

  get fun unsubscribeDeposit(): Int {
    return SB_UNSUBSCRIBE_DEPOSIT;
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

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.stream);

    self.notify(SBDeploySuccess { queryId: request.queryId, batchId: self.batchId }.toCell());
  }

  receive(request: SBSubscribe) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.stream);
    nativeThrowUnless(ERR_SUBSCRIPTION_LIMIT_EXCEEDED, self.subscriptionsCount <= SUBSCRIPTION_LIMIT);

    let session: Address = request.session;
    let info: SubscriptionInfo? = self.subscriptions.get(session);

    if (info == null) {
      nativeThrowUnless(ERR_INVALID_ARGUMENT, request.notificationsCount >= 2);
    } else {
      nativeThrowUnless(ERR_INVALID_ARGUMENT, request.notificationsCount >= 1);
    }

    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= SB_SUBSCRIBE_DEPOSIT + NOTIFICATION_DEPOSIT * request.notificationsCount);

    self.storageReserve += NOTIFICATION_DEPOSIT * request.notificationsCount;

    let remainingNotificationsCount: Int = request.notificationsCount;

    if (info != null) {
      remainingNotificationsCount += info!!.remainingNotificationsCount;
    }
    
    self.subscriptions.set(session, SubscriptionInfo { remainingNotificationsCount }); 

    if (info == null) {
      self.subscriptionsCount += 1;
    }

    self.notify((SBSubscribeSuccess { queryId: request.queryId, session, remainingNotificationsCount }).toCell());
  }

  //   // let remainingNotificationsCount: Int = request.notificationsCount;

  //   if (info == null) {

  //     nativeThrowUnless(ERR_INVALID_ARGUMENT, request.notificationsCount >= 2);
  //     nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= SB_SUBSCRIBE_DEPOSIT + NOTIFICATION_DEPOSIT * request.notificationsCount);

  //     self.storageReserve += (request.notificationsCount) * NOTIFICATION_DEPOSIT;
  //     self.subscriptions.set(session, SubscriptionInfo { remainingNotificationsCount: request.notificationsCount });      
      
  //     self.subscriptionsCount += 1;

  //     self.notify((SBSubscribeSuccess { queryId: request.queryId, session, remainingNotificationsCount: request.notificationsCount }).toCell());
    
  //   } else {

  //     nativeThrowUnless(ERR_INVALID_ARGUMENT, request.notificationsCount >= 1);
  //     nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= SB_SUBSCRIBE_DEPOSIT + NOTIFICATION_DEPOSIT * request.notificationsCount);

  //     self.storageReserve += (request.notificationsCount) * NOTIFICATION_DEPOSIT;
  //     self.subscriptions.set(session, SubscriptionInfo { remainingNotificationsCount: (info!!.remainingNotificationsCount + request.notificationsCount) });

  //     self.notify((SBSubscribeSuccess { queryId: request.queryId, session, remainingNotificationsCount: (info!!.remainingNotificationsCount + request.notificationsCount) }).toCell());    
    
  //   }
  // }

  receive(request: SBPublishCandlestick) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.stream);
    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= SB_PUBLISH_CANDLESTICK_DEPOSIT);

    let subscriptions: map<Address, SubscriptionInfo> = self.subscriptions;

    foreach (session, info in subscriptions) {
      self.storageReserve -= NOTIFICATION_DEPOSIT;

      send(SendParameters { 
        to: session, 
        value: NOTIFICATION_DEPOSIT, 
        mode: SendIgnoreErrors, 
        body: (SBCandlestickPublishedNotification { queryId: request.queryId, candlestick: request.candlestick, remainingNotificationsCount: (info.remainingNotificationsCount - 1) }).toCell(),
      });

      if (info.remainingNotificationsCount == 2) {
        self.storageReserve -= NOTIFICATION_DEPOSIT;

        send(SendParameters { 
          to: self.stream, 
          value: NOTIFICATION_DEPOSIT, 
          mode: SendIgnoreErrors, 
          body: (SBUnsubscribedNotification { queryId: request.queryId, session, remainingNotificationsCount: 0 }).toCell(),
        });
      } 
      
      if (info.remainingNotificationsCount == 2) {
        self.subscriptions.set(session, null);
      } else {
        self.subscriptions.set(session, SubscriptionInfo { remainingNotificationsCount: (info.remainingNotificationsCount - 1) });
      }
    }

    self.forward(request.publisher, (SBPublishCandlestickSuccess { queryId: request.queryId }).toCell(), false, null);
  }

  receive(request: SBUnsubscribe) {
    let ctx: Context = context();

    let session: Address = ctx.sender;
    let info: SubscriptionInfo? = self.subscriptions.get(session);

    nativeThrowUnless(ERR_ACCESS_DENIED, info != null);
    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= SB_UNSUBSCRIBE_DEPOSIT);

    self.subscriptions.set(session, null);
    self.subscriptionsCount -= info!!.remainingNotificationsCount;

    let remainingDeposit: Int = NOTIFICATION_DEPOSIT * info!!.remainingNotificationsCount;

    self.storageReserve -= remainingDeposit;

    send(SendParameters { 
      to: self.stream, 
      value: remainingDeposit, 
      mode: SendRemainingValue, 
      body: (SBUnsubscribedNotification { queryId: request.queryId, session, remainingNotificationsCount: info!!.remainingNotificationsCount }).toCell(),
    });
  }
}

// END Subscription Batch