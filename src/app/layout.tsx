import { DM_Sans, JetBrains_Mono, Sora } from 'next/font/google'
import type { Metadata } from 'next'

import { AIChatPanel } from '@/components/AIChatPanel'
import { ChatUsButton } from '@/components/ChatUsButton'
import { HotToaster } from '@/components/HotToaster'
import { AuthProvider } from '@/context/AuthContext'
import { ChatWidgetProvider } from '@/context/ChatWidgetContext'
import { CartProvider } from '@/context/CartContext'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { siteName } from '@/lib/site'

import './globals.css'

const display = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

const sans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: {
    default: `${siteName()} · Electronics & e-commerce`,
    template: `%s | ${siteName()}`,
  },
  description:
    'Glantra (glantrastore.com). Shop laptops and tablets, with cart and secure checkout.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="min-h-screen bg-slate-100">
        <AuthProvider>
          <ChatWidgetProvider>
            <CartProvider>
              <Navbar />
              <main className="mx-auto min-h-[50vh] max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                {children}
              </main>
              <Footer />
              <AIChatPanel />
              <ChatUsButton />
              <HotToaster />
            </CartProvider>
          </ChatWidgetProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
