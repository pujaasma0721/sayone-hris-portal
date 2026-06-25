/**
 * API client for the SayOne HRIS Career Portal (candidate-facing Talent Portal).
 *
 * All requests are scoped under `/api/public/careers/{COMPANY_CODE}`. The client
 * transparently falls back to an in-memory mock implementation when:
 *   1. `NEXT_PUBLIC_API_MOCK !== 'false'`, OR
 *   2. a real network/CORS error is thrown while calling the backend.
 *
 * The real backend wraps responses in an `ApiResponse<T>` envelope; the mock
 * layer returns the raw data payload directly. `apiRequest` normalizes both
 * paths and returns the unwrapped `T` to callers.
 */

import type { ApiResponse, CandidateProfile } from './types';
import { mockRequest } from './mock-data';

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://hris.sayone.my.id';

export const COMPANY_CODE =
  process.env.NEXT_PUBLIC_COMPANY_CODE || 'SAYONE';

/**
 * Mock mode is **on** by default. Set `NEXT_PUBLIC_API_MOCK=false` to force
 * real backend calls (the client still auto-falls back to mock on network
 * errors).
 */
export const USE_MOCK = process.env.NEXT_PUBLIC_API_MOCK !== 'false';

/* -------------------------------------------------------------------------- */
/*  Token + profile persistence (browser only)                                */
/* -------------------------------------------------------------------------- */

const TOKEN_KEY = 'sayone_hris_token';
const PROFILE_KEY = 'sayone_hris_profile';

const isBrowser = (): boolean => typeof window !== 'undefined';

export function getToken(): string | null {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
}

export function clearToken(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(PROFILE_KEY);
  } catch {
    /* ignore */
  }
}

export function getStoredProfile(): CandidateProfile | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CandidateProfile;
  } catch {
    return null;
  }
}

export function setStoredProfile(profile: CandidateProfile | null): void {
  if (!isBrowser()) return;
  try {
    if (profile) {
      window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } else {
      window.localStorage.removeItem(PROFILE_KEY);
    }
  } catch {
    /* ignore */
  }
}

/* -------------------------------------------------------------------------- */
/*  Request helpers                                                           */
/* -------------------------------------------------------------------------- */

export interface ApiRequestOptions<TBody = any> {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: TBody;
  /** Query parameters appended to the URL. */
  query?: Record<string, string | number | boolean | undefined | null>;
  /** Attach `Authorization: Bearer <token>` header. Defaults to `true`. */
  auth?: boolean;
  /** Convert `body` into `FormData` (file uploads). */
  isForm?: boolean;
  /** Explicit signal for aborting the request. */
  signal?: AbortSignal;
}

/** Returns true when an error looks like a network/CORS failure. */
function isNetworkError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message || '';
  if (err instanceof TypeError) return true; // fetch failed to reach server
  const lower = msg.toLowerCase();
  return (
    lower.includes('failed to fetch') ||
    lower.includes('allowcredentials') ||
    lower.includes('cors') ||
    lower.includes('networkerror')
  );
}

/** Build a query string from a record, skipping null/undefined values. */
function buildQueryString(query?: ApiRequestOptions['query']): string {
  if (!query) return '';
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    params.append(key, String(value));
  }
  const str = params.toString();
  return str ? `?${str}` : '';
}

/** Convert a plain object into `FormData`, preserving File/Blob values. */
function toFormData(body: Record<string, any>): FormData {
  const form = new FormData();
  for (const [key, value] of Object.entries(body)) {
    if (value === undefined || value === null) continue;
    if (value instanceof File || value instanceof Blob) {
      form.append(key, value);
      continue;
    }
    if (typeof value === 'object') {
      form.append(key, JSON.stringify(value));
      continue;
    }
    form.append(key, String(value));
  }
  return form;
}

/**
 * Core request function. Builds the URL, decides between mock and real
 * backends, attaches auth/form headers, and unwraps the `ApiResponse` envelope.
 *
 * @param path Path *after* the `/api/public/careers/{COMPANY_CODE}` prefix.
 */
export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const {
    method = 'GET',
    body,
    query,
    auth = true,
    isForm = false,
    signal,
  } = options;

  const qs = buildQueryString(query);
  const url = `${API_URL}/api/public/careers/${COMPANY_CODE}${path}${qs}`;

  /* ----------------------------- Mock path ----------------------------- */
  if (USE_MOCK) {
    const parsedQuery: Record<string, string> = {};
    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (v !== undefined && v !== null) parsedQuery[k] = String(v);
      }
    }
    return mockRequest<T>(path, {
      method,
      body,
      query: parsedQuery,
      auth,
      isForm,
    });
  }

  /* ----------------------------- Real path ----------------------------- */
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  let payload: BodyInit | undefined;
  if (body !== undefined && body !== null) {
    if (isForm) {
      const formBody = body instanceof FormData ? body : toFormData(body as Record<string, any>);
      payload = formBody;
      // Do NOT set Content-Type; the browser sets the multipart boundary.
    } else {
      headers['Content-Type'] = 'application/json';
      payload = JSON.stringify(body);
    }
  }

  if (auth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: payload,
      credentials: 'include',
      signal,
    });

    const text = await response.text();
    const data: ApiResponse<T> | T = text ? safeParse(text) : null;

    if (!response.ok) {
      const message = extractMessage(data) || `Request failed with status ${response.status}`;
      const error = new Error(message) as Error & { status?: number };
      error.status = response.status;
      throw error;
    }

    // Unwrap ApiResponse envelope if present, otherwise return data directly.
    if (isApiResponse(data)) {
      if (!data.success) {
        throw new Error(data.message || 'Request was not successful');
      }
      return data.data as T;
    }
    return data as T;
  } catch (err) {
    // Auto-fallback to mock on network/CORS errors.
    if (isNetworkError(err)) {
      const parsedQuery: Record<string, string> = {};
      if (query) {
        for (const [k, v] of Object.entries(query)) {
          if (v !== undefined && v !== null) parsedQuery[k] = String(v);
        }
      }
      return mockRequest<T>(path, {
        method,
        body,
        query: parsedQuery,
        auth,
        isForm,
      });
    }
    throw err;
  }
}

function safeParse(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function isApiResponse<T>(value: any): value is ApiResponse<T> {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof value.success === 'boolean' &&
    typeof value.message === 'string' &&
    'data' in value
  );
}

function extractMessage(data: any): string | null {
  if (!data) return null;
  if (typeof data === 'string') return data;
  if (typeof data === 'object') {
    if (typeof data.message === 'string') return data.message;
    if (typeof data.error === 'string') return data.error;
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      const first = data.errors[0];
      if (typeof first === 'string') return first;
      if (first && typeof first.message === 'string') return first.message;
    }
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/*  Convenience wrappers                                                      */
/* -------------------------------------------------------------------------- */

export const api = {
  get: <T>(path: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: any, options?: Omit<ApiRequestOptions, 'method'>) =>
    apiRequest<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: any, options?: Omit<ApiRequestOptions, 'method'>) =>
    apiRequest<T>(path, { ...options, method: 'PUT', body }),
  delete: <T>(path: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'DELETE' }),
};
