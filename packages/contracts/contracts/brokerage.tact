import "./constants";
import "./messages";

import "./broker";
import "./brokerage_account";

contract Brokerage {
  override const storageReserve: Int = 10_000_000;
  owner: Address;

  // Constructor to initialize the contract with the owner's address
  init(owner: Address) {
    self.owner = owner;
  }

  // Getter function to retrieve the storage reserve
  get fun storageReserve(): Int {
    return self.storageReserve;
  }

  // Getter function to retrieve the owner's address
  get fun owner(): Address {
    return self.owner;
  }

  // Function to get the address of the broker contract associated with a given stream
  get fun broker(stream: Address): Address {
    let brokerStateInit: StateInit = initOf Broker(myAddress(), stream);
    let broker: Address = contractAddress(brokerStateInit);
    return broker;
  }

  // Function to get the address of the brokerage account contract associated with a given trader
  get fun account(trader: Address): Address {
    let accountStateInit: StateInit = initOf BrokerageAccount(myAddress(), trader);
    let account: Address = contractAddress(accountStateInit);
    return account;
  }

  // Function to handle the deployment of the brokerage contract
  receive(request: BRGDeploy) {
    let ctx: Context = context();

    // Ensure the sender is the owner of the contract
    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.owner);

    self.notify((BRGDeploySuccess { queryId: request.queryId }).toCell());
  }

  // Function to handle the deployment of a broker contract
  receive(request: BRGDeployBroker) {
    let ctx: Context = context();

    // Ensure the sender is the owner and has provided the required deposit
    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.owner);
    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= BRG_DEPLOY_BROKER_DEPOSIT);

    // Initialize and deploy the broker contract
    let brokerStateInit: StateInit = initOf Broker(myAddress(), request.stream);
    let broker: Address = contractAddress(brokerStateInit);

    self.forward(broker, (BRKDeploy { queryId: request.queryId }).toCell(), true, brokerStateInit);
  }

  // TODO: bounced(deploy: BRKDeploy);

  // Function to handle the success response of a broker deployment
  receive(response: BRKDeploySuccess) {
    let ctx: Context = context();

    let brokerStateInit: StateInit = initOf Broker(myAddress(), response.stream);
    let broker: Address = contractAddress(brokerStateInit);

    // Ensure the sender is the deployed broker contract
    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == broker);

    // Forward success notification to the owner
    self.forward(self.owner, (BRGDeployBrokerSuccess { queryId: response.queryId, broker: broker }).toCell(), false, null);
  }

  // Function to handle the deployment of a brokerage account contract
  receive(request: BRGDeployAccount) {
    let ctx: Context = context();

    // Ensure the sender has provided the required deposit
    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= DST_DEPLOY_BATCH_DEPOSIT);

    // Initialize and deploy the brokerage account contract
    let accountStateInit: StateInit = initOf BrokerageAccount(myAddress(), ctx.sender);
    let account: Address = contractAddress(accountStateInit);

    self.forward(account, (BRADeploy { queryId: request.queryId }).toCell(), true, accountStateInit);
  }

  // TODO: bounced(deploy: BRADeploy);

  // Function to handle the success response of a brokerage account deployment
  receive(response: BRADeploySuccess) {
    let ctx: Context = context();

    let accountStateInit: StateInit = initOf BrokerageAccount(myAddress(), response.trader);
    let account: Address = contractAddress(accountStateInit);

    // Ensure the sender is the deployed brokerage account contract
    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == account);

    // Forward success notification to the trader
    self.forward(response.trader, (BRGDeployAccountSuccess { queryId: response.queryId, account: account }).toCell(), false, null);
  }
}
