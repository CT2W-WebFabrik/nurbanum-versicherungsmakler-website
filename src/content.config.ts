import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const versicherungen = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/versicherungen/de" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['personen', 'sach', 'haftpflicht', 'gewerbe', 'altersvorsorge']),
    audience: z.enum(['privat', 'gewerbe']).default('privat'),
    icon: z.string().optional(),
    order: z.number().default(99),
  }),
});

const ratgeber = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/ratgeber/de" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['Grundlagen', 'Lebenssituationen', 'Altersvorsorge', 'Schadenfall', 'Haftung & Recht', 'Betrieb & Sicherheit', 'Arbeitgeber']),
    audience: z.enum(['privat', 'gewerbe']).default('privat'),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    readingTime: z.string().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog/de" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    readingTime: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/faq/de" }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['Versicherungen', 'Allgemein', 'Altersvorsorge', 'Vertragsfragen', 'Gewerbe']),
    order: z.number().default(99),
  }),
});

const spezialisierungen = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/spezialisierungen/de" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    h1: z.string(),
    heroDescription: z.string(),
    audience: z.enum(['privat', 'gewerbe']),
    category: z.enum(['Lebensphasen', 'Vorsorge & Ruhestand', 'Absicherung im Beruf', 'Freie Berufe & Dienstleistung', 'Handwerk, Handel & Industrie', 'Vereine & Organisationen']),
    productLinks: z.array(z.object({
      title: z.string(),
      href: z.string(),
      description: z.string(),
    })).optional(),
  }),
});

export const collections = { versicherungen, ratgeber, blog, faq, spezialisierungen };
