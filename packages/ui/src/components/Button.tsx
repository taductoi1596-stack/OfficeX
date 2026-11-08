import React from 'react'
import { cn } from '../lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-md',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-100',
      ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
      glass: 'bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 text-gray-900 dark:text-white hover:bg-white/30 dark:hover:bg-black/30',
    }
    return (
      <button
        ref={ref}
        className={cn('inline-flex items-center justify-center px-4 py-2 rounded-md transition-all duration-200 font-medium', variants[variant], className)}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
