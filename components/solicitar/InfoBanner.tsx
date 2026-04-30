"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function InfoBanner({
  children,
  variant = "info",
}: {
  children: React.ReactNode;
  variant?: "info" | "success" | "warning";
}) {
  const styles = {
    info: "bg-primary/5 border-primary/20 text-primary",
    success: "bg-secondary/10 border-secondary/30 text-secondary-mobile",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
  };
  const icons = { info: "info", success: "check_circle", warning: "warning" };

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4",
        styles[variant],
      )}
    >
      <span
        className="material-symbols-outlined mt-0.5 shrink-0 text-base"
        style={{ fontVariationSettings: "'FILL' 1" }}
        aria-hidden
      >
        {icons[variant]}
      </span>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
