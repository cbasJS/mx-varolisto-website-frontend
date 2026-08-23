export type AlertDialogMediaTone = 'default' | 'destructive' | 'warning'

export const MEDIA_TONE: Record<AlertDialogMediaTone, string> = {
  default: 'bg-primary/[0.08] text-primary dark:bg-white/[0.06] dark:text-white',
  destructive: 'bg-[#fee2e2] text-[#b91c1c] dark:bg-[#7f1d1d]/[0.20] dark:text-[#fecaca]',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
}
