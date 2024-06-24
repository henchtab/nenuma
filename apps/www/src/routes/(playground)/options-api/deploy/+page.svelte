<script lang="ts">
  import { backButton } from '$lib/stores/tma';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { OptionForm } from './components';
  import { derived } from 'svelte/store';

  type ComponentKey = keyof ComponentMap;

  // Define the contract to component mapping type
  type ComponentMap = {
    option: typeof OptionForm;
  };

  const contractToComponent: ComponentMap = {
    option: OptionForm
  };

  const contractType = derived(page, ($page) => {
    const type = $page.url.searchParams.get('contract') || 'option';

    return (type in contractToComponent ? type : 'option') as ComponentKey;
  });

  const title = $page.url.searchParams.get('title') || 'Fill out the form';
  const subtitle = $page.url.searchParams.get('subtitle') || '';

  onMount(() => {
    $backButton.show();

    const unsubscribe = $backButton.on('click', () => {
      history.back();
    });

    return () => {
      unsubscribe();
      $backButton.hide();
    };
  });
</script>

<svelte:head>
  <title>Deploy {title}</title>
  <meta name="description" content="Fill out the form below to deploy your own {subtitle}." />
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="bg-ds-background-100 border-b">
  <div class="container py-6 grid gap-1.5">
    <h1 class="text-lg font-medium text-center text-balance">
      Deploy {title}
    </h1>
    <p class="text-ds-gray-900 text-center text-balance">
      Fill out the form below to deploy your own {subtitle}.
    </p>
  </div>
</div>

<svelte:component this={contractToComponent[$contractType]} />
