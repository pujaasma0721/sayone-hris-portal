'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, X, Send, ArrowUp, Lightbulb, TrendingUp, Package, Wallet, RefreshCw, AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useErp } from '@/lib/erp-store'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Msg {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  { icon: TrendingUp, text: 'Summarize this quarter in 3 bullets', tone: 'text-chart-1 bg-chart-1/10' },
  { icon: Package, text: 'Which SKUs need reordering this week?', tone: 'text-chart-2 bg-chart-2/10' },
  { icon: Wallet, text: 'How can we improve net margin?', tone: 'text-chart-3 bg-chart-3/10' },
  { icon: Lightbulb, text: 'What should I prioritize tomorrow morning?', tone: 'text-chart-5 bg-chart-5/10' },
]

// Lightweight markdown-ish renderer for **bold** and bullet lines.
function renderContent(text: string) {
  return text.split('\n').map((line, i) => {
    if (line.trim() === '') return <div key={i} className="h-2" />
    const isBullet = /^\s*[-*]\s+/.test(line)
    const content = line.replace(/^\s*[-*]\s+/, '')
    const parts = content.split(/(\*\*[^*]+\*\*)/g)
    const rendered = parts.map((p, j) =>
      p.startsWith('**') && p.endsWith('**') ? (
        <strong key={j} className="font-semibold text-foreground">{p.slice(2, -2)}</strong>
      ) : (
        <React.Fragment key={j}>{p}</React.Fragment>
      )
    )
    return (
      <p key={i} className={cn('leading-relaxed', isBullet && 'flex gap-2 pl-1')}>
        {isBullet && <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/60" />}
        <span>{rendered}</span>
      </p>
    )
  })
}

export function AiCopilot() {
  const { copilotOpen, setCopilot } = useErp()
  const [messages, setMessages] = React.useState<Msg[]>([])
  const [input, setInput] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  // Keyboard: Cmd/Ctrl+J to toggle
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault()
        setCopilot(!copilotOpen)
      }
      if (e.key === 'Escape' && copilotOpen) setCopilot(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [copilotOpen, setCopilot])

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    setError(null)
    const next: Msg[] = [...messages, { role: 'user', content: trimmed }]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Request failed (${res.status})`)
      }
      const data = await res.json()
      setMessages((m) => [...m, { role: 'assistant', content: data.content }])
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setMessages([])
    setError(null)
  }

  return (
    <AnimatePresence>
      {copilotOpen && (
        <>
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCopilot(false)}
            className="fixed inset-0 z-40 bg-background/40 backdrop-blur-sm"
          />
          {/* panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[440px] flex-col border-l border-border bg-card/95 backdrop-blur-2xl shadow-2xl"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-chart-3 shadow-lg shadow-primary/30">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                  <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chart-1 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-chart-1 ring-2 ring-card" />
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold">
                    Aurora Copilot
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium uppercase text-primary">AI</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">Your enterprise intelligence</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={reset}
                  title="New conversation"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCopilot(false)}
                  aria-label="Close copilot"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-area-thin px-4 py-4">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col">
                  <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent p-4">
                    <div className="mb-1 flex items-center gap-2 text-sm font-medium">
                      <Lightbulb className="h-4 w-4 text-primary" />
                      How can I help today?
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      I have live context on your revenue, inventory, pipeline, and team. Ask me anything — analysis, forecasts, or next steps.
                    </p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="px-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Try asking</p>
                    {SUGGESTIONS.map((s) => {
                      const Icon = s.icon
                      return (
                        <button
                          key={s.text}
                          onClick={() => send(s.text)}
                          className="group flex w-full items-center gap-2.5 rounded-lg border border-border/60 bg-card/60 p-2.5 text-left text-xs transition-all hover:border-primary/40 hover:bg-accent/40"
                        >
                          <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-lg', s.tone)}>
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <span className="flex-1 text-foreground/90">{s.text}</span>
                          <ArrowUp className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((m, i) => (
                    <div key={i} className={cn('flex gap-2.5', m.role === 'user' && 'flex-row-reverse')}>
                      {m.role === 'assistant' ? (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-chart-3">
                          <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
                        </div>
                      ) : (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-[10px] font-medium">
                          AK
                        </div>
                      )}
                      <div
                        className={cn(
                          'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm',
                          m.role === 'user'
                            ? 'rounded-tr-sm bg-primary text-primary-foreground'
                            : 'rounded-tl-sm bg-secondary/70 text-secondary-foreground'
                        )}
                      >
                        {m.role === 'assistant' ? (
                          <div className="space-y-1 text-[13px] text-muted-foreground">{renderContent(m.content)}</div>
                        ) : (
                          m.content
                        )}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-chart-3">
                        <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
                      </div>
                      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-secondary/70 px-4 py-3">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '0ms' }} />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '150ms' }} />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                  {error && (
                    <div className="flex items-start gap-2 rounded-lg border border-chart-4/30 bg-chart-4/10 p-3 text-xs text-chart-4">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <div>
                        <p className="font-medium">Couldn&apos;t get a response</p>
                        <p className="text-chart-4/80">{error}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* input */}
            <div className="border-t border-border p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  send(input)
                }}
                className="relative"
              >
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      send(input)
                    }
                  }}
                  rows={1}
                  placeholder="Ask Aurora anything…"
                  className="max-h-32 min-h-[44px] w-full resize-none rounded-xl border border-border bg-background/60 px-3.5 py-3 pr-11 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label="Send"
                  className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-chart-2 text-primary-foreground transition-all disabled:opacity-40 enabled:hover:opacity-90"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
              <p className="mt-1.5 px-1 text-[10px] text-muted-foreground">
                Aurora has access to your live business context. Press <kbd className="rounded border border-border bg-muted px-1 font-mono">⌘J</kbd> to toggle.
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
