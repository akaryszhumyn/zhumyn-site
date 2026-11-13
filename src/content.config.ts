import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Кейсы: src/content/cases/<slug>/<kk|ru|en>.md
const cases = defineCollection({
  loader: glob({ pattern: '*/{kk,ru,en}.md', base: './src/content/cases' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      company: z.string(),
      role: z.string(),
      period: z.string(),
      date: z.coerce.date(),
      cover: image(),
      coverAlt: z.string(),
      metrics: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
      tags: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

export const collections = { cases };
