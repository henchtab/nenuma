// BEGIN Broker

import "./constants";
import "./messages";

contract Broker {
  storageReserve: Int;

  brokerage: Address;
  stream: Address;

  init(brokerage: Address, stream: Address) {
    self.storageReserve = BRK_STORAGE_RESERVE;
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

    self.storageReserve = myBalance() - BRK_DEPOSIT_DEPOSIT;

    self.forward(owner, (BRKDepositSuccess { queryId: request.queryId }).toCell(), true, null);
  }

  receive(request: BRKWithdraw) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= BRK_WITHDRAW_DEPOSIT);

    let brokerageStateInit: StateInit = initOf Brokerage(ctx.sender);
    let brokerage: Address = contractAddress(brokerageStateInit);

    nativeThrowUnless(ERR_ACCESS_DENIED, brokerage == self.brokerage);

    let owner: Address = ctx.sender;

    self.storageReserve = BRK_STORAGE_RESERVE;

    self.forward(owner, (BRKWithdrawSuccess { queryId: request.queryId }).toCell(), true, null);
  }
}

// END Brokerage Account