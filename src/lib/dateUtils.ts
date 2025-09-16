/**
 * Utility functions for date formatting
 */

/**
 * Formats a date string to a user-friendly format
 * @param dateString - ISO date string or date string
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string | undefined | null,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
): string {
  if (!dateString) return '—';
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '—';
    }
    
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.warn('Error formatting date:', dateString, error);
    return '—';
  }
}

/**
 * Formats a date to show relative time (e.g., "2 days ago", "1 month ago")
 * @param dateString - ISO date string or date string
 * @returns Relative time string
 */
export function formatRelativeDate(dateString: string | undefined | null): string {
  if (!dateString) return '—';
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '—';
    }
    
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return months === 1 ? '1 month ago' : `${months} months ago`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return years === 1 ? '1 year ago' : `${years} years ago`;
    }
  } catch (error) {
    console.warn('Error formatting relative date:', dateString, error);
    return '—';
  }
}

/**
 * Formats a date for display in portfolio cards (compact format)
 * @param dateString - ISO date string or date string
 * @returns Compact formatted date string
 */
export function formatPortfolioDate(dateString: string | undefined | null): string {
  return formatDate(dateString, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Formats a date for display in detailed views (full format)
 * @param dateString - ISO date string or date string
 * @returns Full formatted date string
 */
export function formatDetailedDate(dateString: string | undefined | null): string {
  return formatDate(dateString, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
