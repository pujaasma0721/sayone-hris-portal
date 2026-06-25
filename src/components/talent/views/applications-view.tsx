'use client';

/**
 * ApplicationsView — pipeline kanban + per-application detail.
 *
 * When `selectedApplicationId` is set, renders the detailed view; otherwise
 * shows the four-column pipeline of active applications and the past
 * (rejected) list underneath.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  X,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { applicationsService } from '@/lib/api/services';
import type {
  ApplicationStage,
  ApplicationStageLog,
  InterviewSchedule,
} from '@/lib/api/types';
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

interface ColumnDef {
  stage: ApplicationStage;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  dot: string;
  tint: string;
}

const COLUMNS: ColumnDef[] = [
  { stage: 'APPLIED', label: 'Applied', icon: Clock, dot: 'bg-muted-foreground', tint: 'bg-muted text-muted-foreground' },
  { stage: 'PHONE_SCREEN', label: 'Screening', icon: FileText, dot: 'bg-chart-2', tint: 'bg-chart-2/15 text-chart-2' },
  { stage: 'INTERVIEW', label: 'Interview', icon: Calendar, dot: 'bg-primary', tint: 'bg-primary/15 text-primary' },
  { stage: 'OFFER', label: 'Offer', icon: CheckCircle2, dot: 'bg-accent-foreground', tint: 'bg-accent text-accent-foreground' },
];

export function ApplicationsView() {
  const candidate = useTalent((s) => s.candidate);
  const selectedApplicationId = useTalent((s) => s.selectedApplicationId);

  if (!candidate) return null;

  if (selectedApplicationId) {
    return <ApplicationDetailView id={selectedApplicationId} />;
  }
  return <PipelineView />;
}

/* -------------------------------------------------------------------------- */
/*  Pipeline                                                                  */
/* -------------------------------------------------------------------------- */

