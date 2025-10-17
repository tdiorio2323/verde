import { ReactNode, forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * GlassCard component props interface
 */
export interface GlassCardProps {
  /** Card content */
  children: ReactNode;
  /** Variant style for the glass card */
  variant?: "default" | "liquid" | "premium";
  /** Additional CSS classes */
  className?: string;
  /** Whether to show hover effects */
  hover?: boolean;
  /** Whether to show glow effect */
  glow?: boolean;
  /** Optional click handler */
  onClick?: () => void;
  /** Optional aria-label for accessibility */
  "aria-label"?: string;
  /** Optional role for accessibility */
  role?: string;
}

/**
 * GlassCard - Reusable glass morphism card component
 *
 * Supports three variants:
 * - default: Basic glass card with subtle background
 * - liquid: Advanced liquid glass effect with gradient border
 * - premium: Enhanced glass card with outer glow and shine overlay
 *
 * @example
 * ```tsx
 * <GlassCard variant="premium" hover glow>
 *   <h2>Card Title</h2>
 *   <p>Card content goes here</p>
 * </GlassCard>
 * ```
 */
const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      variant = "default",
      className,
      hover = false,
      glow = false,
      onClick,
      "aria-label": ariaLabel,
      role,
    },
    ref,
  ) => {
    // Base classes for all variants
    const baseClasses = "relative rounded-[2rem] backdrop-blur-3xl transition-all duration-500";

    // Variant-specific classes
    const variantClasses = {
      default: "glass-card",
      liquid: "liquid-glass border-2 border-white/[0.15]",
      premium: "liquid-glass border-2 border-white/[0.15]",
    };

    // Conditional hover classes
    const hoverClasses = hover
      ? "hover:border-white/[0.25] hover:shadow-glow-sm hover:scale-[1.01]"
      : "";

    // Clickable classes
    const clickableClasses = onClick ? "cursor-pointer active:scale-[0.99]" : "";

    const cardClasses = cn(
      baseClasses,
      variantClasses[variant],
      hoverClasses,
      clickableClasses,
      className,
    );

    return (
      <>
        {variant === "premium" ? (
          <div className="relative group">
            {/* Outer Glow Layer */}
            {glow && (
              <div
                className="absolute -inset-1 rounded-[2rem] opacity-20 blur-2xl group-hover:opacity-30 transition-smooth"
                style={{
                  background:
                    "radial-gradient(ellipse, rgba(255, 255, 255, 0.2) 0%, transparent 70%)",
                }}
                aria-hidden="true"
              />
            )}

            {/* Main Glass Container */}
            <div
              ref={ref}
              className={cardClasses}
              onClick={onClick}
              aria-label={ariaLabel}
              role={role}
              tabIndex={onClick ? 0 : undefined}
              onKeyDown={
                onClick
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onClick();
                      }
                    }
                  : undefined
              }
            >
              {/* Inner Shine Overlay */}
              <div
                className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/[0.15] via-transparent to-transparent pointer-events-none"
                aria-hidden="true"
              />

              {/* Content */}
              <div className="relative">{children}</div>
            </div>
          </div>
        ) : (
          <div
            ref={ref}
            className={cardClasses}
            onClick={onClick}
            aria-label={ariaLabel}
            role={role}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={
              onClick
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onClick();
                    }
                  }
                : undefined
            }
          >
            {children}
          </div>
        )}
      </>
    );
  },
);

GlassCard.displayName = "GlassCard";

export default GlassCard;
