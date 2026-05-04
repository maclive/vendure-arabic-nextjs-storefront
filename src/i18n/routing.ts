import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['ar', 'en', 'de'],
    defaultLocale: 'ar',
});

export type Locale = (typeof routing.locales)[number];

export const localeNames: Record<Locale, string> = {
    ar: 'العربية',
    en: 'English',
    de: 'Deutsch',
};
