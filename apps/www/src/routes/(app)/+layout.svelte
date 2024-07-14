<script lang="ts">
  import { PUBLIC_BROKER_ADDRESS } from '$env/static/public';
  import { TON_CONNECT_UI_CONTEXT } from '$lib/constants';
  import { isConnected, isReconnecting, type TonConnectStore } from '$lib/stores/ton-connect';
  import { KlineTopic, ws } from '$lib/stores/ws.svelte';
  import { useBroker } from '$lib/wrappers';
  import { getContext, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import Header from './Header.svelte';

  let { children } = $props();

  const tonConnect = getContext<TonConnectStore>(TON_CONNECT_UI_CONTEXT);
  const broker = useBroker(writable(PUBLIC_BROKER_ADDRESS));

  // options.subscribe(console.log);

  onMount(() => {
    // $cloudStorage.getKeys().then((keys) => {
    //   $cloudStorage.delete(keys);
    // });

    /*
    options.subscribe(async (_options) => {
      for (const option of _options) {
        if (option.status === 'pending') {
          // if (option.draft.initiation < BigInt(Math.ceil(Date.now() / 1000))) {
          //   await $cloudStorage.delete(`option-${option.optionId}`);
          //   continue;
          // }

          for (let i = 0n; i < 32n; i++) {
            console.log(`Checking option ${option.optionId + i}...`);
            
            const optionAddress = await $broker.getOptionAddress(option.optionId + i);

            console.log(`Option address: ${optionAddress}`);

            const contract = $publicClient.open(CashOrNothingOption.fromAddress(optionAddress));

            try {
              const agreement = await contract.getAgreement();

              if (
                agreement &&
                agreement.holder.toRawString() === $tonConnect.connection.wallet!.account.address
              ) {
                console.log(`Option ${option.optionId + i} has been deployed!`);
                const updatedOption: DeployedOption = {
                  ...option,
                  status: 'deployed',
                  address: contract.address,
                  agreement
                };

                options.set(updatedOption);
              }
            } catch (error) {
              if (error instanceof Error && error.message.includes('-256')) {
                console.error(
                  `Option with address ${contract.address.toString({ testOnly: true })} has not been deployed. Full error: ${error}`
                );
              }

              // console.error(error);
              break;
            }
          }

          continue;
        }

        const contract = $publicClient.open(CashOrNothingOption.fromAddress(option.address));

        if (option.status === 'deployed') {
          const strikePrice = await contract.getStrikePrice();

          console.log(`Strike price: ${strikePrice}`);

          if (!strikePrice) {
            continue;
          }

          const updatedOption: InitiatedOption = {
            ...option,
            status: 'initiated',
            strikePrice: Number(strikePrice)
          };

          options.set(updatedOption);
        } else if (option.status === 'initiated') {
          try {
            const expiration = await contract.getExpiration();

            if (expiration && expiration + 3600n < BigInt(Math.ceil(Date.now() / 1000))) {
              console.log('Option has expired!');
              const updatedOption: ExpiredOption = {
                ...option,
                status: 'expired'
              };

              options.set(updatedOption);
            }
          } catch (error) {
            console.log(error);

            const updatedOption: SettledOption = {
              ...option,
              status: 'settled'
            };

            options.set(updatedOption);
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    });
    */

    $ws.addEventListener('open', () => {
      $ws.send(JSON.stringify({ op: 'subscribe', args: [KlineTopic.BTCUSDT] }));
    });
  });
</script>

{#if $isReconnecting || !$ws.isConnected}
  <div class="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
    <div class="animate-rotate">
      <div
        class="absolute bg-spinner top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-14 rounded-full before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:size-10 before:bg-ds-background-200 before:rounded-full after:absolute after:top-1/2 after:-translate-y-1/2 after:right-0 after:rounded-lg after:bg-ds-blue-700 after:size-2"
      ></div>
    </div>
  </div>
{:else}
  <Header />

  {@render children()}
{/if}
