import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  variant?: 'cyan' | 'amber' | 'coral'
}

export default function GlassCard({ children, className = '', variant = 'cyan' }: GlassCardProps) {
  const variantClass = variant === 'amber' ? 'glass-amber' : variant === 'coral' ? 'glass-coral' : 'glass'
  return (
    <div className={`${variantClass} rounded-2xl ${className}`}>
      {children}
    </div>
  )
}
