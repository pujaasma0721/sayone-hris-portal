'use client'

import { useEffect, useState } from 'react'
import { Activity, Globe, Server, Zap } from 'lucide-react'

export function Footer() {
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    const update = () => {
      const d = new Date()
      setTime(
        d.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' UTC+7'
      )
    }
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <footer className="mt-auto border-t border-border/70 bg-background/60 px-4 py-2 backdrop-blur-xl lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-chart-1 text-chart-1" />
            <Activity className="h-3 w-3" />
            <span className="hidden sm:inline">Live · syncing</span>
          </span>
          <span className="hidden items-center gap-1.5 sm:flex">
            <Server className="h-3 w-3" />
            7 services operational
          </span>
          <span className="hidden items-center gap-1.5 md:flex">
            <Globe className="h-3 w-3" />
            3 regions
          </span>
          <span className="hidden items-center gap-1.5 lg:flex">
            <Zap className="h-3 w-3" />
            99.98% uptime
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono tabular-nums">{time}</span>
          <span className="hidden sm:inline">Aurora ERP v3.2 · © 2024</span>
        </div>
      </div>
    </footer>
  )
}
