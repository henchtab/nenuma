// BEGIN Broker

import "./constants";
import "./messages";

contract Broker {
  override const storageReserve: Int = 10_000_000;

  brokerage: Address;
  stream: Address;

  init(brokerage: Address, stream: Address) {
    self.brokerage = brokerage;
    self.stream = stream;
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

  get fun brokerage(): Address {
    return self.brokerage;
  }

  get fun stream(): Address {
    return self.stream;
  }

  receive(request: BRKDeploy) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.brokerage);

    self.notify((BRKDeploySuccess { queryId: request.queryId, stream: self.stream }).toCell());
  }

  receive(request: BRKDeposit) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value > BRK_DEPOSIT_DEPOSIT);

    let brokerageStateInit: StateInit = initOf Brokerage(ctx.sender);
    let brokerage: Address = contractAddress(brokerageStateInit);

    nativeThrowUnless(ERR_ACCESS_DENIED, brokerage == self.brokerage);

    let owner: Address = ctx.sender;

    nativeReserve(ctx.value - BRK_DEPOSIT_DEPOSIT, ReserveExact | ReserveAddOriginalBalance);

    send(SendParameters {
      to: owner,
      value: 0,
      mode: SendRemainingBalance,
      body: (BRKDepositSuccess { queryId: request.queryId }).toCell()
    });
  }

  receive(request: BRKWithdraw) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= BRK_WITHDRAW_DEPOSIT);

    let brokerageStateInit: StateInit = initOf Brokerage(ctx.sender);
    let brokerage: Address = contractAddress(brokerageStateInit);

    nativeThrowUnless(ERR_ACCESS_DENIED, brokerage == self.brokerage);

    let owner: Address = ctx.sender;

    nativeReserve(BRK_STORAGE_RESERVE, ReserveExact);

    send(SendParameters {
      to: owner,
      value: 0,
      mode: SendRemainingBalance,
      body: (BRKWithdrawSuccess { queryId: request.queryId }).toCell(),
    });
  }
}

// END Brokerage Account