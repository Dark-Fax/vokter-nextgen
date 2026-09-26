import { ArrowUpRight, PackageCheck } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { Order } from '../context/AccountContext'
import { useAccount } from '../hooks/useAccount'
import { pointValue } from '../utils/points'
import { formatPrice, priceOf } from '../utils/price'

// Los pedidos vienen de localStorage, así que pueden llegar incompletos de versiones anteriores.
function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Fecha no registrada'
  return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
}

function linesOf(order: Order) { return Array.isArray(order.lines) ? order.lines : [] }
function itemsIn(order: Order) { return linesOf(order).reduce((total, line) => total + line.quantity, 0) }

function OrderCard({ order }: { order: Order }) {
  const items = itemsIn(order)
  return <article className="order-card"><div className="order-card-head"><div><p className="eyebrow">{formatDate(order.createdAt)}</p><h3>{order.id}</h3></div><strong>{formatPrice(order.total)}</strong></div><div className="order-card-lines">{linesOf(order).map((line) => <div key={line.product.id}><span>{line.quantity} × {line.product.name}</span><strong>{formatPrice(priceOf(line.product) * line.quantity)}</strong></div>)}</div><div className="order-card-foot"><span>{items} {items === 1 ? 'artículo' : 'artículos'}</span>{order.pointsUsed > 0 ? <span className="order-tag is-spent">−{order.pointsUsed} pts</span> : null}<span className="order-tag">+{order.pointsEarned} pts</span><Link className="text-link" to={`/pedido/confirmado?pedido=${order.id}`}>Ver pedido <ArrowUpRight size={14} /></Link></div></article>
}

export function AccountPage() {
  const [searchParams] = useSearchParams()
  const { points, orders } = useAccount()
  const profile = orders[0]?.customer
  const totalSpent = orders.reduce((total, order) => total + order.total, 0)
  const pointsSpent = orders.reduce((total, order) => total + order.pointsUsed, 0)
  useEffect(() => { if (searchParams.get('section') === 'points') document.getElementById('points-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }, [searchParams])

  return <section className="page-section account-page"><p className="eyebrow">CUENTA / DEMO</p><h1>Tu espacio<br /><em>VOKTER.</em></h1><div className="account-grid"><div><p className="eyebrow">PERFIL</p><h2>Hola, {profile ? profile.name.split(' ')[0] : 'Alex'}.</h2>{profile ? <dl className="profile-list"><div><dt>Nombre</dt><dd>{profile.name}</dd></div><div><dt>Correo</dt><dd>{profile.email}</dd></div><div><dt>Teléfono</dt><dd>{profile.phone}</dd></div><div><dt>Ciudad</dt><dd>{profile.city}</dd></div><div><dt>Dirección</dt><dd>{profile.address}</dd></div></dl> : <p>Tu cuenta simulada está lista. Completa un pedido y aquí quedarán tus datos de envío.</p>}</div><div className="points-card" id="points-section"><p className="eyebrow">PUNTOS VOKTER</p><strong>{points}</strong><span>puntos disponibles</span><p>Acumula 1 punto por cada $1.000 de compra y canjéalos en el checkout: cada punto vale ${pointValue}.</p></div></div><div className="account-stats"><div><strong>{orders.length.toString().padStart(2, '0')}</strong><span>{orders.length === 1 ? 'pedido realizado' : 'pedidos realizados'}</span></div><div><strong>{formatPrice(totalSpent)}</strong><span>total comprado</span></div><div><strong>{pointsSpent}</strong><span>puntos canjeados</span></div></div><div className="order-history"><p className="eyebrow">HISTORIAL / {orders.length.toString().padStart(2, '0')} PEDIDOS</p>{orders.length ? <div className="order-list">{orders.map((order) => <OrderCard key={order.id} order={order} />)}</div> : <div className="order-empty"><div className="empty-icon"><PackageCheck size={22} /></div><h2>Todavía no tienes pedidos.</h2><p>Cuando completes uno, aquí vas a ver el detalle completo y los puntos que ganaste.</p><Link className="text-link" to="/tienda">Explorar tienda <ArrowUpRight size={15} /></Link></div>}</div></section>
}
