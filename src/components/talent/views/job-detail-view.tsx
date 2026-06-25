'use client';

/**
 * JobDetailView — single job posting with apply flow.
 *
 * Renders the job header, an apply bar with CV upload (when signed in),
 * the description, responsibilities, requirements, and a sidebar with
 * benefits + an about-company card.
 */

import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  MapPin,
  Sparkles,
  Users,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { jobsService, applicationsService } from '@/lib/api/services';
import type { JobPosting } from '@/lib/api/types';
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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

function guessDepartment(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('design')) return 'Design';
  if (t.includes('devops') || t.includes('sre') || t.includes('cloud')) return 'Infrastructure';
  if (t.includes('data') || t.includes('analyst')) return 'Analytics';
  if (t.includes('qa') || t.includes('test')) return 'Quality';
  return 'Engineering';
}

function postedAgo(dateStr?: string): string {
  if (!dateStr) return 'Recently';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  }
  const months = Math.floor(days / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
}

const BENEFITS: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }[] = [
  { icon: DollarSign, label: 'Compensation', value: 'Competitive salary + equity' },
  { icon: Sparkles, label: 'Wellness', value: 'Premium health & dental coverage' },
  { icon: Clock, label: 'Time off', value: '25 days PTO + public holidays' },
  { icon: Building2, label: 'Workspace', value: 'Hybrid setup, modern office' },
];

export function JobDetailView({ jobId }: { jobId: number }) {
  const setActive = useTalent((s) => s.set);
  const openJob = useTalent((s) => s.openJob);
  const candidate = useTalent((s) => s.candidate);
  const openAuth = useTalent((s) => s.openAuth);
  const setCopilot = useTalent((s) => s.setCopilot);
  const queryClient = useQueryClient();

  const { data: posting, isLoading } = useQuery({
    queryKey: ['talent', 'postings', jobId],
    queryFn: () => jobsService.get(jobId),
    enabled: !!jobId,
  });

  const [resumeFile, setResumeFile] = React.useState<File | null>(null);
  const [applied, setApplied] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Reset apply state when navigating between postings.
  React.useEffect(() => {
    setApplied(false);
    setResumeFile(null);
    setError(null);
  }, [jobId]);

  const handleApply = async () => {
    if (!posting) return;
    if (!candidate) {
      openAuth('register');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await jobsService.apply({
        postingId: posting.id,
        expectedSalary: candidate.expectedSalary,
        noticePeriodDays: candidate.noticePeriodDays,
        resumeFile: resumeFile || undefined,
      });
      setApplied(true);
      await queryClient.invalidateQueries({ queryKey: ['talent', 'applications'] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Application failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !posting) {
    return (
      <div className="view-enter space-y-4">
        <Skeleton className="h-9 w-48 rounded-lg" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  const department = guessDepartment(posting.title);
  const closingDate = posting.closingDate
    ? new Date(posting.closingDate).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Open';

  const responsibilities = [
    'Drive the design and implementation of core product surfaces end-to-end.',
    'Partner with product, design, and backend teams to ship delightful experiences.',
    'Write clean, tested, well-documented, and accessible code.',
    'Mentor peers and contribute to a strong engineering culture.',
    'Champion performance, observability, and operational excellence.',
  ];
  const requirements = [
    '3+ years of relevant professional experience.',
    'Strong fundamentals in modern web technologies.',
    'Excellent communication and collaboration skills.',
    'A bias toward ownership and shipping.',
    'Experience with design systems is a plus.',
  ];

  return (
    <div className="view-enter space-y-5">
      <button
        type="button"
        onClick={() => {
          openJob(0);
          setActive('careers');
        }}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded"
      >
        <ArrowLeft className="size-4" />
        Back to all jobs
      </button>

      {/* Header card */}
      <Card className="relative overflow-hidden border-border/60 bg-gradient-to-br from-primary/10 via-card to-accent/10">
        <div className="grid-texture absolute inset-0 opacity-40" aria-hidden />
        <CardContent className="relative space-y-4 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Briefcase className="size-3" />
              {department}
            </Badge>
            <Badge variant="outline">Full-time</Badge>
            <Badge variant="outline" className="font-mono">
              REQ-{posting.id}
            </Badge>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {posting.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" /> Jakarta / Remote
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="size-3.5" /> Full-time
              </span>
              <span className="inline-flex items-center gap-1.5">
                <DollarSign className="size-3.5" /> Competitive
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" /> {postedAgo(posting.publishDate)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-3.5" /> {posting.applicationsCount} applicants
              </span>
            </div>
          </div>

          {/* Apply bar */}
          <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-background/60 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-muted-foreground">
              {applied ? (
                <span className="inline-flex items-center gap-1.5 font-medium text-primary">
                  <CheckCircle2 className="size-3.5" />
                  Application submitted — we&apos;ll be in touch soon.
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  Closes on {closingDate}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCopilot(true)}>
                <Sparkles className="size-4" />
                Ask Coach
              </Button>
              <Button
                size="sm"
                disabled={applied || submitting}
                onClick={handleApply}
                className={cn(
                  'bg-gradient-to-r from-primary to-accent text-primary-foreground',
                  'shadow-sm shadow-primary/20 hover:opacity-95',
                )}
              >
                {submitting ? 'Submitting…' : applied ? 'Applied' : 'Apply Now'}
              </Button>
            </div>
          </div>
          {error && (
            <p className="text-xs text-destructive" role="alert">
              {error}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* CV upload (if signed in and not yet applied) */}
          {candidate && !applied && (
            <Card className="border-border/60">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-primary" />
                  <h2 className="text-sm font-semibold text-foreground">Attach your CV</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload a fresh résumé for this application, or leave empty to use your
                  profile résumé.
                </p>
                <Label
                  htmlFor="resume-upload"
                  className={cn(
                    'flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border/60',
                    'bg-background/60 px-4 py-6 text-center transition-colors hover:border-primary/40',
                  )}
                >
                  <FileText className="size-5 text-muted-foreground" />
                  <span className="text-xs font-medium text-foreground">
                    {resumeFile ? resumeFile.name : 'Click to upload · PDF, DOC, DOCX'}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {resumeFile ? `${(resumeFile.size / 1024).toFixed(0)} KB` : 'Max 10MB'}
                  </span>
                  <Input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="sr-only"
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  />
                </Label>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">About the role</CardTitle>
              <CardDescription>{posting.description}</CardDescription>
            </CardHeader>
          </Card>

          {/* Responsibilities */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">What you&apos;ll do</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {responsibilities.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-foreground/80">{r}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">What we&apos;re looking for</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {requirements.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                    aria-hidden
                  />
                  <span className="text-foreground/80">{r}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="size-4 text-accent-foreground" />
                Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {BENEFITS.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.label} className="flex items-start gap-2.5">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="size-3.5" />
                    </span>
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium text-foreground">{b.label}</p>
                      <p className="text-xs text-muted-foreground">{b.value}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-border/60 bg-gradient-to-br from-card to-accent/10">
            <CardHeader>
              <CardTitle className="text-base">About SayOne HRIS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                SayOne HRIS is building the next-generation human resources platform for
                ambitious, people-first companies across Southeast Asia.
              </p>
              <p>
                We believe HR software should feel modern, calm, and genuinely helpful — for
                candidates and operators alike.
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between"
                onClick={() => setCopilot(true)}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="size-4 text-accent-foreground" />
                  Ask Aurora Coach
                </span>
                <ArrowUpRight className="size-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* Keep applicationsService import tree-shaken */
void applicationsService;
