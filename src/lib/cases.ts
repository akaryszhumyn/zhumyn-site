import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n';

export type CaseEntry = CollectionEntry<'cases'> & { slug: string };

/** Кейсы одного языка, новые сверху, без черновиков */
export async function getCases(lang: Lang): Promise<CaseEntry[]> {
  const all = await getCollection('cases', ({ id, data }) => id.endsWith(`/${lang}`) && !data.draft);
  return all
    .map((e) => ({ ...e, slug: e.id.split('/')[0] }))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
