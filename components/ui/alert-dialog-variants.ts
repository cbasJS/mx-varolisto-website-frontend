export type AlertDialogActionVariant = 'primary' | 'ghost' | 'destructive' | 'outline-destructive'

export const ACTION_BASE =
  'inline-flex items-center justify-center rounded-xl px-5 h-11 font-headline text-[14px] font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900 disabled:pointer-events-none disabled:opacity-50'

export const ACTION_VARIANTS: Record<AlertDialogActionVariant, string> = {
  primary:
    'bg-primary text-white shadow-[0_1px_2px_rgba(0,6,102,0.20),_0_4px_12px_rgba(0,6,102,0.18)] hover:bg-primary/95 hover:shadow-[0_2px_4px_rgba(0,6,102,0.24),_0_6px_16px_rgba(0,6,102,0.28)] focus-visible:ring-primary/40',
  ghost:
    'bg-white text-zinc-700 border border-black/[0.06] hover:bg-zinc-50 hover:text-zinc-900 dark:bg-transparent dark:text-zinc-300 dark:border-white/[0.08] dark:hover:bg-white/[0.04] dark:hover:text-white focus-visible:ring-zinc-400/60',
  destructive:
    'bg-[#dc2626] text-white shadow-[0_1px_2px_rgba(220,38,38,0.20),_0_4px_12px_rgba(220,38,38,0.20)] hover:bg-[#b91c1c] hover:shadow-[0_2px_4px_rgba(220,38,38,0.28),_0_6px_16px_rgba(220,38,38,0.32)] focus-visible:ring-[#dc2626]/40',
  'outline-destructive':
    'bg-white text-[#b91c1c] border border-[#fecaca] hover:bg-[#fef2f2] hover:text-[#991b1b] hover:border-[#fca5a5] dark:bg-transparent dark:text-[#fca5a5] dark:border-[#7f1d1d]/60 dark:hover:bg-[#7f1d1d]/[0.12] dark:hover:text-[#fecaca] focus-visible:ring-[#dc2626]/40',
}
