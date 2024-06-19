import "./constants";
import "./messages";

import "./subscriber";

// Message representing a subscriber deployment request
message CNODeploy {
  queryId: Int as uint64;  // Query ID for the request
  stream: Address; // In the future updates, should be substitued for underlyingAsset once the Data Streams Router is present to enable Data Stream contract upgradeability.
  agreement: Agreement;
}

// Message representing a successful subscriber deployment
message CNODeploySuccess {
  queryId: Int as uint64;  // Query ID for the response
  optionId: Int;  // Unique identifier for the subscriber
}

message CNOSettleInMoneyNotification {
  queryId: Int as uint64;
}

message CNOSettleOutMoneyNotification {
  queryId: Int as uint64;
}

message CNOSettleAtMoneyNotification {
  queryId: Int as uint64;
}

struct Agreement {
  holder: Address;
  writer: Address;
  initiation: Int;
  expiration: Int; 
  type: Bool;
  investment: Int;
  payout: Int;
}

const CASH_OR_NOTHING_OPTION_TYPE_CALL: Bool = true;
const CASH_OR_NOTHING_OPTION_TYPE_PUT : Bool = false;

// Contract representing a simple subscriber
contract CashOrNothingOption with Subscriber {
    deployer: Address;  // Address of the deployer of this subscriber contract
    
    stream: Address?;  // Address of the stream to which the subscriber is subscribed
    notificationsCount: Int?;  // Number of notifications the subscriber is entitled to receive
    session: Address?;  // Address of the subscription session
    // FIXME: substitute for DATA_STREAM_TIMEOUT
    timeout: Int?;  // Expiry time of the subscription
    
    optionId: Int;  // Unique identifier for the subscriber
    agreement: Agreement?;

    strikePrice: Int?;
    isSettled: Bool = false;

    get fun optionId(): Int {
      return self.optionId;
    }

    // Getter function for the latest candlestick
    get fun agreement(): Agreement? {
      return self.agreement;
    }
    
    // Initialize the contract with the deployer address and subscriber ID
    init(deployer: Address, optionId: Int) {
      self.deployer = deployer;
      self.optionId = optionId;
    }

    // FIXME: refactor this 
    fun validateAgreement(agreement: Agreement) {
      nativeThrowUnless(500, agreement.initiation > now());
      nativeThrowUnless(501, agreement.initiation < agreement.expiration);
      nativeThrowUnless(502, agreement.initiation % 60 == 0); // FIXME: Technically, there's no need in this check as devision rounds down the value; if user subscribes for 0:59, it's the save as subscribing to 0:00 as the candlestick is published only on 1:00
      nativeThrowUnless(503, agreement.expiration % 60 == 0); // FIXME:
      nativeThrowUnless(504, agreement.investment > 0);
      nativeThrowUnless(505, agreement.payout > 0);
    }

    // Function to handle the deployment of the subscriber
    receive(request: CNODeploy) {
      dump("CNODeploy");

      let ctx: Context = context();
      nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.deployer);

      self.validateAgreement(request.agreement);
      self.agreement = request.agreement;

      let notificationsCount: Int = (request.agreement.expiration - now()) / 60 + 1;
      self.subscribeStream(request.queryId, request.stream, notificationsCount, request.agreement.expiration);

      nativeReserve(request.agreement.investment + request.agreement.payout, ReserveExact | ReserveAddOriginalBalance);

      // Send a success response back to the deployer
      send(SendParameters {
        to: self.deployer,
        value: 0,
        mode: SendRemainingBalance,
        body: (CNODeploySuccess { queryId: request.queryId, optionId: self.optionId }).toCell(),
      });
    }

    fun settleAtMoney(queryId: Int) {
      dump("self.settleAtMoney()");

      send(SendParameters {
        to: self.agreement!!.holder,
        value: NOTIFICATION_DEPOSIT + self.agreement!!.investment,
        mode: SendIgnoreErrors | SendPayGasSeparately,
        body: (CNOSettleAtMoneyNotification { queryId }).toCell(),
      });

      send(SendParameters {
        to: self.agreement!!.writer,
        value: NOTIFICATION_DEPOSIT + self.agreement!!.payout,
        mode: SendIgnoreErrors | SendPayGasSeparately,
        body: (CNOSettleAtMoneyNotification { queryId }).toCell(),
      });
    }

    fun settleInMoney(queryId: Int) {
      dump("self.settleInMoney()");

      send(SendParameters {
        to: self.agreement!!.holder,
        value: NOTIFICATION_DEPOSIT + self.agreement!!.investment + self.agreement!!.payout,
        mode: SendIgnoreErrors | SendPayGasSeparately,
        body: (CNOSettleInMoneyNotification { queryId }).toCell(),
      });

      send(SendParameters {
        to: self.agreement!!.writer,
        value: NOTIFICATION_DEPOSIT,
        mode: SendIgnoreErrors | SendPayGasSeparately,
        body: (CNOSettleInMoneyNotification { queryId }).toCell(),
      });
    }

    fun settleOutMoney(queryId: Int) {      
      send(SendParameters {
        to: self.agreement!!.holder,
        value: NOTIFICATION_DEPOSIT,
        mode: SendIgnoreErrors | SendPayGasSeparately,
        body: (CNOSettleOutMoneyNotification { queryId }).toCell(),
      });

      send(SendParameters {
        to: self.agreement!!.writer,
        value: NOTIFICATION_DEPOSIT + self.agreement!!.investment + self.agreement!!.payout,
        mode: SendIgnoreErrors | SendPayGasSeparately,
        body: (CNOSettleOutMoneyNotification { queryId }).toCell(),
      });
    }

    override fun handleCandlestick(queryId: Int, candlestick: Candlestick) {
      dump("self.handleCandlestick()");
      
      let ctx: Context = context();

      nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.session!!);

      if (candlestick.start == self.agreement!!.initiation) {
        dump("Case #1");

        self.strikePrice = candlestick.open;
      }

      if (candlestick.end == self.agreement!!.expiration) {
        if (self.strikePrice == null) {
          dump("Case #2");

          self.settleAtMoney(queryId);
        } else if (self.agreement!!.type == CASH_OR_NOTHING_OPTION_TYPE_CALL && candlestick.close >= self.strikePrice!!) {
          dump("Case #3");
          
          self.settleInMoney(queryId);
        } else if (self.agreement!!.type == CASH_OR_NOTHING_OPTION_TYPE_PUT && candlestick.close <= self.strikePrice!!) {
          dump("Case #4");
          
          self.settleInMoney(queryId);
        } else {
          dump("Case #5");
          
          self.settleOutMoney(queryId);
        }

        self.isSettled = true;
      }
    }

    override fun handleDestroy(queryId: Int) {
      dump("self.handleDestroy()");

      if (!self.isSettled) {
        dump("Case #6");

        self.settleAtMoney(queryId);
      } 
    }
}