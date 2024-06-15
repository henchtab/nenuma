# Nenuma Contracts

## Overview
Welcome to Nenuma Contracts! We've built these contracts to help you create and trade derivatives like options and perpetual futures right on the TON blockchain. With real-time data streams, you'll have everything you need to launch your own financial products.

## Contracts

### 1. Data Stream Contract
Our Data Stream Contract gives you real-time financial data. It's managed by us and makes sure you always have the data you need on-chain when there are active subscribers.

- **Why?** To provide real-time data to other contracts.
- **How to use?** Integrate it with contracts that need real-time financial data.

### 2. Subscription Batch Contract
The Subscription Batch Contract helps you manage subscriptions efficiently, so multiple users can subscribe to data streams without any hassle.

- **Why?** To manage and scale data stream subscriptions.
- **How to use?** Handle multiple user subscriptions easily.

### 3. Session Contract
The Session Contract keeps track of individual user sessions for trading, making sure each user's actions are recorded and managed separately.

- **Why?** To track and manage user sessions.
- **How to use?** Ensure accurate session management for trading.

### 4. Brokerage Contract
The Brokerage Contract is your middleman, helping to facilitate trades and ensure secure transactions.

- **Why?** To facilitate trading activities.
- **How to use?** Securely manage trades and transactions.

### 5. Broker Contract
The Broker Contract works with the Brokerage Contract to execute trades for users, providing a seamless experience.

- **Why?** To execute trades.
- **How to use?** Work with the Brokerage Contract for trade execution.

### 6. Brokerage Account Contract
The Brokerage Account Contract handles individual user accounts, tracking balances and ensuring everything is accurate.

- **Why?** To manage user accounts.
- **How to use?** Track balances and transaction histories.

### 7. Cash-or-Nothing Option Contract
The Cash-or-Nothing Option Contract lets you trade binary options easily.

- **Why?** To enable binary options trading.
- **How to use?** Trade cash-or-nothing options on our platform.

### 8. Simple Subscriber Contract
The Simple Subscriber Contract is for managing subscriptions to data streams and handling notifications.

- **Why?** To manage subscriptions and notifications.
- **How to use?** Subscribe to data streams and handle notifications with ease.


## Deployment
We've published the Data Stream contact so that you can test it yourself. We will automatically publish BTC/USDT candlesticks when we have at least 1 subscriber  

[Testnet Deployment](https://testnet.tonviewer.com/kQDZnFY0yew3AcB0pk0H0CL5L2kclQXH0VHO_cWyfdOQ0SEp)

## Getting Started
To interact with the contracts, you can use our provided APIs and interfaces. Detailed documentation for each contract and its functions is available in the repository.

### Prerequisites
- Access to the TON Testnet.
- Familiarity with smart contract development.

### Installation
Clone the repository and install the necessary dependencies.

```bash
git clone https://github.com/dreamqip/nenuma
cd nenuma/contracts
pnpm install
```

### Deployment
Deploy the contracts to your desired network (e.g., Testnet).

```bash
pnpm start
```

### Testing
Run the test suite to ensure that everything is working correctly.

```bash
pnpm test
```

## License
This project is licensed under the MIT License. See the [LICENSE](https://github.com/dreamqip/nenuma/blob/main/LICENSE) file for details.

## Community and Support
Join our [Telegram channel](https://t.me/NenumaCommunity) for updates and support. For detailed questions and discussions, open an issue on GitHub.

## Additional Resources
- [Nenuma Interface](https://github.com/dreamqip/nenuma/tree/main/www)

