/**
 * Style Utilities - Helper functions for consistent styling
 */

import { cn } from "@/lib/utils";
import { colors, statusColors } from "./design-tokens";

/**
 * Get status badge classes
 */
export function getStatusBadgeClasses(status: "success" | "error" | "warning" | "info" | "pending") {
  const statusColor = statusColors[status];
  return cn(
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-small font-medium",
    `bg-[${statusColor.bg}]`,
    `text-[${statusColor.text}]`,
    `border border-[${statusColor.border}]`
  );
}

/**
 * Get toast style object
 */
export function getToastStyle(type: "success" | "error" | "warning" | "info" | "default") {
  const toastColors = {
    success: {
      bg: "#ffffff",
      text: colors.success[600],
      border: colors.success[500],
    },
    error: {
      bg: "#ffffff",
      text: colors.error[600],
      border: colors.error[500],
    },
    warning: {
      bg: "#ffffff",
      text: colors.warning[600],
      border: colors.warning[500],
    },
    info: {
      bg: "#ffffff",
      text: colors.info[600],
      border: colors.info[500],
    },
    default: {
      bg: "#ffffff",
      text: colors.primary[800],
      border: colors.primary[500],
    },
  };

  const style = toastColors[type];
  return {
    background: style.bg,
    color: style.text,
    border: `1px solid ${style.border}`,
  };
}

/**
 * Get card style classes
 */
export function getCardClasses(variant: "default" | "elevated" | "outlined" = "default") {
  const baseClasses = "rounded-lg bg-card text-card-foreground";
  
  switch (variant) {
    case "elevated":
      return cn(baseClasses, "shadow-md");
    case "outlined":
      return cn(baseClasses, "border border-border");
    default:
      return cn(baseClasses, "shadow-sm");
  }
}

/**
 * Get button variant classes (for consistency with GenericButton)
 */
export function getButtonClasses(
  variant: "primary" | "secondary" | "outline" | "ghost" | "link" = "primary",
  size: "sm" | "md" | "lg" = "md"
) {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary",
    outline: "border border-border bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring",
    ghost: "hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring",
    link: "text-primary underline-offset-4 hover:underline focus-visible:ring-primary",
  };

  const sizes = {
    sm: "h-8 px-3 text-small",
    md: "h-10 px-4 text-small",
    lg: "h-12 px-6 text-base",
  };

  return cn(baseClasses, variants[variant], sizes[size]);
}

