export const colors = {
  background:      "#0A0E1A",
  surface:         "#131929",
  surfaceElevated: "#1C2540",
  border:          "#243050",

  primary:      "#F5A623",
  primaryDark:  "#C97D0A",

  danger:    "#E8394A",
  dangerBg:  "#2A1018",
  success:   "#2ECC71",
  successBg: "#0E2018",
  warning:   "#F39C12",
  warningBg: "#261B08",
  info:      "#3498DB",
  infoBg:    "#0C1B2A",

  textPrimary:   "#F0F4FF",
  textSecondary: "#8899BB",
  textMuted:     "#4A5570",
} as const;

export const spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
} as const;

export const radius = {
  sm: 8, md: 12, lg: 16, xl: 24, full: 999,
} as const;

export const typography = {
  h1:        { fontSize: 28, fontWeight: "700" as const },
  h2:        { fontSize: 22, fontWeight: "700" as const },
  h3:        { fontSize: 18, fontWeight: "600" as const },
  body:      { fontSize: 14, fontWeight: "400" as const },
  bodySmall: { fontSize: 12, fontWeight: "400" as const },
  label:     { fontSize: 11, fontWeight: "600" as const, letterSpacing: 0.8 },
} as const;
