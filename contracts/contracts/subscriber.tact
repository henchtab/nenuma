// Accept incoming message
@name(accept_message)
native nativeAcceptMessage();

// Message representing a notification of subscriber destruction
message SubscriberDestroyedNotification {
  queryId: Int as uint64;  // Query ID for the notification
}

// Message representing an expiration check request
message SubscriberCheckTimeout {
  queryId: Int as uint64;  // Query ID for the request
}

// Message representing an expiration exceeded notification
message SubscriberTimeoutExceeded {
  queryId: Int as uint64;
}

const SUBSCRIBER_STORAGE_RESERVE: Int = ton("0.05"); // Storage reserve for subscription session
const SUBSCRIBER_OPERATIONAL_RESERVE: Int = ton("0.20"); // Operational reserve for subscription session
const SUBSCRIBER_GRACE_PERIOD: Int = 3600; // Timeout for subscription session

/**
 * Interface for Subscriber smart contract
 */
trait Subscriber {
  deployer: Address;
  stream: Address?;
  notificationsCount: Int?; // Number of notifications the subscriber is entitled to receive
  session: Address?;
  expiration: Int?; // Expiry time of the subscription

  /**
   * Getter function for the contract balance
   * @returns {Int} - The contract balance
   */
  get fun balance(): Int {
    return myBalance();
  }

  /**
   * Getter function for the deployer's address
   * @returns {Address} - The deployer's address
   */
  get fun deployerAddress(): Address {
    return self.deployer;
  }

  /**
   * Getter function for the stream address
   * @returns {Address?} - The stream address
   */
  get fun streamAddress(): Address? {
    return self.stream;
  }

  /**
   * Getter function for the number of notifications
   * @returns {Int?} - The number of notifications
   */
  get fun notificationsCount(): Int? {
    return self.notificationsCount;
  }

  /**
   * Getter function for the expiration time
   * @returns {Int?} - The expiration time
   */
  get fun expiration(): Int? {
    return self.expiration;
  }

  /**
   * Getter function for the session address
   * @returns {Address?} - The session address
   */
  get fun sessionAddress(): Address? {
    return self.session;
  }

  /**
   * Deploys a session associated with the subscriber
   * @param {Int} queryId - The ID of the query initiating the session deployment
   */
  fun deploySession(queryId: Int) {
    dump("self.deploySession()");
    send(SendParameters {
      to: self.stream!!,
      value: DST_DEPLOY_SESSION_DEPOSIT,
      mode: SendPayGasSeparately | SendBounceIfActionFail,
      body: (DSTDeploySession { queryId }).toCell(),
    });
  }

  /**
   * Subscribes to a stream
   * @param {Int} queryId - The ID of the query initiating the subscription
   * @param {Address} stream - The address of the stream to subscribe to
   * @param {Int} notificationsCount - The number of notifications expected
   * @param {Int} expiration - The expiration time for the subscription
   */
  virtual fun subscribeStream(queryId: Int, stream: Address, notificationsCount: Int, expiration: Int) {
    dump("subscribeStream()");

    let ctx: Context = context();
    nativeThrowUnless(ERR_INVALID_ARGUMENT, notificationsCount >= 2);
    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= SUBSCRIBER_STORAGE_RESERVE + SUBSCRIBER_OPERATIONAL_RESERVE + (NOTIFICATION_DEPOSIT + NOTIFICATION_PREMIUM) * notificationsCount);

    self.stream = stream;
    self.notificationsCount = notificationsCount;
    self.expiration = expiration;

