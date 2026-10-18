import { initReveal } from './reveal';
import { initSiteMotion } from './site-motion';
import { initTheme } from './theme';

function boot(): void {
  initTheme();
  initReveal();
  const runMotion = (): void => {
    void initSiteMotion();
  };
  if ('requestIdleCallback' in window) {
    requestIdleCallback(runMotion, { timeout: 1500 });
  } else {
    window.setTimeout(runMotion, 1);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
