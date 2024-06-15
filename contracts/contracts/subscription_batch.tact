import "./constants";
import "./messages";

// Struct representing the subscription information
struct SubscriptionInfo {
  // TODO: In the future updates, implement 'start: Int' to make the notifications pricing predictable.
  // This field is intended to handle the timing of candlestick publications and the associated costs.
  remainingNotificationsCount: Int;  // Number of remaining notifications for this subscription
}

// Contract representing a batch of subscriptions
contract SubscriptionBatch {
  stream: Address;  // Address of the stream to which this batch is associated
  batchId: Int;  // Identifier for this batch
  subscriptions: map<Address, SubscriptionInfo>;  // Mapping of session addresses to their subscription info
  subscriptionsCount: Int;  // Count of active subscriptions in this batch

  // Initialize the contract with the stream address and batch ID
  init(stream: Address, batchId: Int) {
    self.stream = stream;
    self.batchId = batchId;
    self.subscriptionsCount = 0;  // Initialize the subscription count to 0
  }

  // Getter function for the contract balance
  get fun balance(): Int {
    return myBalance();
  }

  // Getter function for the storage reserve
  get fun storageReserve(): Int {
    return SB_STORAGE_RESERVE;
  }

  // Getter function for the stream address
  get fun streamAddress(): Address {
    return self.stream;
  }

  // Getter function for the batch ID
  get fun batchId(): Int {
    return self.batchId;
  }

  // Getter function for the subscriptions mapping
  get fun subscriptions(): map<Address, SubscriptionInfo> {
    return self.subscriptions;
  }

  // Getter function for the subscription count
  get fun subscriptionsCount(): Int {
    return self.subscriptionsCount;
  }

  // Function to handle the deployment of the subscription batch
  receive(request: SBDeploy) {
    let ctx: Context = context();

    // Reserve storage to ensure the contract remains active
    nativeReserve(SB_STORAGE_RESERVE, ReserveExact | ReserveAddOriginalBalance);

    // Send a success response back to the sender of the deployment request
    send(SendParameters {
      to: ctx.sender,
      value: 0,
      mode: SendRemainingBalance,
      body: SBDeploySuccess { queryId: request.queryId, batchId: self.batchId }.toCell(),
    });
  }

  // Function to handle new subscription requests
  receive(request: SBSubscribe) {
    let ctx: Context = context();

    // Ensure only the stream address can send subscription requests
    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.stream);

    // Ensure the subscription limit has not been exceeded
    nativeThrowUnless(ERR_SUBSCRIPTION_LIMIT_EXCEEDED, self.subscriptionsCount < SUBSCRIPTION_LIMIT);
    self.subscriptionsCount += 1;  // Increment the subscription count

    // Ensure the requested notifications count is valid
    nativeThrowUnless(ERR_INVALID_ARGUMENT, request.notificationsCount >= 2);
    
    // Reserve the required amount for notifications
    nativeReserve(NOTIFICATION_DEPOSIT * request.notificationsCount, ReserveExact | ReserveAddOriginalBalance);

    let session: Address = request.session;
    let info: SubscriptionInfo? = self.subscriptions.get(session);

    // Ensure the session does not already exist
    nativeThrowUnless(ERR_SESSION_ALREADY_EXISTS, info == null);

    let remainingNotificationsCount: Int = request.notificationsCount;
    
    // Add the new subscription
    self.subscriptions.set(session, SubscriptionInfo { remainingNotificationsCount });

    // Send a success response back to the sender of the subscription request
    send(SendParameters {
      to: ctx.sender,
      value: 0,
      mode: SendRemainingBalance,
      body: (SBSubscribeSuccess { queryId: request.queryId, session, remainingNotificationsCount }).toCell(),
    });
  }

  // Function to handle topping up an existing subscription
  receive(request: SBTopUpSubscription) {
    let ctx: Context = context();

    // Ensure only the stream address can send top-up requests
    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.stream);

    // Ensure the requested notifications count is valid
    nativeThrowUnless(ERR_INVALID_ARGUMENT, request.notificationsCount >= 1);
    
    // Reserve the required amount for notifications
    nativeReserve(NOTIFICATION_DEPOSIT * request.notificationsCount, ReserveExact | ReserveAddOriginalBalance);

    let session: Address = request.session;
    let info: SubscriptionInfo? = self.subscriptions.get(session);

    // Ensure the session exists
    nativeThrowUnless(ERR_SESSION_NOT_FOUND, info != null);

    // Update the remaining notifications count
    let remainingNotificationsCount: Int = info!!.remainingNotificationsCount + request.notificationsCount;
    self.subscriptions.set(session, SubscriptionInfo { remainingNotificationsCount });

    // Send a success response back to the sender of the top-up request
    send(SendParameters {
      to: ctx.sender,
      value: 0,
      mode: SendRemainingBalance,
      body: (SBSubscribeSuccess { queryId: request.queryId, session, remainingNotificationsCount }).toCell(),
    });
  }

  // Function to handle the publication of a new candlestick
  receive(request: SBPublishCandlestick) {
    let ctx: Context = context();

    // Ensure only the stream address can send publication requests
    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.stream);

    let subscriptions: map<Address, SubscriptionInfo> = self.subscriptions;
    let notificationsCount: Int = 0;

    // Iterate through all subscriptions and send notifications
    foreach (session, info in subscriptions) {
      notificationsCount += 1;

      // Send the candlestick notification to the session
      send(SendParameters { 
        to: session, 
        value: NOTIFICATION_DEPOSIT, 
        mode: SendIgnoreErrors, 
        body: (SBCandlestickPublishedNotification { queryId: request.queryId, candlestick: request.candlestick, remainingNotificationsCount: (info.remainingNotificationsCount - 1) }).toCell(),
      });

      // Update the remaining notifications count
      self.subscriptions.set(session, SubscriptionInfo { remainingNotificationsCount: (info.remainingNotificationsCount - 1) });

      // If only two notifications are left, prepare to unsubscribe the session
      if (info.remainingNotificationsCount == 2) {
        notificationsCount += 1;

        // Send an unsubscribe notification to the stream
        send(SendParameters { 
          to: self.stream, 
          value: NOTIFICATION_DEPOSIT, 
          mode: SendIgnoreErrors, 
          body: (SBUnsubscribedNotification { queryId: request.queryId, session, remainingNotificationsCount: 0 }).toCell(),
        });

        // Remove the subscription
        self.subscriptions.set(session, null);
        self.subscriptionsCount -= 1;
      }
    }

    // Reserve the required amount for notifications
    nativeReserve(NOTIFICATION_DEPOSIT * notificationsCount, ReserveExact | ReserveInvertSign | ReserveAddOriginalBalance);

    // Send a success response back to the sender of the publication request
    send(SendParameters {
      to: request.publisher,
      value: 0,
      mode: SendRemainingBalance,
      body: (SBPublishCandlestickSuccess { queryId: request.queryId }).toCell(),
    });
  }

  // Function to handle unsubscription requests
  receive(request: SBUnsubscribe) {
    let ctx: Context = context();

    let session: Address = ctx.sender;
    let info: SubscriptionInfo? = self.subscriptions.get(session);

    // Ensure the session exists
    nativeThrowUnless(ERR_ACCESS_DENIED, info != null);

    // Update the subscription count and remove the subscription
    self.subscriptionsCount -= 1;
    self.subscriptions.set(session, null);

    // Reserve the required amount for the remaining notifications
    nativeReserve(NOTIFICATION_DEPOSIT * info!!.remainingNotificationsCount, ReserveExact | ReserveInvertSign | ReserveAddOriginalBalance);

    // Send an unsubscribe notification to the stream
    send(SendParameters { 
      to: self.stream, 
      value: NOTIFICATION_DEPOSIT * info!!.remainingNotificationsCount, 
      mode: SendRemainingBalance, 
      body: (SBUnsubscribedNotification { queryId: request.queryId, session, remainingNotificationsCount: info!!.remainingNotificationsCount }).toCell(),
    });
  }
}
