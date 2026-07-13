import i18n from '../data/i18n.json';

type Lang = keyof Omit<typeof i18n, 'languages'>;

const supported = i18n.languages.map((l) => l.code) as Lang[];

export function initI18n(): void {
  const stored = localStorage.getItem('versacarte-lang');
  const lang = supported.includes(stored as Lang) ? (stored as Lang) : 'en';
  applyLang(lang);

  document.querySelectorAll<HTMLSelectElement>('[data-lang-select]').forEach((select) => {
    select.value = lang;
    select.addEventListener('change', () => {
      const next = select.value as Lang;
      if (!supported.includes(next)) return;
      applyLang(next);
      localStorage.setItem('versacarte-lang', next);
    });
  });
}

function applyLang(lang: Lang): void {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  const strings = i18n[lang] ?? i18n.en;
  const fallback = i18n.en;

  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (!key) return;
    const value = (strings as Record<string, string>)[key] ?? (fallback as Record<string, string>)[key];
    if (value) el.textContent = value;
  });

  document.querySelectorAll<HTMLSelectElement>('[data-lang-select]').forEach((select) => {
    select.value = lang;
  });
}
