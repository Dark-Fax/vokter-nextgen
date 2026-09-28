import type { OrderTotals } from '../../utils/pricing'
import { formatPrice } from '../../utils/price'

// Filas del resumen de compra compartidas por carrito, checkout y confirmación.
export function SummaryRows({ totals, bundleNames = [] }: { totals: OrderTotals; bundleNames?: string[] }) {
  return <>
    <div className="summary-divider"><span>Subtotal</span><strong>{formatPrice(totals.subtotal)}</strong></div>
    {totals.bundleDiscount > 0 ? <div className="summary-discount"><span>{bundleNames.length ? bundleNames.join(' + ') : 'Descuento por combos'}</span><strong>−{formatPrice(totals.bundleDiscount)}</strong></div> : null}
    <div><span>Envío</span><strong>{totals.shipping ? formatPrice(totals.shipping) : 'Gratis'}</strong></div>
    {totals.discount > 0 ? <div className="summary-discount"><span>Puntos usados ({totals.pointsUsed})</span><strong>−{formatPrice(totals.discount)}</strong></div> : null}
  </>
}
