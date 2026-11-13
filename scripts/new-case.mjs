#!/usr/bin/env node
// npm run new-case "Название кейса" → src/content/cases/<slug>/{kk,ru,en}.md + cover.jpg
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert';
import sharp from 'sharp';

const map = {
  а: 'a', ә: 'a', б: 'b', в: 'v', г: 'g', ғ: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i', й: 'y',
  к: 'k', қ: 'q', л: 'l', м: 'm', н: 'n', ң: 'ng', о: 'o', ө: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
  ұ: 'u', ү: 'u', ф: 'f', х: 'h', һ: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', і: 'i', ь: '',
  э: 'e', ю: 'yu', я: 'ya',
};
export const slugify = (s) =>
  [...s.toLowerCase()].map((c) => map[c] ?? c).join('')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

assert.equal(slugify('Мобильный банк 2.0'), 'mobilnyy-bank-2-0');
assert.equal(slugify('Қаржы қосымшасы'), 'qarzhy-qosymshasy');

const title = process.argv.slice(2).join(' ').trim();
if (!title) {
  console.error('Usage: npm run new-case "Название кейса"');
  process.exit(1);
}
const slug = slugify(title);
if (!slug) {
  console.error('Не получилось сделать slug из названия, используйте латиницу или кириллицу.');
  process.exit(1);
}
const dir = join('src/content/cases', slug);
if (existsSync(dir)) {
  console.error(`Кейс уже существует: ${dir}`);
  process.exit(1);
}
mkdirSync(dir, { recursive: true });

const today = new Date().toISOString().slice(0, 10);
const body = {
  kk: '## Міндет\n\nМұнда не істеу керек болғанын жазыңыз.\n\n## Шешім\n\nНе істедіңіз және неге.\n\n## Нәтиже\n\nНе өзгерді.\n',
  ru: '## Задача\n\nОпишите, что нужно было сделать.\n\n## Решение\n\nЧто сделали и почему.\n\n## Результат\n\nЧто изменилось.\n',
  en: '## Problem\n\nWhat needed to be solved.\n\n## Solution\n\nWhat you did and why.\n\n## Outcome\n\nWhat changed.\n',
};
for (const lang of ['kk', 'ru', 'en']) {
  writeFileSync(join(dir, `${lang}.md`), `---
title: ${JSON.stringify(title)}
summary: "TODO"
company: "TODO"
role: "Product Designer"
period: "TODO"
date: ${today}
cover: ./cover.jpg
coverAlt: "TODO"
metrics:
  - value: "+0%"
    label: "TODO"
tags: []
featured: false
draft: true
---

${body[lang]}`);
}

// Заглушка обложки, замените своим cover.jpg (желательно от 1600px в ширину)
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000"><rect width="100%" height="100%" fill="#e9e9e4"/><text x="80" y="920" font-family="sans-serif" font-size="72" fill="#55554f">${slug}</text></svg>`;
await sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toFile(join(dir, 'cover.jpg'));

console.log(`Готово: ${dir}\nКейс создан как черновик (draft: true). Заполните поля и поставьте draft: false.`);
