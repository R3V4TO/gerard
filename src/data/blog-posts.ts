export const blogPosts: Record<string, { title: string; date: string; readTime: string; tags: string[]; content: string }> = {
  'react-native-supabase-kenya': {
    title: 'Building React Native apps with Supabase',
    date: '2026-05-15',
    readTime: '8 min',
    tags: ['React Native', 'Supabase', 'Mobile'],
    content: `
Product teams launching their first mobile app face a specific set of constraints: diverse Android devices, variable connectivity and users who expect local payment methods from day one. Here is how we structure React Native and Supabase projects for global markets.

## Start with auth that works offline

Supabase Auth with PKCE flow handles token refresh gracefully. We cache the session in AsyncStorage and queue mutations when connectivity drops, which is critical for field workers in areas with spotty coverage.

## Design RLS policies before UI

Row Level Security is not an afterthought. We write policies alongside the schema, test them in a playground and document which roles access which tables. This prevents the common trap where everything works in dev but leaks in production.

## Payment integration patterns

Checkout and wallet flows run server-side through Supabase Edge Functions. Never expose consumer secrets in the mobile client. We use idempotency keys and webhook verification to handle duplicate callbacks.

## Performance on mid-range devices

Keep bundle size under 15MB, lazy-load screens and profile on representative hardware, not just flagship devices. React Native's Hermes engine helps but image optimization and list virtualization matter more.

## Takeaway

The stack is proven. The differentiator is designing for real-world infrastructure from the first architecture diagram, not bolting on integrations at the end.
    `.trim(),
  },
  'iot-mqtt-east-africa': {
    title: 'IoT telemetry with MQTT at scale',
    date: '2026-04-02',
    readTime: '10 min',
    tags: ['IoT', 'MQTT', 'ESP8266'],
    content: `
Field IoT deployments mean planning for power cuts, cellular fallback and technicians who may not have a laptop on site. MQTT is our default transport because it is lightweight, pub/sub native and tolerant of intermittent connections.

## Hardware choices

ESP8266 remains cost-effective for stationary sensors. We add deep-sleep cycles and supercapacitor buffers for brief outages. For mobile assets, we use ESP32 with LTE modules when budget allows.

## MQTT topic design

Hierarchical topics like \`site/{id}/node/{id}/telemetry\` keep ACL rules simple. QoS 1 for telemetry, QoS 0 for heartbeat pings. Retained messages only for config, never for high-frequency data.

## Dashboard requirements

Operators need mobile-friendly dashboards. We build with Astro or React, WebSocket bridges to the broker and alert thresholds that push to email or SMS because those are channels people actually check.

## Security

TLS on MQTT (port 8883), per-device credentials and broker ACLs that isolate tenants. No anonymous publish.

## Takeaway

The Smart Traffic Control project proved this architecture works at intersection scale. The same patterns apply to tank monitoring, cold chain and energy metering.
    `.trim(),
  },
  'astro-cloudflare-performance': {
    title: 'Shipping sub-second sites with Astro and Cloudflare',
    date: '2026-03-10',
    readTime: '6 min',
    tags: ['Astro', 'Cloudflare', 'Performance'],
    content: `
Enterprise clients and government agencies sometimes run Lighthouse audits before engaging a studio. Here is our checklist for 95+ scores on both mobile and desktop.

## Static-first with Astro

Astro ships zero JavaScript by default. We add Motion only where animation adds value, such as hero reveals, count-ups and scroll-triggered cards. Everything else is HTML and CSS.

## Image strategy

WebP with explicit width and height to prevent CLS. Lazy loading below the fold. Unsplash URLs with \`auto=format\` for modern formats. SVG logos for project cards.

## Edge caching

Cloudflare Pages with aggressive cache headers on \`/_astro/*\` and images. API routes get \`no-store\`. HTML gets short TTL with stale-while-revalidate.

## Core Web Vitals targets

- LCP under 2.5s (hero image preloaded, critical CSS inlined)
- INP under 200ms (minimal JS, passive scroll listeners)
- CLS under 0.1 (reserved space for images and fonts)

## Takeaway

Performance is a feature. Fast sites convert better, rank higher and signal engineering discipline to technical buyers.
    `.trim(),
  },
};
