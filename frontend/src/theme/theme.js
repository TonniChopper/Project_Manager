/**
 * Eye-catching theme with glassmorphism, gradients, and neon effects
 * Inspired by modern design trends: Stripe, Linear, and Vercel
 */

export const lightTheme = {
  name: 'light',

  // Vibrant gradient backgrounds
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    cosmic: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    ocean: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    sunset: 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)',
    aurora: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    neon: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    mesh: 'radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(22,100%,77%,1) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%), radial-gradient(at 0% 0%, hsla(343,100%,76%,1) 0px, transparent 50%)',
  },

  // Core colors with vibrant palette
  colors: {
    // Primary - Electric Purple
    primary: '#7c3aed',
    primaryLight: '#a78bfa',
    primaryDark: '#5b21b6',
    primaryGlow: 'rgba(124, 58, 237, 0.4)',

    // Secondary - Hot Pink
    secondary: '#ec4899',
    secondaryLight: '#f472b6',
    secondaryDark: '#be185d',
    secondaryGlow: 'rgba(236, 72, 153, 0.4)',

    // Accent colors
    accent: '#06b6d4', // Cyan
    accentLight: '#22d3ee',
    accentDark: '#0891b2',
    accentGlow: 'rgba(6, 182, 212, 0.4)',

    // Status colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',

    // Glow effects for status
    successGlow: 'rgba(16, 185, 129, 0.4)',
    warningGlow: 'rgba(245, 158, 11, 0.4)',
    errorGlow: 'rgba(239, 68, 68, 0.4)',
    infoGlow: 'rgba(59, 130, 246, 0.4)',

    // Neutral colors
    white: '#ffffff',
    black: '#000000',
    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827',
  },

  // Text colors
  text: {
    primary: '#1f2937',
    secondary: '#6b7280',
    tertiary: '#9ca3af',
    inverse: '#ffffff',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },

  // Background colors with glassmorphism
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
    elevated: '#ffffff',
    overlay: 'rgba(255, 255, 255, 0.8)',
    glass: 'rgba(255, 255, 255, 0.7)',
    glassHover: 'rgba(255, 255, 255, 0.9)',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    mesh: 'radial-gradient(at 40% 20%, hsla(28,100%,74%,0.2) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.2) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,0.2) 0px, transparent 50%)',
  },

  // Border colors
  border: {
    light: '#e5e7eb',
    medium: '#d1d5db',
    dark: '#9ca3af',
    focus: '#7c3aed',
    glass: 'rgba(255, 255, 255, 0.3)',
  },

  // Shadows with neon effects
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    xxl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',

    // Glow effects
    glow: '0 0 20px rgba(124, 58, 237, 0.5)',
    glowLg: '0 0 40px rgba(124, 58, 237, 0.6)',
    neon: '0 0 5px rgba(124, 58, 237, 0.5), 0 0 20px rgba(124, 58, 237, 0.3)',
    neonPink: '0 0 5px rgba(236, 72, 153, 0.5), 0 0 20px rgba(236, 72, 153, 0.3)',
    neonCyan: '0 0 5px rgba(6, 182, 212, 0.5), 0 0 20px rgba(6, 182, 212, 0.3)',

    // Glass effect
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  },

  // Border radius
  radius: {
    none: '0',
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    xxl: '1.5rem',
    full: '9999px',
  },

  // Spacing scale
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
    xxxl: '4rem',
  },

  // Typography
  fonts: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"Fira Code", "SF Mono", Monaco, Consolas, "Courier New", monospace',
  },

  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    xxl: '1.5rem',
    xxxl: '2rem',
    xxxxl: '3rem',
  },

  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line heights
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Z-index scale
  zIndices: {
    hide: -1,
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    overlay: 1200,
    modal: 1300,
    popover: 1400,
    toast: 1500,
    tooltip: 1600,
  },

  // Blur effects
  blur: {
    sm: 'blur(4px)',
    md: 'blur(8px)',
    lg: 'blur(16px)',
    xl: 'blur(24px)',
  },
};

export const darkTheme = {
  ...lightTheme,
  name: 'dark',

  // Adjust gradients for dark mode with more vibrant colors
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    cosmic: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    ocean: 'linear-gradient(135deg, #09203f 0%, #537895 100%)',
    sunset: 'linear-gradient(135deg, #ff6a88 0%, #ff9a56 100%)',
    aurora: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    neon: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    mesh: 'radial-gradient(at 40% 20%, hsla(28,100%,74%,0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.3) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,0.3) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(340,100%,76%,0.3) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(22,100%,77%,0.3) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(242,100%,70%,0.3) 0px, transparent 50%)',
  },

  // Darker backgrounds
  background: {
    primary: '#0f172a',
    secondary: '#1e293b',
    tertiary: '#334155',
    elevated: '#1e293b',
    overlay: 'rgba(15, 23, 42, 0.9)',
    glass: 'rgba(30, 41, 59, 0.7)',
    glassHover: 'rgba(30, 41, 59, 0.9)',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    mesh: 'radial-gradient(at 40% 20%, hsla(28,100%,74%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.15) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,0.15) 0px, transparent 50%)',
  },

  // Light text for dark mode
  text: {
    primary: '#f1f5f9',
    secondary: '#cbd5e1',
    tertiary: '#94a3b8',
    inverse: '#0f172a',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },

  // Darker borders
  border: {
    light: '#334155',
    medium: '#475569',
    dark: '#64748b',
    focus: '#a78bfa',
    glass: 'rgba(255, 255, 255, 0.1)',
  },

  // Enhanced glow for dark mode
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6)',
    xxl: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',

    // More intense glow in dark mode
    glow: '0 0 30px rgba(124, 58, 237, 0.7)',
    glowLg: '0 0 60px rgba(124, 58, 237, 0.8)',
    neon: '0 0 10px rgba(124, 58, 237, 0.8), 0 0 30px rgba(124, 58, 237, 0.5), 0 0 50px rgba(124, 58, 237, 0.3)',
    neonPink:
      '0 0 10px rgba(236, 72, 153, 0.8), 0 0 30px rgba(236, 72, 153, 0.5), 0 0 50px rgba(236, 72, 153, 0.3)',
    neonCyan:
      '0 0 10px rgba(6, 182, 212, 0.8), 0 0 30px rgba(6, 182, 212, 0.5), 0 0 50px rgba(6, 182, 212, 0.3)',

    // Glass effect in dark
    glass: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
  },
};

export default { light: lightTheme, dark: darkTheme };
