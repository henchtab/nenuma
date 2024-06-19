import "./constants";
import "./messages";

import "./subscriber";

// Contract representing a simple subscriber
contract SimpleSubscriber with Subscriber {
    const TestConstantValue: Int = 777;

    deployer: Address;  // Address of the deployer of this subscriber contract
    stream: Address?;  // Address of the stream to which the subscriber is subscribed
    notificationsCount: Int?;  // Number of notifications the subscriber is entitled to receive
    session: Address?;  // Address of the subscription session
    timeout: Int?;  // Expiry time of the subscription
    
    subscriberId: Int;  // Unique identifier for the subscriber
    latestCandlestick: Candlestick?;  // The latest candlestick received by the subscriber

    // Getter function for the latest candlestick
    get fun latestCandlestick(): Candlestick? {
      return self.latestCandlestick;
    }
    
    // Initialize the contract with the deployer address and subscriber ID
    init(deployer: Address, subscriberId: Int) {
      self.deployer = deployer;
      self.subscriberId = subscriberId;
    }

    // Function to handle the deployment of the subscriber
    receive(request: SUSDeploy) {
      dump("SUSDeploy");

      let ctx: Context = context();

      nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.deployer);

      self.subscribeStream(request.queryId, request.stream, request.notificationsCount, request.timeout);

      // Send a success response back to the deployer
      send(SendParameters {
        to: self.deployer,
        value: 0,
        mode: SendRemainingBalance,
        body: (SUSDeploySuccess { queryId: request.queryId, subscriberId: self.subscriberId }).toCell(),
      });
    }

    override fun handleCandlestick(queryId: Int, candlestick: Candlestick) {
      dump("override fun handleCandlestickPublished");
      
      // Update the latest candlestick
      self.latestCandlestick = candlestick;
    }

    override fun handleDestroy(queryId: Int) {
      dump("override fun handleSessionUnsubscribed");
    }
}

// Message representing a subscriber deployment request
message SUSDeploy {
  queryId: Int as uint64;  // Query ID for the request
  stream: Address;  // Address of the stream
  notificationsCount: Int;  // Number of notifications requested
  timeout: Int;  // Expiry time for the subscription
}

// Message representing a successful subscriber deployment
message SUSDeploySuccess {
  queryId: Int as uint64;  // Query ID for the response
  subscriberId: Int;  // Unique identifier for the subscriber
}