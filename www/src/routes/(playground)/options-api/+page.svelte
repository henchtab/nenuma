<script lang="ts">
  import { formatDate } from '$lib';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { createBrokerage, useBroker, useBrokerageAccount } from '$lib/wrappers';
  import { Address, fromNano, toNano } from '@ton/ton';
  import { toast } from 'svelte-sonner';
  import { writable } from 'svelte/store';

  const brokerage = createBrokerage();

  const brokerAddress = writable('');
  const broker = useBroker(brokerAddress);

  const brokerageAddress = writable('');
  const brokerageAccount = useBrokerageAccount(brokerageAddress);

  const output = $state<
    Record<
      string,
      {
        date: string;
        message: string;
      }[]
    >
  >({
    brokerage: [],
    broker: [],
    brokerageAccount: []
  });

  async function handleDeploySubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const args = {
      queryId: BigInt(formData.get('queryId') as string)
    };

    await $brokerage.deploy(args);
  }

  async function handleDeployBrokerSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const args = {
      stream: Address.parse(formData.get('stream') as string),
      queryId: BigInt(formData.get('queryId') as string)
    };

    await $brokerage.deployBroker(args);
  }

  async function handleDeployAccountSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const args = {
      queryId: BigInt(formData.get('queryId') as string)
    };

    await $brokerage.deployAccount(args);
  }

  async function handleGetBrokerSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const stream = formData.get('stream') as string;

    const result = await $brokerage.getBroker(Address.parse(stream));
    output.brokerage.unshift({
      date: formatDate(new Date()),
      message: JSON.stringify(result.toString({ testOnly: true, bounceable: false }), null, 2)
    });
  }

  const handleGetAccountSubmit = async (
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const trader = formData.get('trader') as string;

    const result = await $brokerage.getAccount(Address.parse(trader));
    output.brokerage.unshift({
      date: formatDate(new Date()),
      message: JSON.stringify(result.toString({ testOnly: true, bounceable: false }), null, 2)
    });
  };

  async function handleDepositSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    try {
      const deposit = formData.get('deposit') as string;
      // If there's a decimal point, convert to nano
      const args = {
        deposit: toNano(deposit),
        queryId: BigInt(formData.get('queryId') as string)
      };

      await $broker.deposit(args);
    } catch (error) {
      toast.error('Deposit failed. Try again');
      console.log(error);
    }
  }

  async function handleWithdrawSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const args = {
      queryId: BigInt(formData.get('queryId') as string)
    };

    await $broker.withdraw(args);
  }
</script>

<svelte:head>
  <title>Options API</title>
  <meta
    name="description"
    content="Setup: Initializes with an owner and a storage reserve. Brokers and Accounts: Can deploy new brokers and brokerage accounts, each associated with specific addresses. Deposits: Ensures adequate deposits for various actions. Notifications: Sends confirmations and success messages back to the owner or relevant parties. The contract includes functions to get storage reserve, owner, and addresses for brokers and accounts, and manages deployment and communication between entities."
  />
</svelte:head>

