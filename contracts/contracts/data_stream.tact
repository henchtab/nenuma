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

  get fun storageReserve(): Int {
    return self.storageReserve;
  }

  get fun publisher(): Address {
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

  get fun decimals(): Int {
    return DECIMALS;
  }

  get fun batch(batchId: Int): Address {
    let batchStateInit: StateInit = initOf SubscriptionBatch(myAddress(), batchId);
    let batch: Address = contractAddress(batchStateInit);

    return batch;
  }

  get fun session(subscriber: Address): Address {
    let sessionStateInit: StateInit = initOf Session(myAddress(), subscriber);
    let session: Address = contractAddress(sessionStateInit);

    return session;
  }

  receive(request: DSTDeploy) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.publisher);

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

  // TODO: bounced(deploy: SBDeploy);

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

    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= DST_DEPLOY_BATCH_DEPOSIT);

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

    if (request.batch == null) {
      nativeThrowUnless(ERR_INVALID_ARGUMENT, request.notificationsCount >= 2);
    } else {
      nativeThrowUnless(ERR_INVALID_ARGUMENT, request.notificationsCount >= 1);
    }

    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= DST_DEPLOY_BATCH_DEPOSIT + (NOTIFICATION_PREMIUM + NOTIFICATION_DEPOSIT) * request.notificationsCount);
    
    self.storageReserve += NOTIFICATION_PREMIUM + request.notificationsCount;

    let batch: Address? = null;

    if (request.batch == null) {
      let batches: map<Address, SBInfo> = self.batches;

      foreach (address, info in batches) {
        if (info.subscriptionsCount < SUBSCRIPTION_LIMIT) {
          batch = address;
        }
      }

      nativeThrowUnless(ERR_SUBSCRIPTION_LIMIT_EXCEEDED, batch != null);
    } else {
      batch = request.batch;      
    }

    let info: SBInfo? = self.batches.get(batch!!);

    nativeThrowUnless(ERR_BATCH_NOT_FOUND, info != null);

    self.batches.set(batch!!, SBInfo { subscriptionsCount: (info!!.subscriptionsCount + 1) });

    self.forward(batch!!, (SBSubscribe { queryId: (request.queryId), session: session, notificationsCount: (request.notificationsCount) }).toCell(), true, null);
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

    foreach (address, info in batches) {
      send(SendParameters { 
        to: address, 
        value: SB_PUBLISH_CANDLESTICK_DEPOSIT,
        mode: SendPayGasSeparately,
        body: (SBPublishCandlestick { queryId: request.queryId, candlestick: request.candlestick, publisher: self.publisher }).toCell()
      });
    }

    self.notify((DSTPublishCandlestickSuccess { queryId: request.queryId }).toCell());
  }

  // TODO: bounced(request: SBPublishCandlestick);

  receive(notification: SBUnsubscribedNotification) {
    let ctx: Context = context();

    let batch: Address = ctx.sender;
    let info: SBInfo? = self.batches.get(batch);

    nativeThrowUnless(ERR_ACCESS_DENIED, info != null);

    self.batches.set(batch, SBInfo { subscriptionsCount: (info!!.subscriptionsCount - 1) });
    self.storageReserve -= NOTIFICATION_PREMIUM * notification.remainingNotificationsCount;

    self.forward(notification.session, (DSTUnsubscribedNotification { queryId: notification.queryId, remainingNotificationsCount: notification.remainingNotificationsCount }).toCell(), false, null);
  }
}

// END Data Stream
