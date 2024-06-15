<script lang="ts">
  import { formatDate } from '$lib';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { tonConnectUI } from '$lib/ton-connect';
  import { createDataStream, useSession, useSubscriptioBatch } from '$lib/wrappers';
  import { Address, fromNano } from '@ton/ton';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  let connectionState = $state({
    isConnnected: false,
    isReconnecting: true
  });

  const streamAddress = writable('');
  const stream = createDataStream(streamAddress);

  const batchId = writable(0);
  const batch = useSubscriptioBatch(batchId);

  const subscriberAddress = writable('');
  const session = useSession(subscriberAddress);

  const output = $state<
    Record<
      string,
      {
        date: string;
        message: string;
      }[]
    >
  >({
    stream: [],
    batch: [],
    session: []
  });

  onMount(() => {
    tonConnectUI.subscribe(async (tonConnectUI) => {
      if (!tonConnectUI) {
        connectionState.isConnnected = false;
        connectionState.isReconnecting = false;
        return;
      }

      const status = await tonConnectUI.connectionRestored;
      connectionState.isConnnected = status;
      connectionState.isReconnecting = false;

      tonConnectUI.onStatusChange((status) => {
        connectionState.isConnnected = status ? true : false;
      });
    });
  });

  async function connectWallet() {
    if (!$tonConnectUI) {
      console.warn('TonConnectUI is not initialized');
      return;
    }

    try {
      if ($tonConnectUI.connected || $tonConnectUI.wallet) {
        await $tonConnectUI.disconnect();
      }

      await $tonConnectUI.openModal();
    } catch (error) {
      console.error(error);
    }
  }

  async function disconnectWallet() {
    if (!$tonConnectUI) {
      console.warn('TonConnectUI is not initialized');
      return;
    }

    try {
      await $tonConnectUI.disconnect();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeploySubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const args = {
      topic: formData.get('topic') as string,
      queryId: BigInt(formData.get('queryId') as string)
    };

    await $stream.deploy(args);
  }

  async function handleDeployBatchSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const args = {
      queryId: BigInt(formData.get('queryId') as string)
    };

    await $stream.deployBatch(args);
  }

  async function handleDeploySessionSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const args = {
      queryId: BigInt(formData.get('queryId') as string)
    };

    await $stream.deploySession(args);
  }

  async function handlePublishCandlestickSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const start = formData.get('start');
    const end = formData.get('end');
    const open = formData.get('open');
    const high = formData.get('high');
    const low = formData.get('low');
    const close = formData.get('close');

    if (start && end && open && high && low && close) {
      const candlestick = {
        start: BigInt(start as string),
        end: BigInt(end as string),
        open: BigInt(open as string),
        high: BigInt(high as string),
        low: BigInt(low as string),
        close: BigInt(close as string)
      };

      const args = {
        candlestick,
        queryId: BigInt(formData.get('queryId') as string)
      };

      await $stream.publishCandlestick(args);
    }
  }

  async function handleSessionAddressSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const subscriberAddress = formData.get('subscriberAddress') as string;

    const result = await $stream.getSessionAddress(Address.parse(subscriberAddress));
    output.stream.unshift({
      date: formatDate(new Date()),
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
    output.stream.unshift({
      date: formatDate(new Date()),
      message: JSON.stringify(result.toString({ testOnly: true, bounceable: false }), null, 2)
    });
  }

  async function handleSessionSubscriptionSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const args = {
      notificationsCount: BigInt(formData.get('notificationsCount') as string),
      queryId: BigInt(formData.get('queryId') as string)
    };

    await $session.subscribe(args);
  }

  async function handleSessionUnsubscriptionSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const args = {
      queryId: BigInt(formData.get('queryId') as string)
    };

    await $session.unsubscribe(args);
  }

  async function handleSessionDestroySubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const args = {
      queryId: BigInt(formData.get('queryId') as string)
    };

    await $session.destroy(args);
  }
