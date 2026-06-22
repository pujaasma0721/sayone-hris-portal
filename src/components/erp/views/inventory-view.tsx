'use client'

import { Package, Warehouse, AlertTriangle, Boxes, Search, Filter, ArrowUpDown, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { products } from '@/lib/erp-data'
import { cn } from '@/lib/utils'

const warehouses = [
  { id: 'A', name: 'Warehouse A · Rotterdam', capacity: 82, units: 48200, color: 'chart-1' },
  { id: 'B', name: 'Warehouse B · Singapore', capacity: 64, units: 31100, color: 'chart-2' },
  { id: 'C', name: 'Warehouse C · Newark', capacity: 91, units: 52800, color: 'chart-3' },
]

const statusStyle = {
  'in-stock': 'bg-chart-1/10 text-chart-1 border-chart-1/20',
  'low': 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  'out': 'bg-chart-4/10 text-chart-4 border-chart-4/20',
}

export function InventoryView() {
  const totalUnits = products.reduce((s, p) => s + p.stock, 0)
  const lowCount = products.filter((p) => p.status !== 'in-stock').length
  const totalValue = products.reduce((s, p) => s + p.stock * p.price, 0)

  return (
    <div className="view-enter space-y-5">
      {/* stat strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total SKUs', value: products.length.toString(), sub: 'across 3 warehouses', icon: Boxes, tone: 'text-chart-1 bg-chart-1/10' },
          { label: 'Units in stock', value: totalUnits.toLocaleString(), sub: 'live count', icon: Package, tone: 'text-chart-2 bg-chart-2/10' },
          { label: 'Stock value', value: `$${(totalValue / 1000).toFixed(1)}K`, sub: 'current valuation', icon: Warehouse, tone: 'text-chart-3 bg-chart-3/10' },
          { label: 'Needs attention', value: lowCount.toString(), sub: 'low / out of stock', icon: AlertTriangle, tone: 'text-chart-4 bg-chart-4/10' },
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
                  <p className="truncate text-[10px] text-muted-foreground">{s.sub}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Warehouses */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {warehouses.map((w) => (
          <Card key={w.id} className="border-border/60 py-0">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg bg-chart-1/10 text-sm font-semibold', `text-${w.color}`)}>
                    {w.id}
                  </span>
                  <span className="text-sm font-medium">{w.name}</span>
                </div>
                <Badge variant={w.capacity > 85 ? 'destructive' : 'secondary'} className="text-[10px]">
                  {w.capacity}% full
                </Badge>
              </div>
              <p className="mt-3 text-2xl font-semibold tabular-nums">{w.units.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">units stored</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn('h-full rounded-full transition-all duration-1000', w.capacity > 85 ? 'bg-chart-4' : 'bg-gradient-to-r from-primary to-chart-2')}
                  style={{ width: `${w.capacity}%` }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Product table */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Inventory Catalog</CardTitle>
          <CardDescription>Real-time stock levels & reorder status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <div className="relative max-w-xs flex-1">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search SKU or product…" className="h-9 pl-8" />
            </div>
            <Button variant="outline" size="sm" className="h-9 gap-1.5"><Filter className="h-3.5 w-3.5" /> Filter</Button>
            <Button variant="outline" size="sm" className="h-9 gap-1.5"><ArrowUpDown className="h-3.5 w-3.5" /> Sort</Button>
            <Button size="sm" className="ml-auto h-9 gap-1.5"><Plus className="h-4 w-4" /> Add product</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">Product</th>
                  <th className="pb-2 font-medium">SKU</th>
                  <th className="pb-2 font-medium">Category</th>
                  <th className="pb-2 text-right font-medium">Stock</th>
                  <th className="pb-2 text-right font-medium">Reorder</th>
                  <th className="pb-2 text-right font-medium">Price</th>
                  <th className="pb-2 text-center font-medium">Wh.</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-border/40 transition-colors last:border-0 hover:bg-accent/30">
                    <td className="py-2.5 font-medium">{p.name}</td>
                    <td className="py-2.5 font-mono text-xs text-muted-foreground">{p.sku}</td>
                    <td className="py-2.5 text-muted-foreground">{p.category}</td>
                    <td className="py-2.5 text-right tabular-nums font-medium">{p.stock.toLocaleString()}</td>
                    <td className="py-2.5 text-right tabular-nums text-muted-foreground">{p.reorder}</td>
                    <td className="py-2.5 text-right tabular-nums">${p.price.toLocaleString()}</td>
                    <td className="py-2.5 text-center"><span className="inline-flex h-6 w-6 items-center justify-center rounded bg-muted text-[10px] font-medium">{p.warehouse}</span></td>
                    <td className="py-2.5">
                      <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize', statusStyle[p.status])}>
                        {p.status.replace('-', ' ')}
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
