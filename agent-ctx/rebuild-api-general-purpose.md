# Task ID: rebuild-api — Agent Record

**Agent**: general-purpose
**Task**: Rebuild API layer, store, and hooks for Talent Portal (sandbox reset recovery)

## Context Loaded
- No prior `worklog.md` existed (this is the first agent on the rebuild).
- Project is Next.js 16 + TypeScript 5 + Tailwind 4 + shadcn/ui (New York).
- `src/lib/api/` was empty; `src/components/talent/` was empty (placeholder).
- ESLint config relaxes `@typescript-eslint/no-explicit-any`, `no-unused-vars`, `react-hooks/exhaustive-deps`, `no-console`, etc.
- Existing `src/lib/utils.ts` provides `cn()`; `zustand`, `@tanstack/react-query` already installed.

## Files Created (8 total)

### 1. `src/lib/api/types.ts`
- Full TypeScript type system mirroring Spring Boot backend entities.
- Envelope: `ApiResponse<T>` (`success`, `message`, `data`).
- Entities: `CandidateProfile`, `CandidateLoginResponse`, `JobPosting`, `JobApplication`, `ApplicationStageLog`, `InterviewSchedule`, `OfferLetter`.
- Union literal types for enums: `CandidateStatus`, `JobPostingStatus`, `ApplicationStage`, `ApplicationStatus`, `InterviewStatus`, `InterviewType`, `OfferStatus`, `WorkArrangement`, `Gender`.
- Input DTOs: `RegisterCandidateInput`, `ApplyJobInput`, `UpdateProfileInput`.

### 2. `src/lib/api/client.ts`
- Constants: `API_URL` (default `https://hris.sayone.my.id`), `COMPANY_CODE` (default `SAYONE`), `USE_MOCK` (default true).
- Token management: `getToken`, `setToken`, `clearToken`, `getStoredProfile`, `setStoredProfile` with `sayone_hris_token` / `sayone_hris_profile` keys.
- `apiRequest<T>(path, options)`: builds `${API_URL}/api/public/careers/${COMPANY_CODE}${path}${qs}`.
  - Mock path: delegates to `mockRequest` (passes parsed query record).
  - Real path: attaches `Authorization: Bearer <token>` when `auth !== false`, converts object body to `FormData` when `isForm` (preserves File/Blob, JSON-encodes nested objects), sends `credentials: 'include'`.
  - Auto-falls back to mock on `TypeError` / messages containing `failed to fetch` / `allowcredentials` / `cors` / `networkerror`.
  - Unwraps `ApiResponse` envelope (throws on `!success`); returns raw payload if envelope absent.
- Exports `api.get/post/put/delete` convenience wrappers.

### 3. `src/lib/api/services.ts`
- `authService.login(email, password)` → `POST /login` (isForm, auth=false).
- `authService.register(data)` → `POST /register` (isForm, auth=false).
- `authService.logout()` → `POST /me/logout`.
- `jobsService.list()` → `GET /postings` (auth=false).
- `jobsService.get(id)` → `GET /postings/${id}` (auth=false).
- `jobsService.apply(data)` → `POST /apply` (isForm, auth=false; supports resume upload).
- `profileService.get()` → `GET /me/profile`.
- `profileService.update(data)` → `POST /me/profile` (isForm).
- `applicationsService.list()`, `.get(id)`, `.stageLog(id)`, `.interviews()`, `.offers()`.

### 4. `src/lib/api/mock-data.ts`
- `mockCandidate`: Aria Kapoor (id 1001, SAYONE, full profile with skills, expectedSalary 28M IDR, etc.).
- `mockPostings`: 6 PUBLISHED postings — Senior Frontend Engineer, Backend Engineer, Product Designer, DevOps Engineer, Data Analyst, QA Engineer. Each has requisitionNumber, screeningQuestionnaireName, pipelineStages, etc.
- `mockApplications`: 4 applications — INTERVIEW/ACTIVE, PHONE_SCREEN/ACTIVE, APPLIED/ACTIVE, REJECTED/REJECTED (with rejectedReasonText).
- `mockStageLogs`: `Record<number, ApplicationStageLog[]>` for each application id (3001–3004).
- `mockInterviews`: 1 SCHEDULED technical interview tied to app 3001.
- `mockOffers`: empty array.
- `mockRequest<T>(path, opts)` with 400ms delay; handles all paths listed in services.ts; returns raw payload (NOT wrapped in ApiResponse); throws for unimplemented paths.

### 5. `src/lib/talent-store.ts` (zustand)
- `TalentModule` = `'careers' | 'dashboard' | 'applications' | 'profile' | 'interviews' | 'messages' | 'settings'`.
- State: `active`, `selectedJobId`, `selectedApplicationId`, `copilotOpen`, `commandOpen`, `authOpen`, `authMode`, `candidate`.
- Actions: `set`, `openJob`, `openApplication`, `setCopilot`, `setCommand`, `openAuth`, `closeAuth`, `setCandidate`.
- Exported as `useTalent` hook (created via `create`).

### 6. `src/hooks/use-auth.ts` (useAuth)
- 'use client'.
- On mount: hydrates `candidate` from `getStoredProfile()`; sets `hydrated=true`.
- `login(email, password)`: calls `authService.login`, then `setToken` + `setStoredProfile` + `setCandidate` + `closeAuth`; manages loading/error.
- `register(data)`: same flow via `authService.register`.
- `logout()`: best-effort `authService.logout` (try/catch swallows errors); always clears token + sets candidate null.
- Returns `{ candidate, loading, error, hydrated, login, register, logout, setError }`.

### 7. `src/components/query-provider.tsx`
- 'use client'.
- Wraps `QueryClientProvider` with a lazily-instantiated `QueryClient` (via `React.useState`).
- Defaults: `queries.retry=1`, `queries.refetchOnWindowFocus=false`, `queries.staleTime=30_000`, `mutations.retry=0`.
- Imports `* as React from 'react'` explicitly (required for `React.useState` to be tree-shake safe under React 19 + Next 16 bundler).

### 8. `src/components/error-boundary.tsx`
- 'use client'.
- Class `ErrorBoundary` with `getDerivedStateFromError` + `componentDidCatch` (logs via `console.error`).
- Accepts optional `fallback` render prop; defaults to `DefaultErrorCard` showing message + stack (scrollable `<pre>`) + "Try again" button that calls `reset()`.
- Alert icon via inline SVG (no external dep). Uses Tailwind utility classes (`border-destructive/30`, `bg-destructive/5`, `text-primary-foreground`, etc.).

## Lint Verification

Command run:
```
npx eslint src/lib/api/ src/lib/talent-store.ts src/hooks/use-auth.ts src/components/query-provider.tsx src/components/error-boundary.tsx
```

Result: **0 errors, 0 warnings.** (Two stale `eslint-disable` comments were removed after the project's ESLint config already disables those rules globally.)

## Hand-off Notes for Downstream Agents
- All API access goes through `services.ts` → `client.ts`. Never call `fetch()` directly.
- Mock mode is **on by default**; set `NEXT_PUBLIC_API_MOCK=false` in `.env.local` to hit the real Spring Boot backend.
- `useTalent` is the single source of truth for navigation + auth UI state; `useAuth` is the single source of truth for auth actions.
- Components should consume data via TanStack Query hooks (`useQuery`/`useMutation`) wrapping the services — wrap the app in `<QueryProvider>` at the root layout.
- Wrap any view that fetches data in `<ErrorBoundary>` for graceful failure UX.
- The `candidate` field on the store is hydrated on mount by `useAuth`; do not assume it is non-null on first render — use `hydrated` to gate profile-dependent UI.
