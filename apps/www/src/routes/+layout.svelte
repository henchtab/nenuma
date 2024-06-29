<script lang="ts">
  import { mediaQuery } from '$lib/utils';
  import { postEvent, retrieveLaunchParams } from '@tma.js/sdk';
  import { onMount } from 'svelte';
  import { Toaster } from 'svelte-sonner';
  import '../app.css';

  let { children } = $props();
  let wrapper = $state<HTMLDivElement>();

  const isDesktop = mediaQuery('(min-width: 768px)');

  onMount(async () => {
    const lp = retrieveLaunchParams();

    // Some versions of Telegram don't need the classes above.
    if (['macos', 'tdesktop', 'weba', 'web', 'webk'].includes(lp.platform)) {
      return;
    }

    postEvent('web_app_expand');

    document.body.setAttribute('data-sticky-app', 'true');
    wrapper?.setAttribute('data-sticky-app', 'true');
  });
</script>

<div
  bind:this={wrapper}
  class="group data-[sticky-app]:absolute data-[sticky-app]:inset-0 data-[sticky-app]:overflow-x-hidden data-[sticky-app]:overflow-y-auto"
>
  <div class="group-data-[sticky-app]:h-[calc(100%+1px)]">
    <div class="relative isolate flex-1 flex flex-col">
      {@render children()}
    </div>
  </div>
</div>

<Toaster
  position={$isDesktop ? 'bottom-right' : 'top-center'}
  richColors
  theme="dark"
  toastOptions={{
    classes: {
      default: '',
      error: '!bg-ds-red-100 !text-ds-red-900'
    }
  }}
/>
