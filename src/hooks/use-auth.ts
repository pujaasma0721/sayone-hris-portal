'use client';

/**
 * Auth hook for the Talent Portal.
 *
 * Responsibilities:
 *   - Hydrate the candidate profile from `localStorage` on mount.
 *   - Expose `login`, `register`, `logout` actions backed by `authService`.
 *   - Sync the profile + token with both the API client and the zustand store.
 */

import * as React from 'react';
import { useTalent } from '@/lib/talent-store';
import { authService } from '@/lib/api/services';
import {
  clearToken,
  getStoredProfile,
  setStoredProfile,
  setToken,
} from '@/lib/api/client';
import type {
  CandidateProfile,
  RegisterCandidateInput,
} from '@/lib/api/types';

export interface UseAuthResult {
  candidate: CandidateProfile | null;
  loading: boolean;
  error: string | null;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<CandidateProfile>;
  register: (data: RegisterCandidateInput) => Promise<CandidateProfile>;
  logout: () => Promise<void>;
  setError: (error: string | null) => void;
}

export function useAuth(): UseAuthResult {
  const candidate = useTalent((s) => s.candidate);
  const setCandidate = useTalent((s) => s.setCandidate);
  const closeAuth = useTalent((s) => s.closeAuth);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [hydrated, setHydrated] = React.useState(false);

  /* -------- Hydrate candidate from localStorage on mount -------- */
  React.useEffect(() => {
    const stored = getStoredProfile();
    if (stored) {
      setCandidate(stored);
    }
    setHydrated(true);
  }, []);

  /* ----------------------------- login ----------------------------- */
  const login = React.useCallback(
    async (email: string, password: string): Promise<CandidateProfile> => {
      setLoading(true);
      setError(null);
      try {
        const res = await authService.login(email, password);
        setToken(res.token);
        setStoredProfile(res.profile);
        setCandidate(res.profile);
        closeAuth();
        return res.profile;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setCandidate, closeAuth],
  );

  /* ---------------------------- register --------------------------- */
  const register = React.useCallback(
    async (data: RegisterCandidateInput): Promise<CandidateProfile> => {
      setLoading(true);
      setError(null);
      try {
        const res = await authService.register(data);
        setToken(res.token);
        setStoredProfile(res.profile);
        setCandidate(res.profile);
        closeAuth();
        return res.profile;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setCandidate, closeAuth],
  );

  /* ----------------------------- logout ---------------------------- */
  const logout = React.useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.logout();
    } catch {
      // Best-effort: ignore backend logout errors.
    } finally {
      clearToken();
      setCandidate(null);
      setLoading(false);
    }
  }, [setCandidate]);

  return {
    candidate,
    loading,
    error,
    hydrated,
    login,
    register,
    logout,
    setError,
  };
}
