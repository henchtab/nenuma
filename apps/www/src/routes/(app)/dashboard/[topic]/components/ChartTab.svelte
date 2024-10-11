<script lang="ts">
  import Chart from "./Chart.svelte";
</script>

<div class="pb-4">
  <div class="container grid gap-1">
    <h1 class="text-2xl tracking-tight font-semibold">
      <!-- FIXME: Hack -->
      <!-- {data.topic} -->
      BTC <span class="text-lg text-ds-gray-900">/ USDT</span>
    </h1>
    <div class="text-ds-gray-900 font-medium">Bitcoin</div>
  </div>
</div>

<Chart />
