import { initReveal } from './reveal';
import { initSiteMotion } from './site-motion';
import { initSmoothScroll } from './smooth-scroll';
import { initTheme } from './theme';
import { initI18n } from './i18n';
import { initAvailability } from './availability';

function boot(): void {
  initTheme();
  initI18n();
  initAvailability();
  initReveal();
  void initSmoothScroll();
  void initSiteMotion();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
