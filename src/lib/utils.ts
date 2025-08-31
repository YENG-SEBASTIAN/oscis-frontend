import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names into a single string, merging Tailwind classes properly
 * @param inputs Class names to combine
 * @returns Merged class string
 */
export function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs));
}

/**
 * Alternative version if you need to export the types separately
 */
export type ClassName = string | number | boolean | null | undefined;
export type ClassDictionary = Record<string, any>;
export type ClassArray = ClassName[];
export type ClassValue = Parameters<typeof clsx>[0]; // Get the type from clsx




export const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });