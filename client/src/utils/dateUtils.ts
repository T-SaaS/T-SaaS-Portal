/**
 * Formats a date string to a readable format
 * Handles PostgreSQL timestamp format: "2025-07-10 16:59:59.249+00"
 * @param dateString - The date string to format
 * @returns Formatted date string (e.g., "Jul 10, 2025, 04:59 PM")
 */
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Formats a date string to show only the date (no time)
 * Handles PostgreSQL timestamp format: "2025-07-10 16:59:59.249+00"
 * @param dateString - The date string to format
 * @returns Formatted date string (e.g., "Jul 10, 2025")
 */
export const formatDateOnly = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Formats a date string to show only the time
 * Handles PostgreSQL timestamp format: "2025-07-10 16:59:59.249+00"
 * @param dateString - The date string to format
 * @returns Formatted time string (e.g., "04:59 PM")
 */
export const formatTimeOnly = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
