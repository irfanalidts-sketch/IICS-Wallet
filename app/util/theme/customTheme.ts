// app/util/theme/customTheme.ts

import { lightTheme as originalLight, darkTheme as originalDark } from '@metamask/design-tokens';

export const customLightTheme = {
  ...originalLight,
  colors: {
    ...originalLight.colors,
    background: {
      default: '#FAFAD2',   // golden background
      alternative: '#F0F0C0',
    },
    text: {
      default: '#111827',   // black text
      alternative: '#374151',
    },
    icon: {
      default: '#111827',   // black icons
    },
  },
};

export const customDarkTheme = {
  ...originalDark,
  colors: {
    ...originalDark.colors,
    background: {
      default: '#FAFAD2',   // golden background in dark mode too
      alternative: '#F0F0C0',
    },
    text: {
      default: '#111827',   // black text (instead of white)
      alternative: '#374151',
    },
    icon: {
      default: '#111827',   // black icons
    },
  },
};
