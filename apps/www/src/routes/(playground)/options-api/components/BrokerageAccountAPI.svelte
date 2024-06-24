<script lang="ts">
  import { formatOutputDate } from '$lib/utils';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { useBrokerageAccount } from '$lib/wrappers';
  import autoAnimate from '@formkit/auto-animate';
  import { fromNano } from '@ton/core';
  import { writable } from 'svelte/store';

  const brokerageAddress = writable('');
  const brokerageAccount = useBrokerageAccount(brokerageAddress);

  let output = $state<{ date: Date | string; message: string }[]>([]);
</script>

<div class="pb-12 mt-12 border-b">
  <h3 class="text-ds-gray-1000 font-medium text-3xl mb-4">Brokerage Account</h3>
  <Label class="grid gap-2">
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
</div>
