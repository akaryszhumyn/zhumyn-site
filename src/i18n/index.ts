import kk from './kk.json';
import ru from './ru.json';
import en from './en.json';

export const langs = ['kk', 'ru', 'en'] as const;
export type Lang = (typeof langs)[number];
export const defaultLang: Lang = 'kk';
export const ogLocale: Record<Lang, string> = { kk: 'kk_KZ', ru: 'ru_RU', en: 'en_US' };

const dict: Record<Lang, typeof kk> = { kk, ru, en };
export const t = (lang: Lang) => dict[lang];

/** Раздел сайта, в котором живёт портфолио: zhumyn.com/product/ */
export const SECTION = '/product';

/** '/cases/' → '/product/cases/' (kk) или '/product/ru/cases/' (казахский без префикса языка) */
export const localize = (lang: Lang, path = '/', section = SECTION) =>
  section + (lang === defaultLang ? '' : `/${lang}`) + path;

/** Главная (zhumyn.com) лежит вне раздела: '/', '/ru/', '/en/' */
export const HUB = '';

/** Значение rest-параметра [...lang]: undefined даёт корень сайта */
export const langParam = (lang: Lang) => (lang === defaultLang ? undefined : lang);

export const langPaths = () => langs.map((lang) => ({ params: { lang: langParam(lang) }, props: { lang } }));
