<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { formatOutputDate } from '$lib/utils';
  import { useBrokerageAccount } from '$lib/wrappers';
  import { fromNano } from '@ton/core';
  import { writable } from 'svelte/store';
  import Output from '../../components/Output.svelte';
  import Section from './Section.svelte';

  const brokerageAddress = writable('');
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
  <p class="mt-3 text-lg mb-8 text-ds-gray-900 max-w-[640px]">
    The Brokerage Account contract initializes with a brokerage address, a trader address, and a
    storage reserve. It includes getter functions to retrieve the storage reserve, brokerage
    address, and trader address. The contract can receive deployment requests (BRADeploy) and
    ensures that these requests are only accepted from the designated brokerage address. Upon
    successful validation of a deployment request, it sends a BRADeploySuccess notification back to
    the requester with the trader address.
  </p>
  <div class="flex gap-4 items-end overflow-x-auto">
    <Button
      class="bg-ds-purple-800 text-white hover:bg-ds-purple-700"
      onclick={async () => {
        const result = await $brokerageAccount.getBrokerage();
        output.unshift({
          date: formatOutputDate(new Date()),
          message: JSON.stringify(result.toString({ testOnly: true }), null, 2)
        });
      }}>Get Brokerage</Button
    >

    <Button
      class="bg-ds-purple-800 text-white hover:bg-ds-purple-700"
      onclick={async () => {
        const result = await $brokerageAccount.getTrader();

        output.unshift({
          date: formatOutputDate(new Date()),
          message: JSON.stringify(result.toString({ testOnly: true }), null, 2)
        });
      }}>Get Trader</Button
    >

    <Button
      class="bg-ds-purple-800 text-white hover:bg-ds-purple-700"
      onclick={async () => {
        const result = await $brokerageAccount.getStorageReserve();

        output.unshift({
          date: formatOutputDate(new Date()),
          message: JSON.stringify(`${fromNano(result)} TON`, null, 2)
        });
      }}>Get Storage Reserve</Button
    >
  </div>
  
  <Output bind:output />
</Section>
