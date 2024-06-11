// BEGIN Data Stream

import "./subscription_batch";
import "./session";

const DST_STORAGE_RESERVE: Int = ton("1.00");
const DST_BATCHES_COUNT_LIMIT: Int = 10;

const DST_DEPLOY_BATCH_DEPOSIT: Int = ton("5.00");
const DST_DEPLOY_SESSION_DEPOSIT: Int = ton("5.00");

const ERR_ACCESS_DENIED: Int = 400;
const ERR_INSUFFICIENT_DEPOSIT: Int = 401;
const ERR_BATCH_LIMIT_EXCEEDED: Int = 402;

message DSTDeploy {
  queryId: Int;
}

message DSTDeploySuccess {
  queryId: Int;
}

message DSTDeployBatch {
  queryId: Int;
}

message DSTDeployBatchSuccess {
  queryId: Int;
  batch: Address; 
}

message DSTDeploySession {
  queryId: Int;
}

message DSTDeploySessionSuccess {
  queryId: Int;
  session: Address; 
}

struct SBInfo {
  subscriptionsCount: Int;
}

struct SubscriptionInfo {
  // TODO: implement 'start: Int' to make the notifications pricing predictable; if the publisher publish a bunch of candlesticks at once (e.g., 1-minute candlesticks for 11:50, 11:51, ..., 12:00), then subscribers who subscribed at 12:00 for 5 minutes will get candlesticks 11:50 to 11:55. This can be either because of the TON blockchain network congestion due to increased demand in the short-run. It also enables users to delay the start of their subscription by paying a relatively smaller fee rather than the fee for receiving the SESCandlestickPublishedNotification. This is extremely useful when issuing derivatives which initiation time is in the future. Moreover, it encourages publisher to publish candlesticks as soon as possible to avoid paying fees to the larger number of subscribers. This is because subscribers pay the 'waiting time' fee for the time difference (subscription.start - now()). Therefore, publishers have to cover the cost of 'waiting time' for the period (now() - candlestick.start) for every lately published candlestick.
  remainingNotificationsCount: Int;
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

  receive(request: DSTDeploy) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.publisher);

    self.notify((DSTDeploySuccess { queryId: request.queryId }).toCell());
  }

  receive(request: DSTDeployBatch) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.publisher);
    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= DST_DEPLOY_BATCH_DEPOSIT);

    nativeThrowUnless(ERR_BATCH_LIMIT_EXCEEDED, self.nextBatchId < DST_BATCHES_COUNT_LIMIT);
    
    let batchStateInit: StateInit = initOf SubscriptionBatch(myAddress(), self.nextBatchId);
    let batch: Address = contractAddress(batchStateInit);

    self.forward(batch, (SBDeploy { queryId: request.queryId }).toCell(), true, batchStateInit);
  }

  // TODO: bounced(deploy: SBDeploy);

  receive(response: SBDeploySuccess) {
    let ctx: Context = context();

    let batchStateInit: StateInit = initOf SubscriptionBatch(myAddress(), self.nextBatchId);
    let batch: Address = contractAddress(batchStateInit);

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.publisher);

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
}

// END Data Stream
