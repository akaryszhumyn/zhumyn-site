# Graph Report - zhumyn.com  (2026-11-24)

## Corpus Check
- Corpus is ~16,535 words - fits in a single context window. You may not need a graph.

## Summary
- 228 nodes · 407 edges · 11 communities
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.89)
- Token cost: 103,027 input · 0 output

## Community Hubs (Navigation)
- Экспорты дизайн-системы
- Шапка и меню
- Документация и структура сайта
- Портрет-эффект (Hero)
- Иконки, ссылки и контакты
- Конфиг и зависимости
- Карточки, кнопки, контейнер
- Лицензии, SEO и деплой
- Данные проектов (works)
- Точечный фон
- Настройки TypeScript

## God Nodes (most connected - your core abstractions)
1. `Lang` - 17 edges
2. `t()` - 16 edges
3. `DitherPortrait` - 15 edges
4. `localize()` - 10 edges
5. `astro` - 7 edges
6. `langPaths()` - 7 edges
7. `getCases()` - 6 edges
8. `scripts` - 5 edges
9. `Bank app sign-up shortened to 3 minutes (-42% drop-off, 7 to 3 min)` - 5 edges
10. `Marketplace seller dashboard (2x faster upload, +18 NPS)` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Small design system for the dashboard` --semantically_similar_to--> `Design system components`  [INFERRED] [semantically similar]
  src/content/cases/seller-dashboard/en.md → README.md
- `Case content collection (src/content/cases)` --references--> `Seller dashboard case (en)`  [INFERRED]
  README.md → src/content/cases/seller-dashboard/en.md
- `Bundled font families (Medeo, Geist, Inter, PT Sans/Serif, Noto Serif Display)` --conceptually_related_to--> `Design tokens (tokens.css)`  [INFERRED]
  public/fonts/OFL.txt → README.md
- `Case content collection (src/content/cases)` --references--> `Fintech onboarding case (en)`  [INFERRED]
  README.md → src/content/cases/fintech-onboarding/en.md
- `Fintech onboarding case (en)` --semantically_similar_to--> `Fintech onboarding case (kk)`  [INFERRED] [semantically similar]
  src/content/cases/fintech-onboarding/en.md → src/content/cases/fintech-onboarding/kk.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Fintech onboarding case in kk/ru/en** — src_content_cases_fintech_onboarding_en, src_content_cases_fintech_onboarding_kk, src_content_cases_fintech_onboarding_ru [INFERRED 0.95]
- **Seller dashboard case in kk/ru/en** — src_content_cases_seller_dashboard_en, src_content_cases_seller_dashboard_kk, src_content_cases_seller_dashboard_ru [INFERRED 0.95]

## Communities (11 total, 0 thin omitted)

### Community 0 - "Экспорты дизайн-системы"
Cohesion: 0.08
Nodes (25): langParam(), langPaths(), CaseEntry, getCases(), colors, lang, sizes, spaces (+17 more)

### Community 1 - "Шапка и меню"
Cohesion: 0.11
Nodes (20): Props, product, Props, s, Props, buttons, Props, s (+12 more)

### Community 2 - "Документация и структура сайта"
Cohesion: 0.09
Nodes (18): README (zhumyn.com portfolio), Astro trilingual static site, Case content collection (src/content/cases), Home section (/, /ru/, /en/), i18n (kk/ru/en JSON), Product Design portfolio section (/product/), works.ts web projects data, body (+10 more)

### Community 3 - "Портрет-эффект (Hero)"
Cohesion: 0.16
Nodes (6): Props, stage, BAYER, clamp01(), DitherPortrait, parseColor()

### Community 4 - "Иконки, ссылки и контакты"
Cohesion: 0.11
Nodes (10): Props, Props, HUB, getStaticPaths, home, { lang }, logos, nav (+2 more)

### Community 5 - "Конфиг и зависимости"
Cohesion: 0.11
Nodes (17): dependencies, astro@^7.4.11, @astrojs/sitemap@^3.7.4, sharp@^0.35.5, name, private, scripts, build (+9 more)

### Community 6 - "Карточки, кнопки, контейнер"
Cohesion: 0.13
Nodes (8): Work, Props, Props, Props, Props, Item, Props, Props

### Community 7 - "Лицензии, SEO и деплой"
Cohesion: 0.19
Nodes (13): Bundled font families (Medeo, Geist, Inter, PT Sans/Serif, Noto Serif Display), SIL Open Font License 1.1 (bundled fonts), Deploy (Cloudflare Pages / Vercel), Design system components, /design-system/ showcase page (noindex), Design tokens (tokens.css), SEO (canonical, hreflang, sitemap), Seller dashboard case (en) (+5 more)

### Community 8 - "Данные проектов (works)"
Cohesion: 0.17
Nodes (4): L, landing, site, works

### Community 9 - "Точечный фон"
Cohesion: 0.36
Nodes (6): canvas, draw(), frame(), ox, resize(), step()

### Community 10 - "Настройки TypeScript"
Cohesion: 0.29
Nodes (6): astro/tsconfigs/strict, compilerOptions, resolveJsonModule, exclude, extends, include

## Knowledge Gaps
- **8 isolated node(s):** `astro/tsconfigs/strict`, `README (zhumyn.com portfolio)`, `i18n (kk/ru/en JSON)`, `works.ts web projects data`, `Deploy (Cloudflare Pages / Vercel)` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 112 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `astro` connect `Конфиг и зависимости` to `Данные проектов (works)`, `Иконки, ссылки и контакты`?**
  _High betweenness centrality (0.364) - this node is a cross-community bridge._
- **What connects `astro/tsconfigs/strict`, `README (zhumyn.com portfolio)`, `i18n (kk/ru/en JSON)` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Экспорты дизайн-системы` be split into smaller, more focused modules?**
  _Cohesion score 0.07777777777777778 - nodes in this community are weakly interconnected._
- **Why does `sharp` connect `Конфиг и зависимости` to `Документация и структура сайта`?**
  _High betweenness centrality (0.272) - this node is a cross-community bridge._
- **Should `Шапка и меню` be split into smaller, more focused modules?**
  _Cohesion score 0.10795454545454546 - nodes in this community are weakly interconnected._
- **Why does `Case content collection (src/content/cases)` connect `Документация и структура сайта` to `Лицензии, SEO и деплой`?**
  _High betweenness centrality (0.205) - this node is a cross-community bridge._
- **Should `Документация и структура сайта` be split into smaller, more focused modules?**
  _Cohesion score 0.09420289855072464 - nodes in this community are weakly interconnected._