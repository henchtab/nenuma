import { type VariantProps, tv } from "tailwind-variants";
import Root from "./toggle.svelte";

export const toggleVariants = tv({
  base: "inline-flex items-center border-r first:rounded-l-md last:border-r-0 last:rounded-r-md justify-center text-sm font-medium transition-colors hover:bg-ds-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ds-gray-600 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-ds-blue-200 data-[state=on]:text-ds-blue-900",
  variants: {
    variant: {
      default: "bg-transparent",
    },
    size: {
      default: "h-9 px-3",
      sm: "h-8 px-2",
      lg: "h-10 px-3",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export type Variant = VariantProps<typeof toggleVariants>["variant"];
export type Size = VariantProps<typeof toggleVariants>["size"];

export {
  Root,
  //
  Root as Toggle,
};
