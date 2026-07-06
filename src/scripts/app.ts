import { initReveal } from './reveal';
import { initSiteMotion } from './site-motion';

function boot(): void {
  initReveal();
  void initSiteMotion();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
