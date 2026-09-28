import { createContext, useEffect, useState, type ReactNode } from 'react'
import type { CartLine } from './CartContext'
import { orderTotals, type OrderTotals } from '../utils/pricing'
import { parseAccount, readStored } from '../utils/storedData'

export type OrderCustomer = { name: string; email: string; phone: string; address: string; city: string }
export type Order = { id: string; createdAt: string; lines: CartLine[]; customer: OrderCustomer } & OrderTotals
export type PlaceOrderInput = { lines: CartLine[]; pointsUsed: number; customer: OrderCustomer }

type AccountContextValue = { points: number; orders: Order[]; placeOrder: (input: PlaceOrderInput) => Order }

const AccountContext = createContext<AccountContextValue | null>(null)
const storageKey = 'vokter-account'

// El saldo se recalcula desde el historial validado; ver utils/storedData.ts.
function readAccount() {
  return parseAccount(readStored(storageKey))
}

function createOrderId() { return `VK-${Date.now().toString(36).toUpperCase().slice(-6)}` }

export function AccountProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState(readAccount)
  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(account))
    } catch {
      // El WebView puede tener el almacenamiento bloqueado: la sesión sigue en memoria.
    }
  }, [account])

  // Los montos se recalculan aquí con los precios del catálogo; lo que envía la pantalla solo indica qué se compra.
  function placeOrder({ lines, pointsUsed, customer }: PlaceOrderInput) {
    const totals = orderTotals(lines, pointsUsed, account.points)
    const order: Order = { id: createOrderId(), createdAt: new Date().toISOString(), lines, customer, ...totals }
    setAccount((current) => ({ points: current.points - totals.pointsUsed + totals.pointsEarned, orders: [order, ...current.orders] }))
    return order
  }

  return <AccountContext.Provider value={{ points: account.points, orders: account.orders, placeOrder }}>{children}</AccountContext.Provider>
}

export { AccountContext }
