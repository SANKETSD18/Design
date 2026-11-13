export const ONBOARDING_COLORS = {
  primary: '#7A5AF8',
  primaryDark: '#5B2EE5',
  primaryLight: '#8862F2',
  background: '#FFFFFF',
  textPrimary: '#1D2939',
  textSecondary: '#667085',
  borderPurple: '#D8CFFC',
  buttonStroke: '#7A5AF8',
  white: '#FFFFFF',
  cardShadow: 'rgba(45, 26, 98, 0.1)',
};

export const ONBOARDING_GRADIENTS = {
  // Exact screen-level vertical gradient extracted from Figma
  screenBackground: [
    '#7B5BF9', // 0% Top (Rich Purple)
    '#9B84FA', // ~20%
    '#C4B7FC', // ~40%
    '#E5E0FF', // ~55%
    '#F7F6FF', // ~65% (Near Text)
    '#FFFFFF', // 75% - 100% (Buttons & Bottom SafeArea)
  ] as const,

  // Button gradient extracted from Figma
  primaryButton: ['#8862F2', '#7544FB', '#5B2EE5'] as const,
};