    self.deploySession(queryId);
    nativeReserve(SUBSCRIBER_STORAGE_RESERVE + (SUBSCRIBER_OPERATIONAL_RESERVE - DST_DEPLOY_SESSION_DEPOSIT) + (NOTIFICATION_DEPOSIT + NOTIFICATION_PREMIUM) * notificationsCount, ReserveExact | ReserveAddOriginalBalance);
  }

  /**
   * Destroys the contract and notifies the deployer
   * @param {Int} queryId - The ID of the query initiating the destruction
   */
  fun destroy(queryId: Int) {
    dump("self.destroy()");

    self.handleDestroy(queryId);
    send(SendParameters {
      to: self.deployer,
      value: 0,
      mode: SendRemainingBalance | SendDestroyIfZero,
      body: (SubscriberDestroyedNotification { queryId }).toCell()
    });
  }

  /**
   * Handles bounced session deployment
   * @param {DSTDeploySession} request - The bounced request
   */
  bounced(request: DSTDeploySession) {
    dump("bounced<DSTDeploySession>");
    self.destroy(request.queryId);
  }

  /**
   * Receives session deployment success response
   * @param {DSTDeploySessionSuccess} response - The success response
   */
  receive(response: DSTDeploySessionSuccess) {
    dump("DSTDeploySessionSuccess");

    let ctx: Context = context();
    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.stream);
    self.session = response.session;

    send(SendParameters {
      to: self.session!!,
      value: SES_SUBSCRIBE_DEPOSIT + (NOTIFICATION_DEPOSIT + NOTIFICATION_PREMIUM) * self.notificationsCount!!,
      mode: SendPayGasSeparately | SendBounceIfActionFail,
      body: (SESSubscribe { queryId: response.queryId, notificationsCount: self.notificationsCount!! }).toCell()
    });
  }

  /**
   * Handles bounced subscription request
   * @param {bounced<SESSubscribe>} request - The bounced subscription request
   */
  bounced(request: bounced<SESSubscribe>) {
    dump("bounced<SESSubscribe>");
    self.destroy(request.queryId);
  }

  /**
   * Receives subscription success response
   * @param {SESSubscribeSuccess} response - The success response
   */
  receive(response: SESSubscribeSuccess) {
    dump("SESSubscribeSuccess");

    let ctx: Context = context();
    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.session!!);

    if (self.notificationsCount != response.remainingNotificationsCount) {
      dump("self.notificationsCount != response.remainingNotificationsCount");
      self.unsubscribeSession(response.queryId);
    }
  }

  /**
   * Abstract function to handle candlestick events
   * @param {Int} queryId - The query ID
   * @param {Candlestick} candlestick - The candlestick data
   */
  abstract fun handleCandlestick(queryId: Int, candlestick: Candlestick);

  /**
   * Receives candlestick published notification
   * @param {SESCandlestickPublishedNotification} notification - The notification
   */
  receive(notification: SESCandlestickPublishedNotification) {
    dump("SESCandlestickPublishedNotification");

    let ctx: Context = context();
    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.session!!);

    nativeAcceptMessage();

    self.handleCandlestick(notification.queryId, notification.candlestick);
  }

  /**
   * Unsubscribes from the session
   * @param {Int} queryId - The ID of the query initiating the unsubscription
   */
  fun unsubscribeSession(queryId: Int) {
    dump("self.unsubscribeSession()");

    send(SendParameters {
      to: self.session!!,
      value: SES_UNSUBSCRIBE_DEPOSIT,
      mode: SendPayGasSeparately,
      body: (SESUnsubscribe { queryId }).toCell()
    });
  }

  /**
   * Handles bounced unsubscribe request
   * @param {SESUnsubscribe} request - The bounced unsubscribe request
   */
  bounced(request: SESUnsubscribe) {
    dump("bounced<SESUnsubscribe>");
    self.destroy(request.queryId);
  }

  /**
   * Abstract function to handle destruction logic
   * @param {Int} queryId - The query ID
   */
  abstract fun handleDestroy(queryId: Int);

  /**
   * Receives unsubscribed notification
   * @param {SESUnsubscribedNotification} notification - The unsubscribed notification
   */
  receive(notification: SESUnsubscribedNotification) {
    dump("SESUnsubscribedNotification");

    let ctx: Context = context();
    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.session!!);

    nativeAcceptMessage();

    self.destroySession(notification.queryId);
  }

  /**
   * Destroys the session
   * @param {Int} queryId - The ID of the query initiating the session destruction
   */
  fun destroySession(queryId: Int) {
    dump("self.destroySession()");

    send(SendParameters {
      to: self.session!!,
      value: SES_DESTROY_DEPOSIT,
      mode: SendPayGasSeparately | SendBounceIfActionFail,
      body: (SESDestroy { queryId }).toCell()
    });
  }

  /**
   * Handles bounced destroy request
   * @param {SESDestroy} request - The bounced destroy request
   */
  bounced(request: SESDestroy) {
    dump("bounced<SESDestroy>");
    self.destroy(request.queryId);
  }

  /**
   * Receives session destruction success response
   * @param {SESDestroySuccess} response - The success response
   */
  receive(response: SESDestroySuccess) {
    dump("SESDestroySuccess");

    let ctx: Context = context();
    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.session!!);
    self.destroy(response.queryId);
  }

  /**
   * Receives expiration check request
   * @param {SUBCheckTimeout} request - The expiration check request
   */
  receive(request: SubscriberCheckTimeout) {
    dump("SUBCheckTimeout");

    nativeThrowUnless(ERR_TIMEOUT_NOT_EXCEEDED, now() > self.expiration!! + SUBSCRIBER_GRACE_PERIOD);

    let ctx: Context = context();
    send(SendParameters {
      to: ctx.sender,
      value: ctx.value,
      mode: SendPayGasSeparately | SendBounceIfActionFail,
      body: (SubscriberTimeoutExceeded { queryId: request.queryId }).toCell(),
    });

    self.unsubscribeSession(request.queryId);
  }
}
