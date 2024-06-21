import "./constants";
import "./messages";
import "./subscriber";

/**
 * Contract representing a simple subscriber.
 */
contract SimpleSubscriber with Subscriber {
  deployer: Address;
  stream: Address?;
  notificationsCount: Int?; // Number of notifications the subscriber is entitled to receive
  session: Address?;
  expiration: Int?; // Expiry time of the subscription
  
  subscriberId: Int;
  latestCandlestick: Candlestick?;  // The latest candlestick received by the subscriber

  /**
    * Getter function for the latest candlestick.
    * @return {Candlestick?} The latest candlestick.
    */
  get fun latestCandlestick(): Candlestick? {
    return self.latestCandlestick;
  }

  /**
    * Initializes the contract with the deployer address and subscriber ID.
    * @param {Address} deployer - The address of the deployer.
    * @param {Int} subscriberId - The unique identifier for the subscriber.
    */
  init(deployer: Address, subscriberId: Int) {
    self.deployer = deployer;
    self.subscriberId = subscriberId;
  }

  /**
    * Handles the deployment of the subscriber.
    * @param {SimpleSubscriberDeploy} request - The deployment request.
    */
  receive(request: SimpleSubscriberDeploy) {
    dump("SimpleSubscriberDeploy");

    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.deployer);

    self.subscribeStream(request.queryId, request.stream, request.notificationsCount, request.expiration);

    // Send a success response back to the deployer
    send(SendParameters {
      to: self.deployer,
      value: 0,
      mode: SendRemainingBalance,
      body: (SimpleSubscriberDeploySuccess { queryId: request.queryId, subscriberId: self.subscriberId }).toCell(),
    });
  }

  /**
    * Overrides the handleCandlestick function to update the latest candlestick.
    * @param {Int} queryId - The ID of the query.
    * @param {Candlestick} candlestick - The received candlestick.
    */
  override fun handleCandlestick(queryId: Int, candlestick: Candlestick) {
    dump("overrided self.handleCandlestick()");
    self.latestCandlestick = candlestick;
  }

  /**
    * Overrides the handleDestroy function.
    * @param {Int} queryId - The ID of the query initiating the destruction.
    */
  override fun handleDestroy(queryId: Int) {
    dump("overrided self.handleDestroy()");
  }
}

/**
* Message representing a subscriber deployment request.
*/
message SimpleSubscriberDeploy {
  queryId: Int as uint64;  // Query ID for the request
  stream: Address;  // Address of the stream
  notificationsCount: Int;  // Number of notifications requested
  expiration: Int;  // Expiry time for the subscription
}

/**
* Message representing a successful subscriber deployment.
*/
message SimpleSubscriberDeploySuccess {
  queryId: Int as uint64;  // Query ID for the response
  subscriberId: Int;  // Unique identifier for the subscriber
}