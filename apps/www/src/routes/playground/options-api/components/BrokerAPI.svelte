<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { formatOutputDate } from '$lib/utils';
  import { useBroker } from '$lib/wrappers';
  import { fromNano, toNano } from '@ton/core';
  import { toast } from 'svelte-sonner';
  import { derived, writable } from 'svelte/store';
  import Output from '../../components/Output.svelte';
  import Section from './Section.svelte';

  const brokerAddress = writable('');
  const broker = useBroker(brokerAddress);

  const shouldDisableActions = derived([brokerAddress], ([$brokerAddress]) => !$brokerAddress);

  let output = $state<{ date: string; message: string }[]>([]);

  async function handleOptionAddressSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const optionId = BigInt(formData.get('optionId') as string);

    await $broker.getOptionAddress(optionId);
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
    Handles brokers and cash-or-nothing options. Sets up options, checks agreements, and ensures
    enough deposit. Manages deposits and withdrawals, handles deployments, payouts, and
    notifications for options settling in, out, or at the money. Keeps track of balances and sends
    success messages to the right folks.
  </p>
  <div class="flex gap-4 items-end overflow-x-auto snap-x snap-mandatory pb-6">
    <a
      class="snap-start"
      href={$shouldDisableActions
        ? undefined
        : `/playground/options-api/deploy?contract=brokerDeposit&title=${encodeURIComponent('Deposit Broker')}&forceTitle=true&broker=${$brokerAddress}`}
    >
      <Button
        class="bg-ds-teal-800 hover:bg-ds-teal-700 text-white"
        disabled={$shouldDisableActions}>Deposit</Button
      >
    </a>

    <Button
      class="snap-start bg-ds-teal-800 hover:bg-ds-teal-700 text-white"
      disabled={$shouldDisableActions}
      onclick={async () => await $broker.withdraw({ queryId: BigInt(Date.now()) })}
    >
      Withdraw
    </Button>

    <a
      class="snap-start"
      href={$shouldDisableActions
        ? undefined
        : `/playground/options-api/deploy?contract=brokerOption&title=${encodeURIComponent('Cash-or-Nothing Option')}&broker=${$brokerAddress}`}
    >
      <Button
        class="bg-ds-teal-800 hover:bg-ds-teal-700 text-white"
        disabled={$shouldDisableActions}>Deploy Option</Button
      >
    </a>

    <Button
      class="bg-ds-blue-800 text-white hover:bg-ds-blue-700 snap-start"
      disabled={$shouldDisableActions}
      onclick={async () => {
        const result = await $broker.getBalance();
        output.unshift({
          date: formatOutputDate(new Date()),
          message: JSON.stringify(`${fromNano(result)} TON`, null, 2)
        });
      }}>Get Balance</Button
    >

    <form class="flex flex-col gap-4 w-max snap-start" onsubmit={handleOptionAddressSubmit}>
      <div class="grid gap-2">
        <Label for="optionId">Option ID</Label>
        <Input type="number" id="optionId" placeholder="777" required min="0" />
      </div>

      <Button
        type="submit"
        disabled={$shouldDisableActions}
        class="bg-ds-blue-800 text-white hover:bg-ds-blue-700">Get Option Address</Button
      >
    </form>

    <Button
      class="bg-ds-blue-800 snap-start text-white hover:bg-ds-blue-700"
      disabled={$shouldDisableActions}
      onclick={async () => {
        const result = await $broker.getNextOptionId();
        output.unshift({
          date: formatOutputDate(new Date()),
          message: JSON.stringify(result.toString(), null, 2)
        });
      }}>Get New Option ID</Button
    >

    <Button
      class="bg-ds-blue-800 snap-start text-white hover:bg-ds-blue-700"
      disabled={$shouldDisableActions}
      onclick={async () => {
        const result = await $broker.getStream();
        output.unshift({
          date: formatOutputDate(new Date()),
          message: JSON.stringify(result.toString({ testOnly: true }), null, 2)
        });
      }}>Get Stream</Button
    >

    <Button
      class="bg-ds-blue-800 snap-start text-white hover:bg-ds-blue-700"
      disabled={$shouldDisableActions}
      onclick={async () => {
        const result = await $broker.getPayout();
        output.unshift({
          date: formatOutputDate(new Date()),
          message: JSON.stringify(
            {
              nominator: result.nominator.toString(),
              denominator: result.denominator.toString()
            },
            null,
            2
          )
        });
      }}>Get Payout Coefficient</Button
    >
  </div>

  <Output bind:output />
</Section>
