'use client';

/**
 * Header — floating, glassy top bar that contains brand, search, AI coach,
 * theme toggle, notifications, and the candidate menu (or sign-in CTA).
 * Renders the TabNav underneath the top bar inside the same floating card.
 */

import * as React from 'react';
import { useTheme } from 'next-themes';
import {
  Bell,
  ChevronDown,
  LogOut,
  Moon,
  Search,
  Settings,
  Sparkles,
  Sun,
  User as UserIcon,
  Briefcase,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { useTalent } from '@/lib/talent-store';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TabNav } from './tab-nav';

function getInitials(firstName?: string, lastName?: string): string {
  const a = (firstName || '').trim().charAt(0).toUpperCase();
  const b = (lastName || '').trim().charAt(0).toUpperCase();
  return `${a}${b}`.trim() || 'C';
}

export function Header() {
  const setCommand = useTalent((s) => s.setCommand);
  const setCopilot = useTalent((s) => s.setCopilot);
  const setModule = useTalent((s) => s.set);
  const openApplication = useTalent((s) => s.openApplication);
  const candidate = useTalent((s) => s.candidate);
  const openAuth = useTalent((s) => s.openAuth);
  const { logout } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const handleLogout = React.useCallback(async () => {
    await logout();
    setModule('careers');
  }, [logout, setModule]);

  return (
    <header
      className={cn(
        'sticky top-3 z-30 overflow-hidden rounded-2xl border border-border/60',
        'bg-card/80 shadow-lg shadow-black/5 backdrop-blur-xl',
      )}
    >
      {/* Top bar */}
      <div className="flex h-14 items-center gap-2 px-3 sm:px-4">
        {/* Brand */}
        <button
          type="button"
          onClick={() => setModule('careers')}
          className="flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          aria-label="SayOne HRIS Career Portal home"
        >
          <span
            className={cn(
              'flex size-9 items-center justify-center rounded-xl',
              'bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground',
              'shadow-md shadow-primary/20',
            )}
          >
            <Sparkles className="size-5" />
          </span>
          <span className="hidden flex-col items-start leading-none sm:flex">
            <span className="text-sm font-semibold text-foreground">
              SayOne HRIS
            </span>
            <span className="text-[11px] text-muted-foreground">Career Portal</span>
          </span>
        </button>

        {/* Search button */}
        <button
          type="button"
          onClick={() => setCommand(true)}
          className={cn(
            'ml-auto hidden h-9 max-w-xs flex-1 items-center gap-2 rounded-lg border border-border/60',
            'bg-background/60 px-3 text-sm text-muted-foreground transition-colors hover:bg-background/80',
            'sm:flex',
          )}
          aria-label="Open command palette"
        >
          <Search className="size-4" />
          <span className="flex-1 text-left">Search jobs, modules…</span>
          <kbd className="rounded border border-border/60 bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium">
            ⌘K
          </kbd>
        </button>

        {/* Mobile search icon */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCommand(true)}
          className="sm:hidden ml-auto"
          aria-label="Open command palette"
        >
          <Search className="size-4" />
        </Button>

        {/* Ask Coach */}
        <Button
          variant="default"
          size="sm"
          onClick={() => setCopilot(true)}
          className={cn(
            'hidden md:inline-flex bg-gradient-to-r from-primary to-accent text-primary-foreground',
            'shadow-sm shadow-primary/20 hover:opacity-95',
          )}
        >
          <Sparkles className="size-4" />
          Ask Coach
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          {mounted && resolvedTheme === 'dark' ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="size-4" />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-accent text-accent pulse-dot" />
        </Button>

        {/* Profile / Sign In */}
        {candidate ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg p-1 pr-2 outline-none transition-colors hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring/50"
                aria-label="Open profile menu"
              >
                <Avatar className="size-8 border border-border/60">
                  <AvatarFallback className="bg-gradient-to-br from-primary/80 to-accent/80 text-primary-foreground text-xs font-semibold">
                    {getInitials(candidate.firstName, candidate.lastName)}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">
                    {candidate.firstName} {candidate.lastName}
                  </span>
                  <span className="text-xs text-muted-foreground">Candidate</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  setModule('profile');
                }}
              >
                <UserIcon className="size-4" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  openApplication(null);
                  setModule('applications');
                }}
              >
                <Briefcase className="size-4" />
                My Applications
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setModule('settings')}>
                <Settings className="size-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="size-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button size="sm" onClick={() => openAuth('login')}>
            Sign In
          </Button>
        )}
      </div>

      {/* Module navigation */}
      <TabNav />
    </header>
  );
}
