/**
 * Mock data + mock request handler for the Talent Portal.
 *
 * Used automatically by `client.ts` when `NEXT_PUBLIC_API_MOCK !== 'false'`,
 * or when a real network/CORS error occurs during a request to the backend.
 *
 * The mock layer mirrors the shapes documented in `types.ts` and returns the
 * *raw* data payload (NOT wrapped in an `ApiResponse` envelope). The real API
 * client unwraps the envelope; the mock layer returns data directly so the
 * `apiRequest` helper in `client.ts` treats both paths uniformly.
 */

import type {
  ApplyJobInput,
  CandidateProfile,
  CandidateLoginResponse,
  JobApplication,
  JobPosting,
  ApplicationStageLog,
  InterviewSchedule,
  OfferLetter,
  RegisterCandidateInput,
  UpdateProfileInput,
} from './types';

/* -------------------------------------------------------------------------- */
/*  Mock state                                                                */
/* -------------------------------------------------------------------------- */

export const mockCandidate: CandidateProfile = {
  id: 1001,
  firstName: 'Aria',
  lastName: 'Kapoor',
  email: 'aria.kapoor@example.com',
  phone: '+62 812 3456 7890',
  companyCode: 'SAYONE',
  currentPosition: 'Senior Frontend Engineer',
  experienceYears: 6,
  educationLevel: "Bachelor's Degree in Computer Science",
  currentEmployer: 'Nimbus Labs',
  expectedSalary: 28000000,
  noticePeriodDays: 30,
  skills: 'React, TypeScript, Next.js, GraphQL, Tailwind CSS, Node.js, Jest, Playwright, Figma',
  resumePath: '/uploads/aria-kapoor-resume.pdf',
  photoPath: '/uploads/aria-kapoor-avatar.jpg',
  address: 'Jl. Sudirman No. 45, Jakarta Selatan, Indonesia',
  dateOfBirth: '1995-03-18',
  gender: 'FEMALE',
  linkedinUrl: 'https://www.linkedin.com/in/aria-kapoor',
  status: 'ACTIVE',
  active: true,
};

