import { ArrowUpRight, PackageCheck, Sparkles } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { EmptyState } from '../components/layout/EmptyState'
import { useAccount } from '../hooks/useAccount'
import { pointValue } from '../utils/points'

export function ConfirmationPage() {
  const [searchParams] = useSearchParams()
  const { orders, points } = useAccount()
  const orderId = searchParams.get('pedido')
  const order = orderId ? orders.find((item) => item.id === orderId) : orders[0]

  if (!order) return <EmptyState icon={<ArrowUpRight />} eyebrow="PEDIDO / SIN REGISTRO" title="No encontramos ese pedido." description="Puede que se haya hecho en otro dispositivo o que el enlace ya no sea válido." action="Seguir comprando" to="/tienda" />

  return <section className="page-section confirmation-page"><div className="empty-icon"><PackageCheck size={24} /></div><p className="eyebrow">PEDIDO / {order.id}</p><h1>Gracias,<br /><em>{order.customer.name.split(' ')[0]}.</em></h1><p className="confirmation-lead">Tu pedido quedó confirmado y sale hacia {order.customer.address}, {order.customer.city}. Te escribiremos a {order.customer.email} con el seguimiento.</p><div className="confirmation-grid"><div className="cart-summary"><p className="eyebrow">DETALLE</p>{order.lines.map((line) => <div key={line.product.id}><span>{line.quantity} × {line.product.name}</span><strong>{line.product.price}</strong></div>)}<div className="summary-divider"><span>Subtotal</span><strong>${order.subtotal.toLocaleString('es-CO')}</strong></div>{order.discount > 0 ? <div className="summary-discount"><span>Puntos usados ({order.pointsUsed})</span><strong>−${order.discount.toLocaleString('es-CO')}</strong></div> : null}<div className="summary-total"><span>Total pagado</span><strong>${order.total.toLocaleString('es-CO')}</strong></div></div><div className="points-card"><p className="eyebrow">PUNTOS VOKTER</p><strong>+{order.pointsEarned}</strong><span>puntos ganados</span><p>Tu saldo actual es de {points} pts. Cada punto vale ${pointValue} en tu próxima compra.</p><Link className="text-link" to="/cuenta?section=points"><Sparkles size={14} /> Ver mis puntos</Link></div></div><Link className="primary-link confirmation-cta" to="/tienda">Seguir comprando <ArrowUpRight size={17} /></Link></section>
}
