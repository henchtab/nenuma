<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { formatOutputDate } from "$lib/utils";
  import { useSession } from "$lib/wrappers";
  import { fromNano } from "@ton/core";
  import { writable } from "svelte/store";
  import Output from "../../components/Output.svelte";
  import Section from "./Section.svelte";

  const subscriberAddress = writable("");
  const session = useSession(subscriberAddress);

  let output = $state<{ date: string; message: string }[]>([]);

  async function handleSessionSubscriptionSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    },
  ) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const args = {
      notificationsCount: BigInt(formData.get("notificationsCount") as string),
      queryId: BigInt(formData.get("queryId") as string),
    };

    await $session.subscribe(args);
  }

  async function handleSessionUnsubscriptionSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    },
  ) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const args = {
      queryId: BigInt(formData.get("queryId") as string),
    };

    await $session.unsubscribe(args);
  }

  async function handleSessionDestroySubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    },
  ) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const args = {
      queryId: BigInt(formData.get("queryId") as string),
    };

    await $session.destroy(args);
  }
</script>

<Section title="Session">
  <Label class="grid gap-2 mt-4">
    Subscriber Address
    <Input
      type="text"
      name="subscriberAddress"
      placeholder="0QDCiYqpPo9esMDX35_BWYcsR1NKS7lbnPcPF6IMH8MNx2Lj"
      required
      class="w-fit"
      bind:value={$subscriberAddress}
    />
  </Label>
  <p class="mt-3 mb-8 text-ds-gray-900 max-w-[640px]">
    The Session contract handles individual subscriptions in a data stream system on the blockchain.
    It manages subscriber info, deposits, and notifications. Key features include: Deploying
    sessions Managing subscriptions (starting, topping up, unsubscribing) Forwarding data
    notifications (like candlesticks) Handling deposits for various actions This contract ensures
    subscribers get the data they signed up for and manages the lifecycle of a subscription
    efficiently. <br /> <br /> For more details, you can explore the
    <a
      class="underline"
      href="https://github.com/dreamqip/nenuma/blob/main/contracts/contracts/session.tact"
      target="_blank">contract code</a
    > and its functionality.
  </p>

  <div class="flex mt-8 gap-4 items-end overflow-x-auto pb-6 snap-x snap-mandatory">
    <form
      class="flex snap-start flex-col gap-4 min-w-max"
      onsubmit={handleSessionSubscriptionSubmit}
    >
      <Label class="flex flex-col gap-2"
        >Notifications Count
        <Input type="number" name="notificationsCount" placeholder="4" required min="1" />
      </Label>
      <Label class="flex flex-col gap-2"
        >Query ID
        <Input type="number" name="queryId" placeholder="777" required min="0" />
      </Label>
      <Button class="bg-ds-teal-800 text-white hover:bg-ds-teal-700" type="submit">Subscribe</Button
      >
    </form>

    <form
      class="flex snap-start flex-col gap-4 min-w-max"
      onsubmit={handleSessionUnsubscriptionSubmit}
    >
      <Label class="flex flex-col gap-2"
        >Query ID
        <Input type="number" name="queryId" placeholder="777" required min="0" />
      </Label>
      <Button class="bg-ds-teal-800 text-white hover:bg-ds-teal-700" type="submit"
        >Unsubscribe</Button
      >
    </form>

    <form class="flex snap-start flex-col gap-4 min-w-max" onsubmit={handleSessionDestroySubmit}>
      <Label class="flex flex-col gap-2"
        >Query ID
        <Input type="number" name="queryId" placeholder="777" required min="0" />
      </Label>
      <Button class="bg-ds-teal-800 text-white hover:bg-ds-teal-700" type="submit">Destroy</Button>
    </form>

    <Button
      class="bg-ds-pink-800 snap-start text-white hover:bg-ds-pink-700"
      onclick={async () => {
        const result = await $session.getStreamAddress();
        output.unshift({
          date: formatOutputDate(new Date()),
          message: JSON.stringify(result.toString({ testOnly: true, bounceable: false }), null, 2),
        });
      }}>Get Stream Address</Button
    >

    <Button
      class="bg-ds-pink-800 snap-start text-white hover:bg-ds-pink-700"
      onclick={async () => {
        const result = await $session.getBalance();

        output.unshift({
          date: formatOutputDate(new Date()),
          message: JSON.stringify(`${fromNano(result)} TON`, null, 2),
        });
      }}>Get Balance</Button
    >

    <Button
      class="bg-ds-pink-800 snap-start text-white hover:bg-ds-pink-700"
      onclick={async () => {
        const result = await $session.getBatchAddress();

        if (!result) {
          output.unshift({
            date: formatOutputDate(new Date()),
            message: "No batch address found",
          });
          return;
        }

        output.unshift({
          date: formatOutputDate(new Date()),
          message: JSON.stringify(result.toString({ testOnly: true, bounceable: false }), null, 2),
        });
      }}>Get Batch Address</Button
    >

    <Button
      class="bg-ds-pink-800 text-white snap-start hover:bg-ds-pink-700"
      onclick={async () => {
        const result = await $session.getSubscriberAddress();

        output.unshift({
          date: formatOutputDate(new Date()),
          message: JSON.stringify(result.toString({ testOnly: true, bounceable: false }), null, 2),
        });
      }}>Get Subscriber Address</Button
    >
  </div>

  <Output bind:output />
</Section>
