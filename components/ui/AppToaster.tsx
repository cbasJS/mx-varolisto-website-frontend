"use client";

import { Toaster } from "sonner";
import {
  CircleCheckBig,
  CircleX,
  CircleAlert,
  TriangleAlert,
} from "lucide-react";

const ICON_SIZE = 16;

const iconBubble = (icon: React.ReactNode, bg: string, color: string) => (
  <span
    className={`flex items-center justify-center rounded-full shrink-0 ${bg} ${color}`}
    style={{ width: 32, height: 32 }}
  >
    {icon}
  </span>
);

const icons = {
  success: iconBubble(
    <CircleCheckBig size={ICON_SIZE} strokeWidth={2.5} />,
    "bg-[#dcfce7]",
    "text-[#16a34a]",
  ),
  error: iconBubble(
    <CircleX size={ICON_SIZE} strokeWidth={2.5} />,
    "bg-[#fee2e2]",
    "text-[#dc2626]",
  ),
  info: iconBubble(
    <CircleAlert size={ICON_SIZE} strokeWidth={2.5} />,
    "bg-[#e0e7ff]",
    "text-[#4338ca]",
  ),
  warning: iconBubble(
    <TriangleAlert size={ICON_SIZE} strokeWidth={2.5} />,
    "bg-[#fef9c3]",
    "text-[#ca8a04]",
  ),
};

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      icons={icons}
      toastOptions={{
        classNames: {
          toast:
            "!font-body !rounded-2xl !bg-white !border !border-black/[0.06] !shadow-[0_4px_24px_rgba(0,0,0,0.08)] !px-4 !py-3.5 !gap-3 !items-center",
          title:
            "!font-headline !text-[13px] !font-semibold !leading-snug !text-[#111827]",
          description: "!font-body !text-xs !leading-snug !text-[#6b7280]",
          success: "!bg-[#f0fdf4] !border-[#bbf7d0]",
          error: "!bg-[#fff5f5] !border-[#fecaca]",
          info: "!bg-[#eef2ff] !border-[#c7d2fe]",
          warning: "!bg-[#fffbeb] !border-[#fde68a]",
        },
      }}
    />
  );
}
