<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { formatOutputDate } from '$lib/utils';
  import { useBroker } from '$lib/wrappers';
  import { fromNano, toNano } from '@ton/core';
  import { toast } from 'svelte-sonner';
  import { writable } from 'svelte/store';
  import Output from '../../components/Output.svelte';
  import Section from './Section.svelte';

  const brokerAddress = writable('');
  const broker = useBroker(brokerAddress);

  let output = $state<{ date: string; message: string }[]>([]);

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

  <Output bind:output />
</Section>
