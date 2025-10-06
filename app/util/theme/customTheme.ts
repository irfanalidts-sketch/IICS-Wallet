// app/util/theme/customTheme.ts

import {
  lightTheme as originalLight,
  darkTheme as originalDark,
} from '@metamask/design-tokens';

export const customLightTheme = {
  ...originalLight,
  colors: {
    ...originalLight.colors,
    background: {
      default: '#FAFAD2',
      alternative: '#F0F0C0',
    },
    text: {
      default: '#111827',
      alternative: '#374151',
    },
    icon: {
      default: '#111827',   // black in light mode
      inverse: '#FFFFFF',
    },
    input: {
      placeholder: '#111827',
      text: '#111827',
      background: '#FAFAD2',
      border: '#E5E7EB',
    },
  },
};

export const customDarkTheme = {
  ...originalDark,
  colors: {
    ...originalDark.colors,
    background: {
      default: '#FAFAD2',
      alternative: '#F0F0C0',
    },
    text: {
      default: '#111827',
      alternative: '#374151',
    },
    icon: {
      default: '#FFFFFF',   // WHITE in dark mode
      inverse: '#111827',
    },
    input: {
      placeholder: '#111827',
      text: '#111827',
      background: '#FAFAD2',
      border: '#D1D5DB',
    },
  },
};
