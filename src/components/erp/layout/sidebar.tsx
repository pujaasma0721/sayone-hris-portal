'use client'

import * as React from 'react'
import {
  LayoutDashboard,
  BarChart3,
  Package,
  ShoppingCart,
  Wallet,
  Users,
  FolderKanban,
  Contact,
  Sparkles,
  ChevronsLeft,
  Settings,
  LifeBuoy,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useErp, type ModuleId } from '@/lib/erp-store'
import { Badge } from '@/components/ui/badge'

interface NavItem {
  id: ModuleId
  label: string
  icon: React.ComponentType<{ className?: string }>
  hint?: string
  badge?: string
}

const mainNav: NavItem[] = [
  { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, hint: 'Live overview' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, hint: 'Deep insights' },
  { id: 'inventory', label: 'Inventory', icon: Package, hint: 'Stock & warehouses', badge: '3' },
  { id: 'sales', label: 'Sales', icon: ShoppingCart, hint: 'Orders & pipeline' },
  { id: 'finance', label: 'Finance', icon: Wallet, hint: 'P&L & cash flow' },
  { id: 'hr', label: 'People', icon: Users, hint: 'Team & performance' },
  { id: 'projects', label: 'Projects', icon: FolderKanban, hint: 'Delivery board' },
  { id: 'crm', label: 'CRM', icon: Contact, hint: 'Leads & deals' },
]

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { active, set, setCopilot } = useErp()

  return (
    <aside
      className={cn(
        'relative z-20 flex h-full flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl transition-[width] duration-300',
        collapsed ? 'w-[76px]' : 'w-[256px]'
      )}
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 px-4">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-chart-3 shadow-lg shadow-primary/20">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-chart-3 ring-2 ring-sidebar" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold tracking-tight">Aurora ERP</div>
            <div className="truncate text-[11px] text-muted-foreground">Enterprise OS</div>
          </div>
        )}
        <button
          onClick={onToggle}
          aria-label="Collapse sidebar"
          className={cn(
            'ml-auto hidden h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground lg:inline-flex',
            collapsed && 'rotate-180'
          )}
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
      </div>

      {/* AI Copilot trigger */}
      <div className="px-3 pb-2">
        <button
          onClick={() => setCopilot(true)}
          className={cn(
            'group relative flex w-full items-center gap-2.5 overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 via-accent/20 to-transparent px-3 py-2.5 text-left transition-all hover:border-primary/50',
            collapsed && 'justify-center px-0'
          )}
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/15">
            <Sparkles className="h-4 w-4 text-primary" />
          </span>
          {!collapsed && (
            <span className="relative min-w-0">
              <span className="block text-xs font-medium text-foreground">Ask Aurora AI</span>
              <span className="block text-[10px] text-muted-foreground">Copilot ⌘J</span>
            </span>
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 scroll-area-thin">
        {!collapsed && (
          <div className="px-2 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Modules
          </div>
        )}
        <ul className="space-y-0.5">
          {mainNav.map((item) => {
            const isActive = active === item.id
            const Icon = item.icon
            return (
              <li key={item.id}>
                <button
                  onClick={() => set(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all',
                    collapsed && 'justify-center px-0',
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                  )}
                  <Icon className={cn('h-[18px] w-[18px] shrink-0 transition-transform group-hover:scale-110', isActive && 'text-primary')} />
                  {!collapsed && (
                    <>
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <Badge variant="destructive" className="ml-auto h-4 px-1 text-[10px]">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </button>
              </li>
            )
          })}
        </ul>

        {!collapsed && (
          <div className="mt-6 rounded-xl border border-dashed border-border/70 bg-card/40 p-3">
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="pulse-dot h-2 w-2 rounded-full bg-chart-2 text-chart-2" />
              System status
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
              All 7 services operational. 99.98% uptime over 30 days.
            </p>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        <div className="space-y-0.5">
          <button className={cn('flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground', collapsed && 'justify-center px-0')}>
            <Settings className="h-[18px] w-[18px]" />
            {!collapsed && <span>Settings</span>}
          </button>
          <button className={cn('flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground', collapsed && 'justify-center px-0')}>
            <LifeBuoy className="h-[18px] w-[18px]" />
            {!collapsed && <span>Support</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}
