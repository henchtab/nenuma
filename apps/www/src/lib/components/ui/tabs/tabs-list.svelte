<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	type $$Props = TabsPrimitive.ListProps;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<TabsPrimitive.List
	class={cn(
		"inline-flex h-9 items-center justify-center rounded-lg bg-ds-gray-100 p-1 text-ds-gray-900",
		className
	)}
	{...$$restProps}
>
	<slot />
</TabsPrimitive.List>
