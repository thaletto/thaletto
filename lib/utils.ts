import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Map to store prefix counters
const prefixCounters = new Map<string, number>()

export function generateId(prefix: string = 'project'): string {
  // Get current counter for prefix or initialize to 0
  const currentCount = prefixCounters.get(prefix) ?? 0
  // Increment counter for this prefix
  prefixCounters.set(prefix, currentCount + 1)
  // Return formatted ID
  return `${prefix}-${currentCount}`
}
