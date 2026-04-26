import * as React from "react";
import { cn } from "@/lib/utils/cn";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-[var(--border)]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
