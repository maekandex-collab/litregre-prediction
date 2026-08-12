"use client";

import { signOutSameOrigin } from "@/lib/authClient";

let signingOut = false;

/**
 * Force a sign-out and redirect the user to the login page with the
 * `expired=1` query param. Guarded so multiple 401s in a row don't trigger
 * the redirect more than once.
 */
export function forceSignOutOnExpiry(callbackPath?: string) {
  if (signingOut) return;
  signingOut = true;
  const path = callbackPath
    ? `/login?expired=1&callbackUrl=${encodeURIComponent(callbackPath)}`
    : "/login?expired=1";
  signOutSameOrigin(path);
}

/**
 * Wrapper around `fetch` that signs the user out when the backend session
 * is no longer valid (any 401 from our proxy routes).
 *
 * Returns the original `Response` so callers can still inspect status/body.
 */
export async function apiFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const res = await fetch(input, init);
  if (res.status === 401) {
    const callbackPath =
      typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : undefined;
    forceSignOutOnExpiry(callbackPath);
  }
  return res;
}
