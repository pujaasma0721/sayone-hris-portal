'use client'

import { Users, UserCheck, Calendar, Award, Plus, MoreHorizontal } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { employees } from '@/lib/erp-data'
import { cn } from '@/lib/utils'

const statusStyle: Record<string, string> = {
  active: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
  remote: 'bg-chart-2/10 text-chart-2 border-chart-2/20',
  leave: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
}

const initials = (name: string) =>
  name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

const departments = [
  { name: 'Engineering', count: 42, pct: 38, color: 'bg-chart-1' },
  { name: 'Sales', count: 28, pct: 25, color: 'bg-chart-3' },
  { name: 'Operations', count: 18, pct: 16, color: 'bg-chart-2' },
  { name: 'Design', count: 12, pct: 11, color: 'bg-chart-5' },
  { name: 'Finance', count: 8, pct: 7, color: 'bg-chart-4' },
  { name: 'Other', count: 4, pct: 3, color: 'bg-muted-foreground' },
]

const attendance = [
  { day: 'Mon', present: 96, remote: 14 },
  { day: 'Tue', present: 98, remote: 16 },
  { day: 'Wed', present: 94, remote: 22 },
  { day: 'Thu', present: 97, remote: 18 },
  { day: 'Fri', present: 88, remote: 28 },
]

export function HrView() {
  return (
    <div className="view-enter space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Headcount', value: '112', sub: '+6 this quarter', icon: Users, tone: 'text-chart-1 bg-chart-1/10' },
          { label: 'Present today', value: '94.2%', sub: '96 on-site · 18 remote', icon: UserCheck, tone: 'text-chart-2 bg-chart-2/10' },
          { label: 'Avg. tenure', value: '2.8 yrs', sub: '+0.3 YoY', icon: Calendar, tone: 'text-chart-3 bg-chart-3/10' },
          { label: 'Engagement', value: '8.4 / 10', sub: 'top quartile', icon: Award, tone: 'text-chart-5 bg-chart-5/10' },
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Team list */}
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Team Directory</CardTitle>
            <CardDescription>Workforce status & performance scores</CardDescription>
            <CardAction>
              <Button size="sm" className="h-8 gap-1.5"><Plus className="h-4 w-4" /> Add member</Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {employees.map((e) => (
                <div key={e.id} className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent/40">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-gradient-to-br from-primary/30 to-chart-2/30 text-[11px] font-medium">
                      {initials(e.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{e.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{e.role} · {e.department}</p>
                  </div>
                  <div className="hidden w-28 sm:block">
                    <div className="mb-1 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>Performance</span>
                      <span className="tabular-nums font-medium">{e.performance}</span>
                    </div>
                    <Progress value={e.performance} className="h-1.5" />
                  </div>
                  <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize', statusStyle[e.status])}>
                    {e.status}
                  </span>
                  <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department distribution */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Headcount by Dept</CardTitle>
            <CardDescription>112 employees total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {departments.map((d) => (
                <div key={d.name}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium">{d.name}</span>
                    <span className="tabular-nums text-muted-foreground">{d.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className={cn('h-full rounded-full transition-all duration-1000', d.color)} style={{ width: `${d.pct * 2.5}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance heatmap */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Weekly Attendance</CardTitle>
          <CardDescription>On-site vs remote distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end justify-between gap-4">
            {attendance.map((a) => (
              <div key={a.day} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-32 w-full max-w-[60px] items-end gap-1">
                  <div className="flex-1 rounded-t bg-gradient-to-t from-primary to-chart-2 transition-all duration-1000" style={{ height: `${a.present}%` }} title={`Present: ${a.present}%`} />
                  <div className="flex-1 rounded-t bg-chart-3/60 transition-all duration-1000" style={{ height: `${a.remote}%` }} title={`Remote: ${a.remote}%`} />
                </div>
                <span className="text-xs text-muted-foreground">{a.day}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> On-site</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-chart-3/60" /> Remote</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
