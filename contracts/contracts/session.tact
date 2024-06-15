import "./constants";
import "./messages";

// Contract representing a session in the subscription system
contract Session {
  storageReserve: Int; // Reserve amount for storage
  stream: Address; // Address of the stream
  subscriber: Address; // Address of the subscriber
  batch: Address?; // Address of the subscription batch

  // Initialize the contract with the stream and subscriber addresses
  init(stream: Address, subscriber: Address) {
    self.storageReserve = SES_STORAGE_RESERVE;
    self.stream = stream;
    self.subscriber = subscriber;
  }

  // Getter function for the contract balance
  get fun balance(): Int {
    return myBalance();
  }

  // Getter function for the storage reserve amount
  get fun storageReserve(): Int {
    return SES_STORAGE_RESERVE;
  }

  // Getter function for the subscribe deposit amount
  get fun subscribeDeposit(): Int {
    return SES_SUBSCRIBE_DEPOSIT;
  }

  // Getter function for the unsubscribe deposit amount
  get fun unsubscribeDeposit(): Int {
    return SES_UNSUBSCRIBE_DEPOSIT;
  }

  // Getter function for the destroy deposit amount
  get fun destroyDeposit(): Int {
    return SES_DESTROY_DEPOSIT;
  }

  // Getter function for the stream address
  get fun streamAddress(): Address {
    return self.stream;
  }

  // Getter function for the subscriber address
  get fun subscriberAddress(): Address {
    return self.subscriber;
  }

  // Getter function for the batch address
  get fun batchAddress(): Address? {
    return self.batch;
  }

  // Function to handle the deployment of the session
  receive(request: SESDeploy) {
    let ctx: Context = context();

    // Notify the subscriber of the successful deployment
    self.notify((SESDeploySuccess { queryId: request.queryId, subscriber: self.subscriber }).toCell());
  }

  // Function to handle subscription requests
  receive(request: SESSubscribe) {
    let ctx: Context = context();

    // Ensure the request is from the subscriber
    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.subscriber);

    // If there is no batch, handle the initial subscription
    if (self.batch == null) {
      nativeThrowUnless(ERR_INVALID_ARGUMENT, request.notificationsCount >= 2);
      nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= SES_SUBSCRIBE_DEPOSIT + (NOTIFICATION_DEPOSIT) * request.notificationsCount + (NOTIFICATION_PREMIUM) * (request.notificationsCount - 1));
      
      // Forward the subscription request to the stream
      self.forward(self.stream, (DSTSubscribe { queryId: request.queryId, subscriber: self.subscriber, notificationsCount: request.notificationsCount }).toCell(), true, null);
    } 
    // If there is a batch, handle the top-up subscription
    else {
      nativeThrowUnless(ERR_INVALID_ARGUMENT, request.notificationsCount >= 1);
      nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= SES_SUBSCRIBE_DEPOSIT + (NOTIFICATION_DEPOSIT) * request.notificationsCount + (NOTIFICATION_PREMIUM) * request.notificationsCount);
      
      // Forward the top-up subscription request to the stream
      self.forward(self.stream, (DSTTopUpSubscription { queryId: request.queryId, subscriber: self.subscriber, batch: self.batch!!, notificationsCount: request.notificationsCount }).toCell(), true, null);
    }
  }

  // TODO: bounced(request: SESSubscribe);

  // Function to handle the success response for a subscription
  receive(response: DSTSubscribeSuccess) {
    let ctx: Context = context();

    // Ensure the response is from the stream
    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.stream);

    // Set the batch address
    self.batch = response.batch;

    // Forward the success response to the subscriber
    self.forward(self.subscriber, (SESSubscribeSuccess { queryId: response.queryId, remainingNotificationsCount: response.remainingNotificationsCount }).toCell(), false, null);
  }

  // Function to handle candlestick published notifications
  receive(notification: SBCandlestickPublishedNotification) {
    let ctx: Context = context();

    // Ensure the notification is from the batch
    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.batch);

    // Forward the notification to the subscriber
    self.forward(self.subscriber, (SESCandlestickPublishedNotification { queryId: notification.queryId, candlestick: notification.candlestick, remainingNotificationsCount: notification.remainingNotificationsCount }).toCell(), false, null);
  }

  // Function to handle the notification of an unsubscribe event
  receive(notification: DSTUnsubscribedNotification) {
    let ctx: Context = context();

    // Ensure the notification is from the stream
    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.stream);

    // Clear the batch address
    self.batch = null;

    // Forward the notification to the subscriber
    self.forward(self.subscriber, (SESUnsubscribedNotification { queryId: notification.queryId, remainingNotificationsCount: notification.remainingNotificationsCount }).toCell(), false, null);
  }

  // Function to handle unsubscribe requests
  receive(request: SESUnsubscribe) {
    let ctx: Context = context();

    // Ensure the request is from the subscriber and the session is active
    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.subscriber);
    nativeThrowUnless(ERR_STREAM_NOT_SUBSCRIBED, self.batch != null);
    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= SES_UNSUBSCRIBE_DEPOSIT);

    // Forward the unsubscribe request to the batch
    self.forward(self.batch!!, (SBUnsubscribe { queryId: request.queryId }).toCell(), true, null);
  }

  // TODO: bounced(request: SESUnsubscribe);

  // Function to handle session destruction requests
  receive(request: SESDestroy) {
    let ctx: Context = context();

    // Ensure the request is from the subscriber and the session is not active
    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.subscriber);
    nativeThrowUnless(ERR_STREAM_SUBSCRIBED, self.batch == null);

    // Destroy the contract and notify the subscriber
    send(SendParameters { 
      to: self.subscriber, 
      value: 0,
      mode: SendRemainingBalance + SendDestroyIfZero, 
      body: (SESDestroySuccess { queryId: request.queryId }).toCell(),
    });
  }
}