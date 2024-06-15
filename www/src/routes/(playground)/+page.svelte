<script lang="ts">
  import { formatDate } from '$lib';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import {
    createDataStream,
    createSimpleSubscriber,
    useSession,
    useSubscriptioBatch
  } from '$lib/wrappers';
  import { Address, fromNano } from '@ton/ton';
  import { writable } from 'svelte/store';

  const streamAddress = writable('');
  const stream = createDataStream(streamAddress);

  const batchId = writable(0);
  const batch = useSubscriptioBatch(batchId);

  const subscriberAddress = writable('');
  const session = useSession(subscriberAddress);

  const simpleSubscriberAddress = writable('');
  const simpleSubscriber = createSimpleSubscriber(simpleSubscriberAddress);

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
    session: [],
    simpleSubscriber: []
  });

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

  async function handleDeploySSSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const args = {
      stream: formData.get('stream') as string,
      notificationsCount: BigInt(formData.get('notificationsCount') as string),
      expiresAt: BigInt(new Date(formData.get('exp') as string).getTime()),
      subscriberId: BigInt(formData.get('subscriberId') as string)
    };

    await $simpleSubscriber.deploy(args);
  }

  async function handleCheckTimeoutSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const args = {
      queryId: BigInt(formData.get('queryId') as string)
    };

    await $simpleSubscriber.checkTimeout(args);
  }
</script>

<svelte:head>
  <title>Streams API</title>
  <meta
    name="description"
    content="Explore the Streams API to deploy data streams, manage subscriptions, and handle notifications on the blockchain."
  />
</svelte:head>

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
    <p class="mt-3 text-lg mb-8 text-ds-gray-900 max-w-[768px]">
      The Data Stream smart contract makes it easy to securely stream data and manage subscriptions
      on the blockchain. Publishers can deploy data batches, handle sessions, and manage
      subscriptions effortlessly. It ensures safe handling of deposits and notifications, offering a
      solid framework for real-time data interaction. Key features include verifying publishers,
      creating batches, deploying sessions, and automating notifications.
      <br />
      <br />
      For more details, check out the
      <a
        class="underline"
        href="https://github.com/dreamqip/nenuma/blob/main/contracts/contracts/data_stream.tact"
        target="_blank">contract code</a
      > and its features here.
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
    <p class="mt-3 text-lg mb-8 text-ds-gray-900 max-w-[768px]">
      Subscription Batch is a smart contract that handles subscription management for data streams
      on the blockchain. It lets publishers manage multiple subscriptions, track remaining
      notifications, and handle deposits. Key features include adding new subscriptions, topping up
      existing ones, and publishing data (like candlesticks). It also ensures that subscribers
      receive timely notifications and that publishers cover costs efficiently. <br /> <br /> For
      more details, you can explore the
      <a
        class="underline"
        href="https://github.com/dreamqip/nenuma/blob/main/contracts/contracts/subscription_batch.tact"
        target="_blank">contract code</a
      > and its functionality.
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
      The Session contract handles individual subscriptions in a data stream system on the
      blockchain. It manages subscriber info, deposits, and notifications. Key features include:
      Deploying sessions Managing subscriptions (starting, topping up, unsubscribing) Forwarding
      data notifications (like candlesticks) Handling deposits for various actions This contract
      ensures subscribers get the data they signed up for and manages the lifecycle of a
      subscription efficiently. <br /> <br /> For more details, you can explore the
      <a
        class="underline"
        href="https://github.com/dreamqip/nenuma/blob/main/contracts/contracts/session.tact"
        target="_blank">contract code</a
      > and its functionality.
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

  <div class="pb-12 mt-12 border-b">
    <h3 class="text-ds-gray-1000 font-medium text-3xl mb-4">Simple Subscriber</h3>
    <Label class="grid gap-2">
      Subscriber Address
      <Input
        type="text"
        name="simpleSubscriberAddress"
        placeholder="0QDCiYqpPo9esMDX35_BWYcsR1NKS7lbnPcPF6IMH8MNx2Lj"
        required
        class="w-fit"
        bind:value={$simpleSubscriberAddress}
      />
    </Label>
    <p class="mt-3 text-lg mb-8 text-ds-gray-900 max-w-[768px]">
      This contract sets up with an owner address and a subscriber ID. It handles subscriptions to a
      data stream, making sure there are enough funds for operations. When deployment requests come
      in, it sets the stream address, notification count, and expiration time. You can check the
      balance, owner address, number of notifications, expiration time, stream address, session
      address, and the latest candlestick data. It deals with subscribing, unsubscribing, and
      destroying sessions, even if transactions bounce. It also checks for expired subscriptions and
      notifies when time is up. Overall, it keeps the subscription process smooth and organized.
    </p>
    <div class="flex gap-4 items-end overflow-x-auto">
      <form class="flex flex-col gap-4 min-w-max" onsubmit={handleDeploySSSubmit}>
        <Label class="flex flex-col gap-2"
          >Stream Address
          <Input
            type="text"
            name="stream"
            placeholder="0QDCiYqpPo9esMDX35_BWYcsR1NKS7lbnPcPF6IMH8MNx2Lj"
            required
          />
        </Label>
        <Label class="flex flex-col gap-2"
          >Notifications Count
          <Input type="number" name="notificationsCount" placeholder="777" required min="0" />
        </Label>
        <Label class="flex flex-col gap-2"
          >Expiration Time
          <Input type="date" name="exp" required />
        </Label>
        <Label class="flex flex-col gap-2"
          >Subscriber ID
          <Input type="number" name="subscriberId" placeholder="777" required min="0" />
        </Label>
        <Button class="bg-ds-green-800 text-white hover:bg-ds-green-700" type="submit"
          >Deploy Simple Subscriber</Button
        >
      </form>

      <form class="flex flex-col gap-4 min-w-max" onsubmit={handleCheckTimeoutSubmit}>
        <Label class="flex flex-col gap-2"
          >Query ID
          <Input type="number" name="queryId" placeholder="777" required min="0" />
        </Label>
        <Button class="bg-ds-green-800 text-white hover:bg-ds-green-700" type="submit"
          >Check timeout</Button
        >
      </form>

      <Button
        class="bg-ds-blue-800 text-white hover:bg-ds-blue-700"
        onclick={async () => {
          const result = await $simpleSubscriber.getBalance();
          output.simpleSubscriber.unshift({
            date: formatDate(new Date()),
            message: JSON.stringify(`${fromNano(result)} TON`, null, 2)
          });
        }}>Get Balance</Button
      >

      <Button
        class="bg-ds-blue-800 text-white hover:bg-ds-blue-700"
        onclick={async () => {
          const result = await $simpleSubscriber.getOwnerAddress();
          output.simpleSubscriber.unshift({
            date: formatDate(new Date()),
            message: JSON.stringify(result.toString({ testOnly: true, bounceable: false }), null, 2)
          });
        }}>Get Owner Address</Button
      >

      <Button
        class="bg-ds-blue-800 text-white hover:bg-ds-blue-700"
        onclick={async () => {
          const result = await $simpleSubscriber.getNotificationsCount();
          output.simpleSubscriber.unshift({
            date: formatDate(new Date()),
            message: JSON.stringify(result?.toString(), null, 2)
          });
        }}>Get Notifications Count</Button
      >

      <Button
        class="bg-ds-blue-800 text-white hover:bg-ds-blue-700"
        onclick={async () => {
          const result = await $simpleSubscriber.getExpiresAt();
          output.simpleSubscriber.unshift({
            date: formatDate(new Date()),
            message: JSON.stringify(result?.toString(), null, 2)
          });
        }}>Get Expires At</Button
      >

      <Button
        class="bg-ds-blue-800 text-white hover:bg-ds-blue-700"
        onclick={async () => {
          const result = await $simpleSubscriber.getStreamAddress();
          output.simpleSubscriber.unshift({
            date: formatDate(new Date()),
            message: JSON.stringify(
              result?.toString({ testOnly: true, bounceable: false }),
              null,
              2
            )
          });
        }}>Get Stream Address</Button
      >

      <Button
        class="bg-ds-blue-800 text-white hover:bg-ds-blue-700"
        onclick={async () => {
          const result = await $simpleSubscriber.getSessionAddress();
          output.simpleSubscriber.unshift({
            date: formatDate(new Date()),
            message: JSON.stringify(
              result?.toString({ testOnly: true, bounceable: false }),
              null,
              2
            )
          });
        }}>Get Session Address</Button
      >

      <Button
        class="bg-ds-blue-800 text-white hover:bg-ds-blue-700"
        onclick={async () => {
          const result = await $simpleSubscriber.getLatestCandlestick();

          if (!result) {
            output.simpleSubscriber.unshift({
              date: formatDate(new Date()),
              message: 'No candlestick found'
            });
            return;
          }

          const serialized = {
            start: result.start.toString(),
            end: result.end.toString(),
            open: result.open.toString(),
            high: result.high.toString(),
            low: result.low.toString(),
            close: result.close.toString()
          };

          output.simpleSubscriber.unshift({
            date: formatDate(new Date()),
            message: JSON.stringify(serialized, null, 2)
          });
        }}>Get Latest Candlestick</Button
      >
    </div>
    <div>
      <h3 class="text-ds-gray-1000 font-medium text-2xl mt-6">Output</h3>
      <ul
        class="border-b border-t font-mono max-h-40 min-h-40 m-0 text-[13px] leading-5 break-normal mt-4 overflow-auto py-4"
      >
        {#if output.simpleSubscriber.length === 0}
          <li class="h-8 text-ds-gray-900 inline-flex items-center">Logs will appear here...</li>
        {:else}
          {#each output.simpleSubscriber as line (line.date)}
            <li class="inline-flex h-8 gap-3 w-full items-center">
              <span class="text-ds-green-900">{line.date}:</span>
              <div class="h-5 w-[1px] bg-ds-green-400"></div>
              <span class="text-ds-green-900">{line.message}</span>
            </li>
          {/each}
        {/if}
      </ul>

      <Button class="mt-4" variant="destructive" onclick={() => (output.simpleSubscriber = [])}
        >Clear Output</Button
      >
    </div>
  </div>
</div>
