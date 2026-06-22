'use client'

import { FolderKanban, CheckCircle2, Clock, AlertCircle, Plus, Calendar, Users, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { projects } from '@/lib/erp-data'
import { cn } from '@/lib/utils'

const stageConfig: Record<string, { label: string; color: string; dot: string }> = {
  planning: { label: 'Planning', color: 'border-border bg-muted/40', dot: 'bg-muted-foreground' },
  'in-progress': { label: 'In Progress', color: 'border-chart-3/30 bg-chart-3/5', dot: 'bg-chart-3' },
  review: { label: 'In Review', color: 'border-chart-2/30 bg-chart-2/5', dot: 'bg-chart-2' },
  done: { label: 'Completed', color: 'border-chart-1/30 bg-chart-1/5', dot: 'bg-chart-1' },
}

const columns = ['planning', 'in-progress', 'review', 'done'] as const

const stageIcons = {
  planning: Clock,
  'in-progress': FolderKanban,
  review: AlertCircle,
  done: CheckCircle2,
}

export function ProjectsView() {
  return (
    <div className="view-enter space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Active Projects', value: '5', sub: '2 due this month', icon: FolderKanban, tone: 'text-chart-1 bg-chart-1/10' },
          { label: 'On Track', value: '4', sub: '80% delivery rate', icon: CheckCircle2, tone: 'text-chart-2 bg-chart-2/10' },
          { label: 'At Risk', value: '1', sub: 'needs attention', icon: AlertCircle, tone: 'text-chart-4 bg-chart-4/10' },
          { label: 'Budget Used', value: '64.2%', sub: '$1.09M of $1.7M', icon: DollarSign, tone: 'text-chart-3 bg-chart-3/10' },
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

      {/* Kanban board */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((col) => {
          const colProjects = projects.filter((p) => p.stage === col)
          const cfg = stageConfig[col]
          const StageIcon = stageIcons[col]
          return (
            <div key={col} className="flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-card/40 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className={cn('h-2 w-2 rounded-full', cfg.dot)} />
                  <span className="text-sm font-medium">{cfg.label}</span>
                </div>
                <Badge variant="secondary" className="text-[10px]">{colProjects.length}</Badge>
              </div>
              <div className="space-y-3">
                {colProjects.map((p) => {
                  const budgetPct = Math.round((p.spent / p.budget) * 100)
                  return (
                    <Card key={p.id} className={cn('border py-0 transition-all hover:shadow-md', cfg.color)}>
                      <div className="p-3.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <StageIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-[10px] font-mono text-muted-foreground">{p.id.toUpperCase()}</span>
                          </div>
                          <button className="text-muted-foreground hover:text-foreground"><Plus className="h-3.5 w-3.5" /></button>
                        </div>
                        <h3 className="mt-2 text-sm font-semibold leading-snug">{p.name}</h3>
                        <p className="text-xs text-muted-foreground">{p.client}</p>

                        <div className="mt-3">
                          <div className="mb-1 flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>Progress</span>
                            <span className="tabular-nums font-medium">{p.progress}%</span>
                          </div>
                          <Progress value={p.progress} className="h-1.5" />
                        </div>

                        <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> {budgetPct}% used</span>
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {p.team}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {p.due}</span>
                        </div>
                      </div>
                    </Card>
                  )
                })}
                {colProjects.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground">
                    No projects
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Budget overview */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Budget Allocation</CardTitle>
          <CardDescription>Planned vs spent across active projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {projects.filter((p) => p.stage !== 'done').map((p) => {
              const pct = Math.round((p.spent / p.budget) * 100)
              return (
                <div key={p.id} className="flex items-center gap-4">
                  <div className="w-40 shrink-0">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{p.id.toUpperCase()}</p>
                  </div>
                  <div className="flex-1">
                    <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn('h-full rounded-full transition-all duration-1000', pct > 90 ? 'bg-chart-4' : 'bg-gradient-to-r from-primary to-chart-2')}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-32 shrink-0 text-right text-xs tabular-nums">
                    <span className="font-medium">${(p.spent / 1000).toFixed(0)}K</span>
                    <span className="text-muted-foreground"> / ${(p.budget / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
