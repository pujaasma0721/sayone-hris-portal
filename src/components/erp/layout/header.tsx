'use client'

import * as React from 'react'
import {
  Search,
  Bell,
  Menu,
  Sparkles,
  ChevronDown,
  Check,
  CircleDot,
  Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useErp, type ModuleId } from '@/lib/erp-store'
import { ThemeToggle } from '@/components/erp/theme-toggle'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { notifications } from '@/lib/erp-data'

const moduleTitles: Record<ModuleId, { title: string; sub: string }> = {
  dashboard: { title: 'Command Center', sub: 'Real-time view of your enterprise' },
  analytics: { title: 'Analytics', sub: 'Performance intelligence across metrics' },
  inventory: { title: 'Inventory', sub: 'Stock levels, warehouses & replenishment' },
  sales: { title: 'Sales', sub: 'Orders, fulfillment & revenue pipeline' },
  finance: { title: 'Finance', sub: 'P&L, cash flow & expenditure control' },
  hr: { title: 'People', sub: 'Workforce, attendance & performance' },
  projects: { title: 'Projects', sub: 'Delivery board & resource allocation' },
  crm: { title: 'CRM', sub: 'Leads, pipeline & customer relationships' },
}

export function Header({ onMenu }: { onMenu: () => void }) {
  const { active, setCommand, setCopilot } = useErp()
  const meta = moduleTitles[active]
  const unread = notifications.filter((n) => n.unread).length

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/70 bg-background/70 px-4 backdrop-blur-xl lg:px-6">
      <button
        onClick={onMenu}
        aria-label="Toggle menu"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="min-w-0">
        <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">
          {meta.title}
        </h1>
        <p className="hidden truncate text-xs text-muted-foreground sm:block">{meta.sub}</p>
      </div>

      {/* Command palette trigger */}
      <button
        onClick={() => setCommand(true)}
        className="group ml-auto hidden h-9 w-full max-w-[280px] items-center gap-2 rounded-lg border border-border bg-card/60 px-3 text-sm text-muted-foreground transition-colors hover:bg-accent/50 md:flex"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search or jump to…</span>
        <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground lg:inline">⌘K</kbd>
      </button>

      <div className="ml-auto flex items-center gap-2 md:ml-0">
        <button
          onClick={() => setCommand(true)}
          aria-label="Search"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground md:hidden"
        >
          <Search className="h-4 w-4" />
        </button>

        <Button
          size="sm"
          onClick={() => setCopilot(true)}
          className="hidden h-9 gap-2 bg-gradient-to-r from-primary to-chart-2 text-primary-foreground shadow-sm shadow-primary/30 hover:opacity-90 sm:inline-flex"
        >
          <Sparkles className="h-4 w-4" />
          Ask AI
        </Button>

        <Button size="sm" variant="outline" className="hidden h-9 gap-1.5 lg:inline-flex">
          <Plus className="h-4 w-4" />
          New
        </Button>

        <ThemeToggle />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="Notifications"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chart-4 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-chart-4" />
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b px-3 py-2.5">
              <span className="text-sm font-semibold">Notifications</span>
              <Badge variant="secondary" className="text-[10px]">{unread} new</Badge>
            </div>
            <div className="max-h-80 overflow-y-auto scroll-area-thin">
              {notifications.map((n) => (
                <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5 px-3 py-2.5">
                  <div className="flex w-full items-center gap-2">
                    <span
                      className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        n.type === 'success' && 'bg-chart-1',
                        n.type === 'warning' && 'bg-chart-3',
                        n.type === 'info' && 'bg-chart-2'
                      )}
                    />
                    <span className="text-xs font-medium">{n.title}</span>
                    {n.unread && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                  </div>
                  <span className="pl-3.5 text-[11px] text-muted-foreground">{n.description}</span>
                  <span className="pl-3.5 text-[10px] text-muted-foreground/70">{n.time}</span>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator className="my-0" />
            <DropdownMenuItem className="justify-center py-2 text-xs text-muted-foreground">
              View all activity
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg border border-border bg-card/60 p-1 pr-2 transition-colors hover:bg-accent/50">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-gradient-to-br from-primary to-chart-2 text-[11px] font-medium text-primary-foreground">
                  AK
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-left sm:block">
                <span className="block text-xs font-medium leading-tight">Aria Kapoor</span>
                <span className="block text-[10px] leading-tight text-muted-foreground">Admin</span>
              </span>
              <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Aria Kapoor</span>
                <span className="text-xs font-normal text-muted-foreground">aria@aurora.io</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><Check className="mr-2 h-4 w-4" /> My Profile</DropdownMenuItem>
            <DropdownMenuItem><CircleDot className="mr-2 h-4 w-4" /> Workspace</DropdownMenuItem>
            <DropdownMenuItem><Bell className="mr-2 h-4 w-4" /> Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
