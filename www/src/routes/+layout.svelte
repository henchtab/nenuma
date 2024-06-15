<script lang="ts">
  import { mediaQuery } from '$lib/utils';
  import { Toaster, toast } from 'svelte-sonner';
  import '../app.css';
  import { onMount } from 'svelte';

  let { children } = $props();

  const isDesktop = mediaQuery('(min-width: 768px)');

  onMount(() => {
    window.onerror = (e) => toast.error(`An error occurred - ${e}`);
    window.onunhandledrejection = (e) =>
      toast.error(`An unhandled promise rejection occurred - ${e.reason}`);
  });
</script>

<div class="relative isolate flex-1 flex flex-col">
  {@render children()}
</div>

<Toaster position={$isDesktop ? 'bottom-right' : 'top-center'} richColors />
