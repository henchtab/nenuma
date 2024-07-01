import "./constants";
import "./messages";

import "./broker";
import "./cash_or_nothing_option";

contract BrokerageAccount {
  override const storageReserve: Int = 10_000_000;
  brokerage: Address;
  trader: Address;

  // Constructor to initialize the contract with the brokerage and trader's addresses
  init(brokerage: Address, trader: Address) {
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


  // receive(request: BrokerageAccountDeployCashOrNothingOption) {
  //   let ctx: Context = context();

  //   nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.trader);

  //   self.forward(request.broker, (BrokerDeployCashOrNothingOption { queryId: request.queryId, draft: request.draft }).toCell(), false, null);
  // }

  // bounced(request: BrokerageAccountDeployCashOrNothingOption) {
  //   // FIXME: Provide custom message
  //   self.forward(self.trader, request.toCell(), false, null);
  // }

  // receive(response: BrokerDeployCashOrNothingOptionSuccess) {
  //   let ctx: Context = context();

  //   nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.trader);
  // }


  // // FIXME: implement something like OptionStatusUpdatedNotification
  // receive(notification: CashOrNothingOptionSettledInMoneyNotification) {
  //   // TODO:
  // }

  // receive(notification: CashOrNothingOptionSettledOutMoneyNotification) {
  //   // TODO:
  // }

  // receive(notification: CashOrNothingOptionSettledAtMoneyNotification) {
  //   // TODO:
  // }
}

// message BrokerageAccountDeployCashOrNothingOption {
//   queryId: Int as uint64;
//   broker: Address;
//   draft: CashOrNothingOptionDraftAgreement;
// }


// message BrokerageAccountDeployCashOrNothingOptionSuccess {
//   queryId: Int as uint64;
//   option: Address;
// }

// message BrokerageAccountOptionSettleOutMoneyNotification {
//   queryId: Int as uint64;
//   option: Address;
// }