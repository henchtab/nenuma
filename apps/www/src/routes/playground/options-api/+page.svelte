<script lang="ts">
  import { Broker, Brokerage, BrokerageAccount, CashOrNothingOption } from "./components";
</script>

<svelte:head>
  <title>Options API</title>
  <meta
    name="description"
    content="Setup: Initializes with an owner and a storage reserve. Brokers and Accounts: Can deploy new brokers and brokerage accounts, each associated with specific addresses. Deposits: Ensures adequate deposits for various actions. Notifications: Sends confirmations and success messages back to the owner or relevant parties. The contract includes functions to get storage reserve, owner, and addresses for brokers and accounts, and manages deployment and communication between entities."
  />
</svelte:head>

<div>
  <div class="py-6 border-b">
    <h1 class="text-ds-gray-1000 container font-semibold text-3xl text-left">Options API</h1>
  </div>

  <Brokerage />
  <Broker />
  <BrokerageAccount />
  <CashOrNothingOption />
</div>
