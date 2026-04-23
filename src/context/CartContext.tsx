'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { getUnitPrice, formatUsd } from '@/lib/pricing'
import toast from 'react-hot-toast'

import { pickImage } from '@/lib/dummyjson'
import type { StoreProduct } from '@/lib/store-types'

const STORAGE_KEY = 'glantra_cart'
const LEGACY_STORAGE_KEY = 'techvault_cart'

export interface CartLine {
  sku: number
  name: string
  unitPrice: number
  imageUrl?: string
  qty: number
}

type CartState = { lines: CartLine[] }

type CartContextValue = {
  lines: CartLine[]
  addFromProduct: (p: StoreProduct, qty?: number) => void
  setQty: (sku: number, qty: number) => void
  remove: (sku: number) => void
  clear: () => void
  subtotal: number
  itemCount: number
  formatLineTotal: (line: CartLine) => string
}

const CartContext = createContext<CartContextValue | null>(null)

function load(): CartState {
  if (typeof window === 'undefined') return { lines: [] }
  try {
    let raw = localStorage.getItem(STORAGE_KEY)
    if (!raw && localStorage.getItem(LEGACY_STORAGE_KEY)) {
      raw = localStorage.getItem(LEGACY_STORAGE_KEY)
      if (raw) {
        localStorage.setItem(STORAGE_KEY, raw)
        localStorage.removeItem(LEGACY_STORAGE_KEY)
      }
    }
    if (!raw) return { lines: [] }
    const j = JSON.parse(raw) as CartState
    if (!j.lines || !Array.isArray(j.lines)) return { lines: [] }
    return j
  } catch {
    return { lines: [] }
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>(() =>
    typeof window === 'undefined' ? { lines: [] } : load()
  )

  const persist = useCallback((s: CartState) => {
    setState(s)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
    } catch {
      // ignore
    }
  }, [])

  const addFromProduct = useCallback(
    (p: StoreProduct, qty = 1) => {
      const price = getUnitPrice(p.salePrice, p.regularPrice)
      if (price <= 0) {
        toast.error('This item is unavailable to add right now.')
        return
      }
      const img = pickImage(p)
      setState((prev) => {
        const lines = [...prev.lines]
        const i = lines.findIndex((l) => l.sku === p.sku)
        if (i >= 0) {
          lines[i] = { ...lines[i]!, qty: lines[i]!.qty + qty }
        } else {
          lines.push({
            sku: p.sku,
            name: p.name,
            unitPrice: price,
            imageUrl: img,
            qty,
          })
        }
        const next = { lines }
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        } catch {
          // ignore
        }
        return next
      })
      toast.success('Added to cart', { position: 'bottom-right' })
    },
    []
  )

  const setQty = useCallback(
    (sku: number, qty: number) => {
      if (qty < 1) {
        setState((prev) => {
          const next = { lines: prev.lines.filter((l) => l.sku !== sku) }
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
          } catch {
            // ignore
          }
          return next
        })
        return
      }
      setState((prev) => {
        const lines = prev.lines.map((l) =>
          l.sku === sku ? { ...l, qty } : l
        )
        const next = { lines }
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        } catch {
          // ignore
        }
        return next
      })
    },
    []
  )

  const remove = useCallback((sku: number) => {
    setState((prev) => {
      const next = { lines: prev.lines.filter((l) => l.sku !== sku) }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  const clear = useCallback(() => {
    persist({ lines: [] })
  }, [persist])

  const subtotal = useMemo(
    () => state.lines.reduce((a, l) => a + l.unitPrice * l.qty, 0),
    [state.lines]
  )
  const itemCount = useMemo(
    () => state.lines.reduce((a, l) => a + l.qty, 0),
    [state.lines]
  )

  const formatLineTotal = useCallback(
    (line: CartLine) => formatUsd(line.unitPrice * line.qty),
    []
  )

  const value: CartContextValue = {
    lines: state.lines,
    addFromProduct,
    setQty,
    remove,
    clear,
    subtotal,
    itemCount,
    formatLineTotal,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const c = useContext(CartContext)
  if (!c) throw new Error('useCart must be under CartProvider')
  return c
}
