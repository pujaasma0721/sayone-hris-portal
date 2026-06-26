'use client';

/**
 * Footer — rounded glass card that sits at the bottom of the boxed layout.
 * Communicates trust signals (encryption, equal opportunity) and brand.
 */

import { Globe, Heart, Shield } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { PortalBranding } from '@/lib/api/portal-access';

export function Footer({ branding }: { branding?: PortalBranding | null }) {
  const year = new Date().getFullYear();
  const companyName = branding?.companyDisplayName || 'SayOne HRIS';

  return (
    <footer
      className={cn(
        'mt-4 rounded-2xl border border-border/60 bg-card/60 px-4 py-2.5 backdrop-blur-xl lg:px-6',
      )}
    >
      <div className="flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <span className="inline-flex items-center gap-1.5">
            <Shield className="size-3.5 text-primary" />
            Your data is encrypted
          </span>
          <span className="hidden sm:inline text-border" aria-hidden>
            •
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Globe className="size-3.5 text-accent-foreground" />
            Equal opportunity employer
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <span>© {year} {companyName}</span>
          <span className="hidden sm:inline text-border" aria-hidden>
            •
          </span>
          <span className="inline-flex items-center gap-1.5">
            Made with
            <Heart className="size-3.5 fill-destructive text-destructive" />
            for candidates
          </span>
        </div>
      </div>
    </footer>
  );
}
