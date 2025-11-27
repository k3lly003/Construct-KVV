"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";
import { toastColors } from "@/lib/design-tokens";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": toastColors.default.bg,
          "--normal-text": toastColors.default.text,
          "--normal-border": toastColors.default.border,
          "--success-bg": toastColors.success.bg,
          "--success-text": toastColors.success.text,
          "--success-border": toastColors.success.border,
          "--error-bg": toastColors.error.bg,
          "--error-text": toastColors.error.text,
          "--error-border": toastColors.error.border,
          "--warning-bg": toastColors.warning.bg,
          "--warning-text": toastColors.warning.text,
          "--warning-border": toastColors.warning.border,
          "--info-bg": toastColors.info.bg,
          "--info-text": toastColors.info.text,
          "--info-border": toastColors.info.border,
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
