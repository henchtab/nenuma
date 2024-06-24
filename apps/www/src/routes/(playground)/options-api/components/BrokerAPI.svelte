<script lang="ts">
  import { formatOutputDate } from '$lib/utils';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { useBroker } from '$lib/wrappers';
  import autoAnimate from '@formkit/auto-animate';
  import { fromNano, toNano } from '@ton/core';
  import { toast } from 'svelte-sonner';
  import { writable } from 'svelte/store';
  import Section from './Section.svelte';

  const brokerAddress = writable('');
  const broker = useBroker(brokerAddress);

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

  let output = $state<{ date: Date | string; message: string }[]>([]);
</script>

<Section title="Broker">
  <Label class="grid gap-2 mt-4">
    Broker Address
    <Input
      type="text"
      placeholder="0QDCiYqpPo9esMDX35_BWYcsR1NKS7lbnPcPF6IMH8MNx2Lj"
      class="w-fit"
      bind:value={$brokerAddress}
    />
  </Label>
  <p class="mt-3 mb-8 text-ds-gray-900 max-w-[640px]">
    This contract ensures secure interactions with the brokerage account by enforcing strict access
    controls and deposit/withdrawal requirements, along with notifying the relevant parties upon
    successful transactions.
  </p>
  <div class="flex gap-4 items-end overflow-x-auto">
    <Button
      class="bg-ds-pink-800 text-white hover:bg-ds-pink-700"
      onclick={async () => {
        const result = await $broker.getBalance();
        output.unshift({
          date: formatOutputDate(new Date()),
          message: JSON.stringify(`${fromNano(result)} TON`, null, 2)
        });
      }}>Get Balance</Button
    >

    <Button
      class="bg-ds-blue-800 text-white hover:bg-ds-blue-700"
      onclick={async () => {
        const result = await $broker.getBrokerage();
        output.unshift({
          date: formatOutputDate(new Date()),
          message: JSON.stringify(result.toString({ testOnly: true }), null, 2)
        });
      }}>Get Brokerage</Button
    >

    <Button
      class="bg-ds-blue-800 text-white hover:bg-ds-blue-700"
      onclick={async () => {
        const result = await $broker.getStream();
        output.unshift({
          date: formatOutputDate(new Date()),
          message: JSON.stringify(result.toString({ testOnly: true }), null, 2)
        });
      }}>Get Stream</Button
    >
  </div>
  <div>
    <h3 class="text-ds-gray-1000 font-medium text-2xl mt-6">Output</h3>
    <ul
      use:autoAnimate
      class="border-b border-t font-mono max-h-40 min-h-40 m-0 text-[13px] leading-5 break-normal mt-4 overflow-auto py-4"
    >
      {#if output.length === 0}
        <li class="h-8 text-ds-gray-900 inline-flex items-center">Logs will appear here...</li>
      {:else}
        {#each output as line (line.date)}
          <li class="inline-flex h-8 gap-3 w-full items-center">
            <span class="text-ds-green-900">{line.date}:</span>
            <div class="h-5 w-[1px] bg-ds-green-400"></div>
            <span class="text-ds-green-900">{line.message}</span>
          </li>
        {/each}
      {/if}
    </ul>

    <Button class="mt-4" variant="destructive" onclick={() => (output = [])}>Clear Output</Button>
  </div>
</Section>
