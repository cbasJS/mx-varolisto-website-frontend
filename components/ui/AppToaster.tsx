'use client'

import { Toaster } from 'sonner'
import { CircleCheckBig, CircleX, Info, TriangleAlert } from 'lucide-react'

const ICON_SIZE = 20

const icons = {
  success: <CircleCheckBig size={ICON_SIZE} strokeWidth={2.25} className="text-[#15803d]" />,
  error: <CircleX size={ICON_SIZE} strokeWidth={2.25} className="text-[#b91c1c]" />,
  info: <Info size={ICON_SIZE} strokeWidth={2.25} className="text-primary" />,
  warning: <TriangleAlert size={ICON_SIZE} strokeWidth={2.25} className="text-[#b45309]" />,
}

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      icons={icons}
      gap={10}
      offset={20}
      duration={4500}
      visibleToasts={4}
      closeButton
      toastOptions={{
        unstyled: false,
        classNames: {
          toast:
            '!font-body !rounded-2xl !bg-white !border !border-black/[0.06] !shadow-[0_1px_2px_rgba(0,6,102,0.04),_0_8px_28px_rgba(0,6,102,0.10)] !px-4 !py-3 !gap-3 !items-center md:!pr-10 [&>[data-icon]]:!shrink-0 [&>[data-content]]:!flex-1 [&>[data-content]]:!min-w-0',
          title:
            '!font-headline !text-[13px] !font-semibold !leading-snug !tracking-[-0.01em] !text-[#0f172a]',
          description: '!font-body !text-[12.5px] !leading-snug !text-[#64748b]',
          actionButton:
            '!font-headline !text-[12px] !font-semibold !rounded-lg !bg-primary !text-white !px-3 !py-1.5 hover:!brightness-110',
          cancelButton:
            '!font-body !text-[12px] !font-medium !rounded-lg !text-[#64748b] !px-2 !py-1.5 hover:!text-[#0f172a]',
          closeButton:
            'max-md:!hidden !left-auto !right-2 !top-1/2 !-translate-y-1/2 !translate-x-0 !opacity-100 !transition-colors !w-6 !h-6 !rounded-lg !bg-white/70 !border !border-black/[0.06] !text-[#94a3b8] hover:!bg-white hover:!text-[#0f172a] hover:!border-black/10',
          success: '!bg-[#f0fdf4] !border-[#bbf7d0]/80',
          error: '!bg-[#fff5f5] !border-[#fecaca]/80',
          info: '!bg-[#eef2ff] !border-[#c7d2fe]/80',
          warning: '!bg-[#fffbeb] !border-[#fde68a]/80',
        },
      }}
    />
  )
}
