'use client';

/**
 * CommandPalette — ⌘K command palette.
 *
 * Navigate modules, jump to the AI coach, ask quick questions, and toggle
 * the theme. Auth-required modules are marked with a lock icon when no
 * candidate is signed in.
 */

import * as React from 'react';
import { useTheme } from 'next-themes';
import {
  Briefcase,
  Calendar,
  Compass,
  LayoutDashboard,
  Lock,
  MessageSquare,
  Moon,
  Settings,
  Sparkles,
  Sun,
  User as UserIcon,
} from 'lucide-react';

import { useTalent, type TalentModule } from '@/lib/talent-store';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

interface NavItem {
  id: TalentModule;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  needsAuth: boolean;
  shortcut?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'careers', label: 'Jobs', icon: Compass, needsAuth: false, shortcut: '1' },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, needsAuth: true, shortcut: '2' },
  { id: 'applications', label: 'Applications', icon: Briefcase, needsAuth: true, shortcut: '3' },
  { id: 'interviews', label: 'Interviews', icon: Calendar, needsAuth: true, shortcut: '4' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, needsAuth: true, shortcut: '5' },
  { id: 'profile', label: 'Profile', icon: UserIcon, needsAuth: true, shortcut: '6' },
  { id: 'settings', label: 'Settings', icon: Settings, needsAuth: true, shortcut: '7' },
];

const QUICK_QUESTIONS = [
  'How can I improve my CV?',
  'What questions should I ask in an interview?',
  'How do I negotiate my salary?',
  'Which skills should I learn next?',
];

export function CommandPalette() {
  const open = useTalent((s) => s.commandOpen);
  const setCommand = useTalent((s) => s.setCommand);
  const setActive = useTalent((s) => s.set);
  const candidate = useTalent((s) => s.candidate);
  const openAuth = useTalent((s) => s.openAuth);
  const setCopilot = useTalent((s) => s.setCopilot);
  const { resolvedTheme, setTheme } = useTheme();

  const go = (item: NavItem) => {
    if (item.needsAuth && !candidate) {
      setCommand(false);
      openAuth('login');
      return;
    }
    setActive(item.id);
    setCommand(false);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setCommand}
      title="Command Palette"
      description="Search modules, actions, and quick questions"
    >
      <CommandInput placeholder="Search jobs, modules, actions…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigate">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const locked = item.needsAuth && !candidate;
            return (
              <CommandItem
                key={item.id}
                value={`${item.label} navigate`}
                onSelect={() => go(item)}
              >
                <Icon className="size-4" />
                <span className="flex-1">{item.label}</span>
                {locked && <Lock className="size-3.5 text-muted-foreground" />}
                {item.shortcut && (
                  <span className="ml-auto text-[10px] text-muted-foreground">
                    {item.shortcut}
                  </span>
                )}
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem
            value="ask aurora coach"
            onSelect={() => {
              setCommand(false);
              setCopilot(true);
            }}
          >
            <Sparkles className="size-4" />
            <span className="flex-1">Ask Aurora Coach</span>
            <span className="ml-auto text-[10px] text-muted-foreground">⌘J</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick questions for Coach">
          {QUICK_QUESTIONS.map((q) => (
            <CommandItem
              key={q}
              value={q}
              onSelect={() => {
                setCommand(false);
                setCopilot(true);
                // Suggestion is dispatched after the panel mounts via a custom event.
                window.dispatchEvent(new CustomEvent('aurora-quick-ask', { detail: q }));
              }}
            >
              <MessageSquare className="size-4" />
              <span className="flex-1">{q}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Preferences">
          <CommandItem
            value="toggle theme"
            onSelect={() => {
              setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
              setCommand(false);
            }}
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
            <span className="flex-1">
              Switch to {resolvedTheme === 'dark' ? 'light' : 'dark'} theme
            </span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
