import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
// `z` re-exported from `astro:content` is deprecated; import it from `astro/zod`.
import { z } from "astro/zod";
import {
  apiCollection,
  docsCollection,
  partialsCollection,
} from "@cloudflare/nimbus-docs/content";

/**
 * Page types, after Cloudflare's `pcx_content_type` taxonomy. Pick the one
 * that matches what the reader is trying to do; see
 * /style-guide/content-types/ for when to use each.
 */
export const contentTypes = [
  "changelog",
  "concept",
  "configuration",
  "design-guide",
  "example",
  "faq",
  "get-started",
  "how-to",
  "integration-guide",
  "learning-unit",
  "navigation",
  "overview",
  "reference",
  "reference-architecture",
  "troubleshooting",
  "tutorial",
] as const;

export const collections = {
  docs: defineCollection(
    docsCollection({
      schemaFields: {
        // Nimbus docs are agent-friendly by default. Set `audience: human`
        // to flag a page that's written primarily for human readers.
        audience: z.literal("human").optional(),

        // --- Orbitum / Cloudflare-style frontmatter -----------------------
        /** The page type (Cloudflare's `pcx_content_type`). */
        pcx_content_type: z.enum(contentTypes).optional(),
        /** Product slugs the page belongs to (ids in src/content/directory/). */
        products: z.array(z.string()).optional(),
        /** Last human review of the content, YYYY-MM-DD. */
        reviewed: z.coerce.date().optional(),
        /** Tutorials and learning paths only. */
        difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
        tags: z.array(z.string()).optional(),
        /** `splash` drops the page header and widens the column (landing pages). */
        template: z.enum(["doc", "splash"]).default("doc"),
      },
    }),
  ),
  partials: defineCollection(partialsCollection()),

  // The API reference, generated from the `api` entry in astro.config.ts.
  api: defineCollection(apiCollection()),

  // Product changelog entries, one file per entry (as in cloudflare-docs).
  // Rendered at /changelog/.
  changelog: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/changelog" }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      /** Product ids from src/content/directory/. */
      products: z.array(z.string()).min(1),
      /** Optional link to the docs page that covers the change. */
      link: z.string().optional(),
    }),
  }),

  // Product directory (as in cloudflare-docs src/content/directory/):
  // one YAML file per product, rendered at /directory/ and on the home page.
  directory: defineCollection({
    loader: glob({ pattern: "*.{yaml,yml}", base: "./src/content/directory" }),
    schema: z.object({
      name: z.string(),
      description: z.string(),
      url: z.string(),
      group: z.enum(["Connect", "Build", "Agents and automation", "Simulation lab", "Reference"]),
      /** An icon name from src/styles/orbitum/icons.json. */
      icon: z.string(),
      /** Optional token name for a coloured dot (e.g. `cloud-azure`). */
      dot: z.string().optional(),
    }),
  }),
};
