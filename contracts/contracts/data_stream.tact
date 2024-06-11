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

  receive(request: SESDeploy) {
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
    nativeThrowUnless(ERR_INVALID_ARGUMENT, request.notificationsCount > 0);

    // TODO: The (+1) is used for for the unsubscribe notification. It is reimbursed if the DSTUnsubscribe is sent.
    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= DST_DEPLOY_BATCH_DEPOSIT + (request.notificationsCount) * NOTIFICATION_PREMIUM + (request.notificationsCount + 1) * NOTIFICATION_DEPOSIT);
    self.storageReserve += request.notificationsCount * NOTIFICATION_PREMIUM;

    let batches: map<Address, SBInfo> = self.batches;
    let batch: Address? = null;

    foreach (address, info in batches) {
      if (info.subscriptionsCount <= SUBSCRIPTION_LIMIT) {
        batch = address;
      }
    }

    nativeThrowUnless(ERR_SUBSCRIPTION_LIMIT_EXCEEDED, batch != null);

    self.forward(batch!!, (SBSubscribe { queryId: request.queryId, session: session, notificationsCount: request.notificationsCount }).toCell(), true, sessionStateInit);
  }

  // TODO: bounced(deploy: SBSubscribe);

  receive(response: SBSubscribeSuccess) {
    let ctx: Context = context();

    let batch: Address = ctx.sender;
    let info: SBInfo? = self.batches.get(batch);

    nativeThrowUnless(ERR_ACCESS_DENIED, info != null);

    self.batches.set(batch, SBInfo { subscriptionsCount: info!!.subscriptionsCount + 1 });

    self.forward(batch, (DSTSubscribeSuccess { queryId: response.queryId, batch: batch, remainingNotificationsCount: response.remainingNotificationsCount }).toCell(), false, null);
  }
}

// END Data Stream
