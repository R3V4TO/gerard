/// <reference types="@cloudflare/workers-types" />

interface SubscribePayload {
  email?: string;
  website?: string;
  consent?: string;
  subscribe?: string;
  source?: string;
}

interface Env {
  WEB3FORMS_ACCESS_KEY?: string;
  RESEND_API_KEY?: string;
  SITE_URL?: string;
  CONTACT_FROM?: string;
}

const GUIDE_PATH = '/guide/web-app-vs-mobile';
const GUIDE_TITLE = 'Web App vs Mobile App Decision Guide';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return json({ success: false, message: 'Method not allowed' }, 405);
  }

  let data: SubscribePayload;
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    data = (await request.json()) as SubscribePayload;
  } else {
    const form = await request.formData();
    data = {
      email: String(form.get('email') ?? ''),
      website: String(form.get('website') ?? ''),
      consent: String(form.get('consent') ?? form.get('subscribe') ?? ''),
      source: String(form.get('source') ?? 'website'),
    };
  }

  if (data.website) {
    return json({ success: true, message: 'Subscribed' });
  }

  const email = data.email?.trim().toLowerCase();
  if (!email || !isValidEmail(email)) {
    return json({ success: false, message: 'Please enter a valid email address.' }, 400);
  }

  const hasConsent = data.consent === 'on' || data.consent === 'true' || data.consent === 'yes' || data.subscribe === 'on';
  if (!hasConsent) {
    return json({ success: false, message: 'Please accept to receive the guide and updates.' }, 400);
  }

  const accessKey = env.WEB3FORMS_ACCESS_KEY?.trim();
  if (!accessKey) {
    return json(
      {
        success: false,
        message: 'Subscribe is not configured. Add WEB3FORMS_ACCESS_KEY in Cloudflare, then redeploy.',
      },
      503,
    );
  }

  const siteUrl = (env.SITE_URL ?? 'https://versacarte.com').replace(/\/$/, '');
  const guideUrl = `${siteUrl}${GUIDE_PATH}`;
  const downloadUrl = `${siteUrl}/downloads/versacarte-web-vs-mobile-guide.html`;

  const listMessage = [
    'New mailing list subscriber',
    `Email: ${email}`,
    `Source: ${data.source ?? 'website'}`,
    `Guide: ${GUIDE_TITLE}`,
    `Consent: yes`,
    `Guide URL: ${guideUrl}`,
  ].join('\n');

  try {
    const listResponse = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        name: email,
        email,
        subject: `Mailing list + guide: ${email}`,
        message: listMessage,
        from_name: 'VersaCarte Subscribe',
        replyto: email,
        botcheck: '',
      }),
    });

    const listResult = (await listResponse.json()) as { success?: boolean; message?: string };
    if (!listResponse.ok || !listResult.success) {
      return json(
        { success: false, message: listResult.message ?? 'Could not add you to the list. Try again.' },
        502,
      );
    }

    const resendKey = env.RESEND_API_KEY?.trim();
    if (resendKey) {
      const from = env.CONTACT_FROM ?? 'hello@versacarte.com';
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
          html: welcomeEmailHtml(guideUrl, downloadUrl),
        }),
      }).catch(() => {
        /* Guide link still returned on success */
      });
    }

    return json({
      success: true,
      message: resendKey
        ? 'You are on the list. Check your inbox for the guide.'
        : 'You are on the list. Your guide is ready below.',
      guideUrl,
      downloadUrl,
    });
  } catch {
    return json({ success: false, message: 'Server error. Email hello@versacarte.com directly.' }, 500);
  }
};

function welcomeEmailHtml(guideUrl: string, downloadUrl: string): string {
  return `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 560px; color: #0a0a0a; line-height: 1.6;">
      <p>Thanks for subscribing to VersaCarte.</p>
      <p>Here is your free <strong>Web App vs Mobile App Decision Guide</strong>, built for teams evaluating their first digital product.</p>
      <p style="margin: 24px 0;">
        <a href="${guideUrl}" style="display:inline-block;background:#0a0a0a;color:#fff;padding:12px 20px;text-decoration:none;font-size:14px;">Read the guide online</a>
      </p>
      <p>Or <a href="${downloadUrl}">download a printable copy</a> to share with your team.</p>
      <p style="margin-top: 32px; font-size: 13px; color: #5c5c5c;">
        You will also receive occasional studio updates. Unsubscribe anytime by replying to this email.
      </p>
      <p style="font-size: 13px; color: #5c5c5c;">VersaCarte · App & web development studio</p>
    </div>
  `;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}
