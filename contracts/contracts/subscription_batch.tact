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
    self.storageReserve = BS_STORAGE_RESERVE;
    self.stream = stream;
    self.batchId = batchId;
    self.subscriptionsCount = 0;
  }

  get fun storageReserve(): Int {
    return self.storageReserve;
  }

  get fun stream(): Address {
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
    nativeThrowUnless(ERR_INVALID_ARGUMENT, request.notificationsCount > 0);
    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= SB_SUBSCRIBE_DEPOSIT + (request.notificationsCount + 1) * NOTIFICATION_DEPOSIT);

    self.storageReserve += (request.notificationsCount + 1) * NOTIFICATION_DEPOSIT;

    let session: Address = request.session;
    let info: SubscriptionInfo? = self.subscriptions.get(session);

    let remainingNotificationsCount: Int = request.notificationsCount;
    
    if (info != null) {
      remainingNotificationsCount += info!!.remainingNotificationsCount;      
    } else {
      self.subscriptionsCount += 1; 
    }

    self.subscriptions.set(session, SubscriptionInfo { remainingNotificationsCount });
    
    self.notify((SBSubscribeSuccess { queryId: request.queryId, session, remainingNotificationsCount }).toCell());
  }
}

// END Subscription Batch