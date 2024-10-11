import type { Button as ButtonPrimitive } from "bits-ui";
import { type VariantProps, tv } from "tailwind-variants";
import Root from "./button.svelte";

const buttonVariants = tv({
  base: "inline-flex items-center justify-center whitespace-nowrap select-none [transform:translateZ(0)] relative rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:bg-ds-gray-100 disabled:text-ds-gray-700 disabled:ring-1 disabled:ring-ds-gray-400",
  variants: {
    variant: {
      default: "bg-ds-gray-1000 text-ds-background-100 hover:bg-[#cacaca]",
      secondary:
        "bg-ds-background-100 ring-1 ring-ds-gray-400 text-ds-gray-1000 hover:bg-ds-gray-200 hover:text-ds-gray-1000",
      destructive: "bg-ds-red-800 text-white hover:bg-ds-red-700",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-8",
      icon: "h-9 w-9",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type Variant = VariantProps<typeof buttonVariants>["variant"];
type Size = VariantProps<typeof buttonVariants>["size"];

type Props = ButtonPrimitive.Props & {
  variant?: Variant;
  size?: Size;
};

type Events = ButtonPrimitive.Events;

export {
  Root,
  type Props,
  type Events,
  //
  Root as Button,
  type Props as ButtonProps,
  type Events as ButtonEvents,
  buttonVariants,
};
