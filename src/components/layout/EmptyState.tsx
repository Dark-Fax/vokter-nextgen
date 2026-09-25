import { ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function EmptyState({ icon, eyebrow, title, description, action, to }: { icon: ReactNode; eyebrow: string; title: string; description: string; action: string; to: string }) {
  return <section className="empty-page"><div className="empty-icon">{icon}</div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p><Link className="primary-link" to={to}>{action} <ArrowUpRight size={17} /></Link></section>
}
