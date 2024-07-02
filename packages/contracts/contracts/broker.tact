// BEGIN Broker

import "./constants";
import "./messages";

// import "./brokerage";
import "./cash_or_nothing_option";

struct Fraction {
  nominator: Int;
  denominator: Int;
}

struct CashOrNothingOptionDraftAgreement {
  holder: Address;
  initiation: Int;
  expiration: Int; 
  optionType: Bool;
  investment: Int;
}

message BrokerDeployOption {
  queryId: Int as uint64;
  draft: CashOrNothingOptionDraftAgreement;
}

message BrokerDeployOptionSuccess {
  queryId: Int as uint64;
  stream: Address;
  option: Address;
}

const BROKER_DEPLOY_OPTION_DEPOSIT: Int = ton("0.1");
const BROKER_MINIMUM_OPTION_INVESTMENT: Int = ton("1"); // FIXME:
const CASH_OR_NOTHING_OPTION_DEPLOY_DEPOSIT: Int = ton("0.75");

contract Broker {
  override const storageReserve: Int = 10_000_000;

  owner: Address;
  stream: Address;
  payout: Fraction;
  payoutRatio: Fraction;
  nextOptionId: Int;

  init(owner: Address, stream: Address) {
    self.owner = owner;
    self.stream = stream;
    self.payout = Fraction { nominator: 74, denominator: 100 };
    self.payoutRatio = Fraction { nominator: 1, denominator: 10 };
    self.nextOptionId = 0;
  }

  get fun balance(): Int {
    return myBalance();
  }

  get fun storageReserve(): Int {
    return BRK_STORAGE_RESERVE;
  }

  get fun depositDeposit(): Int {
    return BRK_DEPOSIT_DEPOSIT;
  }

  get fun owner(): Address {
    return self.owner;
  }

  get fun stream(): Address {
    return self.stream;
  }

  get fun payout(): Fraction {
    return self.payout;
  }

  get fun nextOptionId(): Int {
    return self.nextOptionId;
  }

  get fun optionAddress(optionId: Int): Address {
    let optionStateInit: StateInit = initOf CashOrNothingOption(myAddress(), optionId);
    let option: Address = contractAddress(optionStateInit);

    return option;
  }

  receive(request: BRKDeploy) {
    dump("BRKDeploy");

    let ctx: Context = context();

    // nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.owner);

    self.notify((BRKDeploySuccess { queryId: request.queryId, stream: self.stream }).toCell());
  }

  receive(request: BRKDeposit) {
    dump("BRKDeposit");

    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.owner);
    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value > BRK_DEPOSIT_DEPOSIT);

    // let brokerageStateInit: StateInit = initOf Brokerage(ctx.sender);
    // let owner: Address = contractAddress(brokerageStateInit);

    // nativeThrowUnless(ERR_ACCESS_DENIED, owner == self.owner);

    // let owner: Address = ctx.sender;

    nativeReserve(ctx.value - BRK_DEPOSIT_DEPOSIT, ReserveExact | ReserveAddOriginalBalance);

    send(SendParameters {
      to: self.owner,
      value: 0,
      mode: SendRemainingBalance,
      body: (BRKDepositSuccess { queryId: request.queryId }).toCell()
    });
  }

  receive(request: BRKWithdraw) {
    dump("BRKWithdraw");

    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.owner);
    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= BRK_WITHDRAW_DEPOSIT);

    // let brokerageStateInit: StateInit = initOf Brokerage(ctx.sender);
    // let owner: Address = contractAddress(brokerageStateInit);

    // nativeThrowUnless(ERR_ACCESS_DENIED, owner == self.owner);

    // let owner: Address = ctx.sender;

    nativeReserve(BRK_STORAGE_RESERVE, ReserveExact);

    send(SendParameters {
      to: self.owner,
      value: 0,
      mode: SendRemainingBalance,
      body: (BRKWithdrawSuccess { queryId: request.queryId }).toCell(),
    });
  }

  fun validateDraftAgreement(draft: CashOrNothingOptionDraftAgreement) {
    nativeThrowUnless(600, draft.initiation % 60 == 0);
    nativeThrowUnless(601, draft.initiation >= now());
    nativeThrowUnless(602, draft.initiation <= now() + 300);

    nativeThrowUnless(603, draft.expiration % 60 == 0);
    nativeThrowUnless(604, draft.expiration >= draft.initiation + 60);
    nativeThrowUnless(605, draft.expiration <= draft.initiation + 300);

    nativeThrowUnless(606, draft.investment >= BROKER_MINIMUM_OPTION_INVESTMENT);
  }

  receive(request: BrokerDeployOption) {
    dump("BrokerDeployOption");

    let ctx: Context = context();

    self.validateDraftAgreement(request.draft);

    let notificationsCount: Int = (request.draft.expiration - now()) / 60 + 1;

    dump("888");
    dump(BROKER_DEPLOY_OPTION_DEPOSIT + CASH_OR_NOTHING_OPTION_DEPLOY_DEPOSIT + request.draft.investment + SUBSCRIBER_STORAGE_RESERVE + SUBSCRIBER_OPERATIONAL_RESERVE + (NOTIFICATION_DEPOSIT + NOTIFICATION_PREMIUM) * notificationsCount);

    nativeThrowUnless(607, ctx.value >= BROKER_DEPLOY_OPTION_DEPOSIT + CASH_OR_NOTHING_OPTION_DEPLOY_DEPOSIT + request.draft.investment + SUBSCRIBER_STORAGE_RESERVE + SUBSCRIBER_OPERATIONAL_RESERVE + (NOTIFICATION_DEPOSIT + NOTIFICATION_PREMIUM) * notificationsCount);

    let payout: Int = (request.draft.investment * self.payout.nominator) / self.payout.denominator;

    nativeThrowUnless(608, payout <= ((myBalance() - BRK_STORAGE_RESERVE) * self.payoutRatio.nominator) / self.payoutRatio.denominator);

    dump("OK2");

    let optionStateInit: StateInit = initOf CashOrNothingOption(myAddress(), self.nextOptionId);

    dump("self.nextOptionId");
    dump(self.nextOptionId);

    let option: Address = contractAddress(optionStateInit);

    dump("option");
    dump(option);

    let agreement: CashOrNothingOptionAgreement = CashOrNothingOptionAgreement {
      holder: request.draft.holder,
      writer: myAddress(),
      initiation: request.draft.initiation,
      expiration: request.draft.expiration,
      optionType: request.draft.optionType,
      investment: request.draft.investment,
      payout: payout,
    };

    send(SendParameters {
      to: option,
      value: CASH_OR_NOTHING_OPTION_DEPLOY_DEPOSIT + agreement.investment + payout + SUBSCRIBER_STORAGE_RESERVE + SUBSCRIBER_OPERATIONAL_RESERVE + (NOTIFICATION_DEPOSIT + NOTIFICATION_PREMIUM) * notificationsCount,
      mode: SendBounceIfActionFail,
      body: (CashOrNothingOptionDeploy { queryId: request.queryId, stream: self.stream, agreement }).toCell(),
      data: optionStateInit.data,
      code: optionStateInit.code,
    });

    nativeReserve(payout, ReserveExact | ReserveInvertSign | ReserveAddOriginalBalance);

    self.nextOptionId += 1;

    send(SendParameters {
      to: ctx.sender,
      value: 0,
      mode: SendRemainingBalance,
      body: "Refund".asComment(),
    });
  }

  receive(response: CashOrNothingOptionDeploySuccess) {
    let ctx: Context = context();

    let optionStateInit: StateInit = initOf CashOrNothingOption(myAddress(), response.optionId);
    let option: Address = contractAddress(optionStateInit);

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == option);

    send(SendParameters {
      to: response.holder,
      value: 0,
      mode: SendRemainingValue,
      body: (BrokerDeployOptionSuccess { queryId: response.queryId, stream: self.stream, option: ctx.sender }).toCell(),
    });
  }

  receive(notification: CashOrNothingOptionSettledInMoneyNotification) {
    dump("CashOrNothingOptionSettledInMoney");
  }

  receive(notification: CashOrNothingOptionSettledOutMoneyNotification) {
    dump("CashOrNothingOptionSettledOutMoney");
  }

  receive(notification: CashOrNothingOptionSettledAtMoneyNotification) {
    dump("CashOrNothingOptionSettledAtMoney");
  }

  receive(notification: SubscriberDestroyedNotification) {
    dump("SubscriberDestroyedNotification");
  }
}