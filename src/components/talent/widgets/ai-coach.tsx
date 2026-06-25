'use client';

/**
 * AiCoach — Aurora Career Coach slide-over panel.
 *
 * Streams a conversation with the LLM via POST /api/coach. Supports bold
 * and bullet rendering, suggestion cards when empty, ⌘J toggle, and
 * Escape to close.
 */

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Lightbulb,
  Loader2,
  RefreshCw,
  Send,
  Sparkles,
  TrendingUp,
  User as UserIcon,
  X,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { useTalent } from '@/lib/talent-store';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS: { icon: React.ComponentType<{ className?: string }>; title: string; prompt: string }[] = [
  {
    icon: Sparkles,
    title: 'Improve my CV',
    prompt: 'Can you suggest 3 concrete ways to improve my CV for a senior frontend engineer role?',
  },
  {
    icon: Lightbulb,
    title: 'Interview tips',
    prompt: 'What are the most common interview questions I should prepare for?',
  },
  {
    icon: TrendingUp,
    title: 'Skills to learn',
    prompt: 'Which skills should I focus on learning to advance my career over the next year?',
  },
  {
    icon: Sparkles,
    title: 'Salary negotiation',
    prompt: 'How should I prepare for a salary negotiation conversation with a recruiter?',
  },
];

function renderContent(content: string): React.ReactNode {
  return content.split('\n').map((line, i) => {
    if (!line.trim()) return <div key={i} className="h-2" />;
    if (line.startsWith('- ') || line.startsWith('• ')) {
      return (
        <div key={i} className="flex gap-1.5">
          <span className="text-primary">•</span>
          <span>{renderInline(line.slice(2))}</span>
        </div>
      );
    }
    return <p key={i}>{renderInline(line)}</p>;
  });
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
}

export function AiCoach() {
  const open = useTalent((s) => s.copilotOpen);
  const setCopilot = useTalent((s) => s.setCopilot);

  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Escape to close
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCopilot(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, setCopilot]);

  // ⌘J toggle
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setCopilot(!useTalent.getState().copilotOpen);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setCopilot]);

  const send = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Coach failed to respond');
      setMessages((prev) => [...prev, { role: 'assistant', content: data.content }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Sorry — I couldn't respond right now. ${
            err instanceof Error ? err.message : ''
          }`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const reset = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-background/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCopilot(false)}
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-label="Aurora Career Coach"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className={cn(
              'fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border/60',
              'bg-card shadow-2xl shadow-black/20',
            )}
          >
            {/* Header */}
            <div className="flex h-14 items-center gap-2 border-b border-border/60 px-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-sm">
                <Sparkles className="size-4" />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-foreground">Aurora Coach</h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-accent-foreground">
                    AI
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={reset} aria-label="Reset conversation">
                <RefreshCw className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setCopilot(false)} aria-label="Close coach">
                <X className="size-4" />
              </Button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto scroll-area-thin p-4">
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="rounded-xl bg-secondary/60 p-3 text-sm text-foreground/80">
                    <p>
                      Hi! I&apos;m <strong>Aurora</strong>, your AI career coach. Ask me anything
                      about your CV, interviews, or career path.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {SUGGESTIONS.map((s) => {
                      const Icon = s.icon;
                      return (
                        <button
                          key={s.title}
                          type="button"
                          onClick={() => void send(s.prompt)}
                          className={cn(
                            'flex flex-col gap-1.5 rounded-lg border border-border/60 bg-background/60 p-3 text-left transition-all',
                            'hover:border-primary/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                          )}
                        >
                          <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <Icon className="size-3.5" />
                          </span>
                          <span className="text-xs font-medium text-foreground">{s.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex gap-2',
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row',
                  )}
                >
                  {msg.role === 'assistant' && (
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      <Sparkles className="size-3.5" />
                    </span>
                  )}
                  {msg.role === 'user' && (
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                      <UserIcon className="size-3.5" />
                    </span>
                  )}
                  <div
                    className={cn(
                      'max-w-[85%] space-y-1 rounded-xl px-3 py-2 text-sm',
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground',
                    )}
                  >
                    {renderContent(msg.content)}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-2">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground">
                    <Sparkles className="size-3.5" />
                  </span>
                  <div className="flex items-center gap-1 rounded-xl bg-secondary px-3 py-3">
                    <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-border/60 p-3">
              <div className="flex items-end gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      void send(input);
                    }
                  }}
                  placeholder="Ask Aurora anything…"
                  className="min-h-10 max-h-32 resize-none text-sm"
                  rows={1}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={loading || !input.trim()}
                  className={cn(
                    'shrink-0 bg-gradient-to-r from-primary to-accent text-primary-foreground',
                    'shadow-sm shadow-primary/20 hover:opacity-95',
                  )}
                  aria-label="Send message"
                >
                  {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                </Button>
              </div>
              <p className="mt-1.5 text-[10px] text-muted-foreground">
                Aurora can make mistakes. Verify important advice. Press ⌘J to toggle, Esc to close.
              </p>
            </form>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
