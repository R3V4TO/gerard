interface AvailabilityConfig {
  acceptingUntil: string;
  bookedUntil: string;
  waitlistMessage: string;
}

const config: AvailabilityConfig = {
  acceptingUntil: '2026-09-30',
  bookedUntil: '2026-12-31',
  waitlistMessage: 'Currently booked. Join the waitlist',
};

export function initAvailability(): void {
  const el = document.querySelector<HTMLElement>('[data-availability]');
  if (!el) return;

  const now = new Date();
  const acceptingEnd = new Date(config.acceptingUntil);
  const bookedEnd = new Date(config.bookedUntil);

  let status: 'available' | 'limited' | 'booked';
  let message: string;

  if (now > bookedEnd) {
    status = 'available';
    const quarter = Math.ceil((now.getMonth() + 1) / 3);
    message = `Accepting select engagements for Q${quarter} ${now.getFullYear()}`;
  } else if (now > acceptingEnd) {
    status = 'booked';
    message = config.waitlistMessage;
    el.classList.add('availability--booked');
  } else {
    status = 'available';
    message = el.dataset.availabilityDefault ?? el.textContent ?? '';
  }

  el.textContent = message;
  el.dataset.availabilityStatus = status;

  if (status === 'booked') {
    const waitlist = document.querySelector<HTMLElement>('[data-waitlist]');
    if (waitlist) waitlist.hidden = false;
  }
}
