import { DateTime } from "luxon";

/**
 * Format ISO date string to a readable format
 * Example: "November 27, 2025 • 02:30 PM"
 */
export const formatDate = (iso: string) => {
  return DateTime.fromISO(iso).toFormat("MMMM dd, yyyy • hh:mm a");
};

/**
 * Shorter format for lists
 * Example: "Nov 27, 2025 • 2:30 PM"
 */
export const formatShortDate = (iso: string) => {
  return DateTime.fromISO(iso).toFormat("MMM dd, yyyy • h:mm a");
};

/**
 * Returns relative time (e.g., "2 minutes ago")
 */
export const formatRelative = (iso: string) => {
  return DateTime.fromISO(iso).toRelative();
};

/**
 * Smart formatting:
 * Today → "Today • 2:30 PM"
 * Yesterday → "Yesterday • 4:12 PM"
 * Otherwise → "Nov 27, 2025 • 2:30 PM"
 */
export const formatSmartDate = (iso: string) => {
  const date = DateTime.fromISO(iso);
  const now = DateTime.local();

  if (date.hasSame(now, "day")) {
    return `Today • ${date.toFormat("h:mm a")}`;
  }

  if (date.hasSame(now.minus({ days: 1 }), "day")) {
    return `Yesterday • ${date.toFormat("h:mm a")}`;
  }

  return date.toFormat("MMM dd, yyyy • h:mm a");
};
