<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { formatOutputDate } from "$lib/utils";
  import { useBrokerageAccount } from "$lib/wrappers";
  import { fromNano } from "@ton/core";
  import { writable } from "svelte/store";
  import Output from "../../components/Output.svelte";
  import Section from "./Section.svelte";

  const brokerageAddress = writable("");
  const brokerageAccount = useBrokerageAccount(brokerageAddress);

  let output = $state<{ date: string; message: string }[]>([]);
</script>

<Section title="Brokerage Account">
  <Label class="grid gap-2 mt-4">
    Brokerage Address
    <Input
      type="text"
      placeholder="0QDCiYqpPo9esMDX35_BWYcsR1NKS7lbnPcPF6IMH8MNx2Lj"
      class="w-fit"
      bind:value={$brokerageAddress}
    />
  </Label>
  <p class="mt-3 mb-8 text-ds-gray-900 max-w-[640px]">
    Sets up and manages brokerage accounts. Initializes with brokerage and trader addresses, ensures
    the sender is authorized, and notifies deployment success. Tracks storage reserves and handles
    account-related requests while validating access.
  </p>
  <div class="flex gap-4 items-end overflow-x-auto snap-x snap-mandatory">
    <Button
      class="bg-ds-purple-800 snap-start text-white hover:bg-ds-purple-700"
      onclick={async () => {
        const result = await $brokerageAccount.getBrokerage();
        output.unshift({
          date: formatOutputDate(new Date()),
          message: JSON.stringify(result.toString({ testOnly: true }), null, 2),
        });
      }}>Get Brokerage</Button
    >

    <Button
      class="bg-ds-purple-800 snap-start text-white hover:bg-ds-purple-700"
      onclick={async () => {
        const result = await $brokerageAccount.getTrader();

        output.unshift({
          date: formatOutputDate(new Date()),
          message: JSON.stringify(result.toString({ testOnly: true }), null, 2),
        });
      }}>Get Trader</Button
    >

    <Button
      class="bg-ds-purple-800 snap-start text-white hover:bg-ds-purple-700"
      onclick={async () => {
        const result = await $brokerageAccount.getStorageReserve();

        output.unshift({
          date: formatOutputDate(new Date()),
          message: JSON.stringify(`${fromNano(result)} TON`, null, 2),
        });
      }}>Get Storage Reserve</Button
    >
  </div>

  <Output bind:output />
</Section>
