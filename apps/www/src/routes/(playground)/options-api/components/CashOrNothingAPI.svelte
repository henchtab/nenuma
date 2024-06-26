<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { formatOutputDate, formatTime } from '$lib/utils';
  import { createCashOrNothingOption } from '$lib/wrappers';
  import { Address, fromNano } from '@ton/core';
  import clsx from 'clsx';
  import { toast } from 'svelte-sonner';
  import { derived, writable } from 'svelte/store';
  import Output from '../../components/Output.svelte';
  import Section from './Section.svelte';

  const streamAddress = writable('');
  const option = createCashOrNothingOption(streamAddress);

  const shouldDisableActions = derived([streamAddress], ([$streamAddress]) => !$streamAddress);

  let output = $state<{ date: string; message: string }[]>([]);

  function formatOutput(input: {
    type: 'coins' | 'object' | 'address' | 'timestamp' | 'other';
    value: bigint | object | Address | null;
  }) {
    if (input.value === null) {
      return 'Empty response.';
    }

    if (input.type === 'coins') {
      return fromNano(input.value as bigint).toString();
    }

    if (input.type === 'timestamp') {
      return formatTime(new Date(Number(input.value) * 1000));
    }

    if (input.type === 'object') {
      return JSON.stringify(
        input.value,
        (_, v) => {
          if (v instanceof Address) {
            return v.toString({ testOnly: true, bounceable: false });
          }

          if (typeof v === 'bigint') {
            return v.toString();
          }

          return v;
        },
        2
      );
    }

    if (input.type === 'address') {
      return (input.value as Address).toString({
        testOnly: true,
        bounceable: false
      });
    }

    return input.value.toString();
  }

  function postToOutput(message: string) {
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
      onclick={async () => {
        try {
          const result = await $option.getOptionId();
          postToOutput(
            formatOutput({
              type: 'other',
              value: result
            })
          );
        } catch (error) {
          toast.error('Option has not been deployed or it has expired.');
        }
      }}
    >
      Get Option ID
    </Button>

    <Button
      class="bg-ds-blue-800 hover:bg-ds-blue-700 snap-start text-white"
      disabled={$shouldDisableActions}
      onclick={async () => {
        try {
          const result = await $option.getAgreement();
          postToOutput(
            formatOutput({
              type: 'object',
              value: result
            })
          );
        } catch (error) {
          toast.error('Option has not been deployed or it has expired.');
        }
      }}
    >
      Get Agreement
    </Button>

    <Button
      class="bg-ds-blue-800 hover:bg-ds-blue-700 snap-start text-white"
      disabled={$shouldDisableActions}
      onclick={async () => {
        try {
          const result = await $option.getStrikePrice();
          postToOutput(
            formatOutput({
              type: 'other',
              value: result
            })
          );
        } catch (error) {
          toast.error('Option has not been deployed or it has expired.');
        }
      }}
    >
      Get Strike Price
    </Button>

    <Button
      class="bg-ds-blue-800 hover:bg-ds-blue-700 snap-start text-white"
      disabled={$shouldDisableActions}
      onclick={async () => {
        try {
          const result = await $option.getLatestCandlestick();
          postToOutput(
            formatOutput({
              type: 'object',
              value: result
            })
          );
        } catch (error) {
          toast.error('Option has not been deployed or it has expired.');
        }
      }}
    >
      Get Latest Candlestick
    </Button>

    <Button
      class="bg-ds-blue-800 hover:bg-ds-blue-700 snap-start text-white"
      disabled={$shouldDisableActions}
      onclick={async () => {
        try {
          const result = await $option.getExpiration();
          postToOutput(
            formatOutput({
              type: 'timestamp',
              value: result
            })
          );
        } catch (error) {
          toast.error('Option has not been deployed or it has expired.');
        }
      }}
    >
      Get Expiration
    </Button>

    <Button
      class="bg-ds-blue-800 hover:bg-ds-blue-700 snap-start text-white"
      disabled={$shouldDisableActions}
      onclick={async () => {
        try {
          const result = await $option.getBalance();
          postToOutput(
            formatOutput({
              type: 'coins',
              value: result
            })
          );
        } catch (error) {
          toast.error('Option has not been deployed or it has expired.');
        }
      }}
    >
      Get Balance
    </Button>

    <Button
      class="bg-ds-blue-800 hover:bg-ds-blue-700 snap-start text-white"
      disabled={$shouldDisableActions}
      onclick={async () => {
        try {
          const result = await $option.getDeployerAddress();
          postToOutput(
            formatOutput({
              type: 'address',
              value: result
            })
          );
        } catch (error) {
          toast.error('Option has not been deployed or it has expired.');
        }
      }}
    >
      Get Deployer Address
    </Button>

    <Button
      class="bg-ds-blue-800 hover:bg-ds-blue-700 snap-start text-white"
      disabled={$shouldDisableActions}
      onclick={async () => {
        try {
          const result = await $option.getStreamAddress();
          postToOutput(
            formatOutput({
              type: 'address',
              value: result
            })
          );
        } catch (error) {
          toast.error('Option has not been deployed or it has expired.');
        }
      }}
    >
      Get Stream Address
    </Button>

    <Button
      class="bg-ds-blue-800 hover:bg-ds-blue-700 snap-start text-white"
      disabled={$shouldDisableActions}
      onclick={async () => {
        try {
          const result = await $option.getSessionAddress();
          postToOutput(
            formatOutput({
              type: 'address',
              value: result
            })
          );
        } catch (error) {
          toast.error('Option has not been deployed or it has expired.');
        }
      }}
    >
      Get Session Address
    </Button>

    <Button
      class="bg-ds-blue-800 hover:bg-ds-blue-700 snap-start text-white"
      disabled={$shouldDisableActions}
      onclick={async () => {
        try {
          const result = await $option.getNotificationsCount();
          postToOutput(
            formatOutput({
              type: 'other',
              value: result
            })
          );
        } catch (error) {
          toast.error('Option has not been deployed or it has expired.');
        }
      }}
    >
      Get Notifications Count
    </Button>
  </div>

  <Output bind:output />
</Section>
