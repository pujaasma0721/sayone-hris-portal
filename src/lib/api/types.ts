/**
 * Type definitions mirroring the Spring Boot backend entities for the
 * SayOne HRIS Career Portal (candidate-facing Talent Portal).
 *
 * These types are intentionally permissive (string literals / unions) so they
 * can be consumed by both the API client and the mock data layer without
 * extra serialization steps.
 */

/** Standard envelope returned by the Spring Boot backend. */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

/** Gender options accepted by the profile endpoints. */
export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';

/** Candidate profile status (mirrors backend enum). */
export type CandidateStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'PENDING';

/** Job posting status (mirrors backend enum). */
export type JobPostingStatus = 'DRAFT' | 'PUBLISHED' | 'PAUSED' | 'CLOSED' | 'ARCHIVED';

/** Pipeline stages for an application (mirrors backend enum). */
export type ApplicationStage =
  | 'APPLIED'
  | 'PHONE_SCREEN'
  | 'INTERVIEW'
  | 'ASSESSMENT'
  | 'OFFER'
  | 'HIRED'
  | 'REJECTED';

/** Application status (mirrors backend enum). */
export type ApplicationStatus = 'ACTIVE' | 'WITHDRAWN' | 'REJECTED' | 'HIRED';

/** Interview schedule status (mirrors backend enum). */
export type InterviewStatus = 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED' | 'NO_SHOW';

/** Interview type (mirrors backend enum). */
export type InterviewType = 'PHONE' | 'VIDEO' | 'ONSITE' | 'TECHNICAL' | 'HR' | 'MANAGER' | 'PANEL';

/** Offer letter status (mirrors backend enum). */
export type OfferStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED' | 'WITHDRAWN';

/** Work arrangement for an offer. */
export type WorkArrangement = 'REMOTE' | 'HYBRID' | 'ONSITE';

/** Full candidate profile returned by auth + /me/profile. */
export interface CandidateProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyCode: string;
  currentPosition?: string;
  experienceYears?: number;
  educationLevel?: string;
  currentEmployer?: string;
  expectedSalary?: number;
  noticePeriodDays?: number;
  skills?: string;
  resumePath?: string;
  photoPath?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: Gender;
  linkedinUrl?: string;
  status: CandidateStatus;
  active: boolean;
}

/** Response payload for login + register endpoints. */
export interface CandidateLoginResponse {
  token: string;
  expiresIn: number;
  profile: CandidateProfile;
}

/** Public job posting shown on the careers board. */
export interface JobPosting {
  id: number;
  companyCode: string;
  title: string;
  description: string;
  status: JobPostingStatus;
  publishDate?: string;
  closingDate?: string;
  maxApplications?: number;
  viewsCount: number;
  applicationsCount: number;
  channels?: string;
  pipelineStages?: string;
  requisitionNumber?: string;
  requisitionPosition?: string;
  screeningQuestionnaireId?: number;
  screeningQuestionnaireName?: string;
}

/** A candidate's application to a posting. */
export interface JobApplication {
  id: number;
  companyCode: string;
  candidateId: number;
  candidateName?: string;
  candidateEmail?: string;
  postingId: number;
  postingTitle?: string;
  stage: ApplicationStage;
  status: ApplicationStatus;
  matchScore?: number;
  screeningScore?: number;
  appliedAt: string;
  lastActivityAt: string;
  rejectedReasonId?: number;
  rejectedReasonText?: string;
}

/** Stage transition log entry for an application. */
export interface ApplicationStageLog {
  id: number;
  applicationId: number;
  fromStage: string | null;
  toStage: string;
  changedAt: string;
  reason?: string;
  changedByName?: string;
}

/** Scheduled interview for an application. */
export interface InterviewSchedule {
  id: number;
  applicationId: number;
  candidateName?: string;
  postingTitle?: string;
  round: number;
  scheduledAt: string;
  durationMinutes: number;
  type: InterviewType;
  meetingLink?: string;
  status: InterviewStatus;
}

/** Offer letter for an application. */
export interface OfferLetter {
  id: number;
  applicationId: number;
  candidateName?: string;
  postingTitle?: string;
  basicSalary: number;
  allowances?: number;
  totalMonthly: number;
  startDate: string;
  probationMonths: number;
  workArrangement?: WorkArrangement;
  specialTerms?: string;
  status: OfferStatus;
  sentAt?: string;
  acceptedAt?: string;
}

/** Payload for the register endpoint (multipart form fields). */
export interface RegisterCandidateInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  companyCode?: string;
  currentPosition?: string;
  experienceYears?: number;
  educationLevel?: string;
  currentEmployer?: string;
  expectedSalary?: number;
  noticePeriodDays?: number;
  skills?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: Gender;
  linkedinUrl?: string;
  resumeFile?: File | Blob;
  photoFile?: File | Blob;
}

/** Payload for the apply endpoint (multipart form fields). */
export interface ApplyJobInput {
  postingId: number;
  coverLetter?: string;
  expectedSalary?: number;
  noticePeriodDays?: number;
  answers?: Record<string, string | string[]>;
  resumeFile?: File | Blob;
}

/** Payload for updating the candidate profile. */
export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  currentPosition?: string;
  experienceYears?: number;
  educationLevel?: string;
  currentEmployer?: string;
  expectedSalary?: number;
  noticePeriodDays?: number;
  skills?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: Gender;
  linkedinUrl?: string;
  resumeFile?: File | Blob;
  photoFile?: File | Blob;
}
