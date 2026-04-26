// ─── Nafsiiq Logo SVG Component ───────────────────────────────────────────────
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 36, showText = true, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {/* Icon mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Background circle */}
        <rect width="40" height="40" rx="12" fill="url(#logoGrad)" />
        {/* Brain-mind icon (abstract) */}
        <path
          d="M20 8C13.373 8 8 13.373 8 20C8 22.386 8.716 24.607 9.953 26.465L8 32L13.535 30.047C15.393 31.284 17.614 32 20 32C26.627 32 32 26.627 32 20C32 13.373 26.627 8 20 8Z"
          fill="white"
          fillOpacity="0.15"
        />
        {/* Left hemisphere */}
        <path
          d="M14 17C14 15.343 15.343 14 17 14H20V26H17C15.343 26 14 24.657 14 23V17Z"
          fill="white"
          fillOpacity="0.9"
        />
        {/* Right hemisphere */}
        <path
          d="M20 14H23C24.657 14 26 15.343 26 17V23C26 24.657 24.657 26 23 26H20V14Z"
          fill="white"
          fillOpacity="0.6"
        />
        {/* Center connector */}
        <rect x="19" y="17" width="2" height="6" fill="white" fillOpacity="0.4" />
        {/* Neural dots */}
        <circle cx="17" cy="19" r="1.5" fill="url(#dotGrad)" />
        <circle cx="23" cy="21" r="1.5" fill="url(#dotGrad)" />
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6C63FF" />
            <stop offset="100%" stopColor="#00C9A7" />
          </linearGradient>
          <linearGradient id="dotGrad" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#6C63FF" />
            <stop offset="100%" stopColor="#00C9A7" />
          </linearGradient>
        </defs>
      </svg>

      {showText && (
        <span
          className="font-display font-bold text-xl tracking-tight gradient-text"
          style={{ fontFamily: "var(--font-display, var(--font-sans))" }}
        >
          Nafsiiq
        </span>
      )}
    </div>
  );
}
