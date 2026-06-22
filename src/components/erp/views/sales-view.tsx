'use client'

import { ShoppingCart, DollarSign, TrendingUp, Clock, Plus, Download, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { orders } from '@/lib/erp-data'
import { cn } from '@/lib/utils'

const statusStyle: Record<string, string> = {
  fulfilled: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
  shipped: 'bg-chart-2/10 text-chart-2 border-chart-2/20',
  processing: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  pending: 'bg-muted text-muted-foreground border-border',
}

const pipeline = [
  { stage: 'Pending', count: 8, value: 124000, color: 'bg-muted-foreground' },
  { stage: 'Processing', count: 14, value: 386000, color: 'bg-chart-3' },
  { stage: 'Shipped', count: 22, value: 612000, color: 'bg-chart-2' },
  { stage: 'Fulfilled', count: 41, value: 1.84, color: 'bg-chart-1' },
]

const topCustomers = [
  { name: 'Northwind Logistics', orders: 38, value: 1.24, logo: 'NL' },
  { name: 'Stark Industries', orders: 24, value: 0.86, logo: 'SI' },
  { name: 'Umbrella Pharma', orders: 19, value: 0.64, logo: 'UP' },
  { name: 'Acme Industries', orders: 31, value: 0.52, logo: 'AI' },
  { name: 'Wayne Enterprises', orders: 12, value: 0.41, logo: 'WE' },
]

export function SalesView() {
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0)

  return (
    <div className="view-enter space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Revenue (30d)', value: '$4.82M', sub: '+12.4% vs prev', icon: DollarSign, tone: 'text-chart-1 bg-chart-1/10' },
          { label: 'Orders (30d)', value: '1,284', sub: '+8.1%', icon: ShoppingCart, tone: 'text-chart-2 bg-chart-2/10' },
          { label: 'Avg. order value', value: '$1,284', sub: '+$72', icon: TrendingUp, tone: 'text-chart-3 bg-chart-3/10' },
          { label: 'Fulfillment time', value: '2.4 days', sub: '-0.3 days', icon: Clock, tone: 'text-chart-5 bg-chart-5/10' },
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
        {/* Pipeline */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Order Pipeline</CardTitle>
            <CardDescription>Orders by fulfillment stage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pipeline.map((p) => (
                <div key={p.stage}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium">{p.stage}</span>
                    <span className="tabular-nums text-muted-foreground">{p.count} orders · {typeof p.value === 'number' && p.value < 10 ? `$${p.value.toFixed(2)}M` : `$${(p.value as number).toLocaleString()}`}</span>
                  </div>
                  <div className="h-7 overflow-hidden rounded-lg bg-muted">
                    <div className={cn('flex h-full items-center rounded-lg px-2 transition-all duration-1000', p.color)} style={{ width: `${(p.count / 41) * 100}%` }}>
                      <span className="text-[10px] font-medium text-white/90">{p.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top customers */}
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Top Customers</CardTitle>
            <CardDescription>Ranked by total revenue this quarter</CardDescription>
            <CardAction>
              <Button variant="ghost" size="sm" className="gap-1 text-xs">View all <ArrowUpRight className="h-3.5 w-3.5" /></Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topCustomers.map((c, i) => (
                <div key={c.name} className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent/40">
                  <span className="w-4 text-center text-xs text-muted-foreground">{i + 1}</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-chart-2/20 text-[11px] font-semibold">{c.logo}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.orders} orders</p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">${c.value.toFixed(2)}M</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders table */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Recent Orders</CardTitle>
          <CardDescription>Latest transactions across all channels</CardDescription>
          <CardAction>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1.5"><Download className="h-3.5 w-3.5" /> Export</Button>
              <Button size="sm" className="h-8 gap-1.5"><Plus className="h-4 w-4" /> New order</Button>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">Order ID</th>
                  <th className="pb-2 font-medium">Customer</th>
                  <th className="pb-2 font-medium">Channel</th>
                  <th className="pb-2 text-right font-medium">Items</th>
                  <th className="pb-2 text-right font-medium">Total</th>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-border/40 transition-colors last:border-0 hover:bg-accent/30">
                    <td className="py-2.5 font-mono text-xs font-medium">{o.id}</td>
                    <td className="py-2.5 font-medium">{o.customer}</td>
                    <td className="py-2.5"><Badge variant="outline" className="text-[10px]">{o.channel}</Badge></td>
                    <td className="py-2.5 text-right tabular-nums">{o.items.toLocaleString()}</td>
                    <td className="py-2.5 text-right tabular-nums font-semibold">${o.total.toLocaleString()}</td>
                    <td className="py-2.5 text-muted-foreground">{o.date}</td>
                    <td className="py-2.5">
                      <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize', statusStyle[o.status])}>
                        {o.status}
                      </span>
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
