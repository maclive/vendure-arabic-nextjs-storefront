/**
 * Converts a vendure/next-intl locale string to a valid Intl locale string.
 * e.g. 'ar' -> 'ar-EG', 'en' -> 'en-US', 'de' -> 'de-DE'
 */
const localeMap: Record<string, string> = {
    ar: 'ar-EG',
    en: 'en-US',
    de: 'de-DE',
};

export function toIntlLocale(locale: string): string {
    return localeMap[locale] ?? locale;
}
