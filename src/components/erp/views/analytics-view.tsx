'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from 'recharts'
import { TrendingUp, Users, ShoppingCart, DollarSign, Activity, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { revenueSeries, cashflow, trafficSources, regions } from '@/lib/erp-data'

const conversionFunnel = [
  { stage: 'Visitors', value: 48200, pct: 100 },
  { stage: 'Sign-ups', value: 12100, pct: 25.1 },
  { stage: 'Trials', value: 6840, pct: 14.2 },
  { stage: 'Qualified', value: 3120, pct: 6.5 },
  { stage: 'Customers', value: 1840, pct: 3.8 },
]

const cohort = [
  { week: 'W1', new: 100, retained: 100 },
  { week: 'W2', new: 88, retained: 76 },
  { week: 'W3', new: 94, retained: 71 },
  { week: 'W4', new: 102, retained: 68 },
  { week: 'W5', new: 96, retained: 64 },
  { week: 'W6', new: 110, retained: 61 },
  { week: 'W7', new: 124, retained: 58 },
  { week: 'W8', new: 118, retained: 55 },
]

const metrics = [
  { label: 'Conversion rate', value: '3.82%', delta: '+0.4pt', icon: TrendingUp, tone: 'text-chart-1 bg-chart-1/10' },
  { label: 'Avg. order value', value: '$1,284', delta: '+$72', icon: DollarSign, tone: 'text-chart-3 bg-chart-3/10' },
  { label: 'Active users', value: '28,490', delta: '+1,240', icon: Users, tone: 'text-chart-2 bg-chart-2/10' },
  { label: 'Cart abandonment', value: '24.6%', delta: '-2.1pt', icon: ShoppingCart, tone: 'text-chart-4 bg-chart-4/10' },
]

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover/95 px-3 py-2 text-xs shadow-md backdrop-blur">
      {label && <div className="mb-1 font-medium">{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium tabular-nums">{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</span>
        </div>
      ))}
    </div>
  )
}

export function AnalyticsView() {
  return (
    <div className="view-enter space-y-5">
      {/* metric strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map((m) => {
          const Icon = m.icon
          return (
            <Card key={m.label} className="border-border/60 py-0">
              <div className="flex items-center gap-3 p-4">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${m.tone}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{m.label}</p>
                  <p className="text-lg font-semibold tabular-nums">{m.value}</p>
                </div>
                <Badge variant="secondary" className="ml-auto text-[10px] text-chart-1">{m.delta}</Badge>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Traffic trend */}
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Traffic & Retention</CardTitle>
            <CardDescription>New vs retained users · last 8 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={cohort} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="new" name="New" stroke="var(--chart-1)" strokeWidth={2.5} dot={{ r: 3 }} animationDuration={1200} />
                <Line type="monotone" dataKey="retained" name="Retained" stroke="var(--chart-3)" strokeWidth={2.5} dot={{ r: 3 }} animationDuration={1200} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Traffic sources */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Acquisition Channels</CardTitle>
            <CardDescription>Share of total traffic</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trafficSources.map((s) => (
                <div key={s.source}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium">{s.source}</span>
                    <span className="tabular-nums text-muted-foreground">{s.value}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${s.value * 2.5}%`, background: s.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-accent/30 p-3 text-xs text-muted-foreground">
              <Activity className="mb-1 h-4 w-4 text-chart-2" />
              Organic search drives the highest LTV at <span className="font-medium text-foreground">$4,820</span>.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funnel + Cashflow */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Conversion Funnel</CardTitle>
            <CardDescription>Visitor → customer journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {conversionFunnel.map((f, i) => (
                <div key={f.stage} className="relative">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium">{f.stage}</span>
                    <span className="tabular-nums text-muted-foreground">{f.value.toLocaleString()} · {f.pct}%</span>
                  </div>
                  <div className="h-8 overflow-hidden rounded-lg bg-muted">
                    <div
                      className="flex h-full items-center justify-end rounded-lg bg-gradient-to-r from-primary to-chart-2 pr-2 text-[10px] font-medium text-primary-foreground transition-all duration-1000"
                      style={{ width: `${f.pct}%`, transitionDelay: `${i * 80}ms` }}
                    >
                      {i > 0 && <ArrowUpRight className="mr-1 h-3 w-3" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Cash Flow</CardTitle>
            <CardDescription>Inflow vs outflow · $K</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={cashflow} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--accent)', opacity: 0.3 }} />
                <Bar dataKey="inflow" name="Inflow" fill="var(--chart-1)" radius={[4, 4, 0, 0]} animationDuration={1200} />
                <Bar dataKey="outflow" name="Outflow" fill="var(--chart-4)" radius={[4, 4, 0, 0]} animationDuration={1200} opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Region table */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Regional Breakdown</CardTitle>
          <CardDescription>Detailed performance by geography</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">Region</th>
                  <th className="pb-2 text-right font-medium">Revenue</th>
                  <th className="pb-2 text-right font-medium">Share</th>
                  <th className="pb-2 text-right font-medium">Growth</th>
                  <th className="pb-2 font-medium">Distribution</th>
                </tr>
              </thead>
              <tbody>
                {regions.map((r) => (
                  <tr key={r.name} className="border-b border-border/40 last:border-0">
                    <td className="py-2.5 font-medium">{r.name}</td>
                    <td className="py-2.5 text-right tabular-nums">${r.revenue.toFixed(2)}M</td>
                    <td className="py-2.5 text-right tabular-nums text-muted-foreground">{r.share}%</td>
                    <td className="py-2.5 text-right"><Badge variant="secondary" className="text-[10px] text-chart-1">{r.growth}</Badge></td>
                    <td className="py-2.5 pl-4">
                      <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary to-chart-2" style={{ width: `${r.share * 2}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
