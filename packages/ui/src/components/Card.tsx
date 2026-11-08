import React from 'react'
import { cn } from '../lib/utils'

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-xl border border-white/20 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-lg', className)}
      {...props}
    />
  )
)
Card.displayName = 'Card'
