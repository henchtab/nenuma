<script lang="ts">
  import { mediaQuery } from '$lib/utils';
  import { Toaster } from 'svelte-sonner';
  import '../app.css';

  let { children } = $props();

  const isDesktop = mediaQuery('(min-width: 768px)');
</script>

<div class="relative isolate flex-1 flex flex-col">
  {@render children()}
</div>

<Toaster position={$isDesktop ? 'bottom-right' : 'top-center'} />
