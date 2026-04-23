'use client'

import { usePathname, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import { useAuth } from '@/context/AuthContext'
import { useChatWidget } from '@/context/ChatWidgetContext'

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const fabClassName =
  'fixed bottom-5 right-4 z-[60] inline-flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg ring-2 ring-emerald-600/30 transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 sm:bottom-6 sm:right-6'

/** Signed-in: contact page. Guests: toast + login (returns via `next`). */
export function ChatUsButton() {
  const { user, loading } = useAuth()
  const { toggle, open } = useChatWidget()
  const router = useRouter()
  const path = usePathname()

  if (loading) {
    return null
  }

  if (user) {
    return (
      <button
        type="button"
        onClick={toggle}
        className={fabClassName}
        aria-label={open ? 'Close chat' : 'Open chat with us'}
        aria-expanded={open}
      >
        <ChatIcon className="h-5 w-5 shrink-0" />
        <span>Chat with us</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      className={fabClassName}
      aria-label="Chat with us"
      onClick={() => {
        toast('You need to log in to chat with us.', {
          duration: 2200,
        })
        const next = path === '/login' || path === '/register' ? '/dashboard' : path
        setTimeout(() => {
          router.push(`/login?next=${encodeURIComponent(next)}`)
        }, 600)
      }}
    >
      <ChatIcon className="h-5 w-5 shrink-0" />
      <span>Chat with us</span>
    </button>
  )
}
