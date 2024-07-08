<script lang="ts">
  import { hapticFeedback, mainButton } from '$lib/stores/tma';
  import {
    Building,
    User,
    Bell,
    Layers,
    Database,
    BriefcaseBusiness,
    UserCheck,
    CreditCard
  } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import { DrawerClose } from '$lib/components/ui/drawer';
  import { onMount } from 'svelte';
  import { type AddressData, loadData } from '$lib/wrappers/utils';
  import {
    DATA_STREAM_STORAGE_KEY,
    SESSION_STORAGE_KEY,
    SIMPLE_SUBSCRIBER_STORAGE_KEY,
    SUBSCRIPTION_BATCHES_STORAGE_KEY
  } from '$lib/constants';

  let { isOpened = false }: { isOpened: boolean } = $props();

  const ItemType = {
    Stream: 'stream',
    SubscriptionBatch: 'subscription_batch',
    Session: 'session',
    SimpleSubscriber: 'simple_subscriber',
    Brokerage: 'brokerage',
    Broker: 'broker',
    BrokerageAccount: 'brokerage_account',
    CashOrNothingOption: 'cash-or-nothing_option'
  } as const;

  const ItemIcon = {
    [ItemType.Stream]: Database,
    [ItemType.SubscriptionBatch]: Layers,
    [ItemType.Session]: Bell,
    [ItemType.SimpleSubscriber]: User,
    [ItemType.Brokerage]: Building,
    [ItemType.Broker]: BriefcaseBusiness,
    [ItemType.BrokerageAccount]: UserCheck,
    [ItemType.CashOrNothingOption]: CreditCard
  };

  type Item = {
    id: Symbol;
    address: string;
    type: (typeof ItemType)[keyof typeof ItemType];
    timestamp?: number;
  };

  let items = $state<Item[]>([]);

  onMount(() => {
    if (isOpened && $mainButton.isVisible) {
      $mainButton.hide();
    }

    const stream = toItem(loadData<AddressData>(DATA_STREAM_STORAGE_KEY), ItemType.Stream);
    const subscriptionBatch = toItem(
      loadData<AddressData[]>(SUBSCRIPTION_BATCHES_STORAGE_KEY),
      ItemType.SubscriptionBatch
    );
    const session = toItem(loadData<AddressData>(SESSION_STORAGE_KEY), ItemType.Session);
    const simpleSubscriber = toItem(
      loadData<AddressData>(SIMPLE_SUBSCRIBER_STORAGE_KEY),
      ItemType.SimpleSubscriber
    );

    const temp = [stream, subscriptionBatch, session, simpleSubscriber]
      .filter((item) => item)
      .flat()
      .sort((a, b) => b!.timestamp - a!.timestamp);

    items = temp as Item[];

    return () => {
      if ($mainButton.isEnabled) {
        $mainButton.show();
      }
    };
  });

  function toItem(
    target:
      | { address: string; timestamp: number }
      | { address: string; timestamp: number }[]
      | null,
    type: (typeof ItemType)[keyof typeof ItemType]
  ) {
    if (!target) {
      return;
    }

    if (Array.isArray(target)) {
      return target.map((item) => ({
        id: Symbol(),
        address: item.address,
        type,
        timestamp: item.timestamp
      }));
    }

    return {
      id: Symbol(),
      address: target.address,
      type,
      timestamp: target.timestamp
    };
  }

  function shortenAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  }

  async function handleCopyAddress(
    e: MouseEvent & {
      currentTarget: EventTarget & HTMLButtonElement;
    }
  ) {
    const address = e.currentTarget.getAttribute('data-address');

    try {
      if (address) {
        await navigator.clipboard.writeText(address);
        $hapticFeedback.impactOccurred('medium');
      }
    } catch (error) {
      toast.error('Something went wrong while copying the address.');
    }
  }
</script>

<div class="container flex flex-col bg-ds-background-200 flex-1 gap-4 py-6 overflow-y-auto">
  <ul class="shadow-md">
    {#each items as item (item.id)}
      <li
        class="bg-ds-gray-100 items-center relative flex justify-center hover:bg-ds-gray-200 transition-colors group overflow-hidden first:rounded-t-md last:rounded-b-md"
      >
        <DrawerClose asChild let:builder>
          <button
            use:builder.action
            {...builder}
            class="text-ds-gray-1000 items-center flex-1 flex gap-4 text-left rounded-md"
            onclickcapture={handleCopyAddress}
            data-address={item.address}
          >
            <span class="pl-3">
              <svelte:component
                this={ItemIcon[item.type]}
                aria-hidden="true"
                size={20}
                strokeWidth={1.5}
                class="overflow-visible"
              />
            </span>

            <div
              class="flex pr-3 border-b justify-center flex-col min-h-14 flex-1 group-last:border-none"
            >
              <span class="text-sm">{shortenAddress(item.address)}</span>
              <span class="text-ds-gray-900 capitalize text-xs"
                >{item.type.split('_').join(' ')}</span
              >
            </div>
          </button>
        </DrawerClose>
      </li>
    {/each}
  </ul>
</div>
