"use client";

import { signOut } from "next-auth/react";

/** Build an absolute callback URL on the host the user is currently on. */
export function sameOriginCallback(path = "/") {
  if (typeof window === "undefined") return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${window.location.origin}${normalized}`;
}

/**
 * Sign out and stay on the current public domain.
 * Avoids NextAuth sending users to a stale NEXTAUTH_URL host
 * (e.g. eaglepredict.viaspark.site after a domain rename).
 */
export function signOutSameOrigin(path = "/") {
  return signOut({ callbackUrl: sameOriginCallback(path) });
}
