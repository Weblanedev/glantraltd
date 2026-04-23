'use client'

import ReactMarkdown from 'react-markdown'

type Props = { content: string }

/**
 * Renders legal / long-form markdown with Glantra-friendly typography.
 */
export function MarkdownArticle({ content }: Props) {
  return (
    <div
      className={`
        prose prose-slate max-w-none
        prose-headings:font-display prose-headings:font-semibold prose-headings:text-brand-800
        prose-h2:mt-10 prose-h2:scroll-mt-24 prose-h2:text-xl
        prose-h2:border-b prose-h2:border-brand-100 prose-h2:pb-2
        prose-p:text-slate-600 prose-p:leading-relaxed
        prose-a:text-brand-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
        prose-li:text-slate-600
        prose-strong:text-slate-800
        prose-hr:border-slate-200
      `}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
