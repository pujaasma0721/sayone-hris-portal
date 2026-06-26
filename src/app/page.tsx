'use client';

/**
 * SayOne HRIS Career Portal — page composition.
 *
 * Renders a boxed, centered layout with a floating header card, an active
 * view, and a sticky footer. Global overlays (auth modal, AI coach, command
 * palette) are mounted at the root.
 */

import * as React from 'react';
import { useCommandShortcut } from '@/hooks/use-count-up';
import { useTalent } from '@/lib/talent-store';
import { QueryProvider } from '@/components/query-provider';
import { ErrorBoundary } from '@/components/error-boundary';
import { Header } from '@/components/talent/layout/header';
import { Footer } from '@/components/talent/layout/footer';
import { usePortalAccess, type PortalBranding } from '@/lib/api/portal-access';
import { CareersView } from '@/components/talent/views/careers-view';
import { JobDetailView } from '@/components/talent/views/job-detail-view';
import { DashboardView } from '@/components/talent/views/dashboard-view';
import { ApplicationsView } from '@/components/talent/views/applications-view';
import { ProfileView } from '@/components/talent/views/profile-view';
import { AuthModal } from '@/components/talent/widgets/auth-modal';
import { AiCoach } from '@/components/talent/widgets/ai-coach';
import { CommandPalette } from '@/components/talent/widgets/command-palette';
import { ComingSoon } from '@/components/talent/widgets/coming-soon';

function ActiveView() {
  const active = useTalent((s) => s.active);
  const selectedJobId = useTalent((s) => s.selectedJobId);
  const candidate = useTalent((s) => s.candidate);
  const openAuth = useTalent((s) => s.openAuth);

  // Auth guard: protected modules trigger the auth modal when no candidate.
  React.useEffect(() => {
    const protectedMods = ['dashboard', 'applications', 'profile', 'interviews', 'messages', 'settings'];
    if (protectedMods.includes(active) && !candidate) {
      openAuth('login');
    }
  }, [active, candidate, openAuth]);

  if (active === 'careers') {
    return selectedJobId ? <JobDetailView jobId={selectedJobId} /> : <CareersView />;
  }
  if (active === 'dashboard') {
    return candidate ? <DashboardView /> : <CareersView />;
  }
  if (active === 'applications') {
    return candidate ? <ApplicationsView /> : <CareersView />;
  }
  if (active === 'profile') {
    return candidate ? <ProfileView /> : <CareersView />;
  }
  if (active === 'interviews' || active === 'messages' || active === 'settings') {
    return candidate ? <ComingSoon module={active} /> : <CareersView />;
  }
  return <CareersView />;
}

function Home() {
  const setCommand = useTalent((s) => s.setCommand);
  useCommandShortcut(() => setCommand(true));
  const { branding, loading, error } = usePortalAccess();

  // Portal access loading — show spinner
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading career portal…</p>
        </div>
      </div>
    );
  }

  // Invalid slug — show error
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="max-w-md rounded-xl border border-chart-4/30 bg-chart-4/5 p-6 text-center">
          <h2 className="text-lg font-semibold text-chart-4">Portal link invalid</h2>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            Please use the access link provided by your company.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background">
      {/* Ambient aurora background */}
      <div className="aurora-bg" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] flex-1 flex-col px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
        <Header branding={branding} />
        <main className="flex-1 py-5">
          <ErrorBoundary>
            <ActiveView />
          </ErrorBoundary>
        </main>
        <Footer branding={branding} />
      </div>

      {/* Global overlays */}
      <AuthModal />
      <AiCoach />
      <CommandPalette />
    </div>
  );
}

export default function Page() {
  return (
    <QueryProvider>
      <Home />
    </QueryProvider>
  );
}
