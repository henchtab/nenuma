<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { formatOutputDate } from "$lib/utils";
  import { useSubscriptioBatch } from "$lib/wrappers";
  import { fromNano } from "@ton/core";
  import { writable } from "svelte/store";
  import Output from "../../components/Output.svelte";
  import Section from "./Section.svelte";
  import { toast } from "svelte-sonner";

  const batchId = writable(0);
  const batch = useSubscriptioBatch(batchId);

  let output = $state<{ date: string; message: string }[]>([]);
</script>

<Section title="Subscription Batch">
  <Label class="grid gap-2 mt-4">
    Batch ID
    <Input type="number" placeholder="0" required min="0" class="w-fit" bind:value={$batchId} />
  </Label>
  <p class="mt-3 mb-8 text-ds-gray-900 max-w-[768px]">
    Subscription Batch is a smart contract that handles subscription management for data streams on
    the blockchain. It lets publishers manage multiple subscriptions, track remaining notifications,
    and handle deposits. Key features include adding new subscriptions, topping up existing ones,
    and publishing data (like candlesticks). It also ensures that subscribers receive timely
    notifications and that publishers cover costs efficiently. <br /> <br /> For more details, you
    can explore the
    <a
      class="underline"
      href="https://github.com/dreamqip/nenuma/blob/main/contracts/contracts/subscription_batch.tact"
      target="_blank">contract code</a
    > and its functionality.
  </p>

  <div class="flex mt-8 gap-4 items-end overflow-x-auto snap-x snap-mandatory pb-6">
    <Button
      class="bg-ds-purple-800 snap-start text-white hover:bg-ds-purple-700"
      onclick={async () => {
        try {
          const result = await $batch.getBalance();
          output.unshift({
            date: formatOutputDate(new Date()),
            message: JSON.stringify(`${fromNano(result)} TON`, null, 2),
          });
        } catch (error) {
          if (error instanceof Error) {
            if (error.message.includes("-256")) {
              toast.error(`Subscription Batch with id ${$batchId} not found. Did you deploy it?`);
            }
          }
        }
      }}>Get Balance</Button
    >

    <Button
      class="bg-ds-purple-800 snap-start text-white hover:bg-ds-purple-700"
      onclick={async () => {
        try {
          const result = await $batch.getBatchId();
          output.unshift({
            date: formatOutputDate(new Date()),
            message: JSON.stringify(result.toString(), null, 2),
          });
        } catch (error) {
          if (error instanceof Error) {
            if (error.message.includes("-256")) {
              toast.error(`Subscription Batch with id ${$batchId} not found. Did you deploy it?`);
            }
          }
        }
      }}>Get Batch ID</Button
    >

    <Button
      class="bg-ds-purple-800 snap-start text-white hover:bg-ds-purple-700"
      onclick={async () => {
        try {
          const result = await $batch.getStreamAddress();
          output.unshift({
            date: formatOutputDate(new Date()),
            message: JSON.stringify(
              result.toString({ testOnly: true, bounceable: false }),
              null,
              2,
            ),
          });
        } catch (error) {
          if (error instanceof Error) {
            if (error.message.includes("-256")) {
              toast.error(`Subscription Batch with id ${$batchId} not found. Did you deploy it?`);
            }
          }
        }
      }}>Get Stream Address</Button
    >

    <Button
      class="bg-ds-purple-800 snap-start text-white hover:bg-ds-purple-700"
      onclick={async () => {
        try {
          const result = await $batch.getSubscriptions();

          const subscriptions: {
            [key: string]: {
              remainingNotificationsCount: string;
            };
          }[] = [];
          for (const [address, info] of result) {
            subscriptions.push({
              [address.toString({ testOnly: true, bounceable: false })]: {
                remainingNotificationsCount: info.remainingNotificationsCount.toString(),
              },
            });
          }

          output.unshift({
            date: formatOutputDate(new Date()),
            message: JSON.stringify(subscriptions, null, 2),
          });
        } catch (error) {
          if (error instanceof Error) {
            if (error.message.includes("-256")) {
              toast.error(`Subscription Batch with id ${$batchId} not found. Did you deploy it?`);
            }
          }
        }
      }}>Get Subscriptions</Button
    >

    <Button
      class="bg-ds-purple-800 snap-start text-white hover:bg-ds-purple-700"
      onclick={async () => {
        try {
          const result = await $batch.getSubscriptionsCount();

          output.unshift({
            date: formatOutputDate(new Date()),
            message: JSON.stringify(result.toString(), null, 2),
          });
        } catch (error) {
          if (error instanceof Error) {
            if (error.message.includes("-256")) {
              toast.error(`Subscription Batch with id ${$batchId} not found. Did you deploy it?`);
            }
          }
        }
      }}>Get Subscriptions Count</Button
    >
  </div>

  <Output bind:output />
</Section>