export const mockPostings: JobPosting[] = [
  {
    id: 201,
    companyCode: 'SAYONE',
    title: 'Senior Frontend Engineer',
    description:
      'Lead the development of our candidate-facing Talent Portal using Next.js, TypeScript and a design-system-first approach. You will partner with product, design and backend teams to ship delightful, accessible experiences.',
    status: 'PUBLISHED',
    publishDate: '2025-05-10T08:00:00.000Z',
    closingDate: '2025-07-15T23:59:59.000Z',
    maxApplications: 80,
    viewsCount: 1248,
    applicationsCount: 36,
    channels: 'WEB,LINKEDIN',
    pipelineStages: 'APPLIED,PHONE_SCREEN,INTERVIEW,OFFER,HIRED',
    requisitionNumber: 'REQ-2025-014',
    requisitionPosition: 'Senior Frontend Engineer',
    screeningQuestionnaireId: 11,
    screeningQuestionnaireName: 'Senior Frontend Screening',
  },
  {
    id: 202,
    companyCode: 'SAYONE',
    title: 'Backend Engineer',
    description:
      'Design and scale the Spring Boot services powering our HRIS suite. You will own critical modules such as payroll, leave management and the candidate pipeline.',
    status: 'PUBLISHED',
    publishDate: '2025-05-08T08:00:00.000Z',
    closingDate: '2025-07-20T23:59:59.000Z',
    maxApplications: 100,
    viewsCount: 980,
    applicationsCount: 41,
    channels: 'WEB,LINKEDIN,REFERRAL',
    pipelineStages: 'APPLIED,PHONE_SCREEN,INTERVIEW,OFFER,HIRED',
    requisitionNumber: 'REQ-2025-015',
    requisitionPosition: 'Backend Engineer',
    screeningQuestionnaireId: 12,
    screeningQuestionnaireName: 'Backend Screening',
  },
  {
    id: 203,
    companyCode: 'SAYONE',
    title: 'Product Designer',
    description:
      'Own the end-to-end design for our Talent Portal and HR analytics dashboards. Conduct research, ship prototypes, and evolve our growing design system.',
    status: 'PUBLISHED',
    publishDate: '2025-05-12T08:00:00.000Z',
    closingDate: '2025-07-25T23:59:59.000Z',
    maxApplications: 60,
    viewsCount: 1502,
    applicationsCount: 28,
    channels: 'WEB,LINKEDIN',
    pipelineStages: 'APPLIED,PHONE_SCREEN,INTERVIEW,OFFER,HIRED',
    requisitionNumber: 'REQ-2025-016',
    requisitionPosition: 'Product Designer',
    screeningQuestionnaireId: 13,
    screeningQuestionnaireName: 'Design Portfolio Review',
  },
  {
    id: 204,
    companyCode: 'SAYONE',
    title: 'DevOps Engineer',
    description:
      'Build and operate our cloud-native platform on AWS + Kubernetes. Drive CI/CD, observability and reliability improvements across the engineering org.',
    status: 'PUBLISHED',
    publishDate: '2025-05-06T08:00:00.000Z',
    closingDate: '2025-07-18T23:59:59.000Z',
    maxApplications: 50,
    viewsCount: 712,
    applicationsCount: 19,
    channels: 'WEB,REFERRAL',
    pipelineStages: 'APPLIED,PHONE_SCREEN,INTERVIEW,OFFER,HIRED',
    requisitionNumber: 'REQ-2025-017',
    requisitionPosition: 'DevOps Engineer',
    screeningQuestionnaireId: 14,
    screeningQuestionnaireName: 'DevOps Screening',
  },
  {
    id: 205,
    companyCode: 'SAYONE',
    title: 'Data Analyst',
    description:
      'Turn raw HR data into actionable insight. Build dashboards, define KPIs and partner with stakeholders across people ops, finance and product.',
    status: 'PUBLISHED',
    publishDate: '2025-05-14T08:00:00.000Z',
    closingDate: '2025-07-30T23:59:59.000Z',
    maxApplications: 40,
    viewsCount: 645,
    applicationsCount: 22,
    channels: 'WEB,LINKEDIN',
    pipelineStages: 'APPLIED,PHONE_SCREEN,INTERVIEW,OFFER,HIRED',
    requisitionNumber: 'REQ-2025-018',
    requisitionPosition: 'Data Analyst',
    screeningQuestionnaireId: 15,
    screeningQuestionnaireName: 'Analytics Case Study',
  },
  {
    id: 206,
    companyCode: 'SAYONE',
    title: 'QA Engineer',
    description:
      'Champion quality across web and mobile surfaces. Design test strategies, automate regressions and embed quality engineering into our delivery flow.',
    status: 'PUBLISHED',
    publishDate: '2025-05-11T08:00:00.000Z',
    closingDate: '2025-07-22T23:59:59.000Z',
    maxApplications: 50,
    viewsCount: 538,
    applicationsCount: 14,
    channels: 'WEB,REFERRAL',
    pipelineStages: 'APPLIED,PHONE_SCREEN,INTERVIEW,OFFER,HIRED',
    requisitionNumber: 'REQ-2025-019',
    requisitionPosition: 'QA Engineer',
    screeningQuestionnaireId: 16,
    screeningQuestionnaireName: 'QA Screening',
  },
];

