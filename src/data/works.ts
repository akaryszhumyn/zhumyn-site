// Веб-проекты на главной. Обложки лежат в src/assets/works, ссылки и сроки взяты из выгрузки Tilda.
import type { ImageMetadata } from 'astro';
import type { Lang } from '../i18n';
import dosParking from '../assets/works/dos-parking.jpg';
import hamit from '../assets/works/hamit.jpg';
import drAset from '../assets/works/dr-aset.jpg';
import tiho from '../assets/works/tiho.jpg';
import wonder from '../assets/works/wonder-fulfillment.jpg';
import aitemr from '../assets/works/aitemr-internship.jpg';

type L = Record<Lang, string>;
export interface Work { slug: string; url: string; cover: ImageMetadata; company: string; title: L; period: L; kind: L; sphere: L }

const site: L = { kk: 'Көпбетті сайт', ru: 'Многостраничный сайт', en: 'Multi-page website' };
const landing: L = { kk: 'Лендинг', ru: 'Лендинг', en: 'Landing page' };
const weeks = (n: number): L => ({ kk: `${n} апта`, ru: `${n} недели`, en: `${n} weeks` });

export const works: Work[] = [
  { slug: 'dos-parking', url: 'https://dosparking.com', cover: dosParking, company: 'Dos Parking', period: weeks(4), kind: site,
    sphere: { kk: 'Ақылды инфрақұрылым', ru: 'Умная инфраструктура', en: 'Smart infrastructure' },
    title: { kk: 'Smart parking және энергетикалық инфрақұрылым саласындағы америкалық компанияға арналған корпоративті сайт', ru: 'Корпоративный сайт для американской компании в сфере smart parking и энергетической инфраструктуры', en: 'Corporate website for a US smart parking and energy infrastructure company' } },
  { slug: 'hamit', url: 'https://spkhamit.kz', cover: hamit, company: 'СПК «Хамит»', period: weeks(4), kind: site,
    sphere: { kk: 'Балық өнеркәсібі', ru: 'Рыбная промышленность', en: 'Fish industry' },
    title: { kk: 'Балық өңдеу компаниясына арналған корпоративті сайт және өнім каталогы', ru: 'Корпоративный сайт и каталог продукции для рыбоперерабатывающей компании', en: 'Corporate website and product catalog for a fish processing company' } },
  { slug: 'dr-aset', url: 'https://doctor-aset.kz', cover: drAset, company: 'Dr. Aset Zhangabek', period: weeks(3), kind: site,
    sphere: { kk: 'Медицина', ru: 'Медицина', en: 'Medicine' },
    title: { kk: 'Урология және андрология дәрігері мен клиникасына арналған көпбетті сайт', ru: 'Многостраничный сайт врача и клиники урологии и андрологии', en: 'Multi-page website for a urology and andrology doctor and clinic' } },
  { slug: 'tiho', url: 'https://tiho.kz', cover: tiho, company: 'TIHO', period: weeks(4), kind: site,
    sphere: { kk: 'Сәулеттік акустика', ru: 'Архитектурная акустика', en: 'Architectural acoustics' },
    title: { kk: 'Сәулеттік және құрылыс акустикасы саласындағы компанияға арналған корпоративті сайт', ru: 'Корпоративный сайт для компании в сфере архитектурной и строительной акустики', en: 'Corporate website for an architectural and building acoustics company' } },
  { slug: 'wonder-fulfillment', url: 'https://wonder-fulfillment.kz', cover: wonder, company: 'Wonder Fulfillment', period: weeks(2), kind: landing,
    sphere: { kk: 'Логистика және фулфилмент', ru: 'Логистика и фулфилмент', en: 'Logistics & fulfillment' },
    title: { kk: 'Қоймалық логистика және фулфилмент компаниясына арналған сайт', ru: 'Сайт для компании в сфере складской логистики и фулфилмента', en: 'Website for a warehouse logistics and fulfillment company' } },
  { slug: 'aitemr-internship', url: 'https://internship.startios.kz', cover: aitemr, company: 'aitemr', period: weeks(2), kind: landing,
    sphere: { kk: 'Білім беру, IT', ru: 'Образование, IT', en: 'Education, IT' },
    title: { kk: 'iOS-әзірлеушілерге арналған тағылымдама лендингі', ru: 'Лендинг стажировки для iOS-разработчиков', en: 'Landing page for an iOS developer internship' } },
];
