<script lang="ts">
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { getAccountInfo } from '$lib/data';
  import { isConnected } from '$lib/stores/ton-connect';
  import { createQuery } from '@tanstack/svelte-query';
  import { derived } from 'svelte/store';

  const accountInfo = createQuery(
    derived(isConnected, ($isConnected) => ({
      queryKey: ['accountInfo'],
      queryFn: getAccountInfo,
      refetchInterval: 1000 * 5,
      enabled: $isConnected
    }))
  );
</script>

<div class="inline-flex items-center gap-1">
  <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 17 18" width="17"
    ><g fill="none" fill-rule="evenodd" stroke="var(--ds-gray-1000, '#000')" stroke-width="1.5"
      ><path
        d="m1.84 3h13.3c.28 0 .5.22.5.5 0 .09-.02.17-.06.25l-6.33 11.18c-.27.48-.88.65-1.36.38-.16-.09-.3-.23-.38-.39l-6.11-11.18c-.13-.24-.04-.55.2-.68.08-.04.16-.06.24-.06z"
      /><path d="m8.5 15v-12" /></g
    ></svg
  >

  <Skeleton show={$accountInfo.isLoading}>
    <div class="font-medium min-w-10 text-center">
      {$accountInfo?.data?.balance?.slice(0, 5)}
    </div>
  </Skeleton>
</div>
