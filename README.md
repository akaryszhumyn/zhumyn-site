# zhumyn.com: портфолио Product Designer

Astro, статический сайт на трёх языках:

Портфолио живёт в разделе `zhumyn.com/product/`. Остальные услуги будут соседними разделами в этом же проекте (`src/pages/<раздел>/`).

| Язык | URL |
|---|---|
| Қазақша (по умолчанию) | `/product/` |
| Русский | `/product/ru/` |
| English | `/product/en/` |

Сейчас `zhumyn.com/` перенаправляет на `/product/`. Когда появится главная-визитка, создайте `src/pages/index.astro` и удалите строку `redirects` в `astro.config.mjs`.

## Запуск

```bash
npm install
npm run dev        # http://localhost:4321/product/
npm run build      # собирает в dist/
npm run preview    # смотреть собранную версию
```

Нужен Node 22.23 или новее.

## Где что лежит

```
src/
  design-system/
    tokens.css        ← цвета (светлая/тёмная), шрифты, размеры, отступы, радиусы, тени, анимация
    components/       ← Button, Link, Tag, Card, Section, Container, Grid, Header,
                        LangSwitcher, Footer, CaseCard, Hero, Timeline, ContactBlock
  i18n/kk.json, ru.json, en.json   ← все тексты интерфейса, опыт, навыки
  site.ts             ← email, Telegram, LinkedIn
  i18n/index.ts       ← SECTION = '/product': раздел, в котором лежат ссылки портфолио
  content/cases/<slug>/kk.md, ru.md, en.md, cover.jpg   ← кейсы
  pages/product/[...lang]/   ← страницы портфолио (одна страница обслуживает все три языка)
  pages/design-system.astro  ← витрина /design-system/ (noindex, общая для всех разделов)
scripts/new-case.mjs
```

Чтобы поменять стиль под референсы, правьте `tokens.css`. Компоненты используют только переменные оттуда.

## Новый кейс

```bash
npm run new-case "Название кейса"
```

Создаёт `src/content/cases/<slug>/` с `kk.md`, `ru.md`, `en.md` и обложкой-заглушкой `cover.jpg`. Кейс создаётся с `draft: true`, поэтому на сайте его пока нет. Заполните поля, замените `cover.jpg` (от 1600px в ширину) и поставьте `draft: false`.

Поля: `title`, `summary`, `company`, `role`, `period`, `date` (для сортировки), `cover`, `coverAlt`, `metrics` (value + label), `tags`, `featured` (показать на главной), `draft`.

Главная и список кейсов собираются автоматически. Картинки при сборке превращаются в AVIF/WebP нужных размеров.

## Деплой

### Cloudflare Pages
1. Залейте проект в GitHub.
2. Cloudflare → Workers & Pages → Create → Pages → Connect to Git → выберите репозиторий.
3. Framework preset: **Astro**. Build command: `npm run build`. Output: `dist`.
4. Переменная окружения `NODE_VERSION` = `22.23.4` (или новее).
5. Custom domains → добавьте `zhumyn.com` (и `www.zhumyn.com` с редиректом на основной).

### Vercel
1. Залейте проект в GitHub.
2. vercel.com → Add New → Project → импортируйте репозиторий. Astro определится сам.
3. Settings → Domains → `zhumyn.com`. Vercel покажет DNS-записи, их нужно добавить у регистратора домена.

После деплоя: добавьте `https://zhumyn.com/sitemap-index.xml` в Google Search Console и Яндекс Вебмастер.

## SEO

- У каждой страницы `canonical`, `hreflang` для kk/ru/en и `x-default` → казахская версия.
- `sitemap-index.xml` генерируется при сборке со связями между языками.
- `/design-system/` закрыт от индексации.
