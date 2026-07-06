/// <reference types="@cloudflare/workers-types" />

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
  website?: string;
}

interface Env {
  WEB3FORMS_ACCESS_KEY?: string;
  CONTACT_FROM?: string;
}

interface Web3FormsResult {
  success?: boolean;
  message?: string;
  body?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return json({ success: false, message: 'Method not allowed' }, 405);
  }

  let data: ContactPayload;
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    data = (await request.json()) as ContactPayload;
  } else {
    const form = await request.formData();
    data = {
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      message: String(form.get('message') ?? ''),
      website: String(form.get('website') ?? ''),
    };
  }

  if (data.website) {
    return json({ success: true, message: 'Sent' });
  }

  const name = data.name?.trim();
  const email = data.email?.trim();
  const message = data.message?.trim();

  if (!name || !email || !message) {
    return json({ success: false, message: 'Name, email, and message are required.' }, 400);
  }

  if (!isValidEmail(email)) {
    return json({ success: false, message: 'Invalid email address.' }, 400);
  }

  const accessKey = env.WEB3FORMS_ACCESS_KEY?.trim();

  if (!accessKey) {
    return json(
      {
        success: false,
        message:
          'Contact form is not configured. Add WEB3FORMS_ACCESS_KEY as a Production secret in Cloudflare, then redeploy.',
      },
      503,
    );
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        name,
        email,
        message,
        subject: `VersaCarte studio inquiry from ${name}`,
        from_name: 'VersaCarte Studio',
        replyto: email,
        botcheck: '',
      }),
    });

    let result: Web3FormsResult = {};
    const raw = await response.text();

    try {
      result = JSON.parse(raw) as Web3FormsResult;
    } catch {
      return json(
        {
          success: false,
          message: 'Unexpected response from mail service. Try hello@versacarte.com directly.',
        },
        502,
      );
    }

    if (!response.ok || !result.success) {
      const detail = result.message ?? result.body ?? 'Failed to send message.';
      return json({ success: false, message: detail }, 502);
    }

    return json({ success: true, message: 'Message sent.' });
  } catch {
    return json(
      { success: false, message: 'Server error. Email hello@versacarte.com directly.' },
      500,
    );
  }
};

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
