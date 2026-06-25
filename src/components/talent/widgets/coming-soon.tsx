'use client';

/**
 * ComingSoon — placeholder for the Interviews, Messages, and Settings
 * modules. Encourages the candidate to lean on Aurora Coach in the
 * meantime.
 */

import * as React from 'react';
import { Construction, Sparkles } from 'lucide-react';

import { useTalent, type TalentModule } from '@/lib/talent-store';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Copy {
  title: string;
  description: string;
}

const COPY: Record<string, Copy> = {
  interviews: {
    title: 'Interviews are coming soon',
    description:
      'A dedicated interview hub — with preparation checklists, calendar sync, and feedback notes — is on the way. In the meantime, your scheduled interviews appear on the dashboard.',
  },
  messages: {
    title: 'Messages are coming soon',
    description:
      'Soon you will be able to chat directly with recruiters inside the portal. For now, Aurora Coach can help you craft outreach messages and email replies.',
  },
  settings: {
    title: 'Settings are coming soon',
    description:
      'Granular privacy, notification, and account preferences are on the roadmap. Aurora Coach can walk you through any account questions you have today.',
  },
};

export function ComingSoon({ module }: { module: TalentModule }) {
  const setCopilot = useTalent((s) => s.setCopilot);
  const copy = COPY[module] || COPY.settings;

  return (
    <div className="view-enter flex min-h-[60vh] items-center justify-center">
      <Card className="relative w-full max-w-lg overflow-hidden border-border/60 bg-gradient-to-br from-primary/10 via-card to-accent/10">
        <div className="grid-texture absolute inset-0 opacity-40" aria-hidden />
        <CardHeader className="relative items-center text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20">
            <Construction className="size-7" />
          </span>
          <CardTitle className="mt-2 text-xl">{copy.title}</CardTitle>
          <CardDescription className="max-w-sm">{copy.description}</CardDescription>
        </CardHeader>
        <CardContent className="relative flex justify-center pb-6">
          <Button
            onClick={() => setCopilot(true)}
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-sm shadow-primary/20 hover:opacity-95"
          >
            <Sparkles className="size-4" />
            Ask Aurora Coach
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
