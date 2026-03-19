"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c3aed]/20 disabled:pointer-events-none disabled:opacity-50 active:translate-y-[1px] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "rounded-[14px] bg-[#037aff]/90 text-white backdrop-blur-xl border border-white/30 shadow-[0_10px_30px_rgba(3,122,255,0.18),inset_0_1px_0_rgba(255,255,255,0.20)] hover:bg-[#037aff] focus-visible:ring-[#037aff]/20",
        destructive:
          "rounded-[14px] bg-red-600 text-white backdrop-blur-xl border border-white/25 shadow-[0_10px_30px_rgba(220,38,38,0.18),inset_0_1px_0_rgba(255,255,255,0.20)] hover:bg-red-700 focus-visible:ring-red-500/20",
        outline:
          "rounded-[14px] border border-white/70 bg-white/50 text-[#0d1619] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl hover:bg-white/70",
        secondary:
          "rounded-[14px] bg-white/50 text-[#0d1619] border border-white/70 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] hover:bg-white/70",
        ghost: "rounded-[14px] hover:bg-white/60 hover:text-[#0d1619]",
        link: "text-[#037aff] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 text-[15px]",
        sm: "h-9 px-4 text-sm",
        lg: "h-12 px-8 text-base",
        icon: "h-11 w-11",
        "icon-sm": "h-8 w-8",
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
