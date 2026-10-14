import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-1 focus:ring-white/20",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-white text-black shadow-sm font-semibold",
        secondary:
          "border-white/10 bg-[#16161a] text-neutral-200",
        destructive:
          "border-rose-500/30 bg-rose-500/15 text-rose-300",
        outline:
          "border-white/[0.12] bg-transparent text-neutral-300 font-mono text-[11px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }
