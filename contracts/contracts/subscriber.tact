const SUBSCRIBER_TIMEOUT: Int = 3600; // 1 hour

// Message representing a notification of subscriber destruction
message SUBDestroyedNotification {
  queryId: Int as uint64;  // Query ID for the notification
}

// Message representing a timeout check request
message SUBCheckTimeout {
  queryId: Int as uint64;  // Query ID for the request
}

// Message representing a timeout exceeded notification
message SUBTimeoutExceeded {
  queryId: Int as uint64;
}

@name(accept_message)
native nativeAcceptMessage();

trait Subscriber {
  deployer: Address;
  stream: Address?;
  notificationsCount: Int?;
  timeout: Int?;
  session: Address?;

  // Getter function for the contract balance
  get fun balance(): Int {
    return myBalance();
  }

  // Getter function for the owner's address
  get fun deployerAddress(): Address {
    return self.deployer;
  }

  // Getter function for the stream address
  get fun streamAddress(): Address? {
    return self.stream;
  }

  // Getter function for the number of notifications
  get fun notificationsCount(): Int? {
    return self.notificationsCount;
  }

  // Getter function for the expiry time
  get fun timeout(): Int? {
    return self.timeout;
  }

  // Getter function for the session address
  get fun sessionAddress(): Address? {
    return self.session;
  }

  fun deploySession(queryId: Int) {
    dump("self.deploySession()");

    // Send a request to deploy a session
    send(SendParameters {
      to: self.stream!!,
      value: DST_DEPLOY_SESSION_DEPOSIT,
      mode: SendPayGasSeparately | SendBounceIfActionFail,
      body: (DSTDeploySession { queryId }).toCell(),
    });
  }

  // Function to handle the deployment of the subscriber
  virtual fun subscribeStream(queryId: Int, stream: Address, notificationsCount: Int, timeout: Int) {
    dump("subscribeStream()");

    let ctx: Context = context();

    // Ensure the notifications count is valid
    nativeThrowUnless(ERR_INVALID_ARGUMENT, notificationsCount >= 2);
    // Ensure sufficient deposit for storage and operational reserves
    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= SUS_STORAGE_RESERVE + SUS_OPERATIONAL_RESERVE + (NOTIFICATION_DEPOSIT + NOTIFICATION_PREMIUM) * notificationsCount);

    // Set the stream, notifications count, and expiry time
    self.stream = stream;
    self.notificationsCount = notificationsCount;
    self.timeout = timeout;

    self.deploySession(queryId);

