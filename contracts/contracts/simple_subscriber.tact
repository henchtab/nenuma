import "./constants";
import "./messages";

// Contract representing a simple subscriber
contract SimpleSubscriber {
    owner: Address;  // Address of the owner of this subscriber contract
    subscriberId: Int;  // Unique identifier for the subscriber
    stream: Address?;  // Address of the stream to which the subscriber is subscribed
    notificationsCount: Int?;  // Number of notifications the subscriber is entitled to receive
    session: Address?;  // Address of the subscription session
    latestCandlestick: Candlestick?;  // The latest candlestick received by the subscriber
    expiresAt: Int?;  // Expiry time of the subscription

    // Getter function for the contract balance
    get fun balance(): Int {
      return myBalance();
    }

    // Getter function for the owner's address
    get fun ownerAddress(): Address {
      return self.owner;
    }

    // Getter function for the number of notifications
    get fun notificationsCount(): Int? {
      return self.notificationsCount;
    }

    // Getter function for the expiry time
    get fun expiresAt(): Int? {
      return self.expiresAt;
    }

    // Getter function for the stream address
    get fun streamAddress(): Address? {
      return self.stream;
    }

    // Getter function for the session address
    get fun sessionAddress(): Address? {
      return self.session;
    }

    // Getter function for the latest candlestick
    get fun latestCandlestick(): Candlestick? {
      return self.latestCandlestick;
    }
    
    // Initialize the contract with the owner address and subscriber ID
    init(owner: Address, subscriberId: Int) {
      self.owner = owner;
      self.subscriberId = subscriberId;
    }

    // Function to handle the deployment of the subscriber
    receive(request: SUSDeploy) {
      dump("SUSDeploy");

      let ctx: Context = context();

      // Ensure the notifications count is valid
      nativeThrowUnless(ERR_INVALID_ARGUMENT, request.notificationsCount >= 2);
      // Ensure sufficient deposit for storage and operational reserves
      nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= SUS_STORAGE_RESERVE + SUS_OPERATIONAL_RESERVE + (NOTIFICATION_DEPOSIT + NOTIFICATION_PREMIUM) * request.notificationsCount);

      // Set the stream, notifications count, and expiry time
      self.stream = request.stream;
      self.notificationsCount = request.notificationsCount;
      self.expiresAt = request.expiresAt;

      // Send a request to deploy a session
      send(SendParameters {
        to: self.stream!!,
        value: DST_DEPLOY_SESSION_DEPOSIT,
        mode: SendPayGasSeparately | SendBounceIfActionFail,
        body: (DSTDeploySession { queryId: request.queryId }).toCell(),
      });

      // Reserve storage and operational balance
      nativeReserve(SUS_STORAGE_RESERVE + (SUS_OPERATIONAL_RESERVE - DST_DEPLOY_SESSION_DEPOSIT) + (NOTIFICATION_DEPOSIT + NOTIFICATION_PREMIUM) * request.notificationsCount, ReserveExact);

      // Send a success response back to the owner
      send(SendParameters {
        to: self.owner,
        value: 0,
        mode: SendRemainingBalance,
        body: (SUSDeploySuccess { queryId: request.queryId, subscriberId: self.subscriberId }).toCell(),
      });
    }

    // Function to handle the success response for session deployment
    receive(response: DSTDeploySessionSuccess) {
      dump("DSTDeploySessionSuccess");

      let ctx: Context = context();

      // Ensure the response is from the stream
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
    
    // Function to destroy the contract and notify the owner
    fun destroy(queryId: Int) {
      dump("self.destroy()");

      send(SendParameters {
        to: self.owner,
        value: 0,
        mode: SendRemainingBalance | SendDestroyIfZero,
        body: (SUSDestroyedNotification { queryId }).toCell()
      });
    }

    // Function to handle a bounced subscription request
    bounced(request: bounced<SESSubscribe>) {
      dump("bounced<SESSubscribe>");

      self.destroy(request.queryId);
    }

    // Function to unsubscribe from the session
    fun unsubscribeSession(queryId: Int) {
      dump("self.unsubscribeSession()");

      send(SendParameters {
        to: self.owner,
        value: SES_UNSUBSCRIBE_DEPOSIT,
        mode: SendPayGasSeparately | SendBounceIfActionFail,
        body: (SESUnsubscribe { queryId }).toCell()
      });
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

    // Function to handle the notification of an unsubscribe event
    receive(response: SESUnsubscribedNotification) {
      dump("SESUnsubscribedNotification");

      let ctx: Context = context();

      // Ensure the response is from the session
      nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.session!!);

      // Destroy the session
      self.destroySession(response.queryId);
    }

    // Function to handle a bounced unsubscribe request
    bounced(request: SESUnsubscribe) {
      dump("bounced<SESUnsubscribe>");
      self.destroy(request.queryId);
    }

    // Function to handle a bounced destroy request
    bounced(request: SESDestroy) {
      dump("bounced<SESDestroy>");
      self.destroy(request.queryId);
    }

    // Function to handle the success response for subscription
    receive(response: SESSubscribeSuccess) {
      dump("SESSubscribeSuccess");

      let ctx: Context = context();

      // Ensure the response is from the session
      nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.session!!);

      // If the counts do not match, unsubscribe from the session
      if (self.notificationsCount != response.remainingNotificationsCount) {
        self.unsubscribeSession(response.queryId);
      }
    }

    // Function to handle candlestick published notifications
    receive(notification: SESCandlestickPublishedNotification) {
      dump("SESCandlestickPublishedNotification");

      let ctx: Context = context();

      // Ensure the notification is from the session
      nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.session!!);

      // Update the latest candlestick
      self.latestCandlestick = notification.candlestick;
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
    receive(request: SUSCheckTimeout) {      
      // Ensure the contract is deployed and the timeout has been exceeded
      nativeThrowUnless(ERR_NOT_DEPLOYED, self.expiresAt != null);
      nativeThrowUnless(ERR_TIMEOUT_NOT_EXCEEDED, now() > self.expiresAt!! + SUS_TIMEOUT);

      let ctx: Context = context();

      // Send a timeout exceeded notification
      send(SendParameters {
        to: ctx.sender,
        value: ctx.value,
        mode: SendPayGasSeparately | SendBounceIfActionFail,
        body: (SUSTimeoutExceeded { queryId: request.queryId }).toCell(),
      });

      // Unsubscribe from the session
      self.unsubscribeSession(request.queryId);
    }
}

// Message representing a subscriber deployment request
message SUSDeploy {
  queryId: Int as uint64;  // Query ID for the request
  stream: Address;  // Address of the stream
  notificationsCount: Int;  // Number of notifications requested
  expiresAt: Int;  // Expiry time for the subscription
}

// Message representing a successful subscriber deployment
message SUSDeploySuccess {
  queryId: Int as uint64;  // Query ID for the response
  subscriberId: Int;  // Unique identifier for the subscriber
}

// Message representing a notification of subscriber destruction
message SUSDestroyedNotification {
  queryId: Int as uint64;  // Query ID for the notification
}

// Message representing a timeout check request
message SUSCheckTimeout {
  queryId: Int as uint64;  // Query ID for the request
}

// Message representing a timeout exceeded notification
message SUSTimeoutExceeded {
  queryId: Int as uint64;
}