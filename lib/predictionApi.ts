const BASE_URL =
  process.env.PREDICTION_API_BASE_URL ?? "https://mtn.lenhub.net";

// ─── Request / Response Types ────────────────────────────────────────────────

export interface CreateUserBody {
  number: string;
  pin: string;
  confirm_pin: string;
}

export interface LoginUserBody {
  number: string;
  pin: string;
}

export interface ForgotPasswordBody {
  phone_number: string;
}

export interface ResetPasswordBody {
  phone_number: string;
  pin: string;
}

/** Shape of a successful login response (exact fields depend on the backend). */
export interface LoginSuccessData {
  access?: string;
  token?: string;
  access_token?: string;
  refresh?: string;
  [key: string]: unknown;
}

export interface ApiResult<T = Record<string, unknown>> {
  ok: boolean;
  status: number;
  data: T;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Extracts the bearer token string from whatever the login endpoint returns. */
export function extractToken(data: LoginSuccessData): string | null {
  return data.access ?? data.token ?? data.access_token ?? null;
}

/** Extracts a human-readable error message from a failed response body. */
export function extractError(
  data: Record<string, unknown>,
  fallback = "Something went wrong. Please try again."
): string {
  // Backend (Bene) uses `message` for auth errors, e.g. user does not exist → dial *7098#
  if (typeof data.message === "string" && data.message.trim()) return data.message.trim();
  if (typeof data.detail === "string" && data.detail.trim()) return data.detail.trim();
  if (typeof data.error === "string" && data.error.trim()) return data.error.trim();
  // Django-style field errors: { field: ["msg"] }
  const first = Object.values(data)[0];
  if (Array.isArray(first) && typeof first[0] === "string") return first[0];
  return fallback;
}

/** Map opaque backend failures to actionable copy for login/signup forms. */
export function friendlyAuthError(message: string): string {
  const trimmed = message.trim();
  if (!trimmed) return "Something went wrong. Please try again.";

  if (/internal server error/i.test(trimmed)) {
    return "Sign-in is temporarily unavailable. Please try again in a few minutes. If this continues, dial *7098# for help.";
  }

  return trimmed;
}

/**
 * Upstream prediction routes expect Bearer AND a session cookie:
 *   <user_id>="{\"session_id\":\"…\",\"access_token\":\"…\"}"
 * Login sets that cookie on mtn.lenhub.net; the Next.js BFF never receives it,
 * so rebuild from the JWT or Bearer-only calls return HTML 500 → FE 502.
 */
export function predictionAuthHeaders(
  token?: string,
  extra: Record<string, string> = {}
): Record<string, string> {
  if (!token) return { ...extra };

  const headers: Record<string, string> = {
    ...extra,
    Authorization: `Bearer ${token}`,
  };

  try {
    const parts = token.split(".");
    if (parts.length >= 2) {
      const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
      const payload = JSON.parse(
        Buffer.from(padded, "base64").toString("utf-8")
      ) as { user_id?: string; session_id?: string };

      if (payload.user_id && payload.session_id) {
        const body = JSON.stringify({
          session_id: payload.session_id,
          access_token: token,
        });
        headers.Cookie = `${payload.user_id}=${JSON.stringify(body)}`;
      }
    }
  } catch {
    // Bearer-only fallback
  }

  return headers;
}

// ─── API Calls ───────────────────────────────────────────────────────────────

/**
 * POST /api/prediction/create/user/
 * Registers a new user on the prediction backend.
 */
export async function createUser(
  body: CreateUserBody
): Promise<ApiResult<Record<string, unknown>>> {
  const res = await fetch(`${BASE_URL}/api/prediction/create/user/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as Record<string, unknown>;
  return { ok: res.ok, status: res.status, data };
}

/**
 * POST /api/prediction/login/user/
 * Authenticates a user and returns a JWT access token.
 */
export async function loginUser(
  body: LoginUserBody
): Promise<ApiResult<LoginSuccessData>> {
  const res = await fetch(`${BASE_URL}/api/prediction/login/user/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as LoginSuccessData;
  return { ok: res.ok, status: res.status, data };
}

/**
 * POST /api/prediction/forgot/password/
 * Starts a PIN reset: backend sends a reset code/PIN to the phone via SMS.
 */
export async function forgotPassword(
  body: ForgotPasswordBody
): Promise<ApiResult<Record<string, unknown>>> {
  const res = await fetch(`${BASE_URL}/api/prediction/forgot/password/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return { ok: res.ok, status: res.status, data };
}

/**
 * POST /api/prediction/reset/password/
 * Completes a PIN reset using the code/PIN the user received via SMS.
 */
export async function resetPassword(
  body: ResetPasswordBody
): Promise<ApiResult<Record<string, unknown>>> {
  const res = await fetch(`${BASE_URL}/api/prediction/reset/password/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return { ok: res.ok, status: res.status, data };
}

// ─── Password Management ─────────────────────────────────────────────────────

export interface ChangePasswordBody {
  old_pin: string;
  new_pin: string;
}

export interface UpdatePasswordBody {
  number: string;
  pin: string;
  confirm_pin: string;
}

/**
 * POST /api/prediction/change/password/
 * Changes password for an authenticated user (requires Bearer token).
 */
export async function changePassword(
  body: ChangePasswordBody,
  token: string
): Promise<ApiResult<Record<string, unknown>>> {
  const res = await fetch(`${BASE_URL}/api/prediction/change/password/`, {
    method: "POST",
    headers: predictionAuthHeaders(token, {
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return { ok: res.ok, status: res.status, data };
}

/**
 * POST /api/prediction/update/password/
 * Sets a new password using phone number (no auth required).
 */
export async function updatePassword(
  body: UpdatePasswordBody
): Promise<ApiResult<Record<string, unknown>>> {
  const res = await fetch(`${BASE_URL}/api/prediction/update/password/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return { ok: res.ok, status: res.status, data };
}
