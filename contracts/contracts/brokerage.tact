import "./constants";
import "./messages";

import "./broker";
import "./brokerage_account";

// struct SBInfo {
//   subscriptionsCount: Int;
// }

contract Brokerage {
  storageReserve: Int;

  owner: Address;

  // brokers: map<Address, BrokerInfo>;

  init(owner: Address) {
    self.storageReserve = BRG_STORAGE_RESERVE;
    self.owner = owner;
  }

  get fun storageReserve(): Int {
    return self.storageReserve;
  }

  get fun owner(): Address {
    return self.owner;
  }

  // get fun brokers(): map<Address, BrokerInfo> {
  //   return self.brokers;
  // }

  get fun broker(stream: Address): Address {
    let brokerStateInit: StateInit = initOf Broker(myAddress(), stream);
    let broker: Address = contractAddress(brokerStateInit);

    return broker;
  }

  get fun account(trader: Address): Address {
    let accountStateInit: StateInit = initOf BrokerageAccount(myAddress(), trader);
    let account: Address = contractAddress(accountStateInit);

    return account;
  }

  receive(request: BRGDeploy) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.owner);

    self.notify((BRGDeploySuccess { queryId: request.queryId }).toCell());
  }

  receive(request: BRGDeployBroker) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == self.owner);
    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= BRG_DEPLOY_BROKER_DEPOSIT);

    let brokerStateInit: StateInit = initOf Broker(myAddress(), request.stream);
    let broker: Address = contractAddress(brokerStateInit);

    self.forward(broker, (BRKDeploy { queryId: request.queryId }).toCell(), true, brokerStateInit);
  }

  // TODO: bounced(deploy: BRKDeploy);

  receive(response: BRKDeploySuccess) {
    let ctx: Context = context();

    let brokerStateInit: StateInit = initOf Broker(myAddress(), response.stream);
    let broker: Address = contractAddress(brokerStateInit);

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == broker);

    // self.brokers.set(broker, BrokerInfo { ... });

    self.forward(self.owner, (BRGDeployBrokerSuccess { queryId: response.queryId, broker: broker }).toCell(), false, null);
  }

  receive(request: BRGDeployAccount) {
    let ctx: Context = context();

    nativeThrowUnless(ERR_INSUFFICIENT_DEPOSIT, ctx.value >= DST_DEPLOY_BATCH_DEPOSIT);

    let accountStateInit: StateInit = initOf BrokerageAccount(myAddress(), ctx.sender);
    let account: Address = contractAddress(accountStateInit);

    self.forward(account, (BRADeploy { queryId: request.queryId }).toCell(), true, accountStateInit);
  }

  // TODO: bounced(deploy: BRADeploy);

  receive(response: BRADeploySuccess) {
    let ctx: Context = context();

    let accountStateInit: StateInit = initOf BrokerageAccount(myAddress(), response.trader);
    let account: Address = contractAddress(accountStateInit);

    nativeThrowUnless(ERR_ACCESS_DENIED, ctx.sender == account);

    self.forward(response.trader, (BRGDeployAccountSuccess { queryId: response.queryId, account: account }).toCell(), false, null);
  }
}
