const STORAGE_KEY = 'versacarte-theme';
const MANUAL_KEY = 'versacarte-theme-manual';

function systemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function chosenTheme(): 'light' | 'dark' {
  const manual = localStorage.getItem(MANUAL_KEY) === '1';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (manual && (stored === 'light' || stored === 'dark')) return stored;
  return systemTheme();
}

export function initTheme(): void {
  applyTheme(chosenTheme());

  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', () => {
    if (localStorage.getItem(MANUAL_KEY) === '1') return;
    applyTheme(systemTheme());
  });

  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
      localStorage.setItem(MANUAL_KEY, '1');
    });
  });
}

function applyTheme(theme: 'light' | 'dark'): void {
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = theme === 'dark' ? '#0a0a0a' : '#fafafa';
}
