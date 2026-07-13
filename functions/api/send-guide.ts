/// <reference types="@cloudflare/workers-types" />

interface Payload {
  email?: string;
}

interface Env {
  RESEND_API_KEY?: string;
  SITE_URL?: string;
  CONTACT_FROM?: string;
}

const GUIDE_PATH = '/guide/web-app-vs-mobile';
const GUIDE_TITLE = 'Web App vs Mobile App Decision Guide';

/** Optional: sends welcome email with guide links when RESEND_API_KEY is set. */
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  let data: Payload;
  try {
    data = (await request.json()) as Payload;
  } catch {
    return json({ success: false }, 400);
  }

  const email = data.email?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ success: false }, 400);
  }

  const resendKey = env.RESEND_API_KEY?.trim();
  if (!resendKey) {
    return json({ success: true, emailed: false });
  }

  const siteUrl = (env.SITE_URL ?? 'https://versacarte.com').replace(/\/$/, '');
  const guideUrl = `${siteUrl}${GUIDE_PATH}`;
  const downloadUrl = `${siteUrl}/downloads/versacarte-web-vs-mobile-guide.html`;
  const from = env.CONTACT_FROM ?? 'hello@versacarte.com';

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `VersaCarte <${from}>`,
        to: [email],
        subject: `Your free copy: ${GUIDE_TITLE}`,
        html: `
          <p>Thanks for subscribing to VersaCarte.</p>
          <p>Here is your free <strong>${GUIDE_TITLE}</strong>.</p>
          <p><a href="${guideUrl}">Read the guide online</a></p>
          <p><a href="${downloadUrl}">Download a printable copy</a></p>
        `,
      }),
    });
    return json({ success: true, emailed: true });
  } catch {
    return json({ success: true, emailed: false });
  }
};

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
