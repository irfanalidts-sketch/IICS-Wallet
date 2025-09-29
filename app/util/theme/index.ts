// app/util/theme/index.ts
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  useColorScheme,
  StatusBar,
  ColorSchemeName,
  Appearance,
  Platform,
} from 'react-native';
import { throttle } from 'lodash';
import { AppThemeKey, Theme } from './models';
import { useSelector } from 'react-redux';
import { brandColor } from '@metamask/design-tokens';
import { customLightTheme, customDarkTheme } from './customTheme';
import Device from '../device';

// -------- Theme context & mocks --------
export const ThemeContext = React.createContext<any>(undefined);

// Simple mock for tests/fallback
export const mockTheme = {
  colors: customLightTheme.colors,
  themeAppearance: 'light' as AppThemeKey.light,
  typography: customLightTheme.typography,
  shadows: customLightTheme.shadows,
  brandColors: brandColor,
};

// -------- Helpers --------
export const getAssetFromTheme = (
  appTheme: AppThemeKey,
  osColorScheme: ColorSchemeName,
  light: any,
  dark: any,
) => {
  let asset = light;
  switch (appTheme) {
    case AppThemeKey.light:
      asset = light;
      break;
    case AppThemeKey.dark:
      asset = dark;
      break;
    case AppThemeKey.os:
      asset = osColorScheme === 'dark' ? dark : light;
      break;
    default:
      asset = light;
  }
  return asset;
};

// Exported custom hook for OS scheme changes
export const useColorSchemeCustom = (
  delay = Platform.select({ android: 0, ios: 350 }),
): ColorSchemeName => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  const onColorSchemeChange = useCallback(
    throttle(({ colorScheme }) => setColorScheme(colorScheme), delay, {
      leading: false,
    }),
    [],
  );
  useEffect(() => {
    const l = Appearance.addChangeListener(onColorSchemeChange);
    return () => {
      onColorSchemeChange.cancel();
      l?.remove();
    };
  }, []);
  return colorScheme;
};

// -------- Hard overrides to keep UI readable on light-golden bg --------
const APP_BG = '#FAFAD2';      // LightGoldenrodYellow
const APP_BG_ALT = '#F0F0C0';
const TEXT_DARK = '#111827';
const TEXT_DARK_2 = '#374151';
const ICON_DARK = '#111827';
const PLACEHOLDER = '#6B7280';
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
  text: {
    ...(c as any).text,
    default: TEXT_DARK,
    alternative: TEXT_DARK_2,
    // keep any other text tokens but ensure defaults are dark
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
    // ensure inputs don’t show very light placeholders
    ...(c as any).input,
    placeholderText: PLACEHOLDER,
  },
});

// Compose all overrides together
const applyAppOverrides = (c: Theme['colors']): Theme['colors'] =>
  withReadableText(withBg(c));

// -------- Main theme hook --------
export const useAppTheme = (): Theme => {
  const osThemeName = useColorSchemeCustom();
  const appTheme: AppThemeKey = useSelector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.user.appTheme,
  );
  const themeAppearance = getAssetFromTheme(
    appTheme,
    osThemeName,
    AppThemeKey.light,
    AppThemeKey.dark,
  );

  let colors: Theme['colors'];
  let typography: Theme['typography'];
  let shadows: Theme['shadows'];
  const brandColors = brandColor;

  const setLightStatusBar = () => {
    // dark icons over light background
    StatusBar.setBarStyle('dark-content', true);
    if (Device.isAndroid()) {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }
  };

  switch (appTheme) {
    case AppThemeKey.os: {
      if (osThemeName === AppThemeKey.dark) {
        colors = applyAppOverrides(customDarkTheme.colors);
        typography = customDarkTheme.typography;
        shadows = customDarkTheme.shadows;
      } else {
        colors = applyAppOverrides(customLightTheme.colors);
        typography = customLightTheme.typography;
        shadows = customLightTheme.shadows;
      }
      setLightStatusBar();
      break;
    }
    case AppThemeKey.light:
      colors = applyAppOverrides(customLightTheme.colors);
      typography = customLightTheme.typography;
      shadows = customLightTheme.shadows;
      setLightStatusBar();
      break;

    case AppThemeKey.dark:
      colors = applyAppOverrides(customDarkTheme.colors);
      typography = customDarkTheme.typography;
      shadows = customDarkTheme.shadows;
      setLightStatusBar();
      break;

    default:
      colors = applyAppOverrides(customLightTheme.colors);
      typography = customLightTheme.typography;
      shadows = customLightTheme.shadows;
      setLightStatusBar();
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

// Asset helper for FCs
export const useAssetFromTheme = (light: any, dark: any) => {
  const osColorScheme = useColorScheme();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const appTheme = useSelector((state: any) => state.user.appTheme);
  return getAssetFromTheme(appTheme, osColorScheme, light, dark);
};
