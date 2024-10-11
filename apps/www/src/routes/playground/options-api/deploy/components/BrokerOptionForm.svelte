<script lang="ts">
  import { page } from "$app/stores";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import * as ToggleGroup from "$lib/components/ui/toggle-group";
  import { hapticFeedback, mainButton } from "$lib/stores/tma";
  import { formatTime, randomize } from "$lib/utils";
  import { useBroker } from "$lib/wrappers";
  import { Address, toNano } from "@ton/core";
  import ChevronDown from "lucide-svelte/icons/chevron-down";
  import TrendingDown from "lucide-svelte/icons/trending-down";
  import TrendingUp from "lucide-svelte/icons/trending-up";
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import { writable } from "svelte/store";

  const searchParams = $page.url.searchParams;
  const brokerAddress = searchParams.get("broker") || "";

  const broker = useBroker(writable(brokerAddress));

  let form = $state<HTMLFormElement>();

  let queryId = $state<number>();
  let initiation = $state(initiationTime(3));
  let optionType = $state<string>();

  $effect(() => {
    if ($mainButton && form) {
      $mainButton.setText("Deploy Option").enable().show();

      const unsubscribe = $mainButton.on("click", () => {
        form?.requestSubmit();
        $hapticFeedback.impactOccurred("heavy");
      });

      return unsubscribe;
    } else {
      $mainButton.hide().disable();
    }
  });

  onMount(() => {
    const interval = setInterval(() => {
      if (initiation < initiationTime(3)) {
        initiation = initiationTime(3);
      }
    }, 1000 * 30);

    return () => {
      $mainButton.hide().disable();
      clearInterval(interval);
    };
  });

  function initiationTime(numberOfMinutes: number) {
    return formatTime(new Date(Date.now() + 1000 * 60 * numberOfMinutes));
  }

  async function handleSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    },
  ) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("optionType", optionType as string);

    for (const [_, value] of formData) {
      if (!value) {
        $hapticFeedback.notificationOccurred("error");
        toast.error("Please fill in all the fields");
        return;
      }
    }

    const intitiationTime = formData.get("initiation") as string;
    const initiation = BigInt(
      new Date(`${new Date().toDateString()} ${intitiationTime}`).getTime() / 1000,
    );

    try {
      const args = {
        queryId: BigInt(formData.get("queryId") as string),
        draft: {
          holder: Address.parse((formData.get("holder") as string).trim()),
          initiation,
          expiration: BigInt(initiation + BigInt(formData.get("expiration") as string) * 60n),
          optionType: Boolean(formData.get("optionType") as string),
          investment: toNano(formData.get("investment") as string),
        },
      };

      await $broker.deployOption(args);
    } catch (error) {
      $hapticFeedback.notificationOccurred("error");

      console.log(error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred while deploying the option");
      }
    }
  }
</script>

<form
  bind:this={form}
  class="flex container py-6 flex-col gap-4 overflow-auto"
  onsubmit={handleSubmit}
>
  <div class="grid gap-2">
    <Label for="queryId" class="w-fit">Query ID</Label>
    <div
      class="flex relative ring-1 ring-ds-gray-400 rounded-md transition-all duration-300 focus-within:ring-2 focus-within:ring-ds-gray-600"
    >
      <Input
        id="queryId"
        type="number"
        name="queryId"
        placeholder="101"
        required
        bind:value={queryId}
        class="rounded-r-none border-0 border-r focus-visible:ring-0 appearance-none"
      />
      <Button
        variant="secondary"
        class="text-sm rounded-l-none ring-0"
        onclick={() => (queryId = randomize())}>Randomize</Button
      >
    </div>
  </div>

  <div class="grid gap-2">
    <Label for="holder" class="w-fit">Holder</Label>
    <Input
      id="holder"
      type="text"
      name="holder"
      placeholder="0QAXeOTnpkBx_A6zKVxAYNDYqNuWPyrZkYZySJRZ_-zV4gLV"
      required
    />
  </div>

  <div class="grid gap-2">
    <Label for="initiation" class="w-fit">Initiation</Label>
    <Input
      id="initiation"
      type="time"
      name="initiation"
      min={initiation}
      bind:value={initiation}
      required
      onchange={() => $hapticFeedback.selectionChanged()}
    />
  </div>

  <div class="grid gap-2">
    <Label for="expiration" class="w-fit">Expiration</Label>
    <div class="relative flex items-center">
      <select
        class="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-ds-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-gray-600 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
        id="expiration"
        name="expiration"
        required
        onchange={() => $hapticFeedback.selectionChanged()}
      >
        <option value="2">2 minutes</option>
        <option value="3">3 minutes</option>
        <option value="4">4 minutes</option>
        <option value="5">5 minutes</option>
      </select>
      <ChevronDown size={16} stroke-width={1.5} class="absolute right-2 text-ds-gray-900" />
    </div>
  </div>

  <div class="grid gap-2">
    <Label for="optionType" class="w-fit">Option Type</Label>
    <ToggleGroup.Root
      type="single"
      id="optionType"
      aria-required
      bind:value={optionType}
      onValueChange={() => $hapticFeedback.selectionChanged()}
    >
      <ToggleGroup.Item value="true">
        <TrendingUp size={16} stroke-width={1.5} class="mr-2" />
        Call
      </ToggleGroup.Item>
      <ToggleGroup.Item value="false">
        <TrendingDown size={16} stroke-width={1.5} class="mr-2" />
        Put
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  </div>

  <div class="grid gap-2">
    <Label for="investment" class="w-fit">Investment</Label>
    <div class="relative flex items-center">
      <Input
        class="pr-12"
        id="investment"
        type="number"
        name="investment"
        placeholder="100"
        step="any"
        required
      />
      <span class="absolute right-3 select-none text-sm font-medium text-ds-gray-1000">TON</span>
    </div>
  </div>
</form>
