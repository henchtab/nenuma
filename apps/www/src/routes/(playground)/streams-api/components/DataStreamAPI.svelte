<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { formatOutputDate } from '$lib/utils';
  import { createDataStream } from '$lib/wrappers';
  import { Address, fromNano } from '@ton/core';
  import { toast } from 'svelte-sonner';
  import { derived, writable } from 'svelte/store';
  import Output from '../../components/Output.svelte';
  import Section from './Section.svelte';

  const streamAddress = writable('');
  const stream = createDataStream(streamAddress);

  const shouldDisableActions = derived([streamAddress], ([$streamAddress]) => !$streamAddress);

  let output = $state<{ date: string; message: string }[]>([]);

  async function handleSessionAddressSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const subscriberAddress = formData.get('subscriberAddress') as string;

    const result = await $stream.getSessionAddress(Address.parse(subscriberAddress));
    output.unshift({
      date: formatOutputDate(new Date()),
      message: JSON.stringify(result.toString({ testOnly: true, bounceable: false }), null, 2)
    });
  }

  async function handleBatchAddressSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const batchId = formData.get('batchId') as string;

    const result = await $stream.getBatchAddress(BigInt(batchId));
    output.unshift({
      date: formatOutputDate(new Date()),
      message: JSON.stringify(result.toString({ testOnly: true, bounceable: false }), null, 2)
    });
  }
</script>

<Section title="Data Stream">
  <Label class="grid gap-2 mt-4">
    Stream Address
    <Input
      type="text"
      placeholder="0QDCiYqpPo9esMDX35_BWYcsR1NKS7lbnPcPF6IMH8MNx2Lj"
      class="w-fit"
      bind:value={$streamAddress}
    />
  </Label>
  <p class="mt-3 mb-8 text-ds-gray-900 max-w-[768px]">
    The Data Stream smart contract makes it easy to securely stream data and manage subscriptions on
    the blockchain. Publishers can deploy data batches, handle sessions, and manage subscriptions
    effortlessly. It ensures safe handling of deposits and notifications, offering a solid framework
    for real-time data interaction. Key features include verifying publishers, creating batches,
    deploying sessions, and automating notifications.
    <br />
    <br />
    For more details, check out the
    <a
      class="underline"
      href="https://github.com/dreamqip/nenuma/blob/main/contracts/contracts/data_stream.tact"
      target="_blank">contract code</a
    > and its features here.
  </p>
  <div
    class="flex gap-4 pb-6 items-end overflow-x-auto snap-x snap-mandatory [-webkit-overflow-scrolling:_touch] scroll-smooth"
  >
    <a
      class="snap-start cursor-pointer"
      href={`/streams-api/deploy?contract=stream&title=${encodeURIComponent('Data Stream')}&subtitle=stream`}
    >
      <Button class="bg-ds-teal-800 hover:bg-ds-teal-700 text-white">Deploy Stream</Button>
    </a>

    <a
      class="snap-start cursor-pointer"
      href={$shouldDisableActions
        ? undefined
        : `/streams-api/deploy?contract=batch&title=${encodeURIComponent('Subscription Batch')}&subtitle=batch&streamAddress=${$streamAddress}`}
    >
      <Button
        disabled={$shouldDisableActions}
        class="bg-ds-teal-800 hover:bg-ds-teal-700 text-white">Deploy Batch</Button
      >
    </a>

    <a
      class="snap-start cursor-pointer"
      href={`/streams-api/deploy?contract=session&title=${encodeURIComponent('Session')}&subtitle=session&streamAddress=${$streamAddress}`}
    >
      <Button
        disabled={$shouldDisableActions}
        class="bg-ds-teal-800 hover:bg-ds-teal-700 text-white">Deploy Session</Button
      >
    </a>

    <a
      class="snap-start cursor-pointer"
      href={`/streams-api/deploy?contract=candlestick&title=${encodeURIComponent('Candlestick')}&subtitle=candlestick&streamAddress=${$streamAddress}`}
    >
      <Button
        disabled={$shouldDisableActions}
        class="bg-ds-teal-800 hover:bg-ds-teal-700 text-white">Publish Candlestick</Button
      >
    </a>

    <Button
      disabled={$shouldDisableActions}
      class="bg-ds-blue-800 snap-start text-white hover:bg-ds-blue-700"
      onclick={async () => {
        try {
          const result = await $stream.getTopic();
          output.unshift({
            date: formatOutputDate(new Date()),
            message: JSON.stringify(result, null, 2)
          });
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message);
          }
        }
      }}>Get Topic</Button
    >

    <Button
      disabled={$shouldDisableActions}
      class="bg-ds-blue-800 snap-start text-white hover:bg-ds-blue-700"
      onclick={async () => {
        const result = await $stream.getBalance();
        output.unshift({
          date: formatOutputDate(new Date()),
          message: JSON.stringify(`${fromNano(result)} TON`, null, 2)
        });
      }}>Get Balance</Button
    >

    <Button
      disabled={$shouldDisableActions}
      class="bg-ds-blue-800 snap-start text-white hover:bg-ds-blue-700"
      onclick={async () => {
        const result = await $stream.getNextBatchId();
        output.unshift({
          date: formatOutputDate(new Date()),
          message: JSON.stringify(result.toString(), null, 2)
        });
      }}>Get Next Batch Id</Button
    >

    <form class="flex snap-start flex-col gap-4" onsubmit={handleSessionAddressSubmit}>
      <Label class="grid gap-2">
        Subscriber Address
        <Input
          type="text"
          name="subscriberAddress"
          placeholder="Enter a subscriber address"
          required
        />
      </Label>
      <Button
        disabled={$shouldDisableActions}
        type="submit"
        class="bg-ds-blue-800 text-white hover:bg-ds-blue-700">Get Session Address</Button
      >
    </form>

    <form class="flex snap-start flex-col gap-4" onsubmit={handleBatchAddressSubmit}>
      <Label class="grid gap-2">
        Batch ID
        <Input type="number" name="batchId" placeholder="Enter a batch ID" required />
      </Label>
      <Button
        disabled={$shouldDisableActions}
        type="submit"
        class="bg-ds-blue-800 text-white hover:bg-ds-blue-700">Get Batch Address</Button
      >
    </form>

    <Button
      disabled={$shouldDisableActions}
      class="bg-ds-blue-800 snap-start text-white hover:bg-ds-blue-700"
      onclick={async () => {
      const result = await $stream.getBatches();

      const batches: {
        [key: string]: string;
      }[] = [];
      for (const [address, info] of result) {
        batches.push({
          [address.toString({ testOnly: true, bounceable: false })]: info.subscriptionsCount.toString()
        });
      }

      output.unshift({
        date: formatOutputDate(new Date()),
        message: JSON.stringify(batches, null, 2)
      });
    }}
      >Get Batches</Button
    >
  </div>

  <Output bind:output />
</Section>
