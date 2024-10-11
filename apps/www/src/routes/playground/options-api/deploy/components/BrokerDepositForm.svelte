<script lang="ts">
  import { page } from "$app/stores";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { hapticFeedback, mainButton } from "$lib/stores/tma";
  import { formatTime, randomize } from "$lib/utils";
  import { useBroker } from "$lib/wrappers";
  import { toNano } from "@ton/core";
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
      $mainButton.setText("Deposit").enable().show();

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

    try {
      const args = {
        queryId: BigInt(formData.get("queryId") as string),
        deposit: toNano(formData.get("deposit") as string),
      };

      await $broker.deposit(args);
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
    <Label for="deposit" class="w-fit">Deposit</Label>
    <div class="relative flex items-center">
      <Input
        class="pr-12"
        id="deposit"
        type="number"
        name="deposit"
        placeholder="100"
        step="any"
        required
      />
      <span class="absolute right-3 select-none text-sm font-medium text-ds-gray-1000">TON</span>
    </div>
  </div>
</form>
