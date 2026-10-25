/// <reference types="@cloudflare/workers-types" />
import { onRequestPost as handleContact } from '../functions/api/contact';
import { onRequestPost as handleSendGuide } from '../functions/api/send-guide';

interface Env {
  ASSETS: Fetcher;
  WEB3FORMS_ACCESS_KEY?: string;
  RESEND_API_KEY?: string;
  CONTACT_FROM?: string;
  SITE_URL?: string;
}

const API_ROUTES = new Set(['/api/contact', '/api/send-guide']);

export default {
  async fetch(request, env): Promise<Response> {
    const pathname = normalizePath(new URL(request.url).pathname);

    if (API_ROUTES.has(pathname)) {
      if (request.method !== 'POST') {
        return json({ success: false, message: 'Method not allowed' }, 405);
      }

      const context = { request, env } as Parameters<typeof handleContact>[0];
      if (pathname === '/api/contact') return handleContact(context);
      return handleSendGuide(context as Parameters<typeof handleSendGuide>[0]);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.replace(/\/+$/, '');
  }
  return pathname;
}

function json(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      Allow: 'POST',
    },
  });
}
