export interface ContactPrefill {
  offeringSlug: string;
  offeringLabel: string;
  priceLabel?: string;
  projectType: string;
  budget: string;
  timeline: string;
  brief: string;
}

const prefills: Record<string, ContactPrefill> = {
  starter: {
    offeringSlug: 'starter',
    offeringLabel: 'Starter tier for websites and landing pages',
    priceLabel: 'KES 25,000 to 75,000 over 2 to 4 weeks',
    projectType: 'web',
    budget: 'under-75k',
    timeline: '1-3months',
    brief:
      'I would like a quote for the Starter package: a marketing site or landing page (up to 6 pages), mobile-responsive and SEO-ready.',
  },
  standard: {
    offeringSlug: 'standard',
    offeringLabel: 'Standard tier for web apps and mobile products',
    priceLabel: 'KES 100,000 to 300,000 over 6 to 12 weeks',
    projectType: 'mobile',
    budget: '75k-300k',
    timeline: '3-6months',
    brief:
      'I would like to discuss the Standard package for a React Native app or full web application with backend and documented handoff.',
  },
  enterprise: {
    offeringSlug: 'enterprise',
    offeringLabel: 'Custom tier for IoT, full-stack and systems engineering',
    priceLabel: 'KES 300,000+ and scoped per project',
    projectType: 'iot',
    budget: '300k-plus',
    timeline: 'flexible',
    brief:
      'I would like enterprise scoping for IoT, full-stack or systems engineering work with a dedicated engineering lead.',
  },
  'landing-page': {
    offeringSlug: 'landing-page',
    offeringLabel: 'Launch Ready Landing Page',
    priceLabel: 'KES 25,000 in 7 days',
    projectType: 'web',
    budget: 'under-75k',
    timeline: 'urgent',
    brief:
      'I would like to order the Launch Ready Landing Page productized service (single-page site with hero, features and contact form).',
  },
  'supabase-setup': {
    offeringSlug: 'supabase-setup',
    offeringLabel: 'Supabase Backend Setup',
    priceLabel: 'KES 30,000 in 10 days',
    projectType: 'cloud',
    budget: 'under-75k',
    timeline: '1-3months',
    brief:
      'I would like to order the Supabase Backend Setup (auth, RLS, schema, Edge Functions and documented API).',
  },
  'iot-dashboard': {
    offeringSlug: 'iot-dashboard',
    offeringLabel: 'IoT Sensor Dashboard',
    priceLabel: 'KES 40,000 in 14 days',
    projectType: 'iot',
    budget: 'under-75k',
    timeline: '1-3months',
    brief:
      'I would like to order the IoT Sensor Dashboard (MQTT ingest, live charts, alerts and mobile-friendly dashboard).',
  },
  maintenance: {
    offeringSlug: 'maintenance',
    offeringLabel: 'Maintenance Plan retainer',
    priceLabel: 'KES 8,000/mo',
    projectType: 'retainer',
    budget: 'retainer',
    timeline: 'flexible',
    brief:
      'I am interested in the Maintenance Plan retainer for hosting oversight, security patches and priority support.',
  },
  growth: {
    offeringSlug: 'growth',
    offeringLabel: 'Growth Plan retainer',
    priceLabel: 'KES 18,000/mo',
    projectType: 'retainer',
    budget: 'retainer',
    timeline: 'flexible',
    brief:
      'I am interested in the Growth Plan retainer for regular feature work, analytics review and backend tuning.',
  },
  embedded: {
    offeringSlug: 'embedded',
    offeringLabel: 'Embedded Engineer retainer',
    priceLabel: 'Custom monthly',
    projectType: 'retainer',
    budget: 'retainer',
    timeline: 'flexible',
    brief:
      'I am interested in Embedded Engineer capacity as an extension of our team (part-time engineering hours).',
  },
};

const typeDefaults: Partial<Record<string, Pick<ContactPrefill, 'projectType' | 'brief'>>> = {
  mobile: {
    projectType: 'mobile',
    brief: 'I would like to discuss a mobile app project.',
  },
  web: {
    projectType: 'web',
    brief: 'I would like to discuss a website or web app project.',
  },
  iot: {
    projectType: 'iot',
    brief: 'I would like to discuss an IoT or embedded systems project.',
  },
  cloud: {
    projectType: 'cloud',
    brief: 'I would like to discuss cloud or backend work.',
  },
  engineering: {
    projectType: 'engineering',
    brief: 'I would like to discuss systems engineering scoping.',
  },
  retainer: {
    projectType: 'retainer',
    brief: 'I would like to discuss an ongoing retainer partnership.',
  },
};

export function getOfferingOptions(): { slug: string; label: string; priceLabel: string }[] {
  return Object.entries(prefills).map(([slug, entry]) => ({
    slug,
    label: entry.offeringLabel,
    priceLabel: entry.priceLabel ?? '',
  }));
}

export function getPrefillMap(): Record<string, ContactPrefill> {
  return prefills;
}

export function getTypeDefaults(): typeof typeDefaults {
  return typeDefaults;
}

export function resolveSlugFromSearchParams(searchParams: URLSearchParams): string {
  return (
    searchParams.get('plan')?.trim() ||
    searchParams.get('product')?.trim() ||
    searchParams.get('package')?.trim() ||
    ''
  );
}

export function resolveContactPrefill(searchParams: URLSearchParams): ContactPrefill | null {
  const key = resolveSlugFromSearchParams(searchParams);

  if (key && prefills[key]) {
    return prefills[key];
  }

  const type = searchParams.get('type')?.trim();
  if (!type) return null;

  const defaults = typeDefaults[type];
  if (!defaults) return null;

  return {
    offeringSlug: key ?? type,
    offeringLabel: key ? `${key} inquiry` : `${type} project inquiry`,
    projectType: defaults.projectType ?? type,
    budget: type === 'retainer' ? 'retainer' : '',
    timeline: '',
    brief: defaults.brief ?? '',
  };
}
