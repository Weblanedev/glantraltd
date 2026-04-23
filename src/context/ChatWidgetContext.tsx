'use client'

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react'

type ChatWidgetValue = {
  open: boolean
  setOpen: (v: boolean) => void
  toggle: () => void
}

const ChatWidgetContext = createContext<ChatWidgetValue | null>(null)

export function ChatWidgetProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const toggle = useCallback(() => {
    setOpen((o) => !o)
  }, [])
  return (
    <ChatWidgetContext.Provider value={{ open, setOpen, toggle }}>
      {children}
    </ChatWidgetContext.Provider>
  )
}

export function useChatWidget() {
  const c = useContext(ChatWidgetContext)
  if (!c) throw new Error('useChatWidget must be under ChatWidgetProvider')
  return c
}
