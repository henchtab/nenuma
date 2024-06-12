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

  get fun storageReserve(): Int {
    return self.storageReserve;
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
}

// END Brokerage Account