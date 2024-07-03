<script lang="ts">
  import { DataStream, Session, SimpleSubscriber, SubscriptionBatch } from './components';
</script>

<svelte:head>
  <title>Streams API</title>
  <meta
    name="description"
    content="Explore the Streams API to deploy data streams, manage subscriptions, and handle notifications on the blockchain."
  />
</svelte:head>

<DataStream />
<SubscriptionBatch />
<Session />
<SimpleSubscriber />
<!-- 
<div>
  <div class="py-6 border-b">
    <h1 class="text-ds-gray-1000 container font-semibold text-4xl text-left">Streams API</h1>
  </div>

  <div class="py-6 border-b">
    <div class="container">
      <h2 class="text-ds-gray-1000 font-medium text-3xl mb-4">Data Stream</h2>
    </div>
  </div>

  <div class="pb-12 mt-12 border-b">
    <div class="container">
      <h3 class="text-ds-gray-1000 font-medium text-3xl mb-4">Subscription Batch</h3>
      <Label class="grid gap-2">
        Batch ID
        <Input type="number" placeholder="0" required min="0" class="w-fit" bind:value={$batchId} />
      </Label>
      <p class="mt-3 text-lg mb-8 text-ds-gray-900 max-w-[768px]">
        Subscription Batch is a smart contract that handles subscription management for data streams
        on the blockchain. It lets publishers manage multiple subscriptions, track remaining
        notifications, and handle deposits. Key features include adding new subscriptions, topping
        up existing ones, and publishing data (like candlesticks). It also ensures that subscribers
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
              date: formatOutputDate(new Date()),
              message: JSON.stringify(`${fromNano(result)} TON`, null, 2)
            });
          }}>Get Balance</Button
        >

        <Button
          class="bg-ds-purple-800 text-white hover:bg-ds-purple-700"
          onclick={async () => {
            const result = await $batch.getBatchId();
            output.batch.unshift({
              date: formatOutputDate(new Date()),
              message: JSON.stringify(result.toString(), null, 2)
            });
          }}>Get Batch ID</Button
        >

        <Button
          class="bg-ds-purple-800 text-white hover:bg-ds-purple-700"
          onclick={async () => {
            const result = await $batch.getStreamAddress();
            output.batch.unshift({
              date: formatOutputDate(new Date()),
              message: JSON.stringify(
                result.toString({ testOnly: true, bounceable: false }),
                null,
                2
              )
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
            date: formatOutputDate(new Date()),
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
              date: formatOutputDate(new Date()),
              message: JSON.stringify(result.toString(), null, 2)
            });
          }}>Get Subscriptions Count</Button
        >
      </div>
      <div>
        <h3 class="text-ds-gray-1000 font-medium text-2xl mt-6">Output</h3>
        <ul
          use:autoAnimate
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
      <div class="container">
        <h3 class="text-ds-gray-1000 font-medium mb-4 text-3xl">Session</h3>
        
    </div>
  </div>

  <div class="pb-12 mt-12 border-b">
    <div class="container">
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
        This contract sets up with an owner address and a subscriber ID. It handles subscriptions to
        a data stream, making sure there are enough funds for operations. When deployment requests
        come in, it sets the stream address, notification count, and expiration time. You can check
        the balance, owner address, number of notifications, expiration time, stream address,
        session address, and the latest candlestick data. It deals with subscribing, unsubscribing,
        and destroying sessions, even if transactions bounce. It also checks for expired
        subscriptions and notifies when time is up. Overall, it keeps the subscription process
        smooth and organized.
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
              date: formatOutputDate(new Date()),
              message: JSON.stringify(`${fromNano(result)} TON`, null, 2)
            });
          }}>Get Balance</Button
        >

        <Button
          class="bg-ds-blue-800 text-white hover:bg-ds-blue-700"
          onclick={async () => {
            const result = await $simpleSubscriber.getOwnerAddress();
            output.simpleSubscriber.unshift({
              date: formatOutputDate(new Date()),
              message: JSON.stringify(
                result.toString({ testOnly: true, bounceable: false }),
                null,
                2
              )
            });
          }}>Get Owner Address</Button
        >

        <Button
          class="bg-ds-blue-800 text-white hover:bg-ds-blue-700"
          onclick={async () => {
            const result = await $simpleSubscriber.getNotificationsCount();
            output.simpleSubscriber.unshift({
              date: formatOutputDate(new Date()),
              message: JSON.stringify(result?.toString(), null, 2)
            });
          }}>Get Notifications Count</Button
        >

        <Button
          class="bg-ds-blue-800 text-white hover:bg-ds-blue-700"
          onclick={async () => {
            const result = await $simpleSubscriber.getExpiresAt();
            output.simpleSubscriber.unshift({
              date: formatOutputDate(new Date()),
              message: JSON.stringify(result?.toString(), null, 2)
            });
          }}>Get Expires At</Button
        >

        <Button
          class="bg-ds-blue-800 text-white hover:bg-ds-blue-700"
          onclick={async () => {
            const result = await $simpleSubscriber.getStreamAddress();
            output.simpleSubscriber.unshift({
              date: formatOutputDate(new Date()),
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
              date: formatOutputDate(new Date()),
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
                date: formatOutputDate(new Date()),
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
              date: formatOutputDate(new Date()),
              message: JSON.stringify(serialized, null, 2)
            });
          }}>Get Latest Candlestick</Button
        >
      </div>
      <div>
        <h3 class="text-ds-gray-1000 font-medium text-2xl mt-6">Output</h3>
        <ul
          use:autoAnimate
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
</div> -->
