import { ArrowUpRight, ShoppingBag, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'

export function CartPage() { return <EmptyState icon={<ShoppingBag />} eyebrow="CARRITO / 00" title="Tu carrito todavía está vacío." description="Guarda algo para continuar cuando estés listo." action="Explorar tienda" to="/tienda" /> }
export function WishlistPage() { return <EmptyState icon={<HeartIcon />} eyebrow="WISHLIST / 00" title="Tu wishlist está esperando." description="Marca productos para volver a ellos después." action="Ver productos" to="/tienda" /> }
export function AccountPage() { return <EmptyState icon={<UserRound />} eyebrow="CUENTA / DEMO" title="Tu espacio VOKTER." description="Aquí verás tus puntos y pedidos cuando conectemos la persistencia." action="Ir a la tienda" to="/tienda" /> }
export function CheckoutPage() { return <EmptyState icon={<ShoppingBag />} eyebrow="CHECKOUT / DEMO" title="Checkout simulado." description="El formulario de envío estará disponible en la siguiente fase funcional." action="Volver al carrito" to="/carrito" /> }
export function ConfirmationPage() { return <EmptyState icon={<ArrowUpRight />} eyebrow="PEDIDO / CONFIRMADO" title="Pedido confirmado." description="Esta pantalla queda lista para recibir el resumen de compra." action="Seguir comprando" to="/tienda" /> }

function EmptyState({ icon, eyebrow, title, description, action, to }: { icon: React.ReactNode; eyebrow: string; title: string; description: string; action: string; to: string }) { return <section className="empty-page"><div className="empty-icon">{icon}</div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p><Link className="primary-link" to={to}>{action} <ArrowUpRight size={17} /></Link></section> }
function HeartIcon() { return <span>♡</span> }