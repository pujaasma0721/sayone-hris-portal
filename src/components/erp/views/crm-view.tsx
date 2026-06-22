'use client'

import { Contact, Target, DollarSign, TrendingUp, Plus, Mail, Phone, MoreHorizontal } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { leads } from '@/lib/erp-data'
import { cn } from '@/lib/utils'

const stageColumns = [
  { id: 'prospect', label: 'Prospect', color: 'bg-muted-foreground' },
  { id: 'qualified', label: 'Qualified', color: 'bg-chart-5' },
  { id: 'proposal', label: 'Proposal', color: 'bg-chart-3' },
  { id: 'negotiation', label: 'Negotiation', color: 'bg-chart-2' },
  { id: 'won', label: 'Won', color: 'bg-chart-1' },
] as const

const initials = (name: string) =>
  name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

export function CrmView() {
  const totalPipeline = leads.reduce((s, l) => s + l.value, 0)
  const weighted = leads.reduce((s, l) => s + (l.value * l.probability) / 100, 0)

  return (
    <div className="view-enter space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Open Leads', value: leads.length.toString(), sub: '2 new today', icon: Contact, tone: 'text-chart-1 bg-chart-1/10' },
          { label: 'Pipeline Value', value: `$${(totalPipeline / 1000).toFixed(0)}K`, sub: 'across all stages', icon: DollarSign, tone: 'text-chart-3 bg-chart-3/10' },
          { label: 'Weighted Forecast', value: `$${(weighted / 1000).toFixed(0)}K`, sub: 'probability-adjusted', icon: TrendingUp, tone: 'text-chart-2 bg-chart-2/10' },
          { label: 'Win Rate', value: '34.8%', sub: '+4.2pt this Q', icon: Target, tone: 'text-chart-5 bg-chart-5/10' },
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

      {/* Pipeline kanban */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Sales Pipeline</CardTitle>
          <CardDescription>Deals moving through your funnel</CardDescription>
          <CardAction>
            <Button size="sm" className="h-8 gap-1.5"><Plus className="h-4 w-4" /> New lead</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {stageColumns.map((col) => {
              const colLeads = leads.filter((l) => l.stage === col.id)
              const colValue = colLeads.reduce((s, l) => s + l.value, 0)
              return (
                <div key={col.id} className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between rounded-lg border border-border/60 bg-card/40 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className={cn('h-2 w-2 rounded-full', col.color)} />
                      <span className="text-xs font-medium">{col.label}</span>
                    </div>
                    <span className="text-[10px] tabular-nums text-muted-foreground">{colLeads.length}</span>
                  </div>
                  <div className="space-y-2.5">
                    {colLeads.map((l) => (
                      <div key={l.id} className="rounded-xl border border-border/60 bg-card p-3 transition-all hover:shadow-md">
                        <div className="flex items-start justify-between">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gradient-to-br from-primary/30 to-chart-2/30 text-[10px] font-medium">
                              {initials(l.company)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-semibold tabular-nums">${(l.value / 1000).toFixed(0)}K</span>
                        </div>
                        <p className="mt-2 text-sm font-medium leading-tight">{l.company}</p>
                        <p className="text-[11px] text-muted-foreground">{l.contact}</p>
                        <div className="mt-2.5">
                          <div className="mb-1 flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>Win probability</span>
                            <span className="tabular-nums font-medium">{l.probability}%</span>
                          </div>
                          <Progress value={l.probability} className="h-1" />
                        </div>
                        <div className="mt-2.5 flex items-center justify-between border-t border-border/40 pt-2">
                          <span className="text-[10px] text-muted-foreground">{l.owner}</span>
                          <span className="text-[10px] text-muted-foreground">{l.lastTouch}</span>
                        </div>
                      </div>
                    ))}
                    {colLeads.length === 0 && (
                      <div className="rounded-lg border border-dashed border-border/60 p-4 text-center text-[11px] text-muted-foreground">
                        Empty
                      </div>
                    )}
                  </div>
                  {colValue > 0 && (
                    <p className="px-1 text-[10px] text-muted-foreground">Total: <span className="font-medium tabular-nums text-foreground">${(colValue / 1000).toFixed(0)}K</span></p>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Contact list */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Key Contacts</CardTitle>
          <CardDescription>Decision makers in active deals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {leads.slice(0, 6).map((l) => (
              <div key={l.id} className="flex items-center gap-3 rounded-lg border border-border/40 p-3 transition-colors hover:bg-accent/30">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-chart-2/20 text-xs font-medium">
                    {initials(l.contact)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{l.contact}</p>
                  <p className="truncate text-xs text-muted-foreground">{l.company}</p>
                </div>
                <div className="flex gap-1">
                  <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"><Mail className="h-3.5 w-3.5" /></button>
                  <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"><Phone className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
