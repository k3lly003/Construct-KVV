/**
 * Design Tokens - Centralized color and styling definitions
 * 
 * This file provides a consistent design system for the entire application.
 * All colors, spacing, and styling should reference these tokens.
 */

// Color Palette - Semantic Colors
export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Main brand color (amber-500)
    600: '#d97706', // amber-600
    700: '#b45309', // amber-700
    800: '#92400e', // amber-800
    900: '#78350f', // amber-900
  },

  // Semantic Colors
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981', // emerald-500
    600: '#059669', // emerald-600
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // red-500
    600: '#dc2626', // red-600
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // amber-500
    600: '#d97706', // amber-600
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // blue-500
    600: '#2563eb', // blue-600
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Neutral Colors
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Background Colors
  background: {
    default: 'hsl(var(--background))',
    card: 'hsl(var(--card))',
    muted: 'hsl(var(--muted))',
  },

  // Text Colors
  text: {
    primary: 'hsl(var(--foreground))',
    secondary: 'hsl(var(--muted-foreground))',
    inverse: 'hsl(var(--primary-foreground))',
  },
} as const;

// Status Colors (for badges, alerts, etc.)
export const statusColors = {
  success: {
    bg: colors.success[50],
    text: colors.success[700],
    border: colors.success[200],
    icon: colors.success[600],
  },
  error: {
    bg: colors.error[50],
    text: colors.error[700],
    border: colors.error[200],
    icon: colors.error[600],
  },
  warning: {
    bg: colors.warning[50],
    text: colors.warning[700],
    border: colors.warning[200],
    icon: colors.warning[600],
  },
  info: {
    bg: colors.info[50],
    text: colors.info[700],
    border: colors.info[200],
    icon: colors.info[600],
  },
  pending: {
    bg: colors.gray[50],
    text: colors.gray[700],
    border: colors.gray[200],
    icon: colors.gray[600],
  },
} as const;

// Toast/Notification Colors
export const toastColors = {
  success: {
    bg: '#ffffff',
    text: colors.success[600],
    border: colors.success[500],
  },
  error: {
    bg: '#ffffff',
    text: colors.error[600],
    border: colors.error[500],
  },
  warning: {
    bg: '#ffffff',
    text: colors.warning[600],
    border: colors.warning[500],
  },
  info: {
    bg: '#ffffff',
    text: colors.info[600],
    border: colors.info[500],
  },
  default: {
    bg: '#ffffff',
    text: colors.primary[800],
    border: colors.primary[500],
  },
} as const;

// Chart Colors (for data visualization)
export const chartColors = {
  primary: colors.primary[500],
  secondary: colors.info[500],
  success: colors.success[500],
  warning: colors.warning[500],
  error: colors.error[500],
  // Extended palette for multiple series
  palette: [
    colors.primary[500],
    colors.info[500],
    colors.success[500],
    colors.warning[500],
    colors.error[500],
    colors.primary[300],
    colors.info[300],
    colors.success[300],
  ],
} as const;

// Spacing Scale (Tailwind default)
export const spacing = {
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem',  // 8px
  3: '0.75rem', // 12px
  4: '1rem',    // 16px
  5: '1.25rem', // 20px
  6: '1.5rem',  // 24px
  8: '2rem',    // 32px
  10: '2.5rem', // 40px
  12: '3rem',   // 48px
  16: '4rem',   // 64px
  20: '5rem',   // 80px
  24: '6rem',   // 96px
} as const;

// Border Radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',
} as const;

// Typography Scale
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
} as const;

// Shadow Scale
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const;

// Helper function to get Tailwind color class
export function getColorClass(color: keyof typeof colors, shade: string = '500'): string {
  return `${color}-${shade}`;
}

// Helper function to get status color classes
export function getStatusColorClasses(status: keyof typeof statusColors) {
  return {
    bg: `bg-[${statusColors[status].bg}]`,
    text: `text-[${statusColors[status].text}]`,
    border: `border-[${statusColors[status].border}]`,
  };
}

// Export all tokens
export const designTokens = {
  colors,
  statusColors,
  toastColors,
  chartColors,
  spacing,
  borderRadius,
  typography,
  shadows,
} as const;

