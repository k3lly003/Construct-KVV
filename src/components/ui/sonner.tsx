"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "white",
          "--normal-text": "#92400e", // amber-800
          "--normal-border": "#f59e0b", // amber-500
          "--success-bg": "white",
          "--success-text": "#059669", // emerald-600
          "--success-border": "#10b981", // emerald-500
          "--error-bg": "white",
          "--error-text": "#dc2626", // red-600
          "--error-border": "#ef4444", // red-500
          "--warning-bg": "white",
          "--warning-text": "#d97706", // amber-600
          "--warning-border": "#f59e0b", // amber-500
          "--info-bg": "white",
          "--info-text": "#2563eb", // blue-600
          "--info-border": "#3b82f6", // blue-500
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
