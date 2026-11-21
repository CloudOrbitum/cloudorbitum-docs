/**
 * MDX globals registry — components available inside MDX without `import`.
 * Wired via `<Content components={components} />` in `[...slug].astro`.
 *
 * Documented with live examples at /style-guide/components/. When you add a
 * component here, add it to that page in the same change.
 */

// Nimbus UI (the same building blocks as developers.cloudflare.com)
import { Aside } from "./components/ui/aside";
import Render from "./components/Render.astro";
import { Badge } from "./components/ui/badge";
import { Card } from "./components/ui/card";
import { CardGrid } from "./components/ui/card-grid";
import { LinkButton } from "./components/ui/link-button";
import { PackageManagers } from "./components/ui/package-managers";
import { Step, Steps } from "./components/ui/steps";
import { Tabs, TabItem } from "./components/ui/tabs";

// Orbitum design-system components
import OrbIcon from "./components/OrbIcon.astro";
import ChangelogEntries from "./components/orbitum/ChangelogEntries.astro";
import CommandLine from "./components/orbitum/CommandLine.astro";
import DirectoryGrid from "./components/orbitum/DirectoryGrid.astro";
import HomeHero from "./components/orbitum/HomeHero.astro";
import LatestChanges from "./components/orbitum/LatestChanges.astro";
import LinkCard from "./components/orbitum/LinkCard.astro";
import Pill from "./components/orbitum/Pill.astro";
import Simulated from "./components/orbitum/Simulated.astro";

export const components = {
  Aside,
  Badge,
  Card,
  CardGrid,
  ChangelogEntries,
  CommandLine,
  DirectoryGrid,
  HomeHero,
  LatestChanges,
  LinkButton,
  LinkCard,
  OrbIcon,
  PackageManagers,
  Pill,
  Render,
  Simulated,
  Step,
  Steps,
  TabItem,
  Tabs,
};
