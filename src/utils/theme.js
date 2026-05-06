// ============================================
// PREPBUDDY — SHARED DESIGN TOKENS
// Import this in every page for consistency
// ============================================

export const F = {
  display: "'Clash Display', 'Sora', sans-serif",   // Hero titles, page headings
  body: "'Sora', 'Segoe UI', sans-serif",           // Body text, descriptions
  ui: "'Nunito', 'Sora', sans-serif",               // Buttons, labels, nav, badges
  mono: "'JetBrains Mono', 'Courier New', monospace", // Code, numbers, scores, stats
};

export const C = {
  primary: "#16A34A",
  secondary: "#14532D",
  accent: "#4ADE80",
  bg: "#F0FDF4",
  bgCard: "#DCFCE7",
  text: "#052E16",
  textMuted: "#166534",
  border: "#BBF7D0",
  borderDark: "#86EFAC",
  white: "#FFFFFF",
};

// Font size scale
export const SIZE = {
  displayXl: "clamp(3rem, 7vw, 5.2rem)",    // Hero headline
  displayLg: "clamp(2.2rem, 5vw, 3.6rem)",  // Section headline
  displayMd: "clamp(1.8rem, 4vw, 2.8rem)",  // Card headline
  h1: "clamp(1.5rem, 3vw, 2rem)",           // Page title
  h2: "1.5rem",                              // Section title
  h3: "1.15rem",                             // Card title
  bodyLg: "1.15rem",                         // Large body
  body: "1rem",                              // Normal body
  bodySm: "0.9rem",                          // Small body
  ui: "0.95rem",                             // Button, nav
  uiSm: "0.82rem",                           // Badge, label
  label: "0.72rem",                          // Uppercase label
  stat: "2.5rem",                            // Big stat number
  mono: "0.9rem",                            // Code/mono text
};

// Common sidebar nav items
export const NAV_ITEMS = [
  {  label: "Dashboard", path: "/dashboard" },
  {  label: "DSA Practice", path: "/dsa" },
  {  label: "Aptitude", path: "/aptitude" },
  {  label: "Study Planner", path: "/planner" },
  {  label: "Community", path: "/community" },
];
