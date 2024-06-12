<script lang="ts">
    import { onMount } from "svelte";

    const options = $state();

    onMount(() => {
        console.log("OpenOptions.svelte mounted");
    });
</script>

<h3 class="text-2xl font-semibold tracking-tight">Options(0)</h3>
