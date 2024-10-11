<script lang="ts">
  import { KlineTopic, ws } from "$lib/stores/ws.svelte";
  import { onMount } from "svelte";
  import Header from "./Header.svelte";

  let { children } = $props();

  onMount(() => {
    $ws.addEventListener("open", () => {
      $ws.send(JSON.stringify({ op: "subscribe", args: [KlineTopic.BTCUSDT] }));
    });
  });
</script>

<Header />

{@render children()}