<div class="container py-8">
  <h2 class="text-ds-gray-1000 font-semibold text-5xl text-left pb-16 border-b mb-16">
    Options API
  </h2>

  <div class="pb-12 mt-12 border-b">
    <h3 class="text-ds-gray-1000 font-medium text-3xl mb-4">Brokerage</h3>
    <p class="mt-3 text-lg mb-8 text-ds-gray-900 max-w-[640px]">
      Setup: Initializes with an owner and a storage reserve. Brokers and Accounts: Can deploy new
      brokers and brokerage accounts, each associated with specific addresses. Deposits: Ensures
      adequate deposits for various actions. Notifications: Sends confirmations and success messages
      back to the owner or relevant parties. The contract includes functions to get storage reserve,
      owner, and addresses for brokers and accounts, and manages deployment and communication
      between entities.
    </p>
    <div class="flex gap-4 items-end overflow-x-auto">
      <form class="flex flex-col gap-4 min-w-max" onsubmit={handleDeploySubmit}>
        <Label class="flex flex-col gap-2"
          >Query ID
          <Input type="number" name="queryId" placeholder="777" required min="0" />
        </Label>
        <Button class="bg-ds-green-800 text-white hover:bg-ds-green-700" type="submit"
          >Deploy Brokerage</Button
        >
      </form>

      <form class="flex flex-col gap-4 w-max" onsubmit={handleDeployBrokerSubmit}>
        <Label class="flex flex-col gap-2"
          >Stream Address
          <Input
            type="text"
            name="stream"
            placeholder="0QAXeOTnpkBx_A6zKVxAYNDYqNuWPyrZkYZySJRZ_-zV4gLV"
            required
            min="0"
          />
        </Label>
        <Label class="flex flex-col gap-2"
          >Query ID
          <Input type="number" name="queryId" placeholder="777" required min="0" />
        </Label>
        <Button class="bg-ds-green-800 text-white hover:bg-ds-green-700" type="submit"
          >Deploy Broker</Button
        >
      </form>

      <form class="flex flex-col gap-4 w-max" onsubmit={handleDeployAccountSubmit}>
        <Label class="flex flex-col gap-2"
          >Query ID
          <Input type="number" name="queryId" placeholder="777" required min="0" />
        </Label>
        <Button class="bg-ds-green-800 text-white hover:bg-ds-green-700" type="submit"
          >Deploy Account</Button
        >
      </form>

      <Button
        class="bg-ds-blue-800 text-white hover:bg-ds-blue-700"
        onclick={async () => {
          const result = await $brokerage.getOwner();
          output.brokerage.unshift({
            date: formatDate(new Date()),
            message: JSON.stringify(result.toString({ testOnly: true, bounceable: false }), null, 2)
          });
        }}>Get Owner</Button
      >

      <form class="flex flex-col gap-4 w-max" onsubmit={handleGetBrokerSubmit}>
        <Label class="flex flex-col gap-2"
          >Stream Address
          <Input
            type="text"
            name="stream"
            placeholder="0QAXeOTnpkBx_A6zKVxAYNDYqNuWPyrZkYZySJRZ_-zV4gLV"
            required
            min="0"
          />
        </Label>
        <Button class="bg-ds-blue-800 text-white hover:bg-ds-blue-700" type="submit"
          >Get Broker</Button
        >
      </form>

      <form class="flex flex-col gap-4 w-max" onsubmit={handleGetAccountSubmit}>
        <Label class="flex flex-col gap-2"
          >Trader
          <Input
            type="text"
            name="trader"
            placeholder="0QAXeOTnpkBx_A6zKVxAYNDYqNuWPyrZkYZySJRZ_-zV4gLV"
            required
            min="0"
          />
        </Label>
        <Button class="bg-ds-blue-800 text-white hover:bg-ds-blue-700" type="submit"
          >Get Account</Button
        >
      </form>

      <Button
        class="bg-ds-blue-800 text-white hover:bg-ds-blue-700"
        onclick={async () => {
          const result = await $brokerage.getStorageReserve();
          output.brokerage.unshift({
            date: formatDate(new Date()),
            message: JSON.stringify(`${fromNano(result)} TON`, null, 2)
          });
        }}>Get Storage Reserve</Button
      >
    </div>
    <div>
      <h3 class="text-ds-gray-1000 font-medium text-2xl mt-6">Output</h3>
      <ul
        class="border-b border-t font-mono max-h-40 min-h-40 m-0 text-[13px] leading-5 break-normal mt-4 overflow-auto py-4"
      >
        {#if output.brokerage.length === 0}
          <li class="h-8 text-ds-gray-900 inline-flex items-center">Logs will appear here...</li>
        {:else}
          {#each output.brokerage as line (line.date)}
            <li class="inline-flex h-8 gap-3 w-full items-center">
              <span class="text-ds-green-900">{line.date}:</span>
              <div class="h-5 w-[1px] bg-ds-green-400"></div>
              <span class="text-ds-green-900">{line.message}</span>
            </li>
          {/each}
        {/if}
      </ul>

      <Button class="mt-4" variant="destructive" onclick={() => (output.brokerage = [])}
        >Clear Output</Button
      >
    </div>
  </div>

  <div class="pb-12 mt-12 border-b">
    <h3 class="text-ds-gray-1000 font-medium text-3xl mb-4">Broker</h3>
    <Label class="grid gap-2">
      Broker Address
      <Input
        type="text"
        placeholder="0QDCiYqpPo9esMDX35_BWYcsR1NKS7lbnPcPF6IMH8MNx2Lj"
        class="w-fit"
        bind:value={$brokerAddress}
      />
    </Label>
    <p class="mt-3 text-lg mb-8 text-ds-gray-900 max-w-[640px]">
      This contract ensures secure interactions with the brokerage account by enforcing strict
      access controls and deposit/withdrawal requirements, along with notifying the relevant parties
      upon successful transactions.
    </p>
    <div class="flex gap-4 items-end overflow-x-auto">
      <Button
        class="bg-ds-pink-800 text-white hover:bg-ds-pink-700"
        onclick={async () => {
          const result = await $broker.getBalance();
          output.broker.unshift({
            date: formatDate(new Date()),
            message: JSON.stringify(`${fromNano(result)} TON`, null, 2)
          });
        }}>Get Balance</Button
      >

      <Button
        class="bg-ds-blue-800 text-white hover:bg-ds-blue-700"
        onclick={async () => {
          const result = await $broker.getBrokerage();
          output.broker.unshift({
            date: formatDate(new Date()),
            message: JSON.stringify(result.toString({ testOnly: true }), null, 2)
          });
        }}>Get Brokerage</Button
      >

      <Button
        class="bg-ds-blue-800 text-white hover:bg-ds-blue-700"
        onclick={async () => {
          const result = await $broker.getStream();
          output.broker.unshift({
            date: formatDate(new Date()),
            message: JSON.stringify(result.toString({ testOnly: true }), null, 2)
          });
        }}>Get Stream</Button
      >
    </div>
    <div>
      <h3 class="text-ds-gray-1000 font-medium text-2xl mt-6">Output</h3>
      <ul
        class="border-b border-t font-mono max-h-40 min-h-40 m-0 text-[13px] leading-5 break-normal mt-4 overflow-auto py-4"
      >
        {#if output.broker.length === 0}
          <li class="h-8 text-ds-gray-900 inline-flex items-center">Logs will appear here...</li>
        {:else}
          {#each output.broker as line (line.date)}
            <li class="inline-flex h-8 gap-3 w-full items-center">
              <span class="text-ds-green-900">{line.date}:</span>
              <div class="h-5 w-[1px] bg-ds-green-400"></div>
              <span class="text-ds-green-900">{line.message}</span>
            </li>
          {/each}
        {/if}
      </ul>

      <Button class="mt-4" variant="destructive" onclick={() => (output.broker = [])}
        >Clear Output</Button
      >
    </div>
  </div>

  <div class="pb-12 mt-12 border-b">
    <h3 class="text-ds-gray-1000 font-medium text-3xl mb-4">Brokerage Account</h3>
    <Label class="grid gap-2">
      Brokerage Address
      <Input
        type="text"
        placeholder="0QDCiYqpPo9esMDX35_BWYcsR1NKS7lbnPcPF6IMH8MNx2Lj"
        class="w-fit"
        bind:value={$brokerageAddress}
      />
    </Label>
    <p class="mt-3 text-lg mb-8 text-ds-gray-900 max-w-[640px]">
      The Brokerage Account contract initializes with a brokerage address, a trader address, and a
      storage reserve. It includes getter functions to retrieve the storage reserve, brokerage
      address, and trader address. The contract can receive deployment requests (BRADeploy) and
      ensures that these requests are only accepted from the designated brokerage address. Upon
      successful validation of a deployment request, it sends a BRADeploySuccess notification back
      to the requester with the trader address.
    </p>
    <div class="flex gap-4 items-end overflow-x-auto">
      <Button
        class="bg-ds-purple-800 text-white hover:bg-ds-purple-700"
        onclick={async () => {
          const result = await $brokerageAccount.getBrokerage();
          output.brokerageAccount.unshift({
            date: formatDate(new Date()),
            message: JSON.stringify(result.toString({ testOnly: true }), null, 2)
          });
        }}>Get Brokerage</Button
      >

      <Button
        class="bg-ds-purple-800 text-white hover:bg-ds-purple-700"
        onclick={async () => {
          const result = await $brokerageAccount.getTrader();

          output.brokerageAccount.unshift({
            date: formatDate(new Date()),
            message: JSON.stringify(result.toString({ testOnly: true }), null, 2)
          });
        }}>Get Trader</Button
      >

      <Button
        class="bg-ds-purple-800 text-white hover:bg-ds-purple-700"
        onclick={async () => {
          const result = await $brokerageAccount.getStorageReserve();

          output.brokerageAccount.unshift({
            date: formatDate(new Date()),
            message: JSON.stringify(`${fromNano(result)} TON`, null, 2)
          });
        }}>Get Storage Reserve</Button
      >
    </div>
    <div>
      <h3 class="text-ds-gray-1000 font-medium text-2xl mt-6">Output</h3>
      <ul
        class="border-b border-t font-mono max-h-40 min-h-40 m-0 text-[13px] leading-5 break-normal mt-4 overflow-auto py-4"
      >
        {#if output.brokerageAccount.length === 0}
          <li class="h-8 text-ds-gray-900 inline-flex items-center">Logs will appear here...</li>
        {:else}
          {#each output.brokerageAccount as line (line.date)}
            <li class="inline-flex h-8 gap-3 w-full items-center">
              <span class="text-ds-green-900">{line.date}:</span>
              <div class="h-5 w-[1px] bg-ds-green-400"></div>
              <span class="text-ds-green-900">{line.message}</span>
            </li>
          {/each}
        {/if}
      </ul>

      <Button class="mt-4" variant="destructive" onclick={() => (output.brokerageAccount = [])}
        >Clear Output</Button
      >
    </div>
  </div>
</div>
