<script lang="ts">
  import { browser } from '$app/environment';
  import { isConnected, isReconnecting } from '$lib/stores/ton-connect';
  import { KlineTopic, ws } from '$lib/stores/ws.svelte';
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import { onMount } from 'svelte';
  import Header from './Header.svelte';

  let { children } = $props();

  // const tonConnect = getContext<TonConnectStore>(TON_CONNECT_UI_CONTEXT);

  // type BaseOption = {
  //   optionId: number;
  // };

  // type PendingOption = BaseOption & {
  //   status: 'pending';
  //   draft: CashOrNothingOptionDraftAgreement;
  // };

  // type DeployedOption = BaseOption & {
  //   status: 'deployed';
  //   address: Address;
  //   agreement: CashOrNothingOptionAgreement;
  // };

  // type InitiatedOption = Omit<DeployedOption, 'status'> & {
  //   status: 'initiated';
  //   strikePrice: number;
  // };

  // type SettledOption = Omit<InitiatedOption, 'status'> & {
  //   status: 'settled';
  // };

  // type ExpiredOption = Omit<DeployedOption, 'status'> & {
  //   status: 'expired';
  // };

  // type Option = PendingOption | DeployedOption | InitiatedOption | SettledOption | ExpiredOption;

  // const options = writable<Option[]>([]);
  // setContext('options', options);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser
      }
    }
  });

  options.subscribe((o) => console.log('Options', o));

  onMount(() => {
    // const interval = setInterval(() => {
    //   options.subscribe(async (_options) => {
    //     for (const option of _options) {
    //       if (option.status === 'pending') {
    //         for (let i = 0; i < 32; i++) {
    //           const contract = $publicClient.open(
    //             await CashOrNothingOption.fromInit(
    //               Address.parse(PUBLIC_BROKER_ADDRESS),
    //               BigInt(option.optionId + i)
    //             )
    //           );

    //           try {
    //             const agreement = await contract.getAgreement();

    //             if (
    //               agreement &&
    //               agreement.holder === Address.parse($tonConnect.connection.wallet!.account.address)
    //             ) {
    //               const updatedOption: DeployedOption = {
    //                 ...option,
    //                 status: 'deployed',
    //                 address: contract.address,
    //                 agreement
    //               };

    //               options.update((_options) =>
    //                 _options.map((o) => (o.optionId === option.optionId ? updatedOption : o))
    //               );
    //             }
    //           } catch (error) {
    //             console.error(error);
    //             break;
    //           }
    //         }

    //         continue;
    //       }

    //       const contract = $publicClient.open(CashOrNothingOption.fromAddress(option.address));

    //       if (option.status === 'deployed') {
    //         const strikePrice = await contract.getStrikePrice();

    //         if (!strikePrice) {
    //           continue;
    //         }

    //         const updatedOption: InitiatedOption = {
    //           ...option,
    //           status: 'initiated',
    //           strikePrice: Number(strikePrice)
    //         };

    //         options.update((_options) =>
    //           _options.map((o) => (o.optionId === option.optionId ? updatedOption : o))
    //         );
    //       } else if (option.status === 'initiated') {
    //         try {
    //           const expiration = await contract.getExpiration();

    //           // @ts-expect-error
    //           if (expiration < BigInt(Date.now() / 1000)) {
    //             const updatedOption: ExpiredOption = {
    //               ...option,
    //               status: 'expired'
    //             };

    //             options.update((_options) =>
    //               _options.map((o) => (o.optionId === option.optionId ? updatedOption : o))
    //             );
    //           }
    //         } catch (error) {
    //           const updatedOption: SettledOption = {
    //             ...option,
    //             status: 'settled'
    //           };

    //           options.update((_options) =>
    //             _options.map((o) => (o.optionId === option.optionId ? updatedOption : o))
    //           );
    //         }
    //       }

    //       await new Promise((resolve) => setTimeout(resolve, 2000));
    //     }
    //   });

    //   console.log('Options 2', $options);
    // }, 1000 * 5);

    $ws.addEventListener('open', () => {
      $ws.send(JSON.stringify({ op: 'subscribe', args: [KlineTopic.BTCUSDT] }));
    });

    // return () => clearInterval(interval);
  });
</script>

{#if $isReconnecting}
  <div class="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
    <div class="animate-rotate">
      <div
        class="absolute bg-spinner top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-14 rounded-full before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:size-10 before:bg-ds-background-200 before:rounded-full after:absolute after:top-1/2 after:-translate-y-1/2 after:right-0 after:rounded-lg after:bg-ds-blue-700 after:size-2"
      ></div>
    </div>
  </div>
{:else if $isConnected}
  <QueryClientProvider client={queryClient}>
    <Header />

    {@render children()}
  </QueryClientProvider>
{/if}
