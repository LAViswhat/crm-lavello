import { cva, type VariantProps } from "class-variance-authority";

export { default as Button } from "./Button.vue";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-md font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-transparent focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 duration-500",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-gray-50 shadow  hover:text-secondary dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90",
        destructive:
          "bg-warning text-gray-50 shadow-sm hover:bg-warning/90 dark:bg-red-900 dark:text-gray-50 dark:hover:bg-red-900/90",
        outline:
          "border-2 border-primary text-primary bg-white shadow-sm hover:bg-gray-100 hover:text-secondary hover:border-secondary dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50",
        secondary:
          "bg-gray-200 text-newblack shadow-sm hover:text-primary hover:bg-gray-200/70 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-800/80",
        ghost:
          "text-newwhite hover:text-primary dark:hover:bg-gray-800 dark:hover:text-gray-50",
        link: "text-gray-900 underline-offset-4 hover:underline dark:text-gray-50",
        disabled:
          "bg-gray-300 text-gray-500 dark:bg-gray-800 dark:text-gray-500",
      },
      size: {
        default: "h-9 px-4 min-w-40 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        md: "h-10 rounded-lg px-3 text-md text-primary",
        lg: "h-12 text-lg min-w-48 px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
