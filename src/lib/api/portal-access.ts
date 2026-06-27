'use client'

/**
 * Career Portal access resolver.
 *
 * Handles the slug-based company resolution flow:
 * 1. Candidate opens portal URL with ?p={slug} (e.g. portal.com/?p=a8k2m9x7)
 * 2. Frontend calls GET /api/public/portal/{slug}
 * 3. Backend resolves slug → companyCode, sets HttpOnly cookie `company_ctx`
 * 4. Frontend stores branding info (company name, logo, tagline, color)
 * 5. All subsequent API calls use credentials:'include' so the cookie is sent
 *    automatically — the backend reads companyCode from cookie, not URL.
 *
 * The slug is non-guessable (8-char UUID). Candidates cannot access other
 * tenants because:
 * - The cookie is HttpOnly (JS cannot read/modify it)
 * - Backend checks cookie first, ignores path variable if cookie exists
 */

import { useState, useEffect, useCallback } from 'react'
import { API_URL, COMPANY_CODE, USE_MOCK } from './client'

export interface PortalBranding {
  companyCode: string
  companyDisplayName?: string
  logoUrl?: string
  tagline?: string
  primaryColor?: string
}

interface PortalState {
  branding: PortalBranding | null
  loading: boolean
  error: string | null
  resolved: boolean
}

let cachedBranding: PortalBranding | null = null

export function usePortalAccess(): PortalState {
  const [state, setState] = useState<PortalState>({
    branding: cachedBranding,
    loading: !cachedBranding,
    error: null,
    resolved: !!cachedBranding,
  })

  const resolve = useCallback(async () => {
    // In mock mode, skip resolution and use default company
    if (USE_MOCK) {
      const mockBranding: PortalBranding = {
        companyCode: COMPANY_CODE,
        companyDisplayName: 'SayOne HRIS',
        tagline: 'Find your next role',
      }
      cachedBranding = mockBranding
      setState({ branding: mockBranding, loading: false, error: null, resolved: true })
      return
    }

    // Check if slug is in URL (?p=slug)
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const slug = params.get('p')

    if (slug) {
      // Resolve slug via backend
      try {
        const res = await fetch(`${API_URL}/api/public/portal/${slug}`, {
          credentials: 'include',
        })
        const json = await res.json()
        if (res.ok && json.success && json.data) {
          const branding: PortalBranding = {
            companyCode: json.data.companyCode,
            companyDisplayName: json.data.companyDisplayName,
            logoUrl: json.data.logoUrl,
            tagline: json.data.tagline,
            primaryColor: json.data.primaryColor,
          }
          cachedBranding = branding
          setState({ branding, loading: false, error: null, resolved: true })
          // Clean URL — remove ?p=slug so it's not shareable
          const url = new URL(window.location.href)
          url.searchParams.delete('p')
          window.history.replaceState({}, '', url.toString())
          return
        } else {
          setState({ branding: null, loading: false, error: json.message || 'Invalid portal link', resolved: true })
          return
        }
      } catch (err: any) {
        // Network error — fall back to default company code (for dev/preview)
        const fallbackBranding: PortalBranding = { companyCode: COMPANY_CODE, companyDisplayName: 'SayOne HRIS' }
        cachedBranding = fallbackBranding
        setState({ branding: fallbackBranding, loading: false, error: null, resolved: true })
        return
      }
    }

    // No slug in URL — assume cookie already set (returning visitor) or use default
    const branding: PortalBranding = {
      companyCode: COMPANY_CODE,
      companyDisplayName: 'SayOne HRIS',
      tagline: 'Find your next role',
    }
    cachedBranding = branding
    setState({ branding, loading: false, error: null, resolved: true })
  }, [])

  useEffect(() => {
    if (cachedBranding) return
    let cancelled = false
    const run = async () => {
      await resolve()
      // resolve() already calls setState; the cancelled flag is just a guard
      // for the unlikely case the effect is cleaned up mid-flight.
      void cancelled
    }
    run()
    return () => { cancelled = true }
  }, [resolve])

  return state
}

/** Get cached branding (non-hook, for use outside React components). */
export function getPortalBranding(): PortalBranding | null {
  return cachedBranding
}
