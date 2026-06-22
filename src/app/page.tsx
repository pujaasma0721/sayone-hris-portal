'use client'

import * as React from 'react'
import { useErp } from '@/lib/erp-store'
import { useCommandShortcut } from '@/hooks/use-count-up'
import { Sidebar } from '@/components/erp/layout/sidebar'
import { Header } from '@/components/erp/layout/header'
import { Footer } from '@/components/erp/layout/footer'
import { DashboardView } from '@/components/erp/views/dashboard-view'
import { AnalyticsView } from '@/components/erp/views/analytics-view'
import { InventoryView } from '@/components/erp/views/inventory-view'
import { SalesView } from '@/components/erp/views/sales-view'
import { FinanceView } from '@/components/erp/views/finance-view'
import { HrView } from '@/components/erp/views/hr-view'
import { ProjectsView } from '@/components/erp/views/projects-view'
import { CrmView } from '@/components/erp/views/crm-view'
import { AiCopilot } from '@/components/erp/widgets/ai-copilot'
import { CommandPalette } from '@/components/erp/widgets/command-palette'

function ActiveView({ active }: { active: string }) {
  switch (active) {
    case 'dashboard': return <DashboardView />
    case 'analytics': return <AnalyticsView />
    case 'inventory': return <InventoryView />
    case 'sales': return <SalesView />
    case 'finance': return <FinanceView />
    case 'hr': return <HrView />
    case 'projects': return <ProjectsView />
    case 'crm': return <CrmView />
    default: return <DashboardView />
  }
}

export default function Home() {
  const { active, setCommand } = useErp()
  const [collapsed, setCollapsed] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  useCommandShortcut(() => setCommand(true))

  // Close mobile sidebar on view change
  React.useEffect(() => {
    setMobileOpen(false)
  }, [active])

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Ambient aurora background */}
      <div className="aurora-bg" aria-hidden />

      <div className="relative z-10 flex min-h-screen flex-1">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
        </div>

        {/* Mobile sidebar drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-background/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full">
              <Sidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
            </div>
          </div>
        )}

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <Header onMenu={() => setMobileOpen(true)} />
          <main className="flex-1 px-4 py-5 lg:px-6">
            <ActiveView active={active} />
          </main>
          <Footer />
        </div>
      </div>

      {/* Global overlays */}
      <AiCopilot />
      <CommandPalette />
    </div>
  )
}
