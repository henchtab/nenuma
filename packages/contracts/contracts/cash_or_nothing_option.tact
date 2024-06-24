import "./constants";
import "./messages";
import "./subscriber";

/**
 * Message representing a cash-or-nothing option deployment request.
 */
message CashOrNothingOptionDeploy {
  queryId: Int as uint64;  // Query ID for the request
  stream: Address; // In the future updates, should be substituted for underlyingAsset once the Data Streams Router is present to enable Data Stream contract upgradeability.
  agreement: CashOrNothingOptionAgreement;
}

/**
 * Message representing a successful cash-or-nothing option deployment.
 */
message CashOrNothingOptionDeploySuccess {
  queryId: Int as uint64;  // Query ID for the response
  optionId: Int;  // Unique identifier for the option
  holder: Address;
}

/**
 * Message representing a cash-or-nothing option settled in the money notification.
 */
message CashOrNothingOptionSettledInMoneyNotification {
  queryId: Int as uint64;
}

/**
 * Message representing a cash-or-nothing option settled out of the money notification.
 */
message CashOrNothingOptionSettledOutMoneyNotification {
  queryId: Int as uint64;
}

/**
 * Message representing a cash-or-nothing option settled at the money notification.
 */
message CashOrNothingOptionSettledAtMoneyNotification {
  queryId: Int as uint64;
}

/**
 * Structure representing a cash-or-nothing option agreement.
 */
struct CashOrNothingOptionAgreement {
  holder: Address;
  writer: Address;
  initiation: Int as uint32;
  expiration: Int as uint32; 
  optionType: Bool;
  investment: Int as coins;
  payout: Int as coins;
}

const CASH_OR_NOTHING_OPTION_TYPE_CALL: Bool = true;
const CASH_OR_NOTHING_OPTION_TYPE_PUT : Bool = false;

