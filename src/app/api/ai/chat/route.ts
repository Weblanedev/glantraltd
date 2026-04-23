import { NextResponse, type NextRequest } from 'next/server'

import { buildProductContextForAI } from '@/lib/ai/build-product-context'
import { getUserById } from '@/lib/auth'
import { siteName } from '@/lib/site'
import { parseSessionToken } from '@/lib/session'

const COOKIE = 'techvault_session'

type ChatMsg = { role: 'user' | 'assistant' | 'system'; content: string }

export async function POST(req: NextRequest) {
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    return NextResponse.json(
      { error: 'AI chat is not configured. Add OPENAI_API_KEY to the server environment.' },
      { status: 503 }
    )
  }

  const token = req.cookies.get(COOKIE)?.value
  const s = parseSessionToken(token)
  if (!s) {
    return NextResponse.json({ error: 'Sign in to use chat.' }, { status: 401 })
  }
  const record = await getUserById(s.userId)
  if (!record) {
    return NextResponse.json({ error: 'Sign in to use chat.' }, { status: 401 })
  }

  let body: { messages?: ChatMsg[] }
  try {
    body = (await req.json()) as { messages?: ChatMsg[] }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const raw = body.messages
  if (!Array.isArray(raw) || raw.length === 0) {
    return NextResponse.json({ error: 'messages[] required' }, { status: 400 })
  }
  if (raw.length > 30) {
    return NextResponse.json({ error: 'Too many messages' }, { status: 400 })
  }

  const messages: ChatMsg[] = []
  for (const m of raw) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant')) {
      return NextResponse.json({ error: 'Invalid message role' }, { status: 400 })
    }
    const content = String(m.content || '').trim()
    if (content.length > 8000) {
      return NextResponse.json({ error: 'Message too long' }, { status: 400 })
    }
    if (!content) {
      return NextResponse.json({ error: 'Empty message' }, { status: 400 })
    }
    messages.push({ role: m.role, content })
  }

  const catalog = await buildProductContextForAI()
  const name = siteName()
  const system: ChatMsg = {
    role: 'system',
    content: `You are a helpful shopping assistant for ${name}, an online electronics store (laptops, computers, tablets, accessories). Use only the information below and general, accurate retail guidance. If a specific price or stock is not in the data, say you cannot confirm live inventory and suggest opening the product page on the site or contacting support. Keep answers concise and friendly. Do not invent SKUs, prices, or product names not present in the catalog block.

Catalog and sample listings:
${catalog}`,
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

  const oaRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      max_tokens: 900,
      messages: [system, ...messages],
    }),
  })

  if (!oaRes.ok) {
    const t = await oaRes.text()
    return NextResponse.json(
      { error: 'Assistant is temporarily unavailable.', detail: t.slice(0, 120) },
      { status: 502 }
    )
  }

  const oa = (await oaRes.json()) as {
    choices?: { message?: { content?: string } }[]
  }
  const reply = oa.choices?.[0]?.message?.content?.trim() || ''
  if (!reply) {
    return NextResponse.json({ error: 'Empty assistant reply' }, { status: 502 })
  }

  return NextResponse.json({ reply })
}
