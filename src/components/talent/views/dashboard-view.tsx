'use client';

/**
 * DashboardView — candidate home base.
 *
 * Greets the signed-in candidate, surfaces four headline stats, and lays
 * out the active application pipeline, profile strength ring, recommended
 * jobs, and upcoming interviews.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowUpRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  applicationsService,
  jobsService,
} from '@/lib/api/services';
import type { InterviewSchedule, JobApplication, JobPosting } from '@/lib/api/types';
import { useTalent } from '@/lib/talent-store';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Stat {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  tint: string;
}

const STAGE_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  APPLIED: FileText,
  PHONE_SCREEN: Users,
  INTERVIEW: Calendar,
  ASSESSMENT: Star,
  OFFER: CheckCircle2,
  HIRED: CheckCircle2,
  REJECTED: Clock,
};

const STAGE_TINT: Record<string, string> = {
  APPLIED: 'bg-muted text-muted-foreground',
  PHONE_SCREEN: 'bg-chart-2/15 text-chart-2',
  INTERVIEW: 'bg-primary/15 text-primary',
  ASSESSMENT: 'bg-chart-5/15 text-chart-5',
  OFFER: 'bg-accent text-accent-foreground',
  HIRED: 'bg-primary text-primary-foreground',
  REJECTED: 'bg-destructive/15 text-destructive',
};

function guessDepartment(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('design')) return 'Design';
  if (t.includes('devops') || t.includes('sre')) return 'Infrastructure';
  if (t.includes('data') || t.includes('analyst')) return 'Analytics';
  if (t.includes('qa') || t.includes('test')) return 'Quality';
  return 'Engineering';
}

function ProfileStrengthRing({ percent }: { percent: number }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <svg viewBox="0 0 100 100" className="size-28 -rotate-90" aria-hidden>
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        strokeWidth="8"
        className="stroke-muted"
      />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        className="stroke-primary transition-all duration-700"
      />
    </svg>
  );
}

export function DashboardView() {
  const candidate = useTalent((s) => s.candidate);
  const setModule = useTalent((s) => s.set);
  const setCopilot = useTalent((s) => s.setCopilot);
  const openJob = useTalent((s) => s.openJob);
  const openApplication = useTalent((s) => s.openApplication);

  const { data: applications, isLoading: appsLoading } = useQuery({
    queryKey: ['talent', 'applications'],
    queryFn: () => applicationsService.list(),
    enabled: !!candidate,
  });

  const { data: interviews, isLoading: intLoading } = useQuery({
    queryKey: ['talent', 'interviews'],
    queryFn: () => applicationsService.interviews(),
    enabled: !!candidate,
  });

  const { data: jobs } = useQuery({
    queryKey: ['talent', 'postings'],
    queryFn: () => jobsService.list(),
    enabled: !!candidate,
  });

  const activeApps = React.useMemo<JobApplication[]>(
    () => (applications || []).filter((a) => a.status === 'ACTIVE'),
    [applications],
  );
  const upcomingInterviews = React.useMemo<InterviewSchedule[]>(
    () =>
      (interviews || [])
        .filter((i) => i.status === 'SCHEDULED' || i.status === 'CONFIRMED')
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()),
    [interviews],
  );
  const recommended = React.useMemo<JobPosting[]>(() => {
    if (!jobs) return [];
    const appliedIds = new Set((applications || []).map((a) => a.postingId));
    return jobs.filter((j) => !appliedIds.has(j.id)).slice(0, 3);
  }, [jobs, applications]);

  // Compute profile strength from candidate fields.
  const profileStrength = React.useMemo(() => {
    if (!candidate) return 0;
    const fields = [
      candidate.firstName,
      candidate.lastName,
      candidate.phone,
      candidate.currentPosition,
      candidate.experienceYears,
      candidate.educationLevel,
      candidate.expectedSalary,
      candidate.skills,
      candidate.linkedinUrl,
      candidate.address,
      candidate.resumePath,
    ];
    const filled = fields.filter((f) => f !== undefined && f !== null && f !== '').length;
    return Math.round((filled / fields.length) * 100);
  }, [candidate]);

  const firstName = candidate?.firstName || 'there';

  const stats: Stat[] = [
    {
      label: 'Active Applications',
      value: String(activeApps.length),
      icon: Briefcase,
      tint: 'bg-primary/15 text-primary',
    },
    {
      label: 'Upcoming Interviews',
      value: String(upcomingInterviews.length),
      icon: Calendar,
      tint: 'bg-accent text-accent-foreground',
    },
    {
      label: 'Profile Strength',
      value: `${profileStrength}%`,
      icon: TrendingUp,
      tint: 'bg-chart-2/15 text-chart-2',
    },
    {
      label: 'Profile Views',
      value: '24',
      icon: Users,
      tint: 'bg-chart-5/15 text-chart-5',
    },
  ];

  if (!candidate) return null;

  return (
    <div className="view-enter space-y-6">
      {/* Welcome hero */}
      <Card className="relative overflow-hidden border-border/60 bg-gradient-to-br from-primary/10 via-card to-accent/10">
        <div className="grid-texture absolute inset-0 opacity-40" aria-hidden />
        <CardContent className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Welcome back</p>
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Hello, {firstName}. Let&apos;s find your next role.
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground">
              You have {activeApps.length} active application{activeApps.length === 1 ? '' : 's'} and{' '}
              {upcomingInterviews.length} upcoming interview{upcomingInterviews.length === 1 ? '' : 's'}.
            </p>
          </div>
          <Button
            onClick={() => setCopilot(true)}
            className={cn(
              'self-start bg-gradient-to-r from-primary to-accent text-primary-foreground',
              'shadow-sm shadow-primary/20 hover:opacity-95',
            )}
          >
            <Sparkles className="size-4" />
            Ask Aurora Coach
          </Button>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="border-border/60">
              <CardContent className="flex items-center gap-3 p-4">
                <span className={cn('flex size-10 items-center justify-center rounded-lg', s.tint)}>
                  <Icon className="size-5" />
                </span>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-semibold text-foreground">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Application pipeline */}
        <Card className="border-border/60 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Application Pipeline</CardTitle>
            <CardDescription>Your active applications at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {appsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))
            ) : activeApps.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                <Briefcase className="size-8 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">No active applications</p>
                  <p className="text-xs text-muted-foreground">
                    Browse open roles and apply to get started.
                  </p>
                </div>
                <Button size="sm" onClick={() => setModule('careers')}>
                  Browse Jobs
                </Button>
              </div>
            ) : (
              activeApps.map((app) => {
                const Icon = STAGE_ICON[app.stage] || FileText;
                const tint = STAGE_TINT[app.stage] || STAGE_TINT.APPLIED;
                const applied = new Date(app.appliedAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                });
                return (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => {
                      openApplication(app.id);
                      setModule('applications');
                    }}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg border border-border/60 bg-background/60 p-3 text-left transition-all',
                      'hover:border-primary/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                    )}
                  >
                    <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', tint)}>
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium text-foreground">
                          {app.postingTitle}
                        </p>
                        <span className="text-[11px] text-muted-foreground">{applied}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] font-normal capitalize">
                          {app.stage.replace('_', ' ').toLowerCase()}
                        </Badge>
                        {app.matchScore ? (
                          <span className="text-[10px] text-muted-foreground">
                            {app.matchScore}% match
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <ArrowUpRight className="size-4 text-muted-foreground" />
                  </button>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Profile strength */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Profile Strength</CardTitle>
            <CardDescription>Complete your profile to boost matches</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="relative">
              <ProfileStrengthRing percent={profileStrength} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-semibold text-foreground">
                  {profileStrength}%
                </span>
              </div>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              {profileStrength >= 80
                ? 'Looking great — recruiters love complete profiles.'
                : 'Add experience, skills, and a résumé to stand out.'}
            </p>
            <Button variant="outline" size="sm" className="w-full" onClick={() => setModule('profile')}>
              Complete profile
            </Button>
          </CardContent>
        </Card>

        {/* Recommended jobs */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Recommended for you</CardTitle>
            <CardDescription>Based on your profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {recommended.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                No new recommendations right now.
              </p>
            ) : (
              recommended.map((job) => (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => openJob(job.id)}
                  className="flex w-full items-start gap-2.5 rounded-lg p-2 text-left transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                    {guessDepartment(job.title).charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{job.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {guessDepartment(job.title)} · Jakarta / Remote
                    </p>
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        {/* Upcoming interviews */}
        <Card className="border-border/60 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Upcoming interviews</CardTitle>
            <CardDescription>Scheduled calls and technical rounds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {intLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))
            ) : upcomingInterviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                <Calendar className="size-8 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">No interviews scheduled</p>
                <p className="text-xs text-muted-foreground">
                  Once a recruiter advances your application, you&apos;ll see it here.
                </p>
              </div>
            ) : (
              upcomingInterviews.map((iv: InterviewSchedule) => {
                const when = new Date(iv.scheduledAt);
                return (
                  <div
                    key={iv.id}
                    className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/60 p-3"
                  >
                    <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <span className="text-[10px] font-medium uppercase">
                        {when.toLocaleString(undefined, { month: 'short' })}
                      </span>
                      <span className="text-lg font-semibold leading-none">
                        {when.getDate()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {iv.postingTitle}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Round {iv.round} · {iv.type.toLowerCase()} ·{' '}
                        {when.toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        · {iv.durationMinutes} min
                      </p>
                    </div>
                    {iv.meetingLink && (
                      <Button asChild variant="outline" size="sm">
                        <a href={iv.meetingLink} target="_blank" rel="noreferrer">
                          Join
                        </a>
                      </Button>
                    )}
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
