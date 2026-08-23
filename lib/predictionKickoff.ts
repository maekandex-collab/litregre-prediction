import dayjs, { type Dayjs } from "dayjs";

export type TimeBucket =
  | "upcoming"
  | "early_today"
  | "yesterday"
  | "past"
  | "other";

export type TimeFilter = "all" | "upcoming" | "early_today" | "yesterday" | "past";

type KickoffSource = {
  kickoff?: string | null;
  date?: string | null;
  date_time?: string | null;
  datetime?: string | null;
  time?: string | null;
};

/** Resolve kickoff from the various field names special/general tips use. */
export function parsePredictionKickoff(item: KickoffSource): Dayjs | null {
  const rawDate =
    item.kickoff ||
    item.date ||
    item.date_time ||
    (typeof item.datetime === "string" ? item.datetime : null);
  if (!rawDate) return null;
  const rawTime = item.time;
  const kickoff = dayjs(rawTime ? `${rawDate}T${rawTime}` : rawDate);
  return kickoff.isValid() ? kickoff : null;
}

/**
 * Hours since kickoff (negative = still in the future).
 */
export function hoursSinceKickoff(kickoff: Dayjs, now = dayjs()): number {
  return now.diff(kickoff, "minute") / 60;
}

/**
 * - upcoming: kickoff still ahead, or started less than 2h ago (still "live window")
 * - early_today: today and kickoff was 2+ hours ago
 * - yesterday: calendar yesterday
 * - past: any day before today (includes yesterday for labeling; filter treats separately)
 * - other: unknown
 */
export function getTimeBucket(kickoff: Dayjs | null, now = dayjs()): TimeBucket {
  if (!kickoff || !kickoff.isValid()) return "other";

  const hoursAgo = hoursSinceKickoff(kickoff, now);

  if (kickoff.isSame(now, "day")) {
    if (hoursAgo < 2) return "upcoming";
    return "early_today";
  }

  if (hoursAgo < 0) return "upcoming"; // future day

  if (kickoff.isSame(now.subtract(1, "day"), "day")) {
    return "yesterday";
  }

  if (kickoff.isBefore(now, "day")) {
    return "past";
  }

  return "other";
}

/** True when a tip matches a selected time filter chip. */
export function matchesTimeFilter(
  kickoff: Dayjs | null,
  filter: TimeFilter,
  now = dayjs()
): boolean {
  if (filter === "all") return true;
  const bucket = getTimeBucket(kickoff, now);
  if (filter === "past") {
    return bucket === "past" || bucket === "yesterday";
  }
  if (filter === "upcoming") {
    return bucket === "upcoming";
  }
  return bucket === filter;
}

export type KickoffStatus = {
  label: string;
  tone: string;
};

/**
 * Honest status from kickoff + finished flags — never "Upcoming" for
 * fixtures that kicked off hours ago.
 */
export function isFinishedStatus(status?: string | null): boolean {
  if (!status) return false;
  return /^(ft|finished|ended|aet|pen|after.?pen|canc|pst|abd)/i.test(
    status.trim()
  );
}

export function getKickoffStatus(opts: {
  kickoff: Dayjs | null;
  isFinished?: boolean;
  status?: string | null;
  isPredictionCorrect?: boolean | null;
  now?: Dayjs;
}): KickoffStatus {
  const {
    kickoff,
    isFinished,
    status,
    isPredictionCorrect,
    now = dayjs(),
  } = opts;

  if (isFinished || isFinishedStatus(status)) {
    if (isPredictionCorrect === true) {
      return { label: "Won", tone: "bg-success/15 text-success" };
    }
    if (isPredictionCorrect === false) {
      return { label: "Lost", tone: "bg-error/15 text-error" };
    }
    return { label: "FT", tone: "bg-base-200 text-base-content/50" };
  }

  if (!kickoff || !kickoff.isValid()) {
    return { label: "Upcoming", tone: "bg-amber-500/15 text-amber-700" };
  }

  const hoursAgo = hoursSinceKickoff(kickoff, now);

  if (hoursAgo < 0) {
    return { label: "Upcoming", tone: "bg-amber-500/15 text-amber-700" };
  }

  // Kickoff passed but still in the ~2h live window
  if (hoursAgo < 2) {
    return { label: "Live", tone: "bg-error/15 text-error" };
  }

  if (kickoff.isSame(now, "day")) {
    return {
      label: "Early today",
      tone: "bg-amber-500/15 text-amber-800",
    };
  }

  if (kickoff.isSame(now.subtract(1, "day"), "day")) {
    return {
      label: "Yesterday",
      tone: "bg-orange-500/15 text-orange-700",
    };
  }

  return { label: "Past", tone: "bg-base-content/10 text-base-content/55" };
}
