<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { hapticFeedback, mainButton } from "$lib/stores/tma";
  import { randomize } from "$lib/utils";
  import { createSimpleSubscriber } from "$lib/wrappers";
  import { onDestroy } from "svelte";
  import { writable } from "svelte/store";

  const simpleSubscriber = createSimpleSubscriber();

  let form = $state<HTMLFormElement>();
  let subscriberId = $state<number>(0);

  $effect(() => {
    if ($mainButton && form) {
      $mainButton.setText("Deploy Simple Subscriber").enable().show();

      const unsubscribe = $mainButton.on("click", () => form?.requestSubmit());

      return unsubscribe;
    } else {
      $mainButton.hide().disable();
    }
  });

  onDestroy(() => {
    if (browser) {
      $mainButton.hide().disable();
    }
  });

  async function handleDeploySSSubmit(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    },
  ) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const args = {
      stream: formData.get("stream") as string,
      notificationsCount: BigInt(formData.get("notificationsCount") as string),
      expiresAt: BigInt(new Date(formData.get("exp") as string).getTime() / 1000),
      subscriberId: BigInt(formData.get("subscriberId") as string),
    };

    await $simpleSubscriber.deploy(args);
  }
</script>

<form
  bind:this={form}
  class="flex container py-6 flex-col gap-4 overflow-auto"
  onsubmit={handleDeploySSSubmit}
>
  <div class="grid gap-2">
    <Label class="flex flex-col gap-2">Stream Address</Label>
    <Input
      type="text"
      name="stream"
      placeholder="0QDCiYqpPo9esMDX35_BWYcsR1NKS7lbnPcPF6IMH8MNx2Lj"
      required
    />
  </div>

  <div class="grid gap-2">
    <Label class="flex flex-col gap-2">Notifications Count</Label>
    <Input type="number" name="notificationsCount" placeholder="777" required min="0" />
  </div>

  <div class="grid gap-2">
    <Label for="exp" class="w-fit">Expiration Time</Label>
    <Input
      id="exp"
      type="datetime-local"
      name="exp"
      required
      onchange={() => $hapticFeedback.selectionChanged()}
    />
  </div>

  <div class="grid gap-2">
    <Label for="subscriberId" class="w-fit">Subscriber ID</Label>
    <div
      class="flex relative ring-1 ring-ds-gray-400 rounded-md transition-all duration-300 focus-within:ring-2 focus-within:ring-ds-gray-600"
    >
      <Input
        id="subscriberId"
        type="number"
        name="subscriberId"
        placeholder="101"
        required
        bind:value={subscriberId}
        class="rounded-r-none border-0 border-r focus-visible:ring-0 appearance-none"
      />
      <Button
        variant="secondary"
        class="text-sm rounded-l-none ring-0"
        onclick={() => (subscriberId = randomize())}>Randomize</Button
      >
    </div>
  </div>
</form>
