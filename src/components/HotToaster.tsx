'use client'

import { Toaster } from 'react-hot-toast'

export function HotToaster() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        className: '!bg-slate-900 !text-slate-100 !px-4 !py-3 !shadow-lg !rounded-xl !text-sm !font-sans !border !border-slate-700',
        duration: 4000,
        style: {
          maxWidth: 420,
        },
        success: {
          iconTheme: { primary: '#22d3ee', secondary: '#0f172a' },
        },
        error: {
          iconTheme: { primary: '#f87171', secondary: '#0f172a' },
        },
      }}
    />
  )
}
