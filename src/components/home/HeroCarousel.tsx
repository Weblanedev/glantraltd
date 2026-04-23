'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

import { formatUsd } from '@/lib/pricing'

export type HeroSlide =
  | {
      id: string
      kind: 'promo'
      title: string
      description: string
      cta: { href: string; label: string }
      accent: 'gold' | 'cyan'
    }
  | {
      id: string
      kind: 'category'
      title: string
      description: string
      href: string
      tag: string
    }
  | {
      id: string
      kind: 'product'
      name: string
      price: number
      image?: string
      href: string
    }

const INTERVAL_MS = 7000

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [i, setI] = useState(0)
  const reduceMotion = useReducedMotion()

  const next = useCallback(() => {
    setI((k) => (slides.length ? (k + 1) % slides.length : 0))
  }, [slides.length])

  const prev = useCallback(() => {
    setI((k) => (slides.length ? (k - 1 + slides.length) % slides.length : 0))
  }, [slides.length])

  useEffect(() => {
    if (slides.length < 2 || reduceMotion) return
    const t = window.setInterval(next, INTERVAL_MS)
    return () => window.clearInterval(t)
  }, [next, slides.length, reduceMotion])

  if (slides.length === 0) return null

  const s = slides[i]!

  return (
    <div className="relative min-h-[min(420px,70vw)] w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-900 shadow-lg sm:min-h-[380px]">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={s.id}
          className="absolute inset-0"
          initial={reduceMotion ? false : { opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, x: -20, transition: { duration: 0.2 } }
          }
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {s.kind === 'promo' && (
            <div
              className={`flex h-full min-h-[320px] flex-col justify-center px-6 py-8 sm:px-12 sm:py-10 ${
                s.accent === 'gold'
                  ? 'bg-gradient-to-br from-amber-900/40 via-slate-900 to-slate-900'
                  : 'bg-gradient-to-br from-cyan-900/40 via-slate-900 to-slate-900'
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300/90">
                Featured
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-white sm:text-4xl sm:leading-tight">
                {s.title}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                {s.description}
              </p>
              <Link
                href={s.cta.href}
                className="mt-6 inline-flex w-max rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow transition hover:bg-cyan-400"
              >
                {s.cta.label}
              </Link>
            </div>
          )}
          {s.kind === 'category' && (
            <div className="flex h-full min-h-[320px] flex-col justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 px-6 py-8 sm:px-12 sm:py-10">
              <span className="w-max rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-0.5 text-xs font-medium text-cyan-200">
                {s.tag}
              </span>
              <h2 className="mt-3 font-display text-2xl font-semibold text-white sm:text-3xl">
                {s.title}
              </h2>
              <p className="mt-2 max-w-lg text-slate-300">{s.description}</p>
              <Link
                href={s.href}
                className="mt-5 inline-flex w-max rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
              >
                Browse category
              </Link>
            </div>
          )}
          {s.kind === 'product' && (
            <div className="grid h-full min-h-[320px] sm:grid-cols-2">
              <div className="flex flex-col justify-center bg-slate-900 px-6 py-8 sm:px-10">
                <p className="text-xs text-cyan-400/90">Spotlight</p>
                <h2 className="mt-1 font-display text-xl font-semibold text-white sm:text-2xl">
                  {s.name}
                </h2>
                <p className="mt-2 font-mono text-2xl text-amber-300">
                  {formatUsd(s.price)}
                </p>
                <Link
                  href={s.href}
                  className="mt-5 inline-flex w-max rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-400"
                >
                  View product
                </Link>
              </div>
              <div className="relative min-h-[200px] bg-slate-800/50 sm:min-h-0">
                {s.image ? (
                  <Image
                    src={s.image}
                    alt={s.name}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width:640px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex h-full min-h-[200px] items-center justify-center text-slate-500 sm:min-h-0">
                    No image
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/50 to-transparent px-3 py-3 sm:px-4">
          <div className="flex gap-1.5">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setI(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === i ? 'w-6 bg-cyan-400' : 'w-1.5 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={prev}
              className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-sm text-white backdrop-blur hover:bg-white/20"
              aria-label="Previous slide"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-sm text-white backdrop-blur hover:bg-white/20"
              aria-label="Next slide"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
