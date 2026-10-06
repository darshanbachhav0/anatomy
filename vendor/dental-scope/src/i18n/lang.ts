/** Upstream translation types are retained; UMA uses Spanish exclusively. */
export type Lang = 'en' | 'sv' | 'de' | 'es' | 'la';

export const LANGS: readonly Lang[] = ['en', 'sv', 'de', 'es', 'la'];
export const DEFAULT_LANG: Lang = 'es';

/** Each language's name in its own language (for the switcher). */
export const LANG_NATIVE: Record<Lang, string> = { en: 'English', sv: 'Svenska', de: 'Deutsch', es: 'Español', la: 'Latina' };

export const isLang = (v: unknown): v is Lang => (LANGS as readonly unknown[]).includes(v);
