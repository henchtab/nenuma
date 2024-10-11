<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { formatOutputDate } from "$lib/utils";
  import { createSimpleSubscriber } from "$lib/wrappers";
  import { fromNano } from "@ton/core";
  import { writable } from "svelte/store";
  import Output from "../../components/Output.svelte";
  import Section from "./Section.svelte";

  const simpleSubscriberAddress = writable("");
  const simpleSubscriber = createSimpleSubscriber(simpleSubscriberAddress);

  let output = $state<{ date: string; message: string }[]>([]);

  async function handleCheckTimeoutSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    },
  ) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const args = {
      queryId: BigInt(formData.get("queryId") as string),
    };

    await $simpleSubscriber.checkTimeout(args);
  }
</script>

<Section title="Simple Subscriber">
  <Label class="grid gap-2 mt-4">
    Simple Subscriber Address
    <Input
      type="text"
      name="simpleSubscriberAddress"
      placeholder="0QDCiYqpPo9esMDX35_BWYcsR1NKS7lbnPcPF6IMH8MNx2Lj"
      required
      class="w-fit"
      bind:value={$simpleSubscriberAddress}
    />
  </Label>
  <p class="mt-3 mb-8 text-ds-gray-900 max-w-[768px]">
    This contract sets up with an owner address and a subscriber ID. It handles subscriptions to a
    data stream, making sure there are enough funds for operations. When deployment requests come
    in, it sets the stream address, notification count, and expiration time. You can check the
    balance, owner address, number of notifications, expiration time, stream address, session
    address, and the latest candlestick data. It deals with subscribing, unsubscribing, and
    destroying sessions, even if transactions bounce. It also checks for expired subscriptions and
    notifies when time is up. Overall, it keeps the subscription process smooth and organized.
  </p>
  <div class="flex gap-4 items-end overflow-x-auto pb-6 snap-x snap-mandatory">
    <a
      class="snap-start"
      href={`/playground/streams-api/deploy?contract=subscriber&title=${encodeURIComponent("Simple Subscriber")}&subtitle=simple subscriber`}
    >
      <Button class="bg-ds-green-800 text-white hover:bg-ds-green-700"
        >Deploy Simple Subscriber
      </Button>
    </a>

    <form class="flex snap-start flex-col gap-4 min-w-max" onsubmit={handleCheckTimeoutSubmit}>
      <Label class="flex flex-col gap-2"
        >Query ID
        <Input type="number" name="queryId" placeholder="777" required min="0" />
      </Label>
      <Button class="bg-ds-green-800 text-white hover:bg-ds-green-700" type="submit"
        >Check timeout</Button
      >
    </form>

    <Button
      class="bg-ds-blue-800 snap-start text-white hover:bg-ds-blue-700"
      onclick={async () => {
        const result = await $simpleSubscriber.getBalance();
        output.unshift({
          date: formatOutputDate(new Date()),
          message: JSON.stringify(`${fromNano(result)} TON`, null, 2),
        });
      }}>Get Balance</Button
    >

    <Button
      class="bg-ds-blue-800 snap-start text-white hover:bg-ds-blue-700"
      onclick={async () => {
        const result = await $simpleSubscriber.getOwnerAddress();
        output.unshift({
          date: formatOutputDate(new Date()),
          message: JSON.stringify(result.toString({ testOnly: true, bounceable: false }), null, 2),
        });
      }}>Get Owner Address</Button
    >

    <Button
      class="bg-ds-blue-800 snap-start text-white hover:bg-ds-blue-700"
      onclick={async () => {
        const result = await $simpleSubscriber.getNotificationsCount();
        output.unshift({
          date: formatOutputDate(new Date()),
          message: JSON.stringify(result?.toString(), null, 2),
        });
      }}>Get Notifications Count</Button
    >

    <Button
      class="bg-ds-blue-800 snap-start text-white hover:bg-ds-blue-700"
      onclick={async () => {
        const result = await $simpleSubscriber.getExpiresAt();
        output.unshift({
          date: formatOutputDate(new Date()),
          message: JSON.stringify(result?.toString(), null, 2),
        });
      }}>Get Expires At</Button
    >

    <Button
      class="bg-ds-blue-800 snap-start text-white hover:bg-ds-blue-700"
      onclick={async () => {
        const result = await $simpleSubscriber.getStreamAddress();
        output.unshift({
          date: formatOutputDate(new Date()),
          message: JSON.stringify(result?.toString({ testOnly: true, bounceable: false }), null, 2),
        });
      }}>Get Stream Address</Button
    >

    <Button
      class="bg-ds-blue-800 snap-start text-white hover:bg-ds-blue-700"
      onclick={async () => {
        const result = await $simpleSubscriber.getSessionAddress();
        output.unshift({
          date: formatOutputDate(new Date()),
          message: JSON.stringify(result?.toString({ testOnly: true, bounceable: false }), null, 2),
        });
      }}>Get Session Address</Button
    >

    <Button
      class="bg-ds-blue-800 snap-start text-white hover:bg-ds-blue-700"
      onclick={async () => {
        const result = await $simpleSubscriber.getLatestCandlestick();

        if (!result) {
          output.unshift({
            date: formatOutputDate(new Date()),
            message: "No candlestick found",
          });
          return;
        }

        const serialized = {
          start: result.start.toString(),
          end: result.end.toString(),
          open: result.open.toString(),
          high: result.high.toString(),
          low: result.low.toString(),
          close: result.close.toString(),
        };

        output.unshift({
          date: formatOutputDate(new Date()),
          message: JSON.stringify(serialized, null, 2),
        });
      }}>Get Latest Candlestick</Button
    >
  </div>

  <Output bind:output />
</Section>
