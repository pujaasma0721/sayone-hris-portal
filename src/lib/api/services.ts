/**
 * Service layer for the Talent Portal.
 *
 * Each service wraps the `api` client and exposes typed methods for a single
 * resource family. Services are safe to consume from React Query hooks or from
 * UI components directly.
 */

import { api } from './client';
import type {
  ApplyJobInput,
  CandidateLoginResponse,
  CandidateProfile,
  InterviewSchedule,
  JobApplication,
  ApplicationStageLog,
  JobPosting,
  OfferLetter,
  RegisterCandidateInput,
  UpdateProfileInput,
} from './types';

/* -------------------------------------------------------------------------- */
/*  Auth                                                                      */
/* -------------------------------------------------------------------------- */

export const authService = {
  /** Authenticate a candidate with email + password. */
  login(email: string, password: string): Promise<CandidateLoginResponse> {
    return api.post<CandidateLoginResponse>(
      '/login',
      { email, password },
      { auth: false, isForm: true },
    );
  },

  /** Register a new candidate (multipart/form-data, optional file uploads). */
  register(data: RegisterCandidateInput): Promise<CandidateLoginResponse> {
    return api.post<CandidateLoginResponse>('/register', data, { auth: false, isForm: true });
  },

  /** Logout the current candidate. Best-effort: failures are ignored by callers. */
  logout(): Promise<void> {
    return api.post<void>('/me/logout', undefined, { auth: true });
  },
};

/* -------------------------------------------------------------------------- */
/*  Job postings                                                              */
/* -------------------------------------------------------------------------- */

export const jobsService = {
  /** List all published job postings for the configured company. */
  list(): Promise<JobPosting[]> {
    return api.get<JobPosting[]>('/postings', { auth: false });
  },

  /** Fetch a single job posting by id. */
  get(id: number | string): Promise<JobPosting> {
    return api.get<JobPosting>(`/postings/${id}`, { auth: false });
  },

  /** Apply to a posting (multipart/form-data, supports resume upload). */
  apply(data: ApplyJobInput): Promise<JobApplication> {
    return api.post<JobApplication>('/apply', data, { auth: false, isForm: true });
  },
};

/* -------------------------------------------------------------------------- */
/*  Candidate profile                                                         */
/* -------------------------------------------------------------------------- */

export const profileService = {
  /** Fetch the authenticated candidate's profile. */
  get(): Promise<CandidateProfile> {
    return api.get<CandidateProfile>('/me/profile', { auth: true });
  },

  /** Update the authenticated candidate's profile (multipart/form-data). */
  update(data: UpdateProfileInput): Promise<CandidateProfile> {
    return api.post<CandidateProfile>('/me/profile', data, { auth: true, isForm: true });
  },
};

/* -------------------------------------------------------------------------- */
/*  Applications + related resources                                          */
/* -------------------------------------------------------------------------- */

export const applicationsService = {
  /** List all applications belonging to the authenticated candidate. */
  list(): Promise<JobApplication[]> {
    return api.get<JobApplication[]>('/me/applications', { auth: true });
  },

  /** Fetch a single application by id. */
  get(id: number | string): Promise<JobApplication> {
    return api.get<JobApplication>(`/me/applications/${id}`, { auth: true });
  },

  /** Fetch the stage-transition log for an application. */
  stageLog(id: number | string): Promise<ApplicationStageLog[]> {
    return api.get<ApplicationStageLog[]>(`/me/applications/${id}/stage-log`, { auth: true });
  },

  /** List all upcoming + past interviews for the candidate. */
  interviews(): Promise<InterviewSchedule[]> {
    return api.get<InterviewSchedule[]>('/me/interviews', { auth: true });
  },

  /** List all offer letters for the candidate. */
  offers(): Promise<OfferLetter[]> {
    return api.get<OfferLetter[]>('/me/offers', { auth: true });
  },
};
