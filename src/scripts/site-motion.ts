import { prefersReducedMotion } from './motion-prefers';

export async function initSiteMotion(): Promise<void> {
  if (prefersReducedMotion()) return;

  const { animate, scroll, stagger } = await import('motion');

  document.querySelectorAll<HTMLElement>('[data-parallax-img]').forEach((img) => {
    const panel = img.closest<HTMLElement>('[data-photo-panel]');
    if (!panel) return;
    scroll(
      animate(img, { y: ['-6%', '6%'] }, { ease: 'linear' }),
      { target: panel, offset: ['start end', 'end start'] },
    );
  });

  document.querySelectorAll<HTMLElement>('[data-photo-panel]:not([data-photo-panel=""])').forEach((panel) => {
    const img = panel.querySelector<HTMLElement>('[data-parallax-img]');
    if (!img) return;
    scroll(
      animate(img, { scale: [1.08, 1] }, { ease: 'linear' }),
      { target: panel, offset: ['start end', 'end start'] },
    );
  });

  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count ?? 0);
    const suffix = el.dataset.suffix ?? '';
    scroll(
      animate(0, target, {
        duration: 1.4,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (v) => {
          el.textContent = `${Math.round(v)}${suffix}`;
        },
      }),
      { target: el, offset: ['start 0.9', 'start 0.5'] },
    );
  });

  document.querySelectorAll<HTMLElement>('[data-reveal-scale]').forEach((card) => {
    scroll(
      animate(card, { opacity: [0, 1], scale: [0.94, 1], y: [24, 0] }, { duration: 0.7, ease: [0.22, 1, 0.36, 1] }),
      { target: card, offset: ['start 0.92', 'start 0.55'] },
    );
  });

  document.querySelectorAll<HTMLElement>('[data-tilt-card]').forEach((card) => {
    if (!window.matchMedia('(hover: hover)').matches) return;
    card.style.transformStyle = 'preserve-3d';
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      animate(card, { rotateX: py * -5, rotateY: px * 8, y: -4 }, { duration: 0.25 });
    });
    card.addEventListener('pointerleave', () => {
      animate(card, { rotateX: 0, rotateY: 0, y: 0 }, { duration: 0.45 });
    });
  });

  const marquee = document.querySelector<HTMLElement>('[data-marquee-track]');
  if (marquee) {
    const width = marquee.scrollWidth / 2;
    animate(marquee, { x: [0, -width] }, { duration: 28, repeat: Infinity, ease: 'linear' });
  }

  document.querySelectorAll<HTMLElement>('[data-stagger-motion]').forEach((group) => {
    const items = group.querySelectorAll<HTMLElement>(':scope > *');
    if (!items.length) return;
    scroll(
      animate(items, { opacity: [0, 1], y: [28, 0] }, { delay: stagger(0.1), duration: 0.65, ease: [0.22, 1, 0.36, 1] }),
      { target: group, offset: ['start 0.9', 'start 0.45'] },
    );
  });
}
