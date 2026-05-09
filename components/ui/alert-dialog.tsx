'use client'

import * as React from 'react'
import { AlertDialog as AlertDialogPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'
import {
  ACTION_BASE,
  ACTION_VARIANTS,
  type AlertDialogActionVariant,
} from './alert-dialog-variants'

function AlertDialog({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
}

function AlertDialogPortal({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-white/30 supports-backdrop-filter:backdrop-blur-[3px] supports-backdrop-filter:bg-white/20 dark:bg-zinc-950/30 dark:supports-backdrop-filter:bg-zinc-950/20 duration-200 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0',
        className,
      )}
      {...props}
    />
  )
}

function AlertDialogContent({
  className,
  size = 'default',
  children,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
  size?: 'default' | 'sm'
}) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(
          'group/alert-dialog-content fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 outline-none',
          'overflow-hidden rounded-[28px]',
          'bg-white dark:bg-zinc-900',
          'border border-black/[0.04] dark:border-white/[0.06]',
          'shadow-[0_1px_2px_rgba(15,23,42,0.04),_0_8px_24px_rgba(15,23,42,0.06),_0_24px_64px_rgba(0,6,102,0.10)]',
          'dark:shadow-[0_1px_2px_rgba(0,0,0,0.30),_0_8px_24px_rgba(0,0,0,0.40),_0_24px_64px_rgba(0,0,0,0.55)]',
          'data-[size=default]:max-w-md data-[size=sm]:max-w-sm',
          'duration-200',
          'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
          'data-closed:animate-out data-closed:fade-out-0',
          className,
        )}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn('flex flex-col gap-2.5 px-7 pt-7 pb-2', className)}
      {...props}
    />
  )
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        'mt-4 flex flex-col-reverse gap-2.5 border-t border-black/[0.05] px-7 py-5 dark:border-white/[0.06]',
        'sm:flex-row sm:justify-end sm:gap-3',
        className,
      )}
      {...props}
    />
  )
}

function AlertDialogMedia({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(
        'mb-1 inline-flex size-11 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary dark:bg-white/[0.06] dark:text-white',
        "*:[svg:not([class*='size-'])]:size-5",
        className,
      )}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(
        'font-headline text-[19px] font-semibold leading-tight tracking-[-0.01em] text-zinc-900 dark:text-white',
        className,
      )}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(
        'font-body text-[14.5px] leading-relaxed text-zinc-600 dark:text-zinc-400',
        '*:[a]:font-medium *:[a]:text-primary *:[a]:underline-offset-4 *:[a]:hover:underline dark:*:[a]:text-primary-fixed-dim',
        className,
      )}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  variant = 'primary',
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> & {
  variant?: AlertDialogActionVariant
}) {
  return (
    <AlertDialogPrimitive.Action
      data-slot="alert-dialog-action"
      className={cn(ACTION_BASE, ACTION_VARIANTS[variant], className)}
      {...props}
    />
  )
}

function AlertDialogCancel({
  className,
  variant = 'ghost',
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> & {
  variant?: AlertDialogActionVariant
}) {
  return (
    <AlertDialogPrimitive.Cancel
      data-slot="alert-dialog-cancel"
      className={cn(ACTION_BASE, ACTION_VARIANTS[variant], className)}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
