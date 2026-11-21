/**
 * The Orbitum mark as a single-colour drawing, for the social cards
 * (src/pages/og/_card.ts): a ring with a centre dot. The header draws the
 * full-colour mark in CSS instead (Logo.astro, `.orb-logo` in theme.css).
 */
export const logo = {
  width: 24,
  height: 24,
  paths: [
    // Outer ring (counter-clockwise) with its hole (clockwise), then the dot.
    "M12 1a11 11 0 1 0 0 22a11 11 0 1 0 0-22Z M12 3.5a8.5 8.5 0 1 1 0 17a8.5 8.5 0 1 1 0-17Z M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6Z",
  ],
};
