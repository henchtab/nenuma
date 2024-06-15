// BEGIN Data Stream

import "./constants";
import "./messages";

import "./subscription_batch";
import "./session";

struct SBInfo {
  subscriptionsCount: Int;
}

contract DataStream {
  storageReserve: Int;

  publisher: Address;
  topic: String;

  batches: map<Address, SBInfo>;
  // TODO: implement 'batchesCount' when BSDestroy is implemented. It allows creating new batches, keeping the total number of active batch <= DST_MAX_BATCHES_COUNT.
  nextBatchId: Int;

  init(publisher: Address, topic: String) {
    self.storageReserve = DST_STORAGE_RESERVE;
    self.publisher = publisher;
    self.topic = topic;
    self.nextBatchId = 0;
  }

  get fun balance(): Int {
    return myBalance();
  }

  get fun storageReserve(): Int {
    return DST_STORAGE_RESERVE;
  }

  get fun deployBatchDeposit(): Int {
    return DST_DEPLOY_BATCH_DEPOSIT;
  }

  get fun deploySessionDeposit(): Int {
    return DST_DEPLOY_SESSION_DEPOSIT;
  }

  get fun publishCandlestickDeposit(): Int {
    return DST_PUBLISH_CANDLESTICK_DEPOSIT;
  }

  get fun notificationDeposit(): Int {
    return NOTIFICATION_DEPOSIT;
  }

  get fun notificationPremium(): Int {
    return NOTIFICATION_PREMIUM;
  }


  // END DEPOSITS

  get fun publisherAddress(): Address {
    return self.publisher;
  }

  get fun topic(): String {
    return self.topic;
  }

  get fun batches(): map<Address, SBInfo> {
    return self.batches;
  }

  get fun nextBatchId(): Int {
    return self.nextBatchId;
  }

  get fun batchAddress(batchId: Int): Address {
    let batchStateInit: StateInit = initOf SubscriptionBatch(myAddress(), batchId);
    let batch: Address = contractAddress(batchStateInit);

    return batch;
  }

  get fun sessionAddress(subscriber: Address): Address {
    let sessionStateInit: StateInit = initOf Session(myAddress(), subscriber);
    let session: Address = contractAddress(sessionStateInit);

    return session;
  }

  receive(request: DSTDeploy) {
    let ctx: Context = context();

    self.notify((DSTDeploySuccess { queryId: request.queryId }).toCell());
  }

  receive(request: DSTDeployBatch) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.publisher);
    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= DST_DEPLOY_BATCH_DEPOSIT);

    nativeThrowUnless(ERR_BATCH_LIMIT_EXCEEDED, self.nextBatchId < BATCH_LIMIT);

    let batchStateInit: StateInit = initOf SubscriptionBatch(myAddress(), self.nextBatchId);
    let batch: Address = contractAddress(batchStateInit);

    self.forward(batch, (SBDeploy { queryId: request.queryId }).toCell(), true, batchStateInit);
  }

  bounced(deploy: SBDeploy) {
    self.forward(self.publisher, "SBDeployError".asComment(), false, null);
  }

  receive(response: SBDeploySuccess) {
    let ctx: Context = context();

    let batchStateInit: StateInit = initOf SubscriptionBatch(myAddress(), self.nextBatchId);
    let batch: Address = contractAddress(batchStateInit);

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == batch);

    self.batches.set(batch, SBInfo { subscriptionsCount: 0 });
    self.nextBatchId += 1;

    self.forward(self.publisher, (DSTDeployBatchSuccess { queryId: response.queryId, batch: batch }).toCell(), false, null);
  }

  receive(request: DSTDeploySession) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= DST_DEPLOY_SESSION_DEPOSIT);

    let sessionStateInit: StateInit = initOf Session(myAddress(), ctx.sender);
    let session: Address = contractAddress(sessionStateInit);

    self.forward(session, (SESDeploy { queryId: request.queryId }).toCell(), true, sessionStateInit);
  }

  // TODO: bounced(deploy: SESDeploy);

  receive(response: SESDeploySuccess) {
    let ctx: Context = context();

    let sessionStateInit: StateInit = initOf Session(myAddress(), response.subscriber);
    let session: Address = contractAddress(sessionStateInit);

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == session);

    self.forward(response.subscriber, (DSTDeploySessionSuccess { queryId: response.queryId, session: session }).toCell(), false, null);
  }

  receive(request: DSTSubscribe) {
    let ctx: Context = context();

    let sessionStateInit: StateInit = initOf Session(myAddress(), request.subscriber);
    let session: Address = contractAddress(sessionStateInit);

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == session);

    nativeThrowUnless(ERR_INVALID_ARGUMENT, request.notificationsCount >= 2);
    nativeReserve((NOTIFICATION_PREMIUM) * (request.notificationsCount - 1), ReserveExact | ReserveAddOriginalBalance);

    let batch: Address? = null;
    let batches: map<Address, SBInfo> = self.batches;

    foreach (address, info in batches) {
      if (info.subscriptionsCount < SUBSCRIPTION_LIMIT) {
        batch = address;
      }
    }

    nativeThrowUnless(ERR_SUBSCRIPTION_LIMIT_EXCEEDED, batch != null);
    let info: SBInfo? = self.batches.get(batch!!);

    self.batches.set(batch!!, SBInfo { subscriptionsCount: (info!!.subscriptionsCount + 1) });

    send(SendParameters {
      to: batch!!,
      value: 0,
      mode: SendRemainingBalance,
      body: (SBSubscribe { queryId: (request.queryId), session: session, notificationsCount: (request.notificationsCount) }).toCell(),
    });
  } 

  receive(request: DSTTopUpSubscription) {
    let ctx: Context = context();

    let sessionStateInit: StateInit = initOf Session(myAddress(), request.subscriber);
    let session: Address = contractAddress(sessionStateInit);

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == session);

    nativeThrowUnless(ERR_INVALID_ARGUMENT, request.notificationsCount >= 1);
    nativeReserve((NOTIFICATION_PREMIUM) * request.notificationsCount, ReserveExact | ReserveAddOriginalBalance);

    send(SendParameters {
      to: request.batch,
      value: 0,
      mode: SendRemainingBalance,
      body: (SBTopUpSubscription { queryId: (request.queryId), session: session, notificationsCount: request.notificationsCount }).toCell(),
    });
  }

    // // The session already has an appointed batch, then there is no need to allocate a new one, when subscribing for additional messages.
    // if (request.batch != null) {
    //   nativeThrowUnless(ERR_INVALID_ARGUMENT, request.notificationsCount >= 1);
    //   self.forward(request.batch!!, (SBSubscribe { queryId: request.queryId, session: session, notificationsCount: request.notificationsCount }).toCell(), true, null);
    //   nativeThrow(0); // TODO: crapcoding?
    // }

    // nativeThrowUnless(ERR_INVALID_ARGUMENT, request.notificationsCount >= 2);

    // let batches: map<Address, SBInfo> = self.batches;
    // let batch: Address? = null;

    // foreach (address, info in batches) {
    //   if (info.subscriptionsCount < SUBSCRIPTION_LIMIT) {
    //     batch = address;
    //   }
    // }

    // nativeThrowUnless(ERR_SUBSCRIPTION_LIMIT_EXCEEDED, batch != null);

    // let info: SBInfo? = self.batches.get(batch!!);
    // self.batches.set(batch!!, SBInfo { subscriptionsCount: info!!.subscriptionsCount + 1 });

    // self.forward(batch!!, (SBSubscribe { queryId: request.queryId, session: session, notificationsCount: request.notificationsCount }).toCell(), true, null);
  // }

  // bounced(deploy: bounced<SBSubscribe>) {
  //   self.batches.set(batch, SBInfo { subscriptionsCount: info!!.subscriptionsCount - 1 });
  //   // TODO: rollback
  // }

  receive(response: SBSubscribeSuccess) {
    let ctx: Context = context();

    let batch: Address = ctx.sender;
    let info: SBInfo? = self.batches.get(batch);

    nativeThrowUnless(ERR_ACCESS_DENIED, info != null);

    self.forward(response.session, (DSTSubscribeSuccess { queryId: response.queryId, batch, remainingNotificationsCount: response.remainingNotificationsCount }).toCell(), false, null);
  }

  receive(request: DSTPublishCandlestick) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.publisher);
    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= DST_PUBLISH_CANDLESTICK_DEPOSIT);

    let batches: map<Address, SBInfo> = self.batches;

    let subscriptionsCount: Int = 0;

    foreach (address, info in batches) {
      if (info.subscriptionsCount > 0) {
        send(SendParameters { 
          to: address, 
          value: SB_PUBLISH_CANDLESTICK_DEPOSIT,
          mode: SendPayGasSeparately,
          body: (SBPublishCandlestick { queryId: request.queryId, candlestick: request.candlestick, publisher: self.publisher }).toCell()
        });

        subscriptionsCount += info.subscriptionsCount;
      }
    }

    let premium: Int = NOTIFICATION_PREMIUM * subscriptionsCount;

    nativeReserve(myBalance() - ctx.value - premium, ReserveExact);

    send(SendParameters {
      to: self.publisher,
      value: premium,
      mode: SendRemainingBalance,
      body: (DSTPublishCandlestickSuccess { queryId: request.queryId }).toCell(),
    });
  }

  // TODO: bounced(request: SBPublishCandlestick);

  receive(notification: SBUnsubscribedNotification) {
    let ctx: Context = context();

    let batch: Address = ctx.sender;
    let info: SBInfo? = self.batches.get(batch);

    nativeThrowUnless(ERR_ACCESS_DENIED, info != null);

    self.batches.set(batch, SBInfo { subscriptionsCount: (info!!.subscriptionsCount - 1) });

    let reimbursement: Int = 0;

    if (notification.remainingNotificationsCount > 1) {
      reimbursement = NOTIFICATION_PREMIUM * (notification.remainingNotificationsCount - 1);
    }
 
    send(SendParameters { 
      to: notification.session, 
      value: reimbursement, 
      mode: SendRemainingValue, 
      body: (DSTUnsubscribedNotification { queryId: notification.queryId, remainingNotificationsCount: notification.remainingNotificationsCount }).toCell(),
    });
  }
}

// END Data Stream
