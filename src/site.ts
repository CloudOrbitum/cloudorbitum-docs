/**
 * Site-wide links and labels that aren't part of the Nimbus config
 * (astro.config.ts): the header's top-level sections, the dashboard call to
 * action and the footer columns.
 */
export const site = {
  brand: "Orbitum",
  dashboardUrl: "https://dash.cloudorbitum.com/",
  repoUrl: "https://github.com/CloudOrbitum/cloudorbitum-docs",
  headerNav: [
    { label: "Directory", href: "/directory/" },
    { label: "API", href: "/api/" },
    { label: "Changelog", href: "/changelog/" },
  ],
  footer: [
    {
      title: "Docs",
      links: [
        { label: "Get started", href: "/get-started/" },
        { label: "Directory", href: "/directory/" },
        { label: "API reference", href: "/api/" },
        { label: "Changelog", href: "/changelog/" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Learning paths", href: "/learning-paths/" },
        { label: "Use cases", href: "/use-cases/" },
        { label: "Reference architecture", href: "/reference-architecture/" },
        { label: "Agent setup", href: "/agent-setup/" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Support", href: "/support/" },
        { label: "Limits and pricing", href: "/reference/limits-and-pricing/" },
        { label: "Contribute to the docs", href: "/style-guide/" },
      ],
    },
  ],
} as const;
