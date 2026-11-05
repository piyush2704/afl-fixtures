import * as React from 'react'

function Card({ className = 'gap-6 py-6', ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card" className={`bg-card text-card-foreground flex flex-col rounded-xl border shadow-sm ${className}`} {...props} />
}

function CardContent({ className = 'px-6', ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={className} {...props} />
}

export { Card, CardContent }
