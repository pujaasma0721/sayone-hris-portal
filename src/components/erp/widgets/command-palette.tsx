'use client'

import * as React from 'react'
import {
  LayoutDashboard, BarChart3, Package, ShoppingCart, Wallet, Users,
  FolderKanban, Contact, Sparkles, Moon, Sun, Plus, Download, Settings, Bell, Search,
} from 'lucide-react'
import { useErp, type ModuleId } from '@/lib/erp-store'
import { useTheme } from 'next-themes'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'

const modules: { id: ModuleId; label: string; icon: any; hint: string }[] = [
  { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, hint: 'Live overview' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, hint: 'Deep insights' },
  { id: 'inventory', label: 'Inventory', icon: Package, hint: 'Stock & warehouses' },
  { id: 'sales', label: 'Sales', icon: ShoppingCart, hint: 'Orders & pipeline' },
  { id: 'finance', label: 'Finance', icon: Wallet, hint: 'P&L & cash flow' },
  { id: 'hr', label: 'People', icon: Users, hint: 'Team & performance' },
  { id: 'projects', label: 'Projects', icon: FolderKanban, hint: 'Delivery board' },
  { id: 'crm', label: 'CRM', icon: Contact, hint: 'Leads & deals' },
]

export function CommandPalette() {
  const { commandOpen, setCommand, set: setActive, setCopilot } = useErp()
  const { setTheme, resolvedTheme } = useTheme()

  const go = (m: ModuleId) => {
    setActive(m)
    setCommand(false)
  }

  return (
    <CommandDialog
      open={commandOpen}
      onOpenChange={setCommand}
      className="max-w-xl"
    >
      <CommandInput placeholder="Search modules, run actions, or ask Aurora…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigate">
          {modules.map((m) => {
            const Icon = m.icon
            return (
              <CommandItem key={m.id} value={`${m.label} ${m.hint} navigate module`} onSelect={() => go(m.id)}>
                <Icon className="text-muted-foreground" />
                <span>{m.label}</span>
                <span className="ml-1 text-xs text-muted-foreground">{m.hint}</span>
              </CommandItem>
            )
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem
            value="ask aurora ai copilot assistant"
            onSelect={() => {
              setCommand(false)
              setCopilot(true)
            }}
          >
            <Sparkles className="text-primary" />
            <span>Ask Aurora AI</span>
            <CommandShortcut>⌘J</CommandShortcut>
          </CommandItem>
          <CommandItem value="create new order add" onSelect={() => go('sales')}>
            <Plus />
            <span>Create new order</span>
          </CommandItem>
          <CommandItem value="add product inventory" onSelect={() => go('inventory')}>
            <Plus />
            <span>Add product</span>
          </CommandItem>
          <CommandItem value="export report download" onSelect={() => go('analytics')}>
            <Download />
            <span>Export report</span>
          </CommandItem>
          <CommandItem value="notifications alerts" onSelect={() => setCommand(false)}>
            <Bell />
            <span>View notifications</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Preferences">
          <CommandItem
            value="toggle theme dark light mode"
            onSelect={() => {
              setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
              setCommand(false)
            }}
          >
            {resolvedTheme === 'dark' ? <Sun /> : <Moon />}
            <span>Switch to {resolvedTheme === 'dark' ? 'light' : 'dark'} mode</span>
          </CommandItem>
          <CommandItem value="settings preferences config" onSelect={() => setCommand(false)}>
            <Settings />
            <span>Open settings</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick insights">
          {[
            'Summarize this quarter',
            'Which SKUs need reordering?',
            'How can we improve net margin?',
            'What should I prioritize tomorrow?',
          ].map((q) => (
            <CommandItem
              key={q}
              value={`insight ${q}`}
              onSelect={() => {
                setCommand(false)
                setCopilot(true)
              }}
            >
              <Search className="text-muted-foreground" />
              <span className="text-muted-foreground">&ldquo;{q}&rdquo;</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
