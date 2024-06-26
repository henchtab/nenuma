<script lang="ts">
  import { formatOutputDate } from '$lib/utils';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { createBrokerage } from '$lib/wrappers';
  import autoAnimate from '@formkit/auto-animate';
  import { Address, fromNano } from '@ton/core';
  import Section from './Section.svelte';
    import Output from '../../components/Output.svelte';

  const brokerage = createBrokerage();

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

  let output = $state<{ date: Date | string; message: string }[]>([]);
</script>

<Section title="Brokerage">
  <p class="mb-8 mt-4 text-ds-gray-900 max-w-[640px]">
    Setup: Initializes with an owner and a storage reserve. Brokers and Accounts: Can deploy new
    brokers and brokerage accounts, each associated with specific addresses. Deposits: Ensures
    adequate deposits for various actions. Notifications: Sends confirmations and success messages
    back to the owner or relevant parties. The contract includes functions to get storage reserve,
    owner, and addresses for brokers and accounts, and manages deployment and communication between
    entities.
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
        output.unshift({
          date: formatOutputDate(new Date()),
          message: JSON.stringify(result.toString({ testOnly: true, bounceable: false }), null, 2)
        });
      }}>Get Owner</Button
    >

    <!-- <form class="flex flex-col gap-4 w-max" onsubmit={handleGetBrokerSubmit}>
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
      </form> -->

    <!-- <form class="flex flex-col gap-4 w-max" onsubmit={handleGetAccountSubmit}>
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
      </form> -->

    <Button
      class="bg-ds-blue-800 text-white hover:bg-ds-blue-700"
      onclick={async () => {
        const result = await $brokerage.getStorageReserve();
        output.unshift({
          date: formatOutputDate(new Date()),
          message: JSON.stringify(`${fromNano(result)} TON`, null, 2)
        });
      }}>Get Storage Reserve</Button
    >
  </div>
  
  <Output bind:output />
</Section>
