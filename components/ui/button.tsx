"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#037aff]/20 disabled:pointer-events-none disabled:opacity-50 active:translate-y-[1px] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-[#037aff] text-white shadow-[0_4px_14px_rgba(3,122,255,0.25),inset_0_1px_0_rgba(255,255,255,0.25)] hover:bg-[#0266D6] hover:shadow-[0_6px_20px_rgba(3,122,255,0.35),inset_0_1px_0_rgba(255,255,255,0.25)]",
        destructive:
          "bg-red-600 text-white shadow-[0_4px_14px_rgba(220,38,38,0.25),inset_0_1px_0_rgba(255,255,255,0.25)] hover:bg-red-700 hover:shadow-[0_6px_20px_rgba(220,38,38,0.35),inset_0_1px_0_rgba(255,255,255,0.25)]",
        outline:
          "border border-[#D9D4CB] bg-white text-[#0d1619] shadow-[0_1px_2px_rgba(13,22,25,0.04),inset_0_1px_0_rgba(255,255,255,0.9)] hover:border-[#CFC8BD] hover:bg-[#FDFCFB]",
        secondary:
          "bg-[#F0EFEB] text-[#0d1619] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] hover:bg-[#E2DFD8]",
        ghost:
          "hover:bg-[#F0EFEB] hover:text-[#0d1619]",
        link: "text-[#037aff] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 rounded-[14px] px-5 text-[15px]",
        sm: "h-9 rounded-xl px-4 text-sm",
        lg: "h-12 rounded-[16px] px-8 text-base",
        icon: "h-11 w-11 rounded-[14px]",
        "icon-sm": "h-8 w-8 rounded-[10px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
