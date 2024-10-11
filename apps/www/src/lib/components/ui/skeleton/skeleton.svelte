<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "$lib/utils.js";

  type Props = HTMLAttributes<HTMLDivElement> & {
    show?: boolean;
  };

  let { class: className, show = true, children, ...rest }: Props = $props();

  // type $$Props = HTMLAttributes<HTMLDivElement>;

  // let className: $$Props["class"] = undefined;
</script>

<div
  class={cn(
    "relative rounded-md inline-block",
    show &&
      "after:absolute after:rounded-md after:inset-0 after:bg-[length:400%_400%] after:bg-skeleton after:animate-skeleton",
    className,
  )}
  {...rest}
>
  {#if children}
    {@render children()}
  {/if}
</div>
