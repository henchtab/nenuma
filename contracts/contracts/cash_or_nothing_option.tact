// TODO: It's a saved draft. Not ready for production usage yet.

import "./messages";

import "./data_stream";
import "./session";

const CNO_STATE_DEPLOYED: Int = 0;
const CNO_STATE_PENDING_DEPLOY_SESSION: Int = 1;
const CNO_STATE_PENDING_SUBSCRIBE_STREAM: Int = 2;
const CNO_STATE_INITIATED: Int = 3;
const CNO_STATE_SETTLED: Int = 4;
const CNO_STATE_PENDING_UNSUBSCRIBE_STREAM: Int = 5;
const CNO_STATE_PENDING_DESTROY_SESSION: Int = 6;

contract CashOrNothingOption {
  broker: Address;
  optionId: Int;
  state: Int;
  agreement: Agreement?;
  session: Address?;
  strikePrice: Int?;
  expirationPrice: Int?;

  get fun broker(): Address {
    return self.broker;
  }

  get fun optionId(): Int {
    return self.optionId;
  }

  get fun state(): Int {
    return self.state;
  }

  get fun agreement(): Agreement? {
    return self.agreement;
  }

  get fun session(): Address? {
    return self.session;
  }

  get fun strikePrice(): Int? {
    return self.strikePrice;
  }

  get fun expirationPrice(): Int? {
    return self.expirationPrice;
  }

  init(broker: Address, optionId: Int) {
    self.broker = broker;
    self.optionId = optionId;
    self.state = CNO_STATE_DEPLOYED;
  }

  // delta = (agreement.expiration - agreement.initiation) / 60
  // CNO_OPERATIONAL_DEPOSIT = DST_DEPLOY_SESSION + SES_SUBSCRIBE + 2 * (NOTIFICATION_DEPOSIT + NOTIFICATION_PREMIUM) * delta  + SES_UNSUBSCRIBE + DST_DESTROY_SESSION
  // value = request.agreement.investment + request.agreement.payout + CNO_STORAGE_RESERVE + CNO_OPERATIONAL_DEPOSIT;
  receive(request: CNODeploy) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.broker);
    nativeThrowUnless(ERR_INVALID_STATE, self.state == CNO_STATE_DEPLOYED);

    nativeThrowUnless(ERR_INVALID_ARGUMENT, request.agreement.initiation >= now());
    nativeThrowUnless(ERR_INVALID_ARGUMENT, request.agreement.initiation <= request.agreement.expiration);
    nativeThrowUnless(ERR_INVALID_ARGUMENT, request.agreement.initiation % 60 == 0);
    nativeThrowUnless(ERR_INVALID_ARGUMENT, request.agreement.expiration % 60 == 0);
    nativeThrowUnless(ERR_INVALID_ARGUMENT, request.agreement.investment > 0);
    nativeThrowUnless(ERR_INVALID_ARGUMENT, request.agreement.payout > 0);

    self.agreement = request.agreement;

    let notificationsCount: Int = 2 * ((self.agreement!!.expiration - self.agreement!!.initiation) / 60);

    if (notificationsCount <= 3) {
      notificationsCount = 5;
    }

    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= CNO_STORAGE_RESERVE 
      + CNO_OPERATIONAL_DEPOSIT 
      + self.agreement!!.investment 
      + self.agreement!!.payout 
      + (NOTIFICATION_DEPOSIT + NOTIFICATION_PREMIUM) * notificationsCount);

    // CNO OPERATIONAL_DEPOSIT = request.agreement.investment + request.agreement.payout + DST_DEPLOY_SESSION_DEPOSIT + SES_SUBSCRIBE_DEPOSIT + 2 * CNO_NOTIFICATION_DEPOSIT + SES_UNSUBSCRIBE_DEPOSIT + SES_DESTROY_DEPOSIT; 
    nativeReserve(
      CNO_STORAGE_RESERVE + 
      CNO_OPERATIONAL_DEPOSIT +
      self.agreement!!.investment + self.agreement!!.payout +
      (NOTIFICATION_DEPOSIT + NOTIFICATION_PREMIUM) * notificationsCount,
      ReserveExact | ReserveBounceIfActionFail
    );

    send(SendParameters {
      to: (self.agreement!!).stream,
      value: DST_DEPLOY_SESSION_DEPOSIT,
      mode: SendPayGasSeparately | SendBounceIfActionFail,
      body: (DSTDeploySession { queryId: request.queryId }).toCell(),
    });

    send(SendParameters {
      to: self.broker,
      value: 0,
      mode: SendRemainingBalance | SendBounceIfActionFail,
      body: (CNODeploySuccess { queryId: request.queryId, optionId: self.optionId }).toCell(),
    });

    self.state = CNO_STATE_PENDING_DEPLOY_SESSION;
  }

  bounced(request: bounced<CNODeploySuccess>) {
    dump("Magic 1");

    self.settleAtMoney(request.queryId);
  }

  receive(response: DSTDeploySessionSuccess) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.agreement!!.stream);
    nativeThrowUnless(ERR_INVALID_STATE, self.state == CNO_STATE_PENDING_DEPLOY_SESSION);

    self.session = response.session;

    let notificationsCount: Int = 2 * ((self.agreement!!.expiration - self.agreement!!.initiation) / 60);

    send(SendParameters {
      to: self.session!!,
      value: SES_SUBSCRIBE_DEPOSIT + (NOTIFICATION_DEPOSIT + NOTIFICATION_PREMIUM) * notificationsCount,
      mode: SendBounceIfActionFail,
      body: (SESSubscribe { queryId: response.queryId, notificationsCount }).toCell(),
    });

    self.state = CNO_STATE_PENDING_SUBSCRIBE_STREAM;
  }

  bounced(request: bounced<SESSubscribe>) {
    dump("Magic 2");

    self.settleAtMoney(request.queryId);
  }

  receive(response: SESSubscribeSuccess) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_INVALID_STATE, self.state == CNO_STATE_PENDING_SUBSCRIBE_STREAM);
    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.session!!);

    self.state = CNO_STATE_INITIATED;
  }

  fun settleInMoney(queryId: Int) {
    dump("ITM");

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

    self.state = CNO_STATE_SETTLED;
  }

  fun settleOutMoney(queryId: Int) {
    dump("OTM");

    send(SendParameters {
      to: self.agreement!!.writer,
      value: NOTIFICATION_DEPOSIT + self.agreement!!.investment + self.agreement!!.payout,
      mode: SendIgnoreErrors | SendPayGasSeparately,
      body: (CNOSettleInMoneyNotification { queryId }).toCell(),
    });

    send(SendParameters {
      to: self.agreement!!.holder,
      value: NOTIFICATION_DEPOSIT,
      mode: SendIgnoreErrors | SendPayGasSeparately,
      body: (CNOSettleInMoneyNotification { queryId }).toCell(),
    });

    self.state = CNO_STATE_SETTLED;
  }

  fun settleAtMoney(queryId: Int) {
    dump("ATM");

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

    self.state = CNO_STATE_SETTLED;
  }

  receive(notification: SESCandlestickPublishedNotification) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.session!!);
    // dump("notification.remainingNotificationsCount");
    // dump(notification.remainingNotificationsCount);

    if (notification.candlestick.start == self.agreement!!.initiation) {
      dump("Case 1");

      self.strikePrice = notification.candlestick.open;
    }

    if (notification.candlestick.end == self.agreement!!.expiration) {

      if (self.strikePrice == null) {
        dump("Magic 3");
        self.settleAtMoney(notification.queryId);
      }

      else if (self.agreement!!.type == CNO_TYPE_CALL && notification.candlestick.close >= self.strikePrice!!) {
        dump("Case #3");
        self.settleInMoney(notification.queryId);
      } 

      else if (self.agreement!!.type == CNO_TYPE_PUT && notification.candlestick.close <= self.strikePrice!!) {
        dump("Case #4");
        self.settleInMoney(notification.queryId);
      }

      else {
        dump("Case #5");
        self.settleOutMoney(notification.queryId);
      }

      self.expirationPrice = notification.candlestick.close;
      self.state = CNO_STATE_SETTLED;
    }
  }

  receive(request: CNOCheckTimeout) {
    nativeThrowUnless(ERR_INVALID_STATE, self.state <= CNO_STATE_INITIATED);
    nativeThrowUnless(ERR_OPTION_NOT_EXPIRED, now() > self.agreement!!.expiration + CNO_TIMEOUT);

    let ctx: Context = context();

    send(SendParameters {
      to: ctx.sender,
      value: ctx.value,
      mode: SendPayGasSeparately,
      body: (CNOTimeoutExceeded { queryId: request.queryId }).toCell()
    });

    dump("Magic 7");
    self.settleAtMoney(request.queryId);
  }

  receive(request: CNODestroy) {
    let ctx: Context = context();
    
    nativeThrowUnless(ERR_INVALID_STATE, self.state == CNO_STATE_SETTLED);

    send(SendParameters {
      to: self.session!!,
      value: SES_UNSUBSCRIBE_DEPOSIT,
      mode: SendIgnoreErrors,
      body: (SESUnsubscribe { queryId: request.queryId }).toCell(),
    });

    self.state = CNO_STATE_PENDING_UNSUBSCRIBE_STREAM;
  }

  bounced(request: SESUnsubscribe) {
    send(SendParameters {
      to: self.broker,
      value: 0,
      mode: SendRemainingBalance | SendDestroyIfZero,
      body: (CNODestroySuccess { queryId: request.queryId, optionId: self.optionId }).toCell(),
    });
  }

  receive(notification: SESUnsubscribedNotification) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.session!!);

    if (self.state < CNO_STATE_SETTLED) {
      dump("Magic 4");
      self.settleAtMoney(notification.queryId);
    }

    send(SendParameters {
      to: self.session!!,
      value: SES_DESTROY_DEPOSIT,
      mode: SendBounceIfActionFail,
      body: (SESDestroy { queryId: notification.queryId }).toCell(),
    });

    self.state = CNO_STATE_PENDING_DESTROY_SESSION;
  }

  bounced(request: SESDestroy) {
    send(SendParameters {
      to: self.broker,
      value: 0,
      mode: SendRemainingBalance | SendDestroyIfZero,
      body: (CNODestroySuccess { queryId: request.queryId, optionId: self.optionId }).toCell(),
    });
  }

  receive(response: SESDestroySuccess) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_INVALID_STATE, self.state == CNO_STATE_PENDING_DESTROY_SESSION);
    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.session!!);

    send(SendParameters {
      to: self.broker,
      value: 0,
      mode: SendIgnoreErrors | SendRemainingBalance | SendDestroyIfZero,
      body: (CNODestroySuccess { queryId: response.queryId, optionId: self.optionId }).toCell(),
    });
  }
}

const CNO_STORAGE_RESERVE: Int = ton("0.01");
const CNO_OPERATIONAL_DEPOSIT: Int = ton("1.00");

const CNO_TIMEOUT: Int = 3600;

const CNO_TYPE_CALL: Bool = true;
const CNO_TYPE_PUT: Bool = false;

struct Agreement {
  holder: Address;
  writer: Address;
  stream: Address; // In the future updates, should be substitued for underlyingAsset once the Data Streams Router is present to enable Data Stream contract upgradeability.
  initiation: Int;
  expiration: Int;
  type: Bool;
  investment: Int;
  payout: Int;
}

message CNODeploy {
  queryId: Int as uint64;
  agreement: Agreement;
}

message CNODeploySuccess {
  queryId: Int as uint64;
  optionId: Int;
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

message CNOCheckTimeout {
  queryId: Int as uint64;
}

message CNOTimeoutExceeded {
  queryId: Int as uint64;
}

message CNODestroy {
  queryId: Int as uint64;
}

message CNODestroySuccess {
  queryId: Int as uint64;
  optionId: Int;
}

