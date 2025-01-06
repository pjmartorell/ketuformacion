import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const ketuColors = {
  blue: {
    50: '#E6F3FF',
    100: '#CCE7FF',
    200: '#99CFFF',
    300: '#66B7FF',
    400: '#339FFF',
    500: '#0087FF', // Primary blue
    600: '#006CCC',
    700: '#005199',
    800: '#003666',
    900: '#001B33',
  },
  white: {
    50: '#FFFFFF',
    100: '#FAFAFA',
    200: '#F5F5F5',
    300: '#E5E5E5',
    400: '#D4D4D4',
    500: '#FFFFFF', // Pure white
    600: '#A3A3A3',
    700: '#737373',
    800: '#525252',
    900: '#262626',
  },
};

// Add blackA with proper structure
const blackAlpha = {
  blackA1: 'rgba(0, 0, 0, 0.05)',
  blackA2: 'rgba(0, 0, 0, 0.1)',
  blackA3: 'rgba(0, 0, 0, 0.15)',
  blackA4: 'rgba(0, 0, 0, 0.2)',
  blackA5: 'rgba(0, 0, 0, 0.25)',
  blackA6: 'rgba(0, 0, 0, 0.3)',
  blackA7: 'rgba(0, 0, 0, 0.4)',
  blackA8: 'rgba(0, 0, 0, 0.5)',
  blackA9: 'rgba(0, 0, 0, 0.6)',
  blackA10: 'rgba(0, 0, 0, 0.7)',
  blackA11: 'rgba(0, 0, 0, 0.8)',
  blackA12: 'rgba(0, 0, 0, 0.9)',
};

export const theme = {
  colors: {
    ...ketuColors,
    ...blackAlpha,
    primary: ketuColors.blue[500],
    secondary: ketuColors.blue[600],
    background: ketuColors.white[500],
    foreground: ketuColors.blue[900],
    muted: ketuColors.white[300],
    accent: ketuColors.blue[300],
    border: ketuColors.blue[200],
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '6px',
    md: '12px',
    lg: '20px',
    xl: '28px',
    round: '50%',
  },
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.05), 0 4px 6px rgba(0, 0, 0, 0.1)',
    glow: `0 0 15px ${ketuColors.blue[300]}`,
    highlight: `0 0 0 2px ${ketuColors.blue[300]}`,
  },
  gradients: {
    primary: `linear-gradient(135deg, ${ketuColors.blue[400]} 0%, ${ketuColors.blue[600]} 100%)`,
    secondary: `linear-gradient(135deg, ${ketuColors.blue[500]} 0%, ${ketuColors.blue[700]} 100%)`,
  },
  keyframes: {
    slideDownAndFade: {
      from: { opacity: 0, transform: 'translateY(-2px)' },
      to: { opacity: 1, transform: 'translateY(0)' }
    }
  }
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Theme = typeof theme;
