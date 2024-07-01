<script lang="ts">
  import autoAnimate from '@formkit/auto-animate';
  import { Button } from '$lib/components/ui/button';

  type OutputMessage = { date: string; message: string };

  let { output = $bindable() }: { output: OutputMessage[] } = $props();
</script>

<div class="flex flex-col gap-4 mt-6">
  <h3 class="text-ds-gray-1000 font-medium text-xl">Output</h3>
  <ul
    use:autoAnimate
    class=" border-b border-t font-mono max-h-40 min-h-40 m-0 text-[13px] leading-5 whitespace-nowrap overflow-auto py-4"
  >
    {#if output.length === 0}
      <li class="h-8 text-ds-gray-900 inline-flex items-center pt-4">Logs will appear here...</li>
    {:else}
      {#each output as line (line.date)}
        <li class="flex h-8 gap-2 w-full items-center">
          <span class="text-ds-green-900 pr-2 border-r">{line.date}:</span>
          <span class="text-ds-green-900">{line.message}</span>
        </li>
      {/each}
    {/if}
  </ul>
  <Button variant="destructive" onclick={() => (output = [])}>Clear Output</Button>
</div>
