import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function Alert({ className, ...props }: ComponentProps<'div'>) {
  return <div role="alert" className={cn('relative w-full rounded-lg border border-destructive/50 p-4 text-destructive', className)} {...props} />
}