export const mockApplications: JobApplication[] = [
  {
    id: 3001,
    companyCode: 'SAYONE',
    candidateId: 1001,
    candidateName: 'Aria Kapoor',
    candidateEmail: 'aria.kapoor@example.com',
    postingId: 201,
    postingTitle: 'Senior Frontend Engineer',
    stage: 'INTERVIEW',
    status: 'ACTIVE',
    matchScore: 92,
    screeningScore: 88,
    appliedAt: '2025-05-22T09:14:00.000Z',
    lastActivityAt: '2025-06-02T10:30:00.000Z',
  },
  {
    id: 3002,
    companyCode: 'SAYONE',
    candidateId: 1001,
    candidateName: 'Aria Kapoor',
    candidateEmail: 'aria.kapoor@example.com',
    postingId: 203,
    postingTitle: 'Product Designer',
    stage: 'PHONE_SCREEN',
    status: 'ACTIVE',
    matchScore: 81,
    screeningScore: 76,
    appliedAt: '2025-05-26T14:05:00.000Z',
    lastActivityAt: '2025-05-29T11:20:00.000Z',
  },
  {
    id: 3003,
    companyCode: 'SAYONE',
    candidateId: 1001,
    candidateName: 'Aria Kapoor',
    candidateEmail: 'aria.kapoor@example.com',
    postingId: 202,
    postingTitle: 'Backend Engineer',
    stage: 'APPLIED',
    status: 'ACTIVE',
    matchScore: 64,
    screeningScore: 0,
    appliedAt: '2025-06-01T16:48:00.000Z',
    lastActivityAt: '2025-06-01T16:48:00.000Z',
  },
  {
    id: 3004,
    companyCode: 'SAYONE',
    candidateId: 1001,
    candidateName: 'Aria Kapoor',
    candidateEmail: 'aria.kapoor@example.com',
    postingId: 205,
    postingTitle: 'Data Analyst',
    stage: 'REJECTED',
    status: 'REJECTED',
    matchScore: 58,
    screeningScore: 52,
    appliedAt: '2025-05-15T10:22:00.000Z',
    lastActivityAt: '2025-05-20T08:15:00.000Z',
    rejectedReasonId: 3,
    rejectedReasonText: 'Profile did not meet minimum experience requirement for this requisition.',
  },
];

export const mockStageLogs: Record<number, ApplicationStageLog[]> = {
  3001: [
    {
      id: 41001,
      applicationId: 3001,
      fromStage: null,
      toStage: 'APPLIED',
      changedAt: '2025-05-22T09:14:00.000Z',
      reason: 'Application submitted',
      changedByName: 'System',
    },
    {
      id: 41002,
      applicationId: 3001,
      fromStage: 'APPLIED',
      toStage: 'PHONE_SCREEN',
      changedAt: '2025-05-24T13:00:00.000Z',
      reason: 'Strong match score, scheduling recruiter call',
      changedByName: 'Maya Tanaka',
    },
    {
      id: 41003,
      applicationId: 3001,
      fromStage: 'PHONE_SCREEN',
      toStage: 'INTERVIEW',
      changedAt: '2025-06-02T10:30:00.000Z',
      reason: 'Recruiter screen passed, advancing to technical interview',
      changedByName: 'Maya Tanaka',
    },
  ],
  3002: [
    {
      id: 42001,
      applicationId: 3002,
      fromStage: null,
      toStage: 'APPLIED',
      changedAt: '2025-05-26T14:05:00.000Z',
      reason: 'Application submitted',
      changedByName: 'System',
    },
    {
      id: 42002,
      applicationId: 3002,
      fromStage: 'APPLIED',
      toStage: 'PHONE_SCREEN',
      changedAt: '2025-05-29T11:20:00.000Z',
      reason: 'Portfolio review passed',
      changedByName: 'Daniel Okafor',
    },
  ],
  3003: [
    {
      id: 43001,
      applicationId: 3003,
      fromStage: null,
      toStage: 'APPLIED',
      changedAt: '2025-06-01T16:48:00.000Z',
      reason: 'Application submitted',
      changedByName: 'System',
    },
  ],
  3004: [
    {
      id: 44001,
      applicationId: 3004,
      fromStage: null,
      toStage: 'APPLIED',
      changedAt: '2025-05-15T10:22:00.000Z',
      reason: 'Application submitted',
      changedByName: 'System',
    },
    {
      id: 44002,
      applicationId: 3004,
      fromStage: 'APPLIED',
      toStage: 'REJECTED',
      changedAt: '2025-05-20T08:15:00.000Z',
      reason: 'Profile did not meet minimum experience requirement for this requisition.',
      changedByName: 'Priya Subramaniam',
    },
  ],
};

export const mockInterviews: InterviewSchedule[] = [
  {
    id: 5001,
    applicationId: 3001,
    candidateName: 'Aria Kapoor',
    postingTitle: 'Senior Frontend Engineer',
    round: 1,
    scheduledAt: '2025-06-10T14:00:00.000Z',
    durationMinutes: 60,
    type: 'TECHNICAL',
    meetingLink: 'https://meet.sayone.dev/interview/aria-3001',
    status: 'SCHEDULED',
  },
];

