// BEGIN Brokerage Account

import "./constants";
import "./messages";

contract BrokerageAccount {
  storageReserve: Int;

  brokerage: Address;
  trader: Address;

  init(brokerage: Address, trader: Address) {
    self.storageReserve = BRA_STORAGE_RESERVE;
    self.brokerage = brokerage;
    self.trader = trader;
  }

  get fun storageReserve(): Int {
    return self.storageReserve;
  }

  get fun brokerage(): Address {
    return self.brokerage;
  }

  get fun trader(): Address {
    return self.trader;
  }

  receive(request: BRADeploy) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.brokerage);

    self.notify((BRADeploySuccess { queryId: request.queryId, trader: self.trader }).toCell());
  }
}

// END Brokerage Account