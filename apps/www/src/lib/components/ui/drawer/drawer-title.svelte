<script lang="ts">
	import { Drawer as DrawerPrimitive } from "vaul-svelte";
	import { cn } from "$lib/utils.js";

	type $$Props = DrawerPrimitive.TitleProps;

	export let el: $$Props["el"] = undefined;
	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<DrawerPrimitive.Title
	bind:el
	class={cn("text-lg text-ds-gray-1000 font-semibold leading-none", className)}
	{...$$restProps}
>
	<slot />
</DrawerPrimitive.Title>
