import de from './de.json';

const translations: Record<string, typeof de> = { de };

export function t(key: string, locale: string = 'de'): string {
  const lang = translations[locale] ?? translations['de'];
  const keys = key.split('.');
  let value: unknown = lang;
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  return typeof value === 'string' ? value : key;
}

export function getLocaleFromUrl(url: URL): string {
  const [, locale] = url.pathname.split('/');
  if (locale && locale in translations) return locale;
  return 'de';
}
