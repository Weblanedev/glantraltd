'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { formatUsd } from '@/lib/pricing'

type State = 'idle' | 'loading' | 'error'

export function PaymentModal({
  open,
  onClose,
  totalUsd,
}: {
  open: boolean
  onClose: () => void
  totalUsd: number
}) {
  const router = useRouter()
  const [state, setState] = useState<State>('idle')

  useEffect(() => {
    if (open) setState('idle')
  }, [open])

  if (!open) return null

  function startPay() {
    setState('loading')
    toast('Processing payment…', { icon: '⏳' })
    window.setTimeout(() => {
      setState('error')
      toast.error('Payment gateway could not be reached. No charge was made.')
    }, 1800)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
        role="dialog"
        aria-modal
        aria-labelledby="payment-title"
      >
        <h2
          id="payment-title"
          className="font-display text-lg font-semibold text-slate-900"
        >
          Payment
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Order total: {formatUsd(totalUsd)}
        </p>
        {state === 'idle' && (
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={startPay}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-amber-400"
            >
              Pay now
            </button>
          </div>
        )}
        {state === 'loading' && (
          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
            <p className="text-sm text-slate-600">Contacting payment gateway…</p>
          </div>
        )}
        {state === 'error' && (
          <div className="mt-4">
            <p className="text-sm text-amber-900" role="alert">
              The payment gateway is not available right now. Please try again in a
              moment, or return to the shop to keep browsing.
            </p>
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setState('idle')
                  toast('Ready to try again', { icon: '↻' })
                }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-800 transition hover:bg-slate-50"
              >
                Try again
              </button>
              <button
                type="button"
                onClick={() => {
                  setState('idle')
                  onClose()
                  router.push('/products')
                }}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-500"
              >
                Back to products
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
