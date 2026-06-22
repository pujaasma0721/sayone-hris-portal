'use client'

import { create } from 'zustand'

export type ModuleId =
  | "dashboard"
  | "analytics"
  | "inventory"
  | "sales"
  | "finance"
  | "hr"
  | "projects"
  | "crm"

interface ErpState {
  active: ModuleId
  copilotOpen: boolean
  commandOpen: boolean
  set: (m: ModuleId) => void
  toggleCopilot: () => void
  setCopilot: (v: boolean) => void
  setCommand: (v: boolean) => void
}

export const useErp = create<ErpState>((set) => ({
  active: "dashboard",
  copilotOpen: false,
  commandOpen: false,
  set: (m) => set({ active: m }),
  toggleCopilot: () => set((s) => ({ copilotOpen: !s.copilotOpen })),
  setCopilot: (v) => set({ copilotOpen: v }),
  setCommand: (v) => set({ commandOpen: v }),
}))
