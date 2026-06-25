/**
 * Global UI + auth state for the Talent Portal.
 *
 * The store intentionally avoids persisting auth tokens — those live in
 * `localStorage` via the API client (`src/lib/api/client.ts`). The `candidate`
 * field is hydrated from `localStorage` on mount by `useAuth`.
 */

import { create } from 'zustand';
import type { CandidateProfile } from './api/types';

export type TalentModule =
  | 'careers'
  | 'dashboard'
  | 'applications'
  | 'profile'
  | 'interviews'
  | 'messages'
  | 'settings';

export interface TalentState {
  /** Currently active navigation module. */
  active: TalentModule;
  /** Selected job posting id (for the detail drawer / apply flow). */
  selectedJobId: number | null;
  /** Selected application id (for the detail drawer). */
  selectedApplicationId: number | null;
  /** Whether the AI Copilot panel is open. */
  copilotOpen: boolean;
  /** Whether the command palette is open. */
  commandOpen: boolean;
  /** Whether the auth modal is open. */
  authOpen: boolean;
  /** Auth modal mode: 'login' | 'register'. */
  authMode: 'login' | 'register';
  /** Authenticated candidate profile (hydrated from localStorage on mount). */
  candidate: CandidateProfile | null;

  /* ----------------------------- Actions ----------------------------- */
  set: (module: TalentModule) => void;
  openJob: (id: number | null) => void;
  openApplication: (id: number | null) => void;
  setCopilot: (open: boolean) => void;
  setCommand: (open: boolean) => void;
  openAuth: (mode: 'login' | 'register') => void;
  closeAuth: () => void;
  setCandidate: (candidate: CandidateProfile | null) => void;
}

export const useTalent = create<TalentState>((set) => ({
  active: 'careers',
  selectedJobId: null,
  selectedApplicationId: null,
  copilotOpen: false,
  commandOpen: false,
  authOpen: false,
  authMode: 'login',
  candidate: null,

  set: (module) => set({ active: module }),
  openJob: (id) => set({ selectedJobId: id }),
  openApplication: (id) => set({ selectedApplicationId: id }),
  setCopilot: (open) => set({ copilotOpen: open }),
  setCommand: (open) => set({ commandOpen: open }),
  openAuth: (mode) => set({ authOpen: true, authMode: mode }),
  closeAuth: () => set({ authOpen: false }),
  setCandidate: (candidate) => set({ candidate }),
}));
