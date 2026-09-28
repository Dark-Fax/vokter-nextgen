import { ArrowUpRight, Check, LoaderCircle, ShieldCheck, ShoppingBag, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EmptyState } from '../components/layout/EmptyState'
import type { OrderCustomer } from '../context/AccountContext'
import { useAccount } from '../hooks/useAccount'
import { useCart } from '../hooks/useCart'
import { SummaryRows } from '../components/cart/SummaryRows'
import { pointValue } from '../utils/points'
import { appliedBundles, orderTotals } from '../utils/pricing'
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

// Pausa simulada del pago: da tiempo a mostrar el estado de procesamiento antes de confirmar.
const processingSteps = ['Verificando tus datos', 'Confirmando el pago']
const stepDuration = 900

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
  const { lines, clearCart } = useCart()
  const { points, placeOrder } = useAccount()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<OrderCustomer>(emptyCustomer)
  const [errors, setErrors] = useState<FormErrors>({})
  const [usePoints, setUsePoints] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), [])

  const redeemable = useMemo(() => orderTotals(lines, points, points).pointsUsed, [lines, points])
  const totals = useMemo(() => orderTotals(lines, usePoints ? points : 0, points), [lines, points, usePoints])

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
    setProcessingStep(0)
    timers.current.push(window.setTimeout(() => setProcessingStep(1), stepDuration))
    timers.current.push(window.setTimeout(() => {
      const order = placeOrder({ lines, pointsUsed: totals.pointsUsed, customer: cleanCustomer })
      clearCart()
      navigate(`/pedido/confirmado?pedido=${order.id}`, { replace: true })
    }, stepDuration * processingSteps.length))
  }

  if (!lines.length) return <EmptyState icon={<ShoppingBag />} eyebrow="CHECKOUT / 00" title="No hay nada que pagar." description="Agrega productos al carrito para completar tu pedido." action="Explorar tienda" to="/tienda" />

  return <section className="page-section checkout-page"><p className="eyebrow">CHECKOUT / ENVÍO Y PAGO</p><h1>Último paso<br /><em>y listo.</em></h1><div className="checkout-layout"><form className="checkout-form" id="checkout-form" onSubmit={handleSubmit} noValidate aria-busy={isProcessing}><fieldset className="checkout-fieldset" disabled={isProcessing}><p className="eyebrow">DATOS DE ENVÍO</p>{fields.map((field) => <label className="checkout-field" key={field.name}><span>{field.label}</span><input type={field.type} name={field.name} value={customer[field.name]} placeholder={field.placeholder} autoComplete={field.autoComplete} maxLength={80} aria-invalid={Boolean(errors[field.name])} onChange={(event) => handleChange(field.name, event.target.value)} />{errors[field.name] ? <small className="input-notice" role="alert">{errors[field.name]}</small> : null}</label>)}<p className="eyebrow">MÉTODO DE PAGO</p><div className="payment-note"><ShieldCheck size={18} /><span>Pago simulado contra entrega. Esta demo no procesa cobros reales ni envía tus datos a ningún servidor.</span></div></fieldset></form><aside className="cart-summary checkout-summary"><p className="eyebrow">RESUMEN</p>{lines.map((line) => <div key={line.product.id}><span>{line.quantity} × {line.product.name}</span><strong>{formatPrice(priceOf(line.product) * line.quantity)}</strong></div>)}<SummaryRows totals={totals} bundleNames={appliedBundles(lines).map((applied) => applied.bundle.name)} /><div className="points-row">{redeemable > 0 ? <label className="points-toggle"><input type="checkbox" checked={usePoints} onChange={(event) => setUsePoints(event.target.checked)} /><span>Usar {redeemable} pts (−{formatPrice(redeemable * pointValue)})</span></label> : <p className="points-hint">Tienes {points} pts disponibles. Cada punto vale ${pointValue} en tus compras.</p>}</div><div className="summary-total"><span>Total</span><strong>{formatPrice(totals.total)}</strong></div><p className="points-hint"><Sparkles size={14} /> Ganarás {totals.pointsEarned} pts con este pedido.</p><button className="primary-link checkout-submit" type="submit" form="checkout-form" disabled={isProcessing}>{isProcessing ? <><LoaderCircle className="spinner" size={17} /> Procesando pedido…</> : <>Confirmar pedido <ArrowUpRight size={17} /></>}</button><Link className="text-link" to="/carrito">Volver al carrito</Link></aside></div>{isProcessing ? <div className="processing-overlay" role="status" aria-live="polite"><div className="processing-card"><LoaderCircle className="spinner" size={34} /><p className="eyebrow">PROCESANDO PAGO</p><h2>Estamos confirmando tu pedido.</h2><ol>{processingSteps.map((step, index) => <li key={step} className={index < processingStep ? 'is-done' : index === processingStep ? 'is-current' : ''}>{index < processingStep ? <Check size={15} /> : <span />}{step}</li>)}</ol><small>No cierres la app. Esto toma unos segundos.</small></div></div> : null}</section>
}