function PipelineView() {
  const { data: applications, isLoading } = useQuery({
    queryKey: ['talent', 'applications'],
    queryFn: () => applicationsService.list(),
  });

  const openApplication = useTalent((s) => s.openApplication);
  const setModule = useTalent((s) => s.set);

  const active = React.useMemo(
    () => (applications || []).filter((a) => a.status === 'ACTIVE'),
    [applications],
  );
  const rejected = React.useMemo(
    () => (applications || []).filter((a) => a.status === 'REJECTED'),
    [applications],
  );

  return (
    <div className="view-enter space-y-5">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Your applications
        </h1>
        <p className="text-sm text-muted-foreground">
          Track every active role and review past outcomes.
        </p>
      </div>

      {/* Pipeline columns */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {COLUMNS.map((col) => {
          const Icon = col.icon;
          const items = active.filter((a) => a.stage === col.stage);
          return (
            <Card key={col.stage} className="border-border/60">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn('size-2 rounded-full', col.dot)} />
                    <CardTitle className="text-sm font-medium flex items-center gap-1.5">
                      <Icon className="size-3.5" />
                      {col.label}
                    </CardTitle>
                  </div>
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[10px] font-semibold text-muted-foreground">
                    {items.length}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {isLoading ? (
                  <Skeleton className="h-20 w-full rounded-lg" />
                ) : items.length === 0 ? (
                  <p className="py-6 text-center text-[11px] text-muted-foreground">
                    No applications here yet.
                  </p>
                ) : (
                  items.map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => openApplication(app.id)}
                      className={cn(
                        'w-full rounded-lg border border-border/60 bg-background/60 p-3 text-left transition-all',
                        'hover:border-primary/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                      )}
                    >
                      <p className="truncate text-sm font-medium text-foreground">
                        {app.postingTitle}
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(app.appliedAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        {app.matchScore ? (
                          <span className={cn('rounded-full px-1.5 py-0.5 text-[10px] font-semibold', col.tint)}>
                            {app.matchScore}%
                          </span>
                        ) : null}
                      </div>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Past applications */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Past applications</CardTitle>
          <CardDescription>Roles that have been closed or rejected</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {rejected.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              No past applications — keep going!
            </p>
          ) : (
            rejected.map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => openApplication(app.id)}
                className="flex w-full items-start gap-3 rounded-lg border border-border/60 bg-background/60 p-3 text-left transition-all hover:border-destructive/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                  <X className="size-4" />
                </span>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {app.postingTitle}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {app.rejectedReasonText || 'Application was not advanced.'}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Closed{' '}
                    {new Date(app.lastActivityAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </button>
            ))
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center pt-2">
        <Button variant="outline" size="sm" onClick={() => setModule('careers')}>
          Browse more jobs
        </Button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Application detail                                                        */
/* -------------------------------------------------------------------------- */

function ApplicationDetailView({ id }: { id: number }) {
  const openApplication = useTalent((s) => s.openApplication);

  const { data: applications } = useQuery({
    queryKey: ['talent', 'applications'],
    queryFn: () => applicationsService.list(),
  });
  const { data: stageLog } = useQuery({
    queryKey: ['talent', 'applications', id, 'stage-log'],
    queryFn: () => applicationsService.stageLog(id),
  });
  const { data: interviews } = useQuery({
    queryKey: ['talent', 'interviews'],
    queryFn: () => applicationsService.interviews(),
  });

  const app = applications?.find((a) => a.id === id);

  if (!app) {
    return (
      <div className="view-enter space-y-4">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  const stageOrder: ApplicationStage[] = ['APPLIED', 'PHONE_SCREEN', 'INTERVIEW', 'OFFER'];
  const currentIndex = stageOrder.indexOf(app.stage as ApplicationStage);
  const isRejected = app.status === 'REJECTED';

  const stageTint: Record<string, string> = {
    APPLIED: 'bg-muted text-muted-foreground',
    PHONE_SCREEN: 'bg-chart-2/15 text-chart-2',
    INTERVIEW: 'bg-primary/15 text-primary',
    OFFER: 'bg-accent text-accent-foreground',
    REJECTED: 'bg-destructive/15 text-destructive',
  };

  const appInterviews = (interviews || []).filter(
    (iv: InterviewSchedule) => iv.applicationId === id,
  );

  const logs: ApplicationStageLog[] = stageLog || [];

  return (
    <div className="view-enter space-y-5">
      <button
        type="button"
        onClick={() => openApplication(null)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded"
      >
        <ArrowLeft className="size-4" />
        Back to pipeline
      </button>

      {/* Header */}
      <Card className="relative overflow-hidden border-border/60 bg-gradient-to-br from-primary/10 via-card to-accent/10">
        <div className="grid-texture absolute inset-0 opacity-40" aria-hidden />
        <CardContent className="relative space-y-3 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="font-mono">#{app.id}</Badge>
            <Badge className={cn('capitalize', stageTint[app.stage])}>
              {app.stage.replace('_', ' ').toLowerCase()}
            </Badge>
            {isRejected && (
              <Badge variant="destructive" className="gap-1">
                <X className="size-3" />
                Rejected
              </Badge>
            )}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {app.postingTitle}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground sm:text-sm">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" />
              Applied {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              Last update {new Date(app.lastActivityAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            {app.matchScore ? (
              <span className="inline-flex items-center gap-1.5">
                <FileText className="size-3.5" />
                {app.matchScore}% match
              </span>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* Progress stepper */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Hiring stage</CardTitle>
          <CardDescription>Where this application sits in the pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="flex items-center gap-1 sm:gap-2">
            {stageOrder.map((stage, idx) => {
              const done = !isRejected && idx < currentIndex;
              const current = !isRejected && idx === currentIndex;
              const tint = stageTint[stage];
              return (
                <li key={stage} className="flex flex-1 items-center gap-1 sm:gap-2">
                  <div
                    className={cn(
                      'flex size-8 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold',
                      done && 'border-primary bg-primary text-primary-foreground',
                      current && cn('border-current', tint),
                      !done && !current && 'border-border bg-background text-muted-foreground',
                    )}
                  >
                    {done ? <CheckCircle2 className="size-4" /> : idx + 1}
                  </div>
                  <span
                    className={cn(
                      'hidden text-[11px] font-medium sm:inline',
                      (done || current) ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {stage === 'PHONE_SCREEN' ? 'Screening' : stage.charAt(0) + stage.slice(1).toLowerCase()}
                  </span>
                  {idx < stageOrder.length - 1 && (
                    <div
                      className={cn(
                        'h-px flex-1',
                        done ? 'bg-primary' : 'bg-border',
                      )}
                    />
                  )}
                </li>
              );
            })}
          </ol>
          {isRejected && (
            <p className="mt-3 text-xs text-destructive">
              This application was rejected at the{' '}
              <span className="font-medium capitalize">{app.stage.replace('_', ' ').toLowerCase()}</span>{' '}
              stage.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Timeline */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Timeline</CardTitle>
            <CardDescription>Stage transitions and notes</CardDescription>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                No activity recorded yet.
              </p>
            ) : (
              <ol className="relative space-y-4 border-l border-border/60 pl-5">
                {logs.map((log) => (
                  <li key={log.id} className="relative">
                    <span className="absolute -left-[1.4rem] top-1 size-2.5 rounded-full bg-primary ring-4 ring-background" />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium capitalize text-foreground">
                          {log.toStage.replace('_', ' ').toLowerCase()}
                        </p>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(log.changedAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      {log.reason && (
                        <p className="text-xs text-muted-foreground">{log.reason}</p>
                      )}
                      {log.changedByName && (
                        <p className="text-[10px] text-muted-foreground">by {log.changedByName}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>

        {/* Interviews */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Interviews</CardTitle>
            <CardDescription>Scheduled rounds for this application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {appInterviews.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                No interviews scheduled yet.
              </p>
            ) : (
              appInterviews.map((iv: InterviewSchedule) => {
                const when = new Date(iv.scheduledAt);
                return (
                  <div
                    key={iv.id}
                    className="rounded-lg border border-border/60 bg-background/60 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">
                        Round {iv.round} · {iv.type.toLowerCase()}
                      </p>
                      <Badge variant="outline" className="text-[10px]">
                        {iv.status.toLowerCase()}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {when.toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      ·{' '}
                      {when.toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      · {iv.durationMinutes} min
                    </p>
                    {iv.meetingLink && (
                      <Button asChild variant="outline" size="sm" className="mt-2 w-full">
                        <a href={iv.meetingLink} target="_blank" rel="noreferrer">
                          Join meeting
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

      {/* Rejection reason */}
      {isRejected && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-destructive">
              <X className="size-4" />
              Rejection reason
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/80">
              {app.rejectedReasonText || 'No reason was provided by the recruiter.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
