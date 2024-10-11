<script lang="ts">
  import { PUBLIC_API_URL, PUBLIC_BROKER_ADDRESS } from "$env/static/public";
  import * as Accordion from "$lib/components/ui/accordion";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import { TON_CONNECT_UI_CONTEXT } from "$lib/constants";
  import { hapticFeedback } from "$lib/stores/tma";
  import { shortenAddress } from "$lib/shorten-address";
  import { isConnected, isDisconnected, type TonConnectStore } from "$lib/stores/ton-connect";
  import { cn } from "$lib/utils";
  import { openedPositionsCount } from "$lib/stores/positions";
  import { createQuery } from "@tanstack/svelte-query";
  import { fromNano } from "@ton/ton";
  import { Microscope, TrendingDown, TrendingUp } from "lucide-svelte";
  import { getContext } from "svelte";
  import { type Writable, derived } from "svelte/store";

  const tonConnect = getContext<TonConnectStore>(TON_CONNECT_UI_CONTEXT);
  const activeTab = getContext<Writable<string>>("activeTab");

  const options = createQuery(
    derived(isConnected, ($isConnected) => ({
      queryKey: ["positions"],
      queryFn: async () => {
        const res = await fetch(
          `${PUBLIC_API_URL}/api/${$tonConnect.connection.wallet?.account.address}/${PUBLIC_BROKER_ADDRESS}/options`,
        );

        if (!res.ok) {
          throw new Error(res.statusText);
        }

        return res.json();
      },
      refetchInterval: 1000 * 10,
      enabled: $isConnected,
    })),
  );

  $effect(() => {
    if ($options?.data?.length > 0) {
      openedPositionsCount.set($options.data.length);
    }

    if ($isDisconnected) {
      openedPositionsCount.set(0);
    }
  });
</script>

<div class="pb-6 container">
  {#if $options.data && !$options.isError && $isConnected}
    <Accordion.Root class="grid gap-3" multiple>
      {#each $options.data.sort((a, b) => b.optionId - a.optionId) as option (option.optionId)}
        <Accordion.Item
          value={option.optionId}
          class="grid gap-2 overflow-hidden border bg-ds-background-100 break-all rounded-md grid-cols-1"
        >
          <Accordion.Trigger class="p-3 gap-2">
            <div class="flex flex-1 gap-3 items-center">
              <div class="w-14 flex justify-start">
                {#if option.agreement.optionType}
                  <span
                    class="text-ds-green-700 flex-row-reverse inline-flex font-medium items-center gap-1"
                    >Call <TrendingUp size={20} /></span
                  >
                {:else}
                  <span
                    class="text-ds-red-700 flex-row-reverse inline-flex font-medium items-center gap-1"
                    >Put <TrendingDown size={20} /></span
                  >
                {/if}
              </div>

              <div class="flex items-baseline">
                <div class="text-ds-gray-900 text-sm">Option ID</div>
                <div class="text-ds-gray-1000 text-sm font-medium">#{option.optionId}</div>
              </div>
            </div>

            <Badge
              class={cn({
                "text-ds-teal-900 bg-ds-teal-200": option.status === "deployed",
                "text-ds-green-900 bg-ds-green-200": option.status === "initiated",
                "text-ds-amber-900 bg-ds-amber-200": option.status === "expired",
                "text-ds-blue-900 bg-ds-blue-200": option.status === "settled",
              })}
            >
              {option.status}
            </Badge>
          </Accordion.Trigger>
          <Accordion.Content class="px-3 grid gap-4 grid-cols-2">
            <div class="grid gap-1">
              <span class="text-ds-gray-900">Initiation Time</span>
              <span class="text-ds-gray-1000 font-medium"
                >{new Date(Number(option?.agreement?.initiation) * 1000).toLocaleString()}</span
              >
            </div>

            <div class="grid gap-1">
              <span class="text-ds-gray-900">Expiration Time</span>
              <span class="text-ds-gray-1000 font-medium"
                >{new Date(Number(option?.agreement?.expiration) * 1000).toLocaleString()}</span
              >
            </div>

            <div class="grid gap-1">
              <span class="text-ds-gray-900">Investment Amount</span>
              <span class="text-ds-gray-1000 font-medium"
                >{Number(fromNano(option?.agreement?.investment || 0n)).toFixed(2)} TON</span
              >
            </div>

            <div class="grid gap-1">
              <span class="text-ds-gray-900">Payout Amount</span>
              <span class="text-ds-gray-1000 font-medium"
                >{Number(fromNano(option?.agreement?.payout || 0n)).toFixed(2)} TON</span
              >
            </div>

            <div class="grid gap-1 grid-cols-1">
              <span class="text-ds-gray-900">Option</span>
              <a
                class="text-ds-blue-700 font-hubot-sans font-medium"
                href="https://testnet.tonviewer.com/{option.address}"
                target="_blank">{shortenAddress(option.address)}</a
              >
            </div>

            <div class="grid gap-1">
              <span class="text-ds-gray-900">Strike Price</span>
              <span class="text-ds-gray-1000 font-medium"
                >{option?.strikePrice ? Number(option?.strikePrice) / 100 : "N/A"}</span
              >
            </div>

            <div class="grid gap-1">
              <span class="text-ds-gray-900">Holder</span>
              <a
                class="text-ds-blue-700 font-hubot-sans font-medium"
                href="https://testnet.tonviewer.com/{option?.agreement?.holder}"
                target="_blank">{shortenAddress(option?.agreement?.holder)}</a
              >
            </div>

            <div class="grid gap-1">
              <span class="text-ds-gray-900">Writer</span>
              <a
                class="text-ds-blue-700 font-hubot-sans font-medium"
                href="https://testnet.tonviewer.com/{option?.agreement?.writer}"
                target="_blank">{shortenAddress(option?.agreement?.writer)}</a
              >
            </div>
          </Accordion.Content>
        </Accordion.Item>
      {/each}
    </Accordion.Root>
  {:else}
    <div class="flex gap-6 flex-col justify-center items-center">
      <div class="p-3 border text-ds-gray-900 rounded-md">
        <Microscope size={32} />
      </div>

      <div class="flex flex-col gap-1 items-center">
        <p class="font-medium">No Positions Opened Yet</p>
        <p
          class="text-ds-gray-900 max-w-[65%] text-center supports-[text-wrap:balance]:text-balance text-sm"
        >
          It looks like you haven't opened any positions yet. Start exploring the market and open
          your first position.
        </p>
      </div>

      <Button
        variant="secondary"
        onclick={() => {
          activeTab.set("trade");
          $hapticFeedback.impactOccurred("light");
        }}>Trade Options</Button
      >
    </div>
  {/if}
</div>
