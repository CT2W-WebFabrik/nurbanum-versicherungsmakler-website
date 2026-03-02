import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const versicherungen = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/versicherungen/de" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['personen', 'sach', 'haftpflicht', 'gewerbe', 'altersvorsorge']),
    icon: z.string().optional(),
    order: z.number().default(99),
  }),
});

const ratgeber = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/ratgeber/de" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
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
    category: z.string(),
    order: z.number().default(99),
  }),
});

export const collections = { versicherungen, ratgeber, blog, faq };