</script>

<header class="container py-4 flex items-center justify-between">
  <h1 class="text-xl font-medium text-center">Nenuma</h1>
  <Skeleton show={connectionState.isReconnecting}>
    <Button
      type="button"
      onclickcapture={() => {
        if (connectionState.isConnnected) {
          disconnectWallet();
        } else {
          connectWallet();
        }
      }}
    >
      {#if connectionState.isConnnected}
        Connected
      {:else}
        Connect
      {/if}
    </Button>
  </Skeleton>
</header>

<div class="container py-8">
  <h2 class="text-ds-gray-1000 font-semibold text-5xl text-left pb-16 border-b mb-16">
    Streams API
  </h2>

  <div class="pb-12 mt-12 border-b">
    <h3 class="text-ds-gray-1000 font-medium text-3xl mb-4">Data Stream</h3>
    <Label class="grid gap-2">
      Stream Address
      <Input
        type="text"
        placeholder="0QDCiYqpPo9esMDX35_BWYcsR1NKS7lbnPcPF6IMH8MNx2Lj"
        class="w-fit"
        bind:value={$streamAddress}
      />
    </Label>
    <p class="mt-3 text-lg mb-8 text-ds-gray-900 max-w-[640px]">
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet similique necessitatibus
      neque in mollitia, placeat porro voluptatibus illum deserunt nihil fugit obcaecati optio vero,
      consectetur tempora autem temporibus fugiat rem.
    </p>
    <div class="flex gap-4 items-end overflow-x-auto">
      <form class="flex flex-col gap-4 min-w-max" onsubmit={handleDeploySubmit}>
        <Label class="flex flex-col gap-2"
          >Topic
          <Input type="text" name="topic" placeholder="1.candlestick.TONUSDT" required />
        </Label>
        <Label class="flex flex-col gap-2"
          >Query ID
          <Input type="number" name="queryId" placeholder="777" required min="0" />
        </Label>
        <Button class="bg-ds-green-800 text-white hover:bg-ds-green-700" type="submit"
          >Deploy Stream</Button
        >
      </form>

      <form class="flex flex-col gap-4 w-max" onsubmit={handleDeployBatchSubmit}>
        <Label class="flex flex-col gap-2"
          >Query ID
          <Input type="number" name="queryId" placeholder="777" required min="0" />
        </Label>
        <Button class="bg-ds-green-800 text-white hover:bg-ds-green-700" type="submit"
          >Deploy Batch</Button
        >
      </form>

      <form class="flex flex-col gap-4 w-max" onsubmit={handleDeploySessionSubmit}>
        <Label class="flex flex-col gap-2"
          >Query ID
          <Input type="number" name="queryId" placeholder="777" required min="0" />
        </Label>
        <Button class="bg-ds-green-800 text-white hover:bg-ds-green-700" type="submit"
          >Deploy Session</Button
        >
      </form>

      <form class="flex flex-col gap-4 w-max" onsubmit={handlePublishCandlestickSubmit}>
        <Label class="grid gap-2">
          Start
          <Input type="number" name="start" placeholder="1718207640000" required />
        </Label>
        <Label class="grid gap-2">
          End
          <Input type="number" name="end" placeholder="1718207699999" required />
        </Label>
        <Label class="grid gap-2">
          Open
          <Input type="number" name="open" placeholder="6969709" required />
        </Label>
        <Label class="grid gap-2">
          High
          <Input type="number" name="high" placeholder="6969774" required />
        </Label>
        <Label class="grid gap-2">
          Low
          <Input type="number" name="low" placeholder="6970129" required />
        </Label>
        <Label class="grid gap-2">
          Close
          <Input type="number" name="close" placeholder="6966979" required />
        </Label>
        <Label class="grid gap-2">
          Query ID
          <Input type="number" name="queryId" placeholder="777" required />
        </Label>
        <Button type="submit" class="bg-ds-green-800 text-white hover:bg-ds-green-700"
          >Publish Candlestick</Button
        >
      </form>

      <Button
        class="bg-ds-blue-800 text-white hover:bg-ds-blue-700"
        onclick={async () => {
          const result = await $stream.getTopic();
          output.stream.unshift({
            date: formatDate(new Date()),
            message: JSON.stringify(result, null, 2)
          });
        }}>Get Topic</Button
      >

      <Button
        class="bg-ds-blue-800 text-white hover:bg-ds-blue-700"
        onclick={async () => {
          const result = await $stream.getBalance();
          output.stream.unshift({
            date: formatDate(new Date()),
            message: JSON.stringify(`${fromNano(result)} TON`, null, 2)
          });
        }}>Get Balance</Button
      >

      <Button
        class="bg-ds-blue-800 text-white hover:bg-ds-blue-700"
        onclick={async () => {
          const result = await $stream.getPublisherAddress();
          output.stream.unshift({
            date: formatDate(new Date()),
            message: JSON.stringify(result.toString({ testOnly: true, bounceable: false }), null, 2)
          });
        }}>Get Publisher Address</Button
      >

      <Button
        class="bg-ds-blue-800 text-white hover:bg-ds-blue-700"
        onclick={async () => {
          const result = await $stream.getNextBatchId();
          output.stream.unshift({
            date: formatDate(new Date()),
            message: JSON.stringify(result.toString(), null, 2)
          });
        }}>Get Next Batch Id</Button
      >

      <form class="flex flex-col gap-4" onsubmit={handleSessionAddressSubmit}>
        <Label class="grid gap-2">
          Subscriber Address
          <Input
            type="text"
            name="subscriberAddress"
            placeholder="Enter a subscriber address"
            required
          />
        </Label>
        <Button type="submit" class="bg-ds-blue-800 text-white hover:bg-ds-blue-700"
          >Get Session Address</Button
        >
      </form>

      <form class="flex flex-col gap-4" onsubmit={handleBatchAddressSubmit}>
        <Label class="grid gap-2">
          Batch ID
          <Input type="number" name="batchId" placeholder="Enter a batch ID" required />
        </Label>
        <Button type="submit" class="bg-ds-blue-800 text-white hover:bg-ds-blue-700"
          >Get Batch Address</Button
        >
      </form>

      <Button
        class="bg-ds-blue-800 text-white hover:bg-ds-blue-700"
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

          output.stream.unshift({
            date: formatDate(new Date()),
            message: JSON.stringify(batches, null, 2)
          });
        }}
        >Get Batches</Button
      >
    </div>
    <div>
      <h3 class="text-ds-gray-1000 font-medium text-2xl mt-6">Output</h3>
      <ul
        class="border-b border-t font-mono max-h-40 min-h-40 m-0 text-[13px] leading-5 break-normal mt-4 overflow-auto py-4"
      >
        {#if output.stream.length === 0}
          <li class="h-8 text-ds-gray-900 inline-flex items-center">Logs will appear here...</li>
        {:else}
          {#each output.stream as line (line.date)}
            <li class="inline-flex h-8 gap-3 w-full items-center">
              <span class="text-ds-green-900">{line.date}:</span>
              <div class="h-5 w-[1px] bg-ds-green-400"></div>
              <span class="text-ds-green-900">{line.message}</span>
            </li>
          {/each}
        {/if}
      </ul>

      <Button class="mt-4" variant="destructive" onclick={() => (output.stream = [])}
        >Clear Output</Button
      >
    </div>
  </div>

  <div class="pb-12 mt-12 border-b">
    <h3 class="text-ds-gray-1000 font-medium text-3xl mb-4">Subscription Batch</h3>
    <Label class="grid gap-2">
      Batch ID
      <Input type="number" placeholder="0" required min="0" class="w-fit" bind:value={$batchId} />
    </Label>
    <p class="mt-3 text-lg mb-8 text-ds-gray-900 max-w-[640px]">
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet similique necessitatibus
      neque in mollitia, placeat porro voluptatibus illum deserunt nihil fugit obcaecati optio vero,
      consectetur tempora autem temporibus fugiat rem.
    </p>

    <div class="flex mt-8 gap-4 items-end overflow-x-auto">
      <Button
        class="bg-ds-purple-800 text-white hover:bg-ds-purple-700"
        onclick={async () => {
          const result = await $batch.getBalance();
          output.batch.unshift({
            date: formatDate(new Date()),
            message: JSON.stringify(`${fromNano(result)} TON`, null, 2)
          });
        }}>Get Balance</Button
      >

      <Button
        class="bg-ds-purple-800 text-white hover:bg-ds-purple-700"
        onclick={async () => {
          const result = await $batch.getBatchId();
          output.batch.unshift({
            date: formatDate(new Date()),
            message: JSON.stringify(result.toString(), null, 2)
          });
        }}>Get Batch ID</Button
      >

      <Button
        class="bg-ds-purple-800 text-white hover:bg-ds-purple-700"
        onclick={async () => {
          const result = await $batch.getStreamAddress();
          output.batch.unshift({
            date: formatDate(new Date()),
            message: JSON.stringify(result.toString({ testOnly: true, bounceable: false }), null, 2)
          });
        }}>Get Stream Address</Button
      >

      <Button
        class="bg-ds-purple-800 text-white hover:bg-ds-purple-700"
        onclick={async () => {
          const result = await $batch.getSubscriptions();

          const subscriptions: {
            [key: string]: {
              remainingNotificationsCount: string;
            }
          }[] = [];
          for (const [address, info] of result) {
            subscriptions.push({
              [address.toString({ testOnly: true, bounceable: false })]: {
                remainingNotificationsCount: info.remainingNotificationsCount.toString(),
              }
            });
          }

          output.batch.unshift({
            date: formatDate(new Date()),
            message: JSON.stringify(subscriptions, null, 2)
          });
        }}
        >Get Subscriptions</Button
      >

      <Button
        class="bg-ds-purple-800 text-white hover:bg-ds-purple-700"
        onclick={async () => {
          const result = await $batch.getSubscriptionsCount();

          output.batch.unshift({
            date: formatDate(new Date()),
            message: JSON.stringify(result.toString(), null, 2)
          });
        }}>Get Subscriptions Count</Button
      >
    </div>
    <div>
      <h3 class="text-ds-gray-1000 font-medium text-2xl mt-6">Output</h3>
      <ul
        class="border-b border-t font-mono max-h-40 min-h-40 m-0 text-[13px] leading-5 break-normal mt-4 overflow-auto py-4"
      >
        {#if output.batch.length === 0}
          <li class="h-8 text-ds-gray-900 inline-flex items-center">Logs will appear here...</li>
        {:else}
          {#each output.batch as line (line.date)}
            <li class="inline-flex h-8 gap-3 w-full items-center">
              <span class="text-ds-green-900">{line.date}:</span>
              <div class="h-5 w-[1px] bg-ds-green-400"></div>
              <span class="text-ds-green-900">{line.message}</span>
            </li>
          {/each}
        {/if}
      </ul>

      <Button class="mt-4" variant="destructive" onclick={() => (output.batch = [])}
        >Clear Output</Button
      >
    </div>
  </div>

  <div class="pb-12 mt-12 border-b">
    <h3 class="text-ds-gray-1000 font-medium mb-4 text-3xl">Session</h3>
    <Label class="grid gap-2">
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
    <p class="mt-3 text-lg mb-8 text-ds-gray-900 max-w-[640px]">
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet similique necessitatibus
      neque in mollitia, placeat porro voluptatibus illum deserunt nihil fugit obcaecati optio vero,
      consectetur tempora autem temporibus fugiat rem.
    </p>

    <div class="flex mt-8 gap-4 items-end overflow-x-auto">
      <form class="flex flex-col gap-4 min-w-max" onsubmit={handleSessionSubscriptionSubmit}>
        <Label class="flex flex-col gap-2"
          >Notifications Count
          <Input type="number" name="notificationsCount" placeholder="4" required min="1" />
        </Label>
        <Label class="flex flex-col gap-2"
          >Query ID
          <Input type="number" name="queryId" placeholder="777" required min="0" />
        </Label>
        <Button class="bg-ds-teal-800 text-white hover:bg-ds-teal-700" type="submit"
          >Subscribe</Button
        >
      </form>

      <form class="flex flex-col gap-4 min-w-max" onsubmit={handleSessionUnsubscriptionSubmit}>
        <Label class="flex flex-col gap-2"
          >Query ID
          <Input type="number" name="queryId" placeholder="777" required min="0" />
        </Label>
        <Button class="bg-ds-teal-800 text-white hover:bg-ds-teal-700" type="submit"
          >Unsubscribe</Button
        >
      </form>

      <form class="flex flex-col gap-4 min-w-max" onsubmit={handleSessionDestroySubmit}>
        <Label class="flex flex-col gap-2"
          >Query ID
          <Input type="number" name="queryId" placeholder="777" required min="0" />
        </Label>
        <Button class="bg-ds-teal-800 text-white hover:bg-ds-teal-700" type="submit">Destroy</Button
        >
      </form>

      <Button
        class="bg-ds-pink-800 text-white hover:bg-ds-pink-700"
        onclick={async () => {
          const result = await $session.getStreamAddress();
          output.session.unshift({
            date: formatDate(new Date()),
            message: JSON.stringify(result.toString({ testOnly: true, bounceable: false }), null, 2)
          });
        }}>Get Stream Address</Button
      >

      <Button
        class="bg-ds-pink-800 text-white hover:bg-ds-pink-700"
        onclick={async () => {
          const result = await $session.getBalance();

          output.session.unshift({
            date: formatDate(new Date()),
            message: JSON.stringify(`${fromNano(result)} TON`, null, 2)
          });
        }}>Get Balance</Button
      >

      <Button
        class="bg-ds-pink-800 text-white hover:bg-ds-pink-700"
        onclick={async () => {
          const result = await $session.getBatchAddress();

          if (!result) {
            output.session.unshift({
              date: formatDate(new Date()),
              message: 'No batch address found'
            });
            return;
          }

          output.session.unshift({
            date: formatDate(new Date()),
            message: JSON.stringify(result.toString({ testOnly: true, bounceable: false }), null, 2)
          });
        }}>Get Batch Address</Button
      >

      <Button
        class="bg-ds-pink-800 text-white hover:bg-ds-pink-700"
        onclick={async () => {
          const result = await $session.getSubscriberAddress();

          output.session.unshift({
            date: formatDate(new Date()),
            message: JSON.stringify(result.toString({ testOnly: true, bounceable: false }), null, 2)
          });
        }}>Get Subscriber Address</Button
      >
    </div>
    <div>
      <h3 class="text-ds-gray-1000 font-medium text-2xl mt-6">Output</h3>
      <ul
        class="border-b border-t font-mono max-h-40 min-h-40 m-0 text-[13px] leading-5 break-normal mt-4 overflow-auto py-4"
      >
        {#if output.session.length === 0}
          <li class="h-8 text-ds-gray-900 inline-flex items-center">Logs will appear here...</li>
        {:else}
          {#each output.session as line (line.date)}
            <li class="inline-flex h-8 gap-3 w-full items-center">
              <span class="text-ds-green-900">{line.date}:</span>
              <div class="h-5 w-[1px] bg-ds-green-400"></div>
              <span class="text-ds-green-900">{line.message}</span>
            </li>
          {/each}
        {/if}
      </ul>

      <Button class="mt-4" variant="destructive" onclick={() => (output.session = [])}
        >Clear Output</Button
      >
    </div>
  </div>
</div>