export const mockOffers: OfferLetter[] = [];

/* -------------------------------------------------------------------------- */
/*  Mock request handler                                                      */
/* -------------------------------------------------------------------------- */

export interface MockRequestOptions {
  method: string;
  body?: any;
  /** Query params already parsed into a record by the client. */
  query?: Record<string, string>;
  /** Indicates the request carried an Authorization header. */
  auth?: boolean;
  /** Indicates the request body was a FormData instance. */
  isForm?: boolean;
}

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock implementation of the backend request pipeline. Returns the *raw* data
 * payload that the real backend would have wrapped in an `ApiResponse`.
 *
 * @param path the API path *after* the `/api/public/careers/{companyCode}` prefix
 */
export async function mockRequest<T>(path: string, opts: MockRequestOptions = { method: 'GET' }): Promise<T> {
  await delay();

  const method = (opts.method || 'GET').toUpperCase();
  const cleanPath = path.replace(/^\//, '').replace(/\/$/, ''); // strip leading/trailing slashes
  const segments = cleanPath ? cleanPath.split('/') : [];

  /* -------------------- GET /postings -------------------- */
  if (method === 'GET' && segments[0] === 'postings' && segments.length === 1) {
    return [...mockPostings] as unknown as T;
  }

  /* -------------------- GET /postings/:id -------------------- */
  if (method === 'GET' && segments[0] === 'postings' && segments.length === 2) {
    const id = Number(segments[1]);
    const posting = mockPostings.find((p) => p.id === id);
    if (!posting) throw new Error(`Job posting ${id} not found`);
    return { ...posting, viewsCount: posting.viewsCount + 1 } as unknown as T;
  }

  /* -------------------- POST /apply -------------------- */
  if (method === 'POST' && segments[0] === 'apply') {
    const input = (opts.body || {}) as ApplyJobInput;
    const posting = mockPostings.find((p) => p.id === Number(input.postingId));
    if (!posting) throw new Error(`Posting ${input.postingId} not found`);
    const newApp: JobApplication = {
      id: 3000 + mockApplications.length + Math.floor(Math.random() * 100),
      companyCode: 'SAYONE',
      candidateId: mockCandidate.id,
      candidateName: `${mockCandidate.firstName} ${mockCandidate.lastName}`,
      candidateEmail: mockCandidate.email,
      postingId: posting.id,
      postingTitle: posting.title,
      stage: 'APPLIED',
      status: 'ACTIVE',
      matchScore: 70 + Math.floor(Math.random() * 20),
      screeningScore: 0,
      appliedAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
    };
    mockApplications.push(newApp);
    mockStageLogs[newApp.id] = [
      {
        id: 90000 + newApp.id,
        applicationId: newApp.id,
        fromStage: null,
        toStage: 'APPLIED',
        changedAt: newApp.appliedAt,
        reason: 'Application submitted',
        changedByName: 'System',
      },
    ];
    return newApp as unknown as T;
  }

  /* -------------------- POST /register -------------------- */
  if (method === 'POST' && segments[0] === 'register') {
    const input = (opts.body || {}) as RegisterCandidateInput;
    const profile: CandidateProfile = {
      ...mockCandidate,
      firstName: input.firstName || mockCandidate.firstName,
      lastName: input.lastName || mockCandidate.lastName,
      email: input.email || mockCandidate.email,
      phone: input.phone || mockCandidate.phone,
      currentPosition: input.currentPosition || mockCandidate.currentPosition,
      experienceYears: input.experienceYears ?? mockCandidate.experienceYears,
      educationLevel: input.educationLevel || mockCandidate.educationLevel,
      currentEmployer: input.currentEmployer || mockCandidate.currentEmployer,
      expectedSalary: input.expectedSalary ?? mockCandidate.expectedSalary,
      noticePeriodDays: input.noticePeriodDays ?? mockCandidate.noticePeriodDays,
      skills: input.skills || mockCandidate.skills,
      address: input.address || mockCandidate.address,
      dateOfBirth: input.dateOfBirth || mockCandidate.dateOfBirth,
      gender: input.gender || mockCandidate.gender,
      linkedinUrl: input.linkedinUrl || mockCandidate.linkedinUrl,
    };
    const response: CandidateLoginResponse = {
      token: `mock-token-${Date.now()}`,
      expiresIn: 86400,
      profile,
    };
    return response as unknown as T;
  }

  /* -------------------- POST /login -------------------- */
  if (method === 'POST' && segments[0] === 'login') {
    const input = (opts.body || {}) as { email?: string; password?: string };
    if (!input.email || !input.password) {
      throw new Error('Email and password are required');
    }
    const response: CandidateLoginResponse = {
      token: `mock-token-${Date.now()}`,
      expiresIn: 86400,
      profile: { ...mockCandidate, email: input.email },
    };
    return response as unknown as T;
  }

  /* -------------------- GET /me/profile -------------------- */
  if (method === 'GET' && segments[0] === 'me' && segments[1] === 'profile') {
    return { ...mockCandidate } as unknown as T;
  }

  /* -------------------- POST /me/profile -------------------- */
  if (method === 'POST' && segments[0] === 'me' && segments[1] === 'profile') {
    const input = (opts.body || {}) as UpdateProfileInput;
    Object.assign(mockCandidate, {
      firstName: input.firstName ?? mockCandidate.firstName,
      lastName: input.lastName ?? mockCandidate.lastName,
      phone: input.phone ?? mockCandidate.phone,
      currentPosition: input.currentPosition ?? mockCandidate.currentPosition,
      experienceYears: input.experienceYears ?? mockCandidate.experienceYears,
      educationLevel: input.educationLevel ?? mockCandidate.educationLevel,
      currentEmployer: input.currentEmployer ?? mockCandidate.currentEmployer,
      expectedSalary: input.expectedSalary ?? mockCandidate.expectedSalary,
      noticePeriodDays: input.noticePeriodDays ?? mockCandidate.noticePeriodDays,
      skills: input.skills ?? mockCandidate.skills,
      address: input.address ?? mockCandidate.address,
      dateOfBirth: input.dateOfBirth ?? mockCandidate.dateOfBirth,
      gender: input.gender ?? mockCandidate.gender,
      linkedinUrl: input.linkedinUrl ?? mockCandidate.linkedinUrl,
    });
    return { ...mockCandidate } as unknown as T;
  }

  /* -------------------- GET /me/applications -------------------- */
  if (method === 'GET' && segments[0] === 'me' && segments[1] === 'applications' && segments.length === 2) {
    return [...mockApplications] as unknown as T;
  }

  /* -------------------- GET /me/applications/:id -------------------- */
  if (method === 'GET' && segments[0] === 'me' && segments[1] === 'applications' && segments.length === 3) {
    const id = Number(segments[2]);
    const app = mockApplications.find((a) => a.id === id);
    if (!app) throw new Error(`Application ${id} not found`);
    return { ...app } as unknown as T;
  }

  /* -------------------- GET /me/applications/:id/stage-log -------------------- */
  if (
    method === 'GET' &&
    segments[0] === 'me' &&
    segments[1] === 'applications' &&
    segments.length === 4 &&
    segments[3] === 'stage-log'
  ) {
    const id = Number(segments[2]);
    const logs = mockStageLogs[id] || [];
    return [...logs] as unknown as T;
  }

  /* -------------------- GET /me/interviews -------------------- */
  if (method === 'GET' && segments[0] === 'me' && segments[1] === 'interviews') {
    return [...mockInterviews] as unknown as T;
  }

  /* -------------------- GET /me/offers -------------------- */
  if (method === 'GET' && segments[0] === 'me' && segments[1] === 'offers') {
    return [...mockOffers] as unknown as T;
  }

  /* -------------------- POST /me/logout -------------------- */
  if (method === 'POST' && segments[0] === 'me' && segments[1] === 'logout') {
    return null as unknown as T;
  }

  throw new Error(`Mock endpoint not implemented: ${method} /${cleanPath}`);
}
