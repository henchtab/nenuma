<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    children,
    title,
  }: {
    children: Snippet;
    title: string;
  } = $props();
</script>

<div class="py-6">
  <div class="container">
    <h1 class="text-ds-gray-1000 font-medium text-2xl">{title}</h1>
    {@render children()}
  </div>
</div>
