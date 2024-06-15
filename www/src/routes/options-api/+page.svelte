<script lang="ts">
  import { formatDate } from '$lib';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { createBrokerage } from '$lib/wrappers';
  import { Address, fromNano } from '@ton/ton';

  const brokerage = createBrokerage();

  const output = $state<
    Record<
      string,
      {
        date: string;
        message: string;
      }[]
    >
  >({
    brokerage: []
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
</script>

<div class="container py-8">
  <h2 class="text-ds-gray-1000 font-semibold text-5xl text-left pb-16 border-b mb-16">
    Options API
  </h2>

  <div class="pb-12 mt-12 border-b">
    <h3 class="text-ds-gray-1000 font-medium text-3xl mb-4">Brokerage</h3>
    <p class="mt-3 text-lg mb-8 text-ds-gray-900 max-w-[640px]">
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet similique necessitatibus
      neque in mollitia, placeat porro voluptatibus illum deserunt nihil fugit obcaecati optio vero,
      consectetur tempora autem temporibus fugiat rem.
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
</div>
