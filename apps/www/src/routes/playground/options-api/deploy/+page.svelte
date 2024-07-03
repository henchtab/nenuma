<script lang="ts">
  import { backButton } from '$lib/stores/tma';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { BrokerOptionForm, BrokerDepositForm, OptionForm } from './components';
  import { derived } from 'svelte/store';

  type ComponentKey = keyof ComponentMap;

  // Define the contract to component mapping type
  type ComponentMap = {
    brokerOption: typeof BrokerOptionForm;
    brokerDeposit: typeof BrokerDepositForm;
    option: typeof OptionForm;
  };

  const contractToComponent: ComponentMap = {
    brokerOption: BrokerOptionForm,
    brokerDeposit: BrokerDepositForm,
    option: OptionForm
  };

  const contractType = derived(page, ($page) => {
    const type = $page.url.searchParams.get('contract') || 'option';

    return (type in contractToComponent ? type : 'option') as ComponentKey;
  });

  const title = $page.url.searchParams.get('title') || 'Fill out the form';
  // TODO: What to do with subtitle?
  const subtitle = $page.url.searchParams.get('subtitle') || '';
  const shouldForceTitle = $page.url.searchParams.get('forceTitle') === 'true';

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
  <title>
    {shouldForceTitle ? title : `Deploy ${title}`}
  </title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="bg-ds-background-100 border-b">
  <div class="container py-6 grid gap-1.5">
    <h1 class="text-lg font-medium text-center text-balance">
      {shouldForceTitle ? title : `Deploy ${title}`}
    </h1>
    <p class="text-ds-gray-900 text-center text-balance">Fill out the form below</p>
  </div>
</div>

<svelte:component this={contractToComponent[$contractType]} />