/**
* Contract representing a cash-or-nothing option.
*/
contract CashOrNothingOption with Subscriber {
  deployer: Address;
  stream: Address?;
  notificationsCount: Int?; // Number of notifications the subscriber is entitled to receive
  session: Address?;
  expiration: Int?; // Expiry time of the subscription
  
  optionId: Int;
  agreement: CashOrNothingOptionAgreement?;
  strikePrice: Int?;
  isSettled: Bool = false;

  /**
    * Retrieves the unique identifier for the option.
    */
  get fun optionId(): Int {
    return self.optionId;
  }

  /**
    * Retrieves the agreement details of the option.
    */
  get fun agreement(): CashOrNothingOptionAgreement? {
    return self.agreement;
  }

  /**
  * Retrieves the agreement details of the option.
  */
  get fun strikePrice(): Int? {
    return self.strikePrice;
  }
  
  /**
    * Initializes the contract with the deployer address and option ID.
    * @param {Address} deployer - The address of the deployer.
    * @param {Int} optionId - The unique identifier for the option.
    */
  init(deployer: Address, optionId: Int) {
    self.deployer = deployer;
    self.optionId = optionId;
  }

  /**
    * Validates the cash-or-nothing option agreement.
    * @param {CashOrNothingOptionAgreement} agreement - The agreement to validate.
    */
  fun validateAgreement(agreement: CashOrNothingOptionAgreement) {
    nativeThrowUnless(ERR_INVALID_ARGUMENT, agreement.initiation > now());
    nativeThrowUnless(ERR_INVALID_ARGUMENT, agreement.initiation < agreement.expiration);
    nativeThrowUnless(ERR_INVALID_ARGUMENT, agreement.investment > 0);
    nativeThrowUnless(ERR_INVALID_ARGUMENT, agreement.payout > 0);
  }

  /**
    * Handles the deployment of a cash-or-nothing option.
    * @param {CashOrNothingOptionDeploy} request - The deployment request.
    */
  receive(request: CashOrNothingOptionDeploy) {
    dump("CashOrNothingOptionDeploy");

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
      body: (CashOrNothingOptionDeploySuccess { queryId: request.queryId, optionId: self.optionId, holder: request.agreement.holder }).toCell(),
    });
  }

  /**
    * Sets the option as settled at the money.
    * @param {Int} queryId - The query ID associated with the settlement.
    */
  fun settleAtMoney(queryId: Int) {
    dump("self.settleAtMoney()");

    send(SendParameters {
      to: self.agreement!!.holder,
      value: NOTIFICATION_DEPOSIT + self.agreement!!.investment,
      mode: SendIgnoreErrors | SendPayGasSeparately,
      body: (CashOrNothingOptionSettledAtMoneyNotification { queryId }).toCell(),
    });

    send(SendParameters {
      to: self.agreement!!.writer,
      value: NOTIFICATION_DEPOSIT + self.agreement!!.payout,
      mode: SendIgnoreErrors | SendPayGasSeparately,
      body: (CashOrNothingOptionSettledAtMoneyNotification { queryId }).toCell(),
    });
  }

  /**
    * Sets the option as settled in the money.
    * @param {Int} queryId - The query ID associated with the settlement.
    */
  fun settleInMoney(queryId: Int) {
    dump("self.settleInMoney()");

    send(SendParameters {
      to: self.agreement!!.holder,
      value: NOTIFICATION_DEPOSIT + self.agreement!!.investment + self.agreement!!.payout,
      mode: SendIgnoreErrors | SendPayGasSeparately,
      body: (CashOrNothingOptionSettledInMoneyNotification { queryId }).toCell(),
    });

    send(SendParameters {
      to: self.agreement!!.writer,
      value: NOTIFICATION_DEPOSIT,
      mode: SendIgnoreErrors | SendPayGasSeparately,
      body: (CashOrNothingOptionSettledInMoneyNotification { queryId }).toCell(),
    });
  }

  /**
    * Sets the option as settled out of the money.
    * @param {Int} queryId - The query ID associated with the settlement.
    */
  fun settleOutMoney(queryId: Int) {      
    send(SendParameters {
      to: self.agreement!!.holder,
      value: NOTIFICATION_DEPOSIT,
      mode: SendIgnoreErrors | SendPayGasSeparately,
      body: (CashOrNothingOptionSettledOutMoneyNotification { queryId }).toCell(),
    });

    send(SendParameters {
      to: self.agreement!!.writer,
      value: NOTIFICATION_DEPOSIT + self.agreement!!.investment + self.agreement!!.payout,
      mode: SendIgnoreErrors | SendPayGasSeparately,
      body: (CashOrNothingOptionSettledOutMoneyNotification { queryId }).toCell(),
    });
  }

  /**
    * Handles the candlestick event for the cash-or-nothing option.
    * @param {Int} queryId - The query ID associated with the candlestick event.
    * @param {Candlestick} candlestick - The candlestick data.
    */
  override fun handleCandlestick(queryId: Int, candlestick: Candlestick) {
    dump("self.handleCandlestick()");
    
    let ctx: Context = context();

    dump("candlestick.start");
    dump(candlestick.start);

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.session!!);

    if (candlestick.start == self.agreement!!.initiation) {
      dump("Case #1");

      self.strikePrice = candlestick.open;
    }

    if (candlestick.end == self.agreement!!.expiration) {
      if (self.strikePrice == null) {
        dump("Case #2");

        self.settleAtMoney(queryId);
        self.unsubscribeSession(queryId);
      } else if (self.agreement!!.optionType == CASH_OR_NOTHING_OPTION_TYPE_CALL && candlestick.close >= self.strikePrice!!) {
        dump("Case #3");
        
        self.settleInMoney(queryId);
      } else if (self.agreement!!.optionType == CASH_OR_NOTHING_OPTION_TYPE_PUT && candlestick.close <= self.strikePrice!!) {
        dump("Case #4");
        
        self.settleInMoney(queryId);
      } else {
        dump("Case #5");
        
        self.settleOutMoney(queryId);
      }

      self.isSettled = true;
    }
  }

  /**
    * Handles the destruction of the cash-or-nothing option.
    * @param {Int} queryId - The query ID associated with the destruction.
    */
  override fun handleDestroy(queryId: Int) {
    dump("self.handleDestroy()");

    if (!self.isSettled) {
      dump("Case #6");

      self.settleAtMoney(queryId);
    }
  }
}