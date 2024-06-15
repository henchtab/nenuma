# Nenuma Contracts

## Overview
Nenuma Contracts are designed to facilitate the creation and trading of derivatives such as options and perpetual futures on the TON blockchain. These contracts utilize data streams and provide a framework for developers to launch their own financial products.

## Contracts

### 1. Data Stream Contract
The Data Stream Contract provides real-time financial data to other contracts. It is managed by our publisher and ensures that data is available on-chain when there are active subscribers.

- **Purpose:** Supply real-time data to other contracts.
- **Usage:** Integrate with other contracts needing real-time financial data.

### 2. Subscription Batch Contract
The Subscription Batch Contract allows for scalable subscription management, enabling multiple users to subscribe to data streams efficiently.

- **Purpose:** Manage and scale data stream subscriptions.
- **Usage:** Handle subscriptions for multiple users.

### 3. Session Contract
The Session Contract manages individual user sessions for trading activities, ensuring that each user's actions are recorded and managed independently.

- **Purpose:** Track and manage user sessions.
- **Usage:** Ensure accurate session management for trading activities.

### 4. Brokerage Contract
The Brokerage Contract acts as an intermediary between users and the market, facilitating trades and ensuring secure transactions.

- **Purpose:** Facilitate trading activities.
- **Usage:** Securely manage trades and transactions.

### 5. Broker Contract
The Broker Contract works with the Brokerage Contract to execute trades on behalf of users, providing a seamless trading experience.

- **Purpose:** Execute trades.
- **Usage:** Work with the Brokerage Contract for trade execution.

### 6. Brokerage Account Contract
The Brokerage Account Contract manages individual user accounts, tracking balances, and ensuring accurate record-keeping.

- **Purpose:** Manage user accounts.
- **Usage:** Track balances and transaction histories.

### 7. Cash-or-Nothing Option Contract
The Cash-or-Nothing Option Contract allows users to trade binary options, providing a straightforward and accessible way to engage in options trading.

- **Purpose:** Enable binary options trading.
- **Usage:** Provide a platform for trading cash-or-nothing options.

### 8. Simple Subscriber Contract
The Simple Subscriber Contract manages subscriptions to data streams and handles various operational tasks such as session management and notification handling.

- **Purpose:** Manage subscriptions and notifications.
- **Usage:** Provide a structure for subscribing to data streams and handling notifications.

## Deployment
The contracts are deployed on the TON Testnet and can be accessed via the following link:

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

## Contributing
We welcome contributions from the community. Please read our [contributing guidelines](CONTRIBUTING.md) for more information.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Community and Support
Join our [Telegram channel](https://t.me/NenumaCommunity) for updates and support. For detailed questions and discussions, open an issue on GitHub.

## Additional Resources
- [Nenuma Interface](https://github.com/dreamqip/nenuma-interface)
- [Nenuma Documentation](https://nenuma.telegram-mini-apps.manuvantara.com/docs)
```

Feel free to customize this README to better fit your project's specifics and any additional information you'd like to include.
