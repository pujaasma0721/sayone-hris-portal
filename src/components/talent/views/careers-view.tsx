'use client';

/**
 * CareersView — public job board.
 *
 * Renders a hero, department filter chips, a featured row, and the full
 * grid of open positions. Clicking a card opens the job detail view via
 * the shared `openJob` action on the talent store.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowUpRight,
  Briefcase,
  Building2,
  Compass,
  MapPin,
  Search,
  Users,
  Zap,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { jobsService } from '@/lib/api/services';
import type { JobPosting } from '@/lib/api/types';
import { useTalent } from '@/lib/talent-store';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface EnrichedJob {
  posting: JobPosting;
  department: string;
  location: string;
  type: string;
  postedAgo: string;
  matchScore: number;
  tags: string[];
}

const DEPARTMENTS = ['All', 'Engineering', 'Design', 'Infrastructure', 'Analytics', 'Quality'] as const;
type Department = (typeof DEPARTMENTS)[number];

function guessDepartment(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('frontend') || t.includes('backend') || t.includes('engineer') || t.includes('developer')) {
    return 'Engineering';
  }
  if (t.includes('design') || t.includes('designer')) return 'Design';
  if (t.includes('devops') || t.includes('sre') || t.includes('infra') || t.includes('cloud')) {
    return 'Infrastructure';
  }
  if (t.includes('data') || t.includes('analyst') || t.includes('analytics')) return 'Analytics';
  if (t.includes('qa') || t.includes('test') || t.includes('quality')) return 'Quality';
  return 'Engineering';
}

function postedAgo(dateStr?: string): string {
  if (!dateStr) return 'Recently';
  const date = new Date(dateStr).getTime();
  const now = Date.now();
  const diffMs = now - date;
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

function enrich(p: JobPosting): EnrichedJob {
  const department = guessDepartment(p.title);
  const lower = p.title.toLowerCase();
  const matchScore = lower.includes('senior') ? 92 : lower.includes('lead') ? 88 : 75;
  const tags = p.channels ? p.channels.split(',').map((c) => c.trim()).filter(Boolean) : [];

  return {
    posting: p,
    department,
    location: 'Jakarta / Remote',
    type: 'Full-time',
    postedAgo: postedAgo(p.publishDate),
    matchScore,
    tags,
  };
}

function departmentColor(dept: string): string {
  switch (dept) {
    case 'Engineering':
      return 'bg-primary/15 text-primary';
    case 'Design':
      return 'bg-chart-4/15 text-chart-4';
    case 'Infrastructure':
      return 'bg-chart-2/15 text-chart-2';
    case 'Analytics':
      return 'bg-chart-5/15 text-chart-5';
    case 'Quality':
      return 'bg-accent text-accent-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export function CareersView() {
  const openJob = useTalent((s) => s.openJob);
  const setCopilot = useTalent((s) => s.setCopilot);

  const [query, setQuery] = React.useState('');
  const [dept, setDept] = React.useState<Department>('All');

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['talent', 'postings'],
    queryFn: () => jobsService.list(),
  });

  const enriched = React.useMemo<EnrichedJob[]>(
    () => (jobs || []).map(enrich),
    [jobs],
  );

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return enriched.filter((j) => {
      const matchesQuery = !q || j.posting.title.toLowerCase().includes(q) || j.department.toLowerCase().includes(q);
      const matchesDept = dept === 'All' || j.department === dept;
      return matchesQuery && matchesDept;
    });
  }, [enriched, query, dept]);

  const featured = React.useMemo(() => {
    if (query || dept !== 'All') return [];
    return enriched.slice(0, 3);
  }, [enriched, query, dept]);

  return (
    <div className="view-enter space-y-6">
      {/* Hero */}
      <Card className="relative overflow-hidden border-border/60 bg-gradient-to-br from-primary/10 via-card to-accent/10">
        <div className="grid-texture absolute inset-0 opacity-50" aria-hidden />
        <CardContent className="relative space-y-5 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 font-medium text-primary">
              <span className="size-1.5 rounded-full bg-primary pulse-dot" />
              {enriched.length} open positions · hiring now
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/60 px-2.5 py-1">
              <Compass className="size-3.5" />
              SayOne HRIS
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Find a place where you{' '}
              <span className="text-gradient">truly belong.</span>
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              Browse open roles, track your applications, and let Airee Coach guide your
              next career move — all in one beautifully crafted portal.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search roles, teams, keywords…"
                className="pl-9"
                aria-label="Search jobs"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCopilot(true)}
              className="w-fit"
            >
              <Zap className="size-4" />
              Ask Airee Coach
            </Button>
          </div>

          {/* Department chips */}
          <div className="flex flex-wrap gap-2">
            {DEPARTMENTS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDept(d)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                  dept === d
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border/60 bg-background/60 text-muted-foreground hover:text-foreground',
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Featured openings</h2>
            <Badge variant="secondary" className="gap-1">
              <Zap className="size-3" /> Top match
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {featured.map((job) => (
              <button
                key={job.posting.id}
                type="button"
                onClick={() => openJob(job.posting.id)}
                className="group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-xl"
              >
                <Card
                  className={cn(
                    'h-full border-border/60 bg-gradient-to-br from-card to-primary/5',
                    'transition-all group-hover:border-primary/40 group-hover:shadow-md group-hover:shadow-primary/10',
                  )}
                >
                  <CardContent className="space-y-3 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={cn(
                          'inline-flex size-9 items-center justify-center rounded-lg',
                          departmentColor(job.department),
                        )}
                      >
                        <Zap className="size-4" />
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        {job.matchScore}% match
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground line-clamp-1">
                        {job.posting.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {job.department} · {job.location}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-medium text-foreground/80">Competitive</span>
                      <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* All jobs */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {query || dept !== 'All' ? 'Results' : 'All open positions'}
          </h2>
          <span className="text-xs text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? 'job' : 'jobs'}
          </span>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-36 w-full rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <Compass className="size-8 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">No jobs found</p>
              <p className="text-xs text-muted-foreground">
                Try a different keyword or department.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  setQuery('');
                  setDept('All');
                }}
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((job) => (
              <button
                key={job.posting.id}
                type="button"
                onClick={() => openJob(job.posting.id)}
                className="group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-xl"
              >
                <Card
                  className={cn(
                    'h-full border-border/60 transition-all',
                    'group-hover:border-primary/40 group-hover:shadow-md group-hover:shadow-primary/5',
                  )}
                >
                  <CardContent className="space-y-3 p-5">
                    <div className="flex items-start gap-3">
                      <span
                        className={cn(
                          'flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold uppercase',
                          departmentColor(job.department),
                        )}
                      >
                        {job.department.charAt(0)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-foreground line-clamp-1">
                            {job.posting.title}
                          </h3>
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                            {job.matchScore}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {job.department} · {job.location} · {job.type}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {job.posting.description}
                    </p>

                    {job.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {job.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[10px] font-normal">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Briefcase className="size-3.5" />
                        {job.postedAgo}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="size-3.5" />
                        {job.posting.applicationsCount} applicants
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-medium text-foreground/80">
                        <Building2 className="size-3.5" />
                        Competitive
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* Unused imports kept tree-shaken */
void MapPin;
