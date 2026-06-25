'use client';

/**
 * ProfileView — editable candidate profile.
 *
 * Form state is hydrated from the candidate on the talent store. Saving
 * posts to `profileService.update`, updates the store, and invalidates
 * relevant React Query caches.
 */

import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Award,
  FileText,
  Link2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  Sparkles,
  Upload,
  User as UserIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { profileService } from '@/lib/api/services';
import type { Gender } from '@/lib/api/types';
import { useTalent } from '@/lib/talent-store';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentPosition: string;
  experienceYears: string;
  educationLevel: string;
  expectedSalary: string;
  skills: string;
  linkedinUrl: string;
  address: string;
  dateOfBirth: string;
  gender: Gender | '';
}

function getInitials(firstName?: string, lastName?: string): string {
  const a = (firstName || '').trim().charAt(0).toUpperCase();
  const b = (lastName || '').trim().charAt(0).toUpperCase();
  return `${a}${b}`.trim() || 'C';
}

export function ProfileView() {
  const candidate = useTalent((s) => s.candidate);
  const setCandidate = useTalent((s) => s.setCandidate);
  const setCopilot = useTalent((s) => s.setCopilot);
  const queryClient = useQueryClient();

  const [form, setForm] = React.useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentPosition: '',
    experienceYears: '',
    educationLevel: '',
    expectedSalary: '',
    skills: '',
    linkedinUrl: '',
    address: '',
    dateOfBirth: '',
    gender: '',
  });
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [resumeFile, setResumeFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Hydrate from candidate
  React.useEffect(() => {
    if (!candidate) return;
    setForm({
      firstName: candidate.firstName || '',
      lastName: candidate.lastName || '',
      email: candidate.email || '',
      phone: candidate.phone || '',
      currentPosition: candidate.currentPosition || '',
      experienceYears: candidate.experienceYears ? String(candidate.experienceYears) : '',
      educationLevel: candidate.educationLevel || '',
      expectedSalary: candidate.expectedSalary ? String(candidate.expectedSalary) : '',
      skills: candidate.skills || '',
      linkedinUrl: candidate.linkedinUrl || '',
      address: candidate.address || '',
      dateOfBirth: candidate.dateOfBirth || '',
      gender: candidate.gender || '',
    });
  }, [candidate]);

  const skillsList = React.useMemo(
    () =>
      form.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    [form.skills],
  );

  if (!candidate) return null;

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await profileService.update({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        currentPosition: form.currentPosition,
        experienceYears: form.experienceYears ? Number(form.experienceYears) : undefined,
        educationLevel: form.educationLevel,
        expectedSalary: form.expectedSalary ? Number(form.expectedSalary) : undefined,
        skills: form.skills,
        linkedinUrl: form.linkedinUrl,
        address: form.address,
        dateOfBirth: form.dateOfBirth || undefined,
        gender: (form.gender || undefined) as Gender | undefined,
        resumeFile: resumeFile || undefined,
      });
      setCandidate(updated);
      await queryClient.invalidateQueries({ queryKey: ['talent'] });
      setResumeFile(null);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="view-enter space-y-5">
      {/* Header card */}
      <Card className="relative overflow-hidden border-border/60 bg-gradient-to-br from-primary/10 via-card to-accent/10">
        <div className="grid-texture absolute inset-0 opacity-40" aria-hidden />
        <CardContent className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-xl font-semibold text-primary-foreground shadow-md shadow-primary/20">
              {getInitials(form.firstName, form.lastName)}
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {form.firstName} {form.lastName}
              </h1>
              <p className="text-sm text-muted-foreground">
                {form.currentPosition || 'Add your current position'}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Badge variant="secondary" className="gap-1">
                  <Sparkles className="size-3" />
                  Candidate
                </Badge>
                {skillsList.slice(0, 3).map((s) => (
                  <Badge key={s} variant="outline" className="text-[10px] font-normal">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className={cn(
              'self-start bg-gradient-to-r from-primary to-accent text-primary-foreground',
              'shadow-sm shadow-primary/20 hover:opacity-95',
            )}
          >
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving…
              </>
            ) : saved ? (
              <>
                <Save className="size-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="size-4" />
                Save changes
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Personal information */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Personal information</CardTitle>
            <CardDescription>Used for identity verification and contact</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="First name"
                icon={<UserIcon className="size-3.5" />}
                value={form.firstName}
                onChange={(v) => update('firstName', v)}
              />
              <Field
                label="Last name"
                icon={<UserIcon className="size-3.5" />}
                value={form.lastName}
                onChange={(v) => update('lastName', v)}
              />
            </div>
            <Field
              label="Email"
              icon={<Mail className="size-3.5" />}
              type="email"
              value={form.email}
              disabled
              hint="Email cannot be changed"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Phone"
                icon={<Phone className="size-3.5" />}
                value={form.phone}
                onChange={(v) => update('phone', v)}
                placeholder="+62 8xx xxxx xxxx"
              />
              <Field
                label="Date of birth"
                type="date"
                value={form.dateOfBirth}
                onChange={(v) => update('dateOfBirth', v)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Gender</Label>
              <select
                value={form.gender}
                onChange={(e) => update('gender', e.target.value as Gender | '')}
                className={cn(
                  'h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm',
                  'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                  'dark:bg-input/30',
                )}
              >
                <option value="">Prefer not to say</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </div>
            <Field
              label="Address"
              icon={<MapPin className="size-3.5" />}
              value={form.address}
              onChange={(v) => update('address', v)}
              placeholder="Street, city, country"
            />
          </CardContent>
        </Card>

        {/* Professional details */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Professional details</CardTitle>
            <CardDescription>Tell us about your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Field
              label="Current position"
              icon={<Award className="size-3.5" />}
              value={form.currentPosition}
              onChange={(v) => update('currentPosition', v)}
              placeholder="e.g. Senior Frontend Engineer"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Experience (years)"
                type="number"
                value={form.experienceYears}
                onChange={(v) => update('experienceYears', v)}
                placeholder="5"
              />
              <Field
                label="Expected salary (IDR/month)"
                type="number"
                value={form.expectedSalary}
                onChange={(v) => update('expectedSalary', v)}
                placeholder="28000000"
              />
            </div>
            <Field
              label="Education level"
              value={form.educationLevel}
              onChange={(v) => update('educationLevel', v)}
              placeholder="e.g. Bachelor's Degree in Computer Science"
            />
            <Field
              label="LinkedIn URL"
              icon={<Link2 className="size-3.5" />}
              type="url"
              value={form.linkedinUrl}
              onChange={(v) => update('linkedinUrl', v)}
              placeholder="https://www.linkedin.com/in/you"
            />
          </CardContent>
        </Card>
      </div>

      {/* Skills */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Skills</CardTitle>
          <CardDescription>Comma-separated list of your strongest skills</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            value={form.skills}
            onChange={(e) => update('skills', e.target.value)}
            placeholder="React, TypeScript, Next.js, GraphQL…"
          />
          {skillsList.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {skillsList.map((s) => (
                <Badge key={s} variant="secondary" className="text-[11px]">
                  {s}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resume */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="size-4 text-primary" />
            Résumé
          </CardTitle>
          <CardDescription>
            Upload a PDF or DOC up to 10MB. We&apos;ll use this when you apply.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {candidate.resumePath && !resumeFile ? (
            <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/60 p-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="size-5 shrink-0 text-primary" />
                <div className="min-w-0 space-y-0.5">
                  <p className="truncate text-sm font-medium text-foreground">
                    {candidate.resumePath.split('/').pop() || 'Current résumé'}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Currently on file</p>
                </div>
              </div>
              <Label
                htmlFor="resume-replace"
                className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-border/60 bg-background px-3 text-xs font-medium hover:bg-accent/40"
              >
                <Upload className="size-3.5" />
                Replace
                <Input
                  id="resume-replace"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="sr-only"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                />
              </Label>
            </div>
          ) : (
            <Label
              htmlFor="resume-upload"
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border/60',
                'bg-background/60 px-4 py-8 text-center transition-colors hover:border-primary/40',
              )}
            >
              <FileText className="size-6 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {resumeFile ? resumeFile.name : 'Click to upload résumé'}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {resumeFile
                  ? `${(resumeFile.size / 1024).toFixed(0)} KB · Save to confirm`
                  : 'PDF, DOC, DOCX · max 10MB'}
              </span>
              <Input
                id="resume-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                className="sr-only"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              />
            </Label>
          )}
          <Button variant="ghost" size="sm" onClick={() => setCopilot(true)}>
            <Sparkles className="size-4 text-accent-foreground" />
            Ask Airee Coach to review my CV
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Reusable field                                                            */
/* -------------------------------------------------------------------------- */

interface FieldProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  hint?: string;
}

function Field({ label, value, onChange, type = 'text', placeholder, disabled, icon, hint }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">
        {icon}
        {label}
      </Label>
      <Input
        type={type}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        disabled={disabled}
      />
      {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
