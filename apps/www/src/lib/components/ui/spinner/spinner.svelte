<script lang="ts">
  let { size = 16 } = $props();
</script>

<div class="size-[var(--spinner-size,1.25rem)]" style="--spinner-size: {size}px;">
  <div class="relative left-1/2 top-1/2 size-[var(--spinner-size,1.25rem)]">
    {#each Array.from({ length: 12 }) as _, i}
      <div
        class="animate-spinner absolute rounded-md bg-ds-gray-700 h-[8%] -top-[3.9%] -left-[10%] w-[24%]"
        style="animation-delay: {i * 0.1 - 1.2}s; transform: rotate({i * 30}deg) translate(146%)"
      ></div>
    {/each}
  </div>
</div>
