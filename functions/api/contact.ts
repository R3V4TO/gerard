/// <reference types="@cloudflare/workers-types" />

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
  website?: string;
  formType?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  package?: string;
  resource?: string;
  consent?: string;
  subscribe?: string;
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
      formType: String(form.get('formType') ?? 'inquiry'),
      projectType: String(form.get('projectType') ?? ''),
      budget: String(form.get('budget') ?? ''),
      timeline: String(form.get('timeline') ?? ''),
      package: String(form.get('package') ?? ''),
      resource: String(form.get('resource') ?? ''),
      consent: String(form.get('consent') ?? ''),
      subscribe: String(form.get('subscribe') ?? ''),
    };
  }

  if (data.website) {
    return json({ success: true, message: 'Sent' });
  }

  const email = data.email?.trim();
  const formType = data.formType ?? 'inquiry';

  if (!email || !isValidEmail(email)) {
    return json({ success: false, message: 'Valid email is required.' }, 400);
  }

  const accessKey = env.WEB3FORMS_ACCESS_KEY?.trim();

  if (!accessKey) {
    return json(
      {
        success: false,
        message:
          'Form is not configured. Add WEB3FORMS_ACCESS_KEY as a Production secret in Cloudflare, then redeploy.',
      },
      503,
    );
  }

  let subject: string;
  let message: string;

  switch (formType) {
    case 'newsletter':
      subject = `Newsletter signup: ${email}`;
      message = `New newsletter subscriber.\nEmail: ${email}\nConsent: yes`;
      break;
    case 'lead-magnet':
      subject = `Lead magnet download: ${data.resource ?? 'guide'}`;
      message = `Resource requested: ${data.resource ?? 'guide'}\nEmail: ${email}\nConsent: ${data.consent ? 'yes' : 'no'}`;
      break;
    case 'waitlist':
      subject = `Waitlist signup: ${email}`;
      message = `Client joined waitlist.\nEmail: ${email}`;
      break;
    default: {
      const name = data.name?.trim();
      const brief = data.message?.trim();
      if (!name || !brief) {
        return json({ success: false, message: 'Name, email and project brief are required.' }, 400);
      }
      subject = `Studio inquiry from ${name}: ${data.projectType || 'general'}`;
      message = [
        `Name: ${name}`,
        `Email: ${email}`,
        `Project type: ${data.projectType || 'not specified'}`,
        `Budget: ${data.budget || 'not specified'}`,
        `Timeline: ${data.timeline || 'not specified'}`,
        data.package ? `Package/product: ${data.package}` : '',
        '',
        'Brief:',
        brief,
      ].filter(Boolean).join('\n');
    }
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        name: data.name?.trim() || email,
        email,
        message,
        subject,
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
          message: 'Unexpected response from mail service. Try owner@versacarte.com directly.',
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
      { success: false, message: 'Server error. Email owner@versacarte.com directly.' },
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
