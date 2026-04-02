import { tv } from "tailwind-variants";

export const buttonVariants = tv({
  base: "mt-4 rounded-md text-center p-4",
  variants: {
    pressed: {
      true: "",
      false: "",
    },
    disabled: {
      true: "bg-gray-500 text-gray-100",
      false: "",
    },
    intent: {
        primary: "bg-sky-500 text-white",
        outline: "bg-transparent border border-sky-500 text-sky-500",
    }
  },
  compoundVariants: [
      {
        intent: 'primary',
        pressed: true,
        disabled: false,
        class: 'bg-sky-700'
      },
      {
        intent: 'primary',
        pressed: false,
        disabled: false,
        class: 'bg-sky-600'
      },
      {
        intent: 'primary',
        pressed: false,
        disabled: true,
        class: 'bg-gray-500 text-gray-200'
      },
  ],
  defaultVariants: {
    pressed: false,
    disabled: false,
    intent: 'primary',
  },
});
