import { ArrowUpRight, ShieldCheck, ShoppingBag, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EmptyState } from '../components/layout/EmptyState'
import type { OrderCustomer } from '../context/AccountContext'
import { useAccount } from '../hooks/useAccount'
import { useCart } from '../hooks/useCart'
import { maxRedeemablePoints, pointValue, pointsEarnedFor } from '../utils/points'
import { formatPrice, priceOf } from '../utils/price'
import { sanitizeField, sanitizeInput } from '../utils/sanitizeInput'

type FormField = keyof OrderCustomer
type FormErrors = Partial<Record<FormField, string>>

const fields: { name: FormField; label: string; placeholder: string; type: string; autoComplete: string }[] = [
  { name: 'name', label: 'Nombre completo', placeholder: 'Alex Rivera', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Correo', placeholder: 'alex@correo.com', type: 'email', autoComplete: 'email' },
  { name: 'phone', label: 'Teléfono', placeholder: '3001234567', type: 'tel', autoComplete: 'tel' },
  { name: 'city', label: 'Ciudad', placeholder: 'Bogotá', type: 'text', autoComplete: 'address-level2' },
  { name: 'address', label: 'Dirección de envío', placeholder: 'Calle 100 # 15-20, Apto 301', type: 'text', autoComplete: 'street-address' },
]

const emptyCustomer: OrderCustomer = { name: '', email: '', phone: '', address: '', city: '' }

function validate(customer: OrderCustomer): FormErrors {
  const errors: FormErrors = {}
  if (customer.name.trim().length < 3) errors.name = 'Escribe tu nombre completo.'
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(customer.email)) errors.email = 'Escribe un correo válido.'
  if (!/^\d{7,12}$/.test(customer.phone.replace(/\s/g, ''))) errors.phone = 'Usa entre 7 y 12 dígitos.'
  if (customer.city.trim().length < 3) errors.city = 'Indica tu ciudad.'
  if (customer.address.trim().length < 6) errors.address = 'Indica una dirección completa.'
  return errors
}

export function CheckoutPage() {
  const { lines, subtotal, clearCart } = useCart()
  const { points, placeOrder } = useAccount()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<OrderCustomer>(emptyCustomer)
  const [errors, setErrors] = useState<FormErrors>({})
  const [usePoints, setUsePoints] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const redeemable = useMemo(() => maxRedeemablePoints(points, subtotal), [points, subtotal])
  const pointsUsed = usePoints ? redeemable : 0
  const discount = pointsUsed * pointValue
  const total = Math.max(0, subtotal - discount)

  function handleChange(name: FormField, value: string) {
    setCustomer((current) => ({ ...current, [name]: sanitizeField(value) }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanCustomer: OrderCustomer = { name: sanitizeInput(customer.name), email: sanitizeInput(customer.email), phone: sanitizeInput(customer.phone), address: sanitizeInput(customer.address), city: sanitizeInput(customer.city) }
    const nextErrors = validate(cleanCustomer)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length || isProcessing) return
    setIsProcessing(true)
    const order = placeOrder({ lines, subtotal, pointsUsed, customer: cleanCustomer })
    clearCart()
    navigate(`/pedido/confirmado?pedido=${order.id}`, { replace: true })
  }

  if (!lines.length) return <EmptyState icon={<ShoppingBag />} eyebrow="CHECKOUT / 00" title="No hay nada que pagar." description="Agrega productos al carrito para completar tu pedido." action="Explorar tienda" to="/tienda" />

  return <section className="page-section checkout-page"><p className="eyebrow">CHECKOUT / ENVÍO Y PAGO</p><h1>Último paso<br /><em>y listo.</em></h1><div className="checkout-layout"><form className="checkout-form" onSubmit={handleSubmit} noValidate><p className="eyebrow">DATOS DE ENVÍO</p>{fields.map((field) => <label className="checkout-field" key={field.name}><span>{field.label}</span><input type={field.type} name={field.name} value={customer[field.name]} placeholder={field.placeholder} autoComplete={field.autoComplete} maxLength={80} aria-invalid={Boolean(errors[field.name])} onChange={(event) => handleChange(field.name, event.target.value)} />{errors[field.name] ? <small className="input-notice" role="alert">{errors[field.name]}</small> : null}</label>)}<p className="eyebrow">MÉTODO DE PAGO</p><div className="payment-note"><ShieldCheck size={18} /><span>Pago simulado contra entrega. Esta demo no procesa cobros reales ni envía tus datos a ningún servidor.</span></div><button className="primary-link checkout-submit" type="submit" disabled={isProcessing}>{isProcessing ? 'Procesando pedido…' : 'Confirmar pedido'} <ArrowUpRight size={17} /></button></form><aside className="cart-summary checkout-summary"><p className="eyebrow">RESUMEN</p>{lines.map((line) => <div key={line.product.id}><span>{line.quantity} × {line.product.name}</span><strong>{formatPrice(priceOf(line.product) * line.quantity)}</strong></div>)}<div className="summary-divider"><span>Subtotal</span><strong>${subtotal.toLocaleString('es-CO')}</strong></div><div><span>Envío</span><strong>Gratis</strong></div>{redeemable > 0 ? <label className="points-toggle"><input type="checkbox" checked={usePoints} onChange={(event) => setUsePoints(event.target.checked)} /><span>Usar {redeemable} pts (−${(redeemable * pointValue).toLocaleString('es-CO')})</span></label> : <p className="points-hint">Tienes {points} pts disponibles. Cada punto vale ${pointValue} en tus compras.</p>}{discount > 0 ? <div className="summary-discount"><span>Descuento por puntos</span><strong>−${discount.toLocaleString('es-CO')}</strong></div> : null}<div className="summary-total"><span>Total</span><strong>${total.toLocaleString('es-CO')}</strong></div><p className="points-hint"><Sparkles size={14} /> Ganarás {pointsEarnedFor(total)} pts con este pedido.</p><Link className="text-link" to="/carrito">Volver al carrito</Link></aside></div></section>
}
