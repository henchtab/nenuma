<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "$lib/utils.js";

  type $$Props = HTMLAttributes<HTMLDivElement> & {
    el?: HTMLDivElement;
  };
  export let el: $$Props["el"] = undefined;
  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<div
  bind:this={el}
  class={cn("flex items-center gap-1.5 p-4 justify-between border-b", className)}
  {...$$restProps}
>
  <slot />
</div>
