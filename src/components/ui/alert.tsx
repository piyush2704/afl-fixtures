import type { ComponentProps } from 'react'

export function Alert({ className = '', ...props }: ComponentProps<'div'>) {
  return <div role="alert" className={`relative w-full rounded-lg border border-destructive/50 p-4 text-destructive ${className}`} {...props} />
}
