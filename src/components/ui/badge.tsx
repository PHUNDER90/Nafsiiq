import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:     "bg-[var(--primary)] text-white",
        secondary:   "bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)]",
        success:     "bg-[#22C55E22] text-[#15803D]",
        warning:     "bg-[#F59E0B22] text-[#B45309]",
        destructive: "bg-[#EF444422] text-[#B91C1C]",
        outline:     "border border-[var(--primary)] text-[var(--primary)] bg-transparent",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
