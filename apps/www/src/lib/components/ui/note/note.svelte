<script lang="ts">
  import { cn } from '$lib/utils';
  import { Info } from 'lucide-svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    children: Snippet;
  }

  const { children, class: className, ...rest }: Props = $props();
</script>

<div
  class={cn(
    'rounded-md border border-ds-gray-400 bg-transparent text-ds-gray-900 text-sm min-h-9 py-1.5 px-2 flex grow gap-3 leading-normal break-words items-center',
    className
  )}
  {...rest}
>
  <div class="flex gap-2 items-center">
    <span><Info size={16} /></span>
    <span>
      {@render children()}
    </span>
  </div>
</div>
