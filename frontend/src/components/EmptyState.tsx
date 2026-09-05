import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  children?: ReactNode
}

export function EmptyState({ title, children }: EmptyStateProps) {
  return (
    <div className="state">
      <h2 className="state__title">{title}</h2>
      {children}
    </div>
  )
}
