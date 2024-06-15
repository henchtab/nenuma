import type { Button as ButtonPrimitive } from 'bits-ui';
import { type VariantProps, tv } from 'tailwind-variants';
import Root from './button.svelte';

const buttonVariants = tv({
  base: 'inline-flex items-center justify-center whitespace-nowrap select-none [transform:translateZ(0)] relative rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  variants: {
    variant: {
      default: 'bg-ds-gray-1000 text-ds-background-100 hover:bg-[#cacaca]',
      destructive: 'bg-ds-red-800 text-white hover:bg-ds-red-700',
    },
    size: {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 rounded-md px-3 text-xs',
      lg: 'h-10 rounded-md px-8',
      icon: 'h-9 w-9'
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'default'
  }
});

type Variant = VariantProps<typeof buttonVariants>['variant'];
type Size = VariantProps<typeof buttonVariants>['size'];

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
  buttonVariants
};