    // Reserve storage and operational balance
    nativeReserve(SUS_STORAGE_RESERVE + (SUS_OPERATIONAL_RESERVE - DST_DEPLOY_SESSION_DEPOSIT) + (NOTIFICATION_DEPOSIT + NOTIFICATION_PREMIUM) * notificationsCount, ReserveExact | ReserveAddOriginalBalance);
  }

  // Function to destroy the contract and notify the deployer
  fun destroy(queryId: Int) {
    dump("self.destroy()");

    self.handleDestroy(queryId);

    send(SendParameters {
      to: self.deployer,
      value: 0,
      mode: SendRemainingBalance | SendDestroyIfZero,
      body: (SUBDestroyedNotification { queryId }).toCell()
    });
  }

  bounced(request: DSTDeploySession) {
    dump("bounced<DSTDeploySession>");

    self.destroy(request.queryId);
  }

  // Function to handle the success response for session deployment
  receive(response: DSTDeploySessionSuccess) {
    dump("DSTDeploySessionSuccess");

    let ctx: Context = context();

    // TODO: Destroy the session...
    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.stream);

    // Set the session address
    self.session = response.session;

    // Send a request to subscribe to the session
    send(SendParameters {
      to: self.session!!,
      value: SES_SUBSCRIBE_DEPOSIT + (NOTIFICATION_DEPOSIT + NOTIFICATION_PREMIUM) * self.notificationsCount!!,
      mode: SendPayGasSeparately | SendBounceIfActionFail,
      body: (SESSubscribe { queryId: response.queryId, notificationsCount: self.notificationsCount!! }).toCell()
    });
  }

  // Function to handle a bounced subscription request
  bounced(request: bounced<SESSubscribe>) {
    dump("bounced<SESSubscribe>");

    self.destroy(request.queryId);
  }

  // Function to handle the success response for subscription
  receive(response: SESSubscribeSuccess) {
    dump("SESSubscribeSuccess");

    let ctx: Context = context();

    // Ensure the response is from the session
    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.session!!);

    // TODO: Do I really need this?
    // If the counts do not match, unsubscribe from the session
    if (self.notificationsCount != response.remainingNotificationsCount) {
      dump("self.notificationsCount != response.remainingNotificationsCount");
      self.unsubscribeSession(response.queryId);
    }
  }

  abstract fun handleCandlestick(queryId: Int, candlestick: Candlestick);

  // Function to handle candlestick published notifications
  receive(notification: SESCandlestickPublishedNotification) {
    dump("SESCandlestickPublishedNotification");

    let ctx: Context = context();

    // Ensure the notification is from the session
    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.session!!);

    self.handleCandlestick(notification.queryId, notification.candlestick);
  }

  // Function to unsubscribe from the session
  fun unsubscribeSession(queryId: Int) {
    dump("self.unsubscribeSession()");

    send(SendParameters {
      to: self.session!!,
      value: SES_UNSUBSCRIBE_DEPOSIT,
      mode: SendPayGasSeparately,
      body: (SESUnsubscribe { queryId }).toCell()
    });
  }

  // Function to handle a bounced unsubscribe request
  bounced(request: SESUnsubscribe) {
    dump("bounced<SESUnsubscribe>");

    self.destroy(request.queryId);
  }

  abstract fun handleDestroy(queryId: Int);

  // Function to handle the notification of an unsubscribe event
  receive(notification: SESUnsubscribedNotification) {
    dump("SESUnsubscribedNotification");

    let ctx: Context = context();

    // Ensure the response is from the session
    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.session!!);

    nativeAcceptMessage();

    // Destroy the session
    self.destroySession(notification.queryId);
  }

  // Function to destroy the session
  fun destroySession(queryId: Int) {
    dump("self.destroySession()");

    send(SendParameters {
      to: self.session!!,
      value: SES_DESTROY_DEPOSIT,
      mode: SendPayGasSeparately | SendBounceIfActionFail,
      body: (SESDestroy { queryId }).toCell()
    });
  }

  // Function to handle a bounced destroy request
  bounced(request: SESDestroy) {
    dump("bounced<SESDestroy>");

    self.destroy(request.queryId);
  }

  // Function to handle the success response for session destruction
  receive(response: SESDestroySuccess) {
    dump("SESDestroySuccess");

    let ctx: Context = context();

    // Ensure the response is from the session
    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.session!!);

    // Destroy the contract
    self.destroy(response.queryId);
  }

  // Function to handle timeout check requests
  receive(request: SUBCheckTimeout) {
    dump("SUBCheckTimeout");

    // Ensure the contract is deployed and the timeout has been exceeded
    // FIXME: THIS IS EXPIRATION | GRACE PERIOD | something else, but timeout; timeout is the interval
    nativeThrowUnless(ERR_TIMEOUT_NOT_EXCEEDED, now() > self.timeout!! + SUBSCRIBER_TIMEOUT);

    let ctx: Context = context();

    // Send a timeout exceeded notification
    send(SendParameters {
      to: ctx.sender,
      value: ctx.value,
      mode: SendPayGasSeparately | SendBounceIfActionFail,
      body: (SUBTimeoutExceeded { queryId: request.queryId }).toCell(),
    });

    // Unsubscribe from the session
    self.unsubscribeSession(request.queryId);
  }
}