import { createContext, useEffect, useState, type ReactNode } from 'react'
import type { CartLine } from './CartContext'
import { maxRedeemablePoints, pointValue, pointsEarnedFor } from '../utils/points'
import { parseAccount, readStored } from '../utils/storedData'

export type OrderCustomer = { name: string; email: string; phone: string; address: string; city: string }
export type Order = { id: string; createdAt: string; lines: CartLine[]; subtotal: number; pointsUsed: number; discount: number; total: number; pointsEarned: number; customer: OrderCustomer }
export type PlaceOrderInput = { lines: CartLine[]; subtotal: number; pointsUsed: number; customer: OrderCustomer }

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

  function placeOrder({ lines, subtotal, pointsUsed, customer }: PlaceOrderInput) {
    const redeemed = maxRedeemablePoints(Math.min(pointsUsed, account.points), subtotal)
    const discount = redeemed * pointValue
    const total = Math.max(0, subtotal - discount)
    const order: Order = { id: createOrderId(), createdAt: new Date().toISOString(), lines, subtotal, pointsUsed: redeemed, discount, total, pointsEarned: pointsEarnedFor(total), customer }
    setAccount((current) => ({ points: Math.max(0, current.points - redeemed) + order.pointsEarned, orders: [order, ...current.orders] }))
    return order
  }

  return <AccountContext.Provider value={{ points: account.points, orders: account.orders, placeOrder }}>{children}</AccountContext.Provider>
}

export { AccountContext }
