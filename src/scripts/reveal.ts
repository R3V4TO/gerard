import { prefersReducedMotion } from './motion-prefers';

export function initReveal(): void {
  const allItems = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!allItems.length) return;

  if (prefersReducedMotion()) {
    allItems.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const standalone = [...allItems].filter((el) => !el.closest('[data-stagger]'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -4% 0px' },
  );

  standalone.forEach((el) => observer.observe(el));

  document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((group) => {
    const items = group.querySelectorAll<HTMLElement>(':scope > *');
    items.forEach((item, index) => {
      item.style.transitionDelay = `${index * 0.08}s`;
      observer.observe(item);
    });
  });
}
