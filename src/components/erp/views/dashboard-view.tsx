'use client'

import * as React from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts'
import {
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Package,
  CreditCard,
  Truck,
  AlertTriangle,
  UserPlus,
  ArrowRight,
  Zap,
  Target,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { KpiCard } from '@/components/erp/widgets/kpi-card'
import {
  kpis,
  revenueSeries,
  departmentSpend,
  activities,
  insights,
  regions,
  radarData,
} from '@/lib/erp-data'
import { useErp } from '@/lib/erp-store'

const activityIcon = {
  deal: { icon: Target, tone: 'text-chart-1 bg-chart-1/10' },
  order: { icon: Package, tone: 'text-chart-2 bg-chart-2/10' },
  payment: { icon: CreditCard, tone: 'text-chart-3 bg-chart-3/10' },
  alert: { icon: AlertTriangle, tone: 'text-chart-4 bg-chart-4/10' },
  hire: { icon: UserPlus, tone: 'text-chart-5 bg-chart-5/10' },
  shipment: { icon: Truck, tone: 'text-chart-2 bg-chart-2/10' },
} as const

const insightAccent = {
  emerald: 'from-chart-1/15 to-transparent border-chart-1/20',
  amber: 'from-chart-3/15 to-transparent border-chart-3/20',
  violet: 'from-chart-5/15 to-transparent border-chart-5/20',
} as const

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover/95 px-3 py-2 text-xs shadow-md backdrop-blur">
      {label && <div className="mb-1 font-medium">{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium tabular-nums">
            {typeof p.value === 'number' ? `$${p.value.toLocaleString()}K` : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export function DashboardView() {
  const { setCopilot, set } = useErp()

  return (
    <div className="view-enter space-y-5">
      {/* Welcome / hero strip */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-5 sm:p-6">
        <div className="grid-texture absolute inset-0 opacity-40" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-chart-1 text-chart-1" />
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Live · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Good evening, Aria. <span className="text-gradient">Operations are healthy.</span>
            </h2>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Revenue is trending 12.4% above target this quarter. Aurora flagged 3 items needing your attention.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <TrendingUp className="h-4 w-4" /> Export report
            </Button>
            <Button
              size="sm"
              onClick={() => setCopilot(true)}
              className="gap-1.5 bg-gradient-to-r from-primary to-chart-2 text-primary-foreground hover:opacity-90"
            >
              <Sparkles className="h-4 w-4" /> Ask Aurora
            </Button>
          </div>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {insights.map((ins) => (
          <Card
            key={ins.id}
            className={cn('relative overflow-hidden border bg-gradient-to-br py-0', insightAccent[ins.accent])}
          >
            <div className="flex h-full flex-col p-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
                  <Sparkles className="mr-1 h-3 w-3" /> {ins.category}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    'text-[10px] capitalize',
                    ins.impact === 'high' && 'border-chart-4/30 text-chart-4',
                    ins.impact === 'medium' && 'border-chart-3/30 text-chart-3',
                    ins.impact === 'low' && 'text-muted-foreground'
                  )}
                >
                  {ins.impact} impact
                </Badge>
              </div>
              <h3 className="mt-2.5 text-sm font-semibold leading-snug">{ins.title}</h3>
              <p className="mt-1 flex-1 text-xs leading-relaxed text-muted-foreground">{ins.body}</p>
              <button
                onClick={() => setCopilot(true)}
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:gap-1.5 transition-all"
              >
                Investigate <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Main charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Revenue chart */}
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Revenue vs Target</CardTitle>
            <CardDescription>Monthly performance · last 12 months</CardDescription>
            <CardAction>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Revenue</span>
                <span className="flex items-center gap-1.5 text-muted-foreground"><span className="h-2 w-2 rounded-full bg-chart-3" /> Target</span>
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueSeries} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}K`} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#revGrad)" animationDuration={1400} />
                <Area type="monotone" dataKey="target" name="Target" stroke="var(--chart-3)" strokeWidth={2} strokeDasharray="5 4" fill="none" animationDuration={1400} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department spend donut */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Department Spend</CardTitle>
            <CardDescription>This quarter · $3.59M total</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={departmentSpend}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={56}
                  outerRadius={84}
                  paddingAngle={3}
                  strokeWidth={0}
                  animationDuration={1200}
                >
                  {departmentSpend.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }: any) =>
                    active && payload?.length ? (
                      <div className="rounded-lg border border-border bg-popover px-3 py-1.5 text-xs shadow-md">
                        <span className="font-medium">{payload[0].name}</span> · ${(payload[0].value as number).toFixed(2)}M
                      </div>
                    ) : null
                  }
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-1.5">
              {departmentSpend.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                  <span className="flex-1 text-muted-foreground">{d.name}</span>
                  <span className="font-medium tabular-nums">${d.value.toFixed(2)}M</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity + Regions + Radar */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Live activity */}
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Live Activity</CardTitle>
            <CardDescription>Real-time events across your organization</CardDescription>
            <CardAction>
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-chart-1 text-chart-1" /> streaming
              </span>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="max-h-[340px] space-y-1 overflow-y-auto scroll-area-thin pr-1">
              {activities.map((a) => {
                const cfg = activityIcon[a.type]
                const Icon = cfg.icon
                return (
                  <div
                    key={a.id}
                    className="group flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent/40"
                  >
                    <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', cfg.tone)}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{a.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{a.detail}</p>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      {a.amount && (
                        <span className="text-sm font-semibold tabular-nums text-foreground">{a.amount}</span>
                      )}
                      <span className="text-[10px] text-muted-foreground">{a.time}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Operations radar */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Operations Index</CardTitle>
            <CardDescription>Multi-dimensional health score</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData} outerRadius={78}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                <Radar dataKey="value" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.3} strokeWidth={2} animationDuration={1400} />
                <Tooltip
                  content={({ active, payload }: any) =>
                    active && payload?.length ? (
                      <div className="rounded-lg border border-border bg-popover px-3 py-1.5 text-xs shadow-md">
                        <span className="font-medium">{payload[0].payload.metric}</span> · {payload[0].value}/100
                      </div>
                    ) : null
                  }
                />
              </RadarChart>
            </ResponsiveContainer>
            <div className="mt-1 flex items-center justify-between rounded-lg bg-accent/30 px-3 py-2">
              <span className="text-xs text-muted-foreground">Overall score</span>
              <span className="flex items-center gap-1 text-sm font-semibold text-chart-1">
                <Zap className="h-3.5 w-3.5" /> 86.7
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional performance */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Regional Performance</CardTitle>
          <CardDescription>Revenue distribution & growth by region</CardDescription>
          <CardAction>
            <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => set('analytics')}>
              View analytics <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {regions.map((r) => (
              <div key={r.name} className="rounded-xl border border-border/60 bg-card/40 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">{r.name}</span>
                  <Badge variant="secondary" className="text-[10px] text-chart-1">{r.growth}</Badge>
                </div>
                <p className="mt-1.5 text-lg font-semibold tabular-nums">${r.revenue.toFixed(2)}M</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-chart-2 transition-all duration-1000"
                    style={{ width: `${r.share * 2}%` }}
                  />
                </div>
                <span className="mt-1 block text-[10px] text-muted-foreground">{r.share}% of total</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
