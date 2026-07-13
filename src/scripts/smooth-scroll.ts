import { prefersReducedMotion } from './motion-prefers';

export async function initSmoothScroll(): Promise<void> {
  document.documentElement.style.scrollPaddingTop = '5rem';

  if (prefersReducedMotion()) return;

  const { animate } = await import('motion');

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      animate(window.scrollY, y, {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (v) => window.scrollTo(0, v),
      });
      history.pushState(null, '', id);
    });
  });
}
