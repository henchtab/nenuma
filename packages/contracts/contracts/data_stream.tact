import "./constants";
import "./messages";
import "./subscription_batch";
import "./session";

// Struct to store information about subscription batches
struct SBInfo {
  subscriptionsCount: Int; // Number of subscriptions in the batch
}

// Contract representing a data stream
contract DataStream {
  override const storageReserve: Int = 50_000_000; // Reserve amount for storage
  publisher: Address; // Address of the publisher
  topic: String; // Topic of the data stream

  batches: map<Address, SBInfo>; // Mapping of batch addresses to their information
  // It allows creating new batches, keeping the total number of active batches <= DST_MAX_BATCHES_COUNT.
  nextBatchId: Int; // ID for the next batch to be created

  // Initialize the contract with the publisher and topic
  init(publisher: Address, topic: String) {
    self.publisher = publisher;
    self.topic = topic;
    self.nextBatchId = 0;
  }

  // Getter function for the contract balance
  get fun balance(): Int {
    return myBalance();
  }

  // Getter function for the storage reserve amount
  get fun storageReserve(): Int {
    return DST_STORAGE_RESERVE;
  }

  // Getter function for the deposit amount to deploy a batch
  get fun deployBatchDeposit(): Int {
    return DST_DEPLOY_BATCH_DEPOSIT;
  }

  // Getter function for the deposit amount to deploy a session
  get fun deploySessionDeposit(): Int {
    return DST_DEPLOY_SESSION_DEPOSIT;
  }

  // Getter function for the deposit amount to publish a candlestick
  get fun publishCandlestickDeposit(): Int {
    return DST_PUBLISH_CANDLESTICK_DEPOSIT;
  }

  // Getter function for the notification deposit amount
  get fun notificationDeposit(): Int {
    return NOTIFICATION_DEPOSIT;
  }

  // Getter function for the notification premium amount
  get fun notificationPremium(): Int {
    return NOTIFICATION_PREMIUM;
  }

  // Getter function for the publisher address
  get fun publisherAddress(): Address {
    return self.publisher;
  }

  // Getter function for the topic
  get fun topic(): String {
    return self.topic;
  }

  // Getter function for the batches mapping
  get fun batches(): map<Address, SBInfo> {
    return self.batches;
  }

  // Getter function for the next batch ID
  get fun nextBatchId(): Int {
    return self.nextBatchId;
  }

  // Function to get the address of a batch by its ID
  get fun batchAddress(batchId: Int): Address {
    let batchStateInit: StateInit = initOf SubscriptionBatch(myAddress(), batchId);
    let batch: Address = contractAddress(batchStateInit);

    return batch;
  }

  // Function to get the address of a session by the subscriber's address
  get fun sessionAddress(subscriber: Address): Address {
    let sessionStateInit: StateInit = initOf Session(myAddress(), subscriber);
    let session: Address = contractAddress(sessionStateInit);

    return session;
  }

  // Function to handle the deployment of the data stream
  receive(request: DSTDeploy) {
    dump("DSTDeploy");

    let ctx: Context = context();

    // Notify the publisher of the successful deployment
    self.notify((DSTDeploySuccess { queryId: request.queryId }).toCell());
  }

  // Function to handle the deployment of a subscription batch
  receive(request: DSTDeployBatch) {
    dump("DSTDeployBatch");

    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.publisher);
    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= DST_DEPLOY_BATCH_DEPOSIT);
    nativeThrowUnless(ERR_BATCH_LIMIT_EXCEEDED, self.nextBatchId < BATCH_LIMIT);

    let batchStateInit: StateInit = initOf SubscriptionBatch(myAddress(), self.nextBatchId);
    let batch: Address = contractAddress(batchStateInit);

    // Forward the batch deployment request
    self.forward(batch, (SBDeploy { queryId: request.queryId }).toCell(), true, batchStateInit);
  }

  // Function to handle a bounced batch deployment
  bounced(deploy: SBDeploy) {
    dump("SBDeploy");

    // Notify the publisher of the deployment error
    self.forward(self.publisher, "SBDeployError".asComment(), false, null);
  }

  // Function to handle the success response for a batch deployment
  receive(response: SBDeploySuccess) {
    dump("SBDeploySuccess");

    let ctx: Context = context();

    let batchStateInit: StateInit = initOf SubscriptionBatch(myAddress(), self.nextBatchId);
    let batch: Address = contractAddress(batchStateInit);

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == batch);

    // Add the batch to the mapping and increment the batch ID
    self.batches.set(batch, SBInfo { subscriptionsCount: 0 });
    self.nextBatchId += 1;

    // Notify the publisher of the successful batch deployment
    self.forward(self.publisher, (DSTDeployBatchSuccess { queryId: response.queryId, batch: batch }).toCell(), false, null);
  }

  // Function to handle the deployment of a session
  receive(request: DSTDeploySession) {
    dump("DSTDeploySession");

    let ctx: Context = context();

    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= DST_DEPLOY_SESSION_DEPOSIT);

    let sessionStateInit: StateInit = initOf Session(myAddress(), ctx.sender);
    let session: Address = contractAddress(sessionStateInit);

    // Forward the session deployment request
    self.forward(session, (SESDeploy { queryId: request.queryId }).toCell(), true, sessionStateInit);
  }

  // TODO: bounced(deploy: SESDeploy);

  // Function to handle the success response for a session deployment
  receive(response: SESDeploySuccess) {
    dump("SESDeploySuccess");

    let ctx: Context = context();

    let sessionStateInit: StateInit = initOf Session(myAddress(), response.subscriber);
    let session: Address = contractAddress(sessionStateInit);

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == session);

    // Notify the subscriber of the successful session deployment
    self.forward(response.subscriber, (DSTDeploySessionSuccess { queryId: response.queryId, session: session }).toCell(), false, null);
  }

  // Function to handle subscription requests
  receive(request: DSTSubscribe) {
    dump("DSTSubscribe");

    let ctx: Context = context();

    let sessionStateInit: StateInit = initOf Session(myAddress(), request.subscriber);
    let session: Address = contractAddress(sessionStateInit);

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == session);
    nativeThrowUnless(ERR_INVALID_ARGUMENT, request.notificationsCount >= 2);
    nativeReserve((NOTIFICATION_PREMIUM) * (request.notificationsCount - 1), ReserveExact | ReserveAddOriginalBalance);

    let batch: Address? = null;
    let batches: map<Address, SBInfo> = self.batches;

    // Find a batch with available subscription slots
    foreach (address, info in batches) {
      if (info.subscriptionsCount < SUBSCRIPTION_LIMIT) {
        batch = address;
      }
    }

    nativeThrowUnless(ERR_SUBSCRIPTION_LIMIT_EXCEEDED, batch != null);
    let info: SBInfo? = self.batches.get(batch!!);

    // Update the subscription count for the batch
    self.batches.set(batch!!, SBInfo { subscriptionsCount: (info!!.subscriptionsCount + 1) });

    // Send the subscription request to the batch
    send(SendParameters {
      to: batch!!,
      value: 0,
      mode: SendRemainingBalance,
      body: (SBSubscribe { queryId: (request.queryId), session: session, notificationsCount: (request.notificationsCount) }).toCell(),
    });
  }

  // Function to handle top-up subscription requests
  receive(request: DSTTopUpSubscription) {
    dump("DSTTopUpSubscription");

    let ctx: Context = context();

    let sessionStateInit: StateInit = initOf Session(myAddress(), request.subscriber);
    let session: Address = contractAddress(sessionStateInit);

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == session);
    nativeThrowUnless(ERR_INVALID_ARGUMENT, request.notificationsCount >= 1);
    nativeReserve((NOTIFICATION_PREMIUM) * request.notificationsCount, ReserveExact | ReserveAddOriginalBalance);

    // Send the top-up subscription request to the batch
    send(SendParameters {
      to: request.batch,
      value: 0,
      mode: SendRemainingBalance,
      body: (SBTopUpSubscription { queryId: (request.queryId), session: session, notificationsCount: request.notificationsCount }).toCell(),
    });
  }

  // Function to handle the success response for a subscription
  receive(response: SBSubscribeSuccess) {
    dump("SBSubscribeSuccess");

    let ctx: Context = context();

    let batch: Address = ctx.sender;
    let info: SBInfo? = self.batches.get(batch);

    nativeThrowUnless(ERR_ACCESS_DENIED, info != null);

    // Notify the session of the successful subscription
    self.forward(response.session, (DSTSubscribeSuccess { queryId: response.queryId, batch, remainingNotificationsCount: response.remainingNotificationsCount }).toCell(), false, null);
  }

  // Function to handle the publishing of candlestick data
  receive(request: DSTPublishCandlestick) {
    dump("DSTPublishCandlestick");

    let ctx: Context = context();

    // Check if the sender is the publisher
    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.publisher);
    // Ensure the sender has provided the required deposit
    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= DST_PUBLISH_CANDLESTICK_DEPOSIT);

    let batches: map<Address, SBInfo> = self.batches;

    let subscriptionsCount: Int = 0;

    // Loop through all batches to send candlestick data to those with subscriptions
    foreach (address, info in batches) {
      if (info.subscriptionsCount > 0) {
        dump("info.subscriptionsCount");
        dump(info.subscriptionsCount);

        // Send candlestick data to the batch
        send(SendParameters { 
          to: address, 
          value: SB_PUBLISH_CANDLESTICK_DEPOSIT,
          mode: SendPayGasSeparately,
          body: (SBPublishCandlestick { queryId: request.queryId, candlestick: request.candlestick, publisher: self.publisher }).toCell()
        });

        subscriptionsCount += info.subscriptionsCount;
      }
    }

    // Calculate the total premium based on the number of subscriptions
    let premium: Int = NOTIFICATION_PREMIUM * subscriptionsCount;

    // Reserve the balance for the premium and the deposit
    nativeReserve(myBalance() - ctx.value - premium, ReserveExact);

    // Send the premium back to the publisher
    send(SendParameters {
      to: self.publisher,
      value: premium,
      mode: SendRemainingBalance,
      body: (DSTPublishCandlestickSuccess { queryId: request.queryId }).toCell(),
    });
  }

  // TODO: bounced(request: SBPublishCandlestick);

  // Function to handle notifications when a subscription is unsubscribed
  receive(notification: SBUnsubscribedNotification) {
    dump("SBUnsubscribedNotification");

    let ctx: Context = context();

    let batch: Address = ctx.sender;
    let info: SBInfo? = self.batches.get(batch);

    // Check if the sender is a valid batch
    nativeThrowUnless(ERR_ACCESS_DENIED, info != null);

    // Decrease the subscription count for the batch
    self.batches.set(batch, SBInfo { subscriptionsCount: (info!!.subscriptionsCount - 1) });

    let reimbursement: Int = 0;

    // Calculate the reimbursement for remaining notifications
    if (notification.remainingNotificationsCount > 1) {
      reimbursement = NOTIFICATION_PREMIUM * (notification.remainingNotificationsCount - 1);
    }
 
    // Send the reimbursement to the session
    send(SendParameters { 
      to: notification.session, 
      value: reimbursement, 
      mode: SendRemainingValue, 
      body: (DSTUnsubscribedNotification { queryId: notification.queryId, remainingNotificationsCount: notification.remainingNotificationsCount }).toCell(),
    });
  }
}