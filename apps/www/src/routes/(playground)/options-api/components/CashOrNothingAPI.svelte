<script lang="ts">
  import { formatOutputDate } from '$lib/utils';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { derived, writable } from 'svelte/store';
  import { createCashOrNothingOption } from '$lib/wrappers';
  import autoAnimate from '@formkit/auto-animate';
  import clsx from 'clsx';
  import Section from './Section.svelte';
  import { Address } from '@ton/core';

  const streamAddress = writable('');

  const option = createCashOrNothingOption(streamAddress);

  const shouldDisableActions = derived([streamAddress], ([$streamAddress]) => !$streamAddress);

  let output = $state<{ date: string; message: string }[]>([]);

  function postToOutput(message: string | bigint | object | Address | null) {
    if (message === null) {
      return;
    }

    if (typeof message === 'bigint') {
      message = message.toString();
    }

    objectIf: if (typeof message === 'object') {
      if (message instanceof Address) {
        message = message.toString({
          testOnly: true,
          bounceable: false
        });

        break objectIf;
      }

      message = JSON.stringify(message, null, 2);
    }

    output.unshift({ date: formatOutputDate(new Date()), message });
  }
</script>

<Section title="Cash-or-Nothing Option">
  <div class="grid gap-3 mt-4">
    <Label class="grid gap-2">
      Stream Address
      <Input
        type="text"
        name="streamAddress"
        placeholder="0QDCiYqpPo9esMDX35_BWYcsR1NKS7lbnPcPF6IMH8MNx2Lj"
        required
        class="w-fit"
        bind:value={$streamAddress}
      />
    </Label>
  </div>
  <p class="mt-3 mb-8 text-ds-gray-900 max-w-[640px]">
    This smart contract manages "cash-or-nothing" options. It handles deployment, validates
    agreements, monitors market data, and determines if an option is "in," "out," or "at" the money
    at expiration, sending notifications and payouts accordingly.
  </p>

  <div class="flex mt-8 gap-4 items-end overflow-x-auto pb-6 snap-x snap-mandatory">
    <a
      class={clsx('snap-start', $shouldDisableActions && 'cursor-not-allowed')}
      href={$shouldDisableActions
        ? undefined
        : `/options-api/deploy?contract=option&title=${encodeURIComponent('Cash-or-Nothing Option')}&subtitle=option&stream=${$streamAddress}`}
    >
      <Button
        class="bg-ds-teal-800 hover:bg-ds-teal-700 text-white"
        disabled={$shouldDisableActions}>Deploy Option</Button
      >
    </a>

    <!-- TODO: Allow the user to provide queryId -->
    <Button
      class="bg-ds-teal-800 hover:bg-ds-teal-700 text-white snap-start"
      disabled={$shouldDisableActions}
      onclick={async () => await $option.checkTimeout({ queryId: BigInt(Date.now()) })}
      >Check Timeout</Button
    >

    <Button
      class="bg-ds-blue-800 hover:bg-ds-blue-700 snap-start text-white"
      disabled={$shouldDisableActions}
      onclick={async () => postToOutput(await $option.getOptionId())}
    >
      Get Option ID
    </Button>

    <Button
      class="bg-ds-blue-800 hover:bg-ds-blue-700 snap-start text-white"
      disabled={$shouldDisableActions}
      onclick={async () => postToOutput(await $option.getAgreement())}
    >
      Get Agreement
    </Button>

    <Button
      class="bg-ds-blue-800 hover:bg-ds-blue-700 snap-start text-white"
      disabled={$shouldDisableActions}
      onclick={async () => postToOutput(await $option.getExpiration())}
    >
      Get Expiration
    </Button>

    <Button
      class="bg-ds-blue-800 hover:bg-ds-blue-700 snap-start text-white"
      disabled={$shouldDisableActions}
      onclick={async () => postToOutput(await $option.getBalance())}
    >
      Get Balance
    </Button>

    <Button
      class="bg-ds-blue-800 hover:bg-ds-blue-700 snap-start text-white"
      disabled={$shouldDisableActions}
      onclick={async () => postToOutput(await $option.getDeployerAddress())}
    >
      Get Deployer Address
    </Button>

    <Button
      class="bg-ds-blue-800 hover:bg-ds-blue-700 snap-start text-white"
      disabled={$shouldDisableActions}
      onclick={async () => postToOutput(await $option.getStreamAddress())}
    >
      Get Stream Address
    </Button>

    <Button
      class="bg-ds-blue-800 hover:bg-ds-blue-700 snap-start text-white"
      disabled={$shouldDisableActions}
      onclick={async () => postToOutput(await $option.getSessionAddress())}
    >
      Get Session Address
    </Button>

    <Button
      class="bg-ds-blue-800 hover:bg-ds-blue-700 snap-start text-white"
      disabled={$shouldDisableActions}
      onclick={async () => postToOutput(await $option.getNotificationsCount())}
    >
      Get Notifications Count
    </Button>
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
