/**
 * Date and time utility functions.
 * Provides consistent formatting and manipulation across the application.
 */

/**
 * Format a date as a time string in 12-hour format
 * @example formatTime(new Date()) => "3:45 PM"
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Add minutes to a date and return a new Date object
 * @param date - The base date
 * @param minutes - Number of minutes to add (can be negative)
 * @returns New Date object with added minutes
 */
export function addMinutes(date: Date, minutes: number): Date {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + minutes);
  return result;
}

/**
 * Add hours to a date and return a new Date object
 * @param date - The base date
 * @param hours - Number of hours to add (can be negative)
 * @returns New Date object with added hours
 */
export function addHours(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

/**
 * Check if a date is in the past
 */
export function isPast(date: Date): boolean {
  return date.getTime() < Date.now();
}

/**
 * Check if a date is in the future
 */
export function isFuture(date: Date): boolean {
  return date.getTime() > Date.now();
}

/**
 * Get the difference in minutes between two dates
 */
export function getDifferenceInMinutes(laterDate: Date, earlierDate: Date): number {
  return Math.floor((laterDate.getTime() - earlierDate.getTime()) / (1000 * 60));
}
