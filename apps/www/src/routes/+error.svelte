<script lang="ts">
  import OctagonAlert from "lucide-svelte/icons/octagon-alert";
  import { page } from "$app/stores";
</script>

<div class="container py-10">
  <OctagonAlert class="text-ds-red-900" strokeWidth={1.5} size="64" />
  <h1 class="text-3xl text-ds-red-900 mt-3">Oh no!</h1>
  <p class="text-ds-red-900 text-lg mt-2">{$page.error?.message}</p>
</div>
