import "./constants";
import "./messages";

contract BrokerageAccount {
  storageReserve: Int;
  brokerage: Address;
  trader: Address;

  // Constructor to initialize the contract with the brokerage and trader's addresses
  init(brokerage: Address, trader: Address) {
    self.storageReserve = BRA_STORAGE_RESERVE;
    self.brokerage = brokerage;
    self.trader = trader;
  }

  // Getter function to retrieve the storage reserve
  get fun storageReserve(): Int {
    return self.storageReserve;
  }

  // Getter function to retrieve the brokerage's address
  get fun brokerage(): Address {
    return self.brokerage;
  }

  // Getter function to retrieve the trader's address
  get fun trader(): Address {
    return self.trader;
  }

  // Function to handle the deployment of the brokerage account contract
  receive(request: BRADeploy) {
    let ctx: Context = context();

    // Ensure the sender is the brokerage contract
    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.brokerage);

    // Notify success of the deployment
    self.notify((BRADeploySuccess { queryId: request.queryId, trader: self.trader }).toCell());
  }
}
