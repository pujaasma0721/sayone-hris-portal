'use client';

/**
 * TabNav — horizontally scrollable module switcher for the Talent Portal.
 *
 * Public modules (careers) are always available. Authenticated modules
 * (dashboard, applications, profile, interviews, messages, settings) are
 * visually locked when no candidate is signed in — clicking them opens the
 * auth modal instead of switching the active module.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Calendar,
  Compass,
  LayoutDashboard,
  MessageSquare,
  Settings,
  User,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { useTalent, type TalentModule } from '@/lib/talent-store';
import { applicationsService } from '@/lib/api/services';

interface TabDef {
  id: TalentModule;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  needsAuth: boolean;
}

const TABS: TabDef[] = [
  { id: 'careers', label: 'Jobs', icon: Compass, needsAuth: false },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, needsAuth: true },
  { id: 'applications', label: 'Applications', icon: Briefcase, needsAuth: true },
  { id: 'interviews', label: 'Interviews', icon: Calendar, needsAuth: true },
  { id: 'messages', label: 'Messages', icon: MessageSquare, needsAuth: true },
  { id: 'profile', label: 'Profile', icon: User, needsAuth: true },
  { id: 'settings', label: 'Settings', icon: Settings, needsAuth: true },
];

export function TabNav() {
  const active = useTalent((s) => s.active);
  const setModule = useTalent((s) => s.set);
  const candidate = useTalent((s) => s.candidate);
  const openAuth = useTalent((s) => s.openAuth);

  const { data: applications } = useQuery({
    queryKey: ['talent', 'applications'],
    queryFn: () => applicationsService.list(),
    enabled: !!candidate,
  });

  const activeCount = React.useMemo(() => {
    if (!applications) return 0;
    return applications.filter((a) => a.status === 'ACTIVE').length;
  }, [applications]);

  const handleClick = (tab: TabDef) => {
    if (tab.needsAuth && !candidate) {
      openAuth('login');
      return;
    }
    setModule(tab.id);
  };

  return (
    <nav
      aria-label="Primary"
      className="flex items-center gap-1 overflow-x-auto scroll-area-thin border-t border-border/50 bg-background/30 px-3 py-1.5"
    >
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        const isLocked = tab.needsAuth && !candidate;
        const Icon = tab.icon;
        const showBadge = tab.id === 'applications' && activeCount > 0;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleClick(tab)}
            aria-label={tab.label}
            title={tab.label}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'relative inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium whitespace-nowrap transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground',
              isLocked && 'opacity-50',
            )}
          >
            {isActive && (
              <motion.span
                layoutId="tabIndicator"
                transition={{ type: 'spring', damping: 28, stiffness: 380 }}
                className="absolute inset-0 rounded-lg bg-primary/10 ring-1 ring-primary/20"
              />
            )}
            <Icon className="relative z-10 size-4 shrink-0" />
            <span className="relative z-10 sm:inline hidden">{tab.label}</span>
            {showBadge && (
              <span
                className={cn(
                  'relative z-10 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {activeCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
