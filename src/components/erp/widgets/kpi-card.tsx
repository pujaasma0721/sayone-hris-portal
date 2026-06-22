'use client'

import * as React from 'react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { useCountUp } from '@/hooks/use-count-up'
import type { Kpi } from '@/lib/erp-data'

const accentMap: Record<Kpi['accent'], { stroke: string; fill: string; glow: string; chip: string }> = {
  emerald: {
    stroke: 'var(--chart-1)',
    fill: 'color-mix(in oklch, var(--chart-1) 22%, transparent)',
    glow: 'shadow-emerald-500/10',
    chip: 'bg-chart-1/10 text-chart-1',
  },
  teal: {
    stroke: 'var(--chart-2)',
    fill: 'color-mix(in oklch, var(--chart-2) 22%, transparent)',
    glow: 'shadow-teal-500/10',
    chip: 'bg-chart-2/10 text-chart-2',
  },
  amber: {
    stroke: 'var(--chart-3)',
    fill: 'color-mix(in oklch, var(--chart-3) 22%, transparent)',
    glow: 'shadow-amber-500/10',
    chip: 'bg-chart-3/10 text-chart-3',
  },
  violet: {
    stroke: 'var(--chart-5)',
    fill: 'color-mix(in oklch, var(--chart-5) 22%, transparent)',
    glow: 'shadow-violet-500/10',
    chip: 'bg-chart-5/10 text-chart-5',
  },
  rose: {
    stroke: 'var(--chart-4)',
    fill: 'color-mix(in oklch, var(--chart-4) 22%, transparent)',
    glow: 'shadow-rose-500/10',
    chip: 'bg-chart-4/10 text-chart-4',
  },
}

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const accent = accentMap[kpi.accent]
  const data = kpi.spark.map((v, i) => ({ i, v }))
  const TrendIcon = kpi.trend === 'up' ? ArrowUpRight : kpi.trend === 'down' ? ArrowDownRight : Minus
  const positive = kpi.trend === 'up'
  const animated = useCountUp(kpi.raw, 1400)

  let display: string
  if (kpi.value.includes('%')) {
    display = kpi.value
  } else if (kpi.raw >= 1000000) {
    display = `$${(animated / 1000000).toFixed(2)}M`
  } else if (kpi.raw >= 1000) {
    display = Math.round(animated).toLocaleString()
  } else {
    display = kpi.value
  }

  return (
    <Card className={cn('group relative overflow-hidden border-border/60 py-0 shadow-sm transition-all hover:shadow-md', accent.glow)}>
      {/* gradient wash on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(120% 80% at 100% 0%, ${accent.fill}, transparent 60%)` }}
      />
      <div className="relative flex items-start justify-between gap-3 p-4 pb-0">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {kpi.label}
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{display}</p>
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium',
            positive ? 'bg-chart-1/10 text-chart-1' : 'bg-chart-3/10 text-chart-3'
          )}
        >
          <TrendIcon className="h-3 w-3" />
          {kpi.delta}
        </span>
      </div>
      <div className="relative h-14 w-full px-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, bottom: 0, left: 0, right: 0 }}>
            <defs>
              <linearGradient id={`grad-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accent.stroke} stopOpacity={0.4} />
                <stop offset="100%" stopColor={accent.stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={accent.stroke}
              strokeWidth={2}
              fill={`url(#grad-${kpi.id})`}
              isAnimationActive
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export { accentMap }
