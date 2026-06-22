'use client'

import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Receipt, Plus, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cashflow, departmentSpend } from '@/lib/erp-data'
import { cn } from '@/lib/utils'

const pnl = [
  { label: 'Gross Revenue', value: 4820000, tone: 'text-foreground' },
  { label: 'Cost of Goods Sold', value: -1740000, tone: 'text-chart-4' },
  { label: 'Gross Profit', value: 3080000, tone: 'text-chart-1 font-semibold', bar: true },
  { label: 'Operating Expenses', value: -2180000, tone: 'text-chart-4' },
  { label: 'EBITDA', value: 900000, tone: 'text-chart-1 font-semibold', bar: true },
  { label: 'Taxes & Interest', value: -216000, tone: 'text-chart-4' },
  { label: 'Net Profit', value: 684000, tone: 'text-chart-1 font-bold text-base', bar: true },
]

const expenses = [
  { name: 'Salaries', value: 1.24, color: 'var(--chart-1)' },
  { name: 'Marketing', value: 0.62, color: 'var(--chart-3)' },
  { name: 'Infrastructure', value: 0.48, color: 'var(--chart-2)' },
  { name: 'R&D', value: 0.54, color: 'var(--chart-5)' },
  { name: 'Other', value: 0.31, color: 'var(--chart-4)' },
]

const fmt = (n: number) => (n < 0 ? '-' : '') + '$' + Math.abs(n).toLocaleString()

export function FinanceView() {
  return (
    <div className="view-enter space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Net Profit', value: '$684K', sub: '+14.2% MoM', icon: TrendingUp, tone: 'text-chart-1 bg-chart-1/10' },
          { label: 'Gross Margin', value: '63.9%', sub: '+1.8pt', icon: PiggyBank, tone: 'text-chart-2 bg-chart-2/10' },
          { label: 'Operating Expenses', value: '$2.18M', sub: '-3.4% optimized', icon: Receipt, tone: 'text-chart-3 bg-chart-3/10' },
          { label: 'Cash on Hand', value: '$8.4M', sub: '14.2 mo runway', icon: Wallet, tone: 'text-chart-5 bg-chart-5/10' },
        ].map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="border-border/60 py-0">
              <div className="flex items-center gap-3 p-4">
                <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', s.tone)}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
                  <p className="text-lg font-semibold tabular-nums">{s.value}</p>
                  <p className="truncate text-[10px] text-chart-1">{s.sub}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Cash flow */}
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Cash Flow Trend</CardTitle>
            <CardDescription>Inflow vs outflow · last 6 months ($K)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={cashflow} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="inflowG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="outflowG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-4)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--chart-4)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => `$${v}K`}
                />
                <Area type="monotone" dataKey="inflow" name="Inflow" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#inflowG)" animationDuration={1200} />
                <Area type="monotone" dataKey="outflow" name="Outflow" stroke="var(--chart-4)" strokeWidth={2.5} fill="url(#outflowG)" animationDuration={1200} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense breakdown */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Expense Breakdown</CardTitle>
            <CardDescription>$3.19M total · this quarter</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={expenses} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3} strokeWidth={0} animationDuration={1200}>
                  {expenses.map((e) => <Cell key={e.name} fill={e.color} />)}
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
              {expenses.map((e) => (
                <div key={e.name} className="flex items-center gap-2 text-xs">
                  <span className="h-2 w-2 rounded-full" style={{ background: e.color }} />
                  <span className="flex-1 text-muted-foreground">{e.name}</span>
                  <span className="font-medium tabular-nums">${e.value.toFixed(2)}M</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* P&L statement */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Profit & Loss Statement</CardTitle>
          <CardDescription>FY2024 · consolidated</CardDescription>
          <CardAction>
            <Button variant="outline" size="sm" className="h-8 gap-1.5"><Plus className="h-3.5 w-3.5" /> New entry</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="max-w-2xl space-y-1.5">
            {pnl.map((row) => (
              <div
                key={row.label}
                className={cn(
                  'flex items-center justify-between rounded-lg px-3 py-2.5',
                  row.bar ? 'bg-accent/40' : 'hover:bg-accent/20'
                )}
              >
                <span className={cn('text-sm', row.tone)}>{row.label}</span>
                <span className={cn('text-sm tabular-nums', row.tone)}>{fmt(row.value)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-chart-1/20 bg-chart-1/5 p-3">
            <TrendingUp className="h-4 w-4 text-chart-1" />
            <p className="text-xs text-muted-foreground">
              Net margin improved to <span className="font-semibold text-chart-1">14.2%</span>, up 2.1pt year-over-year.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
