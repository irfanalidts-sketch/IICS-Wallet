// app/util/theme/index.ts
import React, { useContext } from 'react';
import { StatusBar } from 'react-native';
import { AppThemeKey, Theme } from './models';
import { brandColor } from '@metamask/design-tokens';
import { customLightTheme } from './customTheme';
import Device from '../device';

// -------- Theme context & mocks --------
export const ThemeContext = React.createContext<any>(undefined);

// Simple mock for tests/fallback (light-only)
export const mockTheme = {
  colors: customLightTheme.colors,
  themeAppearance: 'light' as AppThemeKey.light,
  typography: customLightTheme.typography,
  shadows: customLightTheme.shadows,
  brandColors: brandColor,
};

// -------- Hard overrides to keep UI readable on light-golden bg --------
const APP_BG = '#FAFAD2';      // LightGoldenrodYellow
const APP_BG_ALT = '#F0F0C0';
const TEXT_DARK = '#111827';
const TEXT_DARK_2 = '#374151';
const ICON_DARK = '#111827';
// DARKER placeholder so it's readable on golden bg
const PLACEHOLDER = '#374151';
const BORDER = '#E5E7EB';

const withBg = (c: Theme['colors']): Theme['colors'] => ({
  ...c,
  background: {
    ...(c as any).background,
    default: APP_BG,
    alternative: APP_BG_ALT,
  },
});

const withReadableText = (c: Theme['colors']): Theme['colors'] => ({
  ...c,
  // ensure all text tokens are dark against light background
  text: {
    ...(c as any).text,
    default: TEXT_DARK,
    alternative: TEXT_DARK_2,
    muted: PLACEHOLDER, // <-- many inputs use text.muted for placeholder
  },
  icon: {
    ...(c as any).icon,
    default: ICON_DARK,
  },
  border: {
    ...(c as any).border,
    default: BORDER,
  },
  input: {
    ...(c as any).input,
    // cover both possible keys used by different input components
    placeholder: PLACEHOLDER,       // <-- some components read this
    placeholderText: PLACEHOLDER,   // <-- others read this
    text: TEXT_DARK,                // typed text color
    background: APP_BG,             // if the input uses a tokenized bg
    border: BORDER,
  },
});

// Compose all overrides together
const applyAppOverrides = (c: Theme['colors']): Theme['colors'] =>
  withReadableText(withBg(c));

// -------- Main theme hook (LIGHT-ONLY) --------
export const useAppTheme = (): Theme => {
  // Hard-lock to LIGHT regardless of OS / Redux
  const themeAppearance = AppThemeKey.light;

  // Light tokens + app-specific overrides
  const colors = applyAppOverrides(customLightTheme.colors);
  const typography = customLightTheme.typography;
  const shadows = customLightTheme.shadows;
  const brandColors = brandColor;

  // Status bar: dark icons over light background
  StatusBar.setBarStyle('dark-content', true);
  if (Device.isAndroid()) {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor('transparent');
  }

  return { colors, themeAppearance, typography, shadows, brandColors };
};

// -------- Context helpers --------
export const useAppThemeFromContext = (): Theme => {
  const theme = useContext<Theme>(ThemeContext);
  return theme;
};

export const useTheme = (): Theme => {
  const theme = useAppThemeFromContext() || mockTheme;
  return theme;
};

// -------- Assets: always pick LIGHT variant --------
export const useAssetFromTheme = (light: any, _dark: any) => {
  // App is light-only now
  return light;
};
