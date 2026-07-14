export const guideMeta = {
  slug: 'web-app-vs-mobile',
  title: 'Web App vs Mobile App',
  titleAccent: 'Decision Guide',
  subtitle: 'A visual planning handbook for teams evaluating their first digital product',
  author: 'VersaCarte',
  version: '1.0',
  updated: 'July 2026',
  path: '/guide/web-app-vs-mobile',
  downloadPath: '/downloads/versacarte-web-vs-mobile-guide.html',
  coverImage:
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=80&auto=format&fit=crop',
};

export const guideChapters = [
  {
    num: '01',
    id: 'introduction',
    title: 'Introduction',
    kicker: 'Start here',
    image:
      'https://images.unsplash.com/photo-1454165804603-c3d57bc86b40?w=900&q=80&auto=format&fit=crop',
    content: [
      'You have an idea, a budget and a deadline. The first fork in the road is usually platform: should you build a web application or a native mobile app?',
      'There is no universal right answer. The best choice depends on who your users are, how often they need your product, what device capabilities you require and how quickly you need to ship.',
    ],
    pullQuote: 'Choose the platform your users already live on and then ship where the evidence points.',
  },
  {
    num: '02',
    id: 'web-app',
    title: 'When a web app wins',
    kicker: 'Browser-first products',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=80&auto=format&fit=crop',
    accent: 'web',
    content: [
      'A web app runs in the browser. Users visit a URL, log in if needed and use your product without installing anything from an app store.',
    ],
    bullets: [
      'Users work on laptops and desktops as much as phones',
      'You need to ship fast without app store review delays',
      'SEO and shareable links matter for discovery',
      'One codebase reaches every device with a browser',
      'The product is used occasionally, not daily',
      'You need admin panels, internal tools or B2B workflows',
    ],
    note: 'Modern web apps can be installable (PWAs) and feel app-like on mobile. For many MVPs, a strong web app validates demand before native mobile investment.',
  },
  {
    num: '03',
    id: 'mobile-app',
    title: 'When mobile wins',
    kicker: 'App store products',
    image:
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900&q=80&auto=format&fit=crop',
    accent: 'mobile',
    content: [
      'A mobile app is installed from the App Store or Google Play. It uses device hardware deeply and stays on the home screen.',
    ],
    bullets: [
      'Users open your product daily or several times per week',
      'Push notifications are a core retention channel',
      'Camera, GPS, Bluetooth or background sync are essential',
      'App store presence builds consumer trust',
      'Offline-first usage is required in the field',
      'You need polish users expect from top-tier mobile apps',
    ],
    note: 'React Native and Expo ship iOS and Android from one codebase and cost far less than building twice natively.',
  },
  {
    num: '04',
    id: 'comparison',
    title: 'Side-by-side comparison',
    kicker: 'At a glance',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80&auto=format&fit=crop',
    comparison: [
      { label: 'Time to launch', web: 'Often faster', mobile: 'Longer (stores & review)' },
      { label: 'Discovery', web: 'SEO, ads, direct links', mobile: 'App store search & ads' },
      { label: 'Updates', web: 'Instant for all users', mobile: 'Store review cycles' },
      { label: 'Device access', web: 'Browser APIs', mobile: 'Camera, GPS, push, background' },
      { label: 'MVP cost', web: 'Typically lower', mobile: 'Typically higher' },
      { label: 'Best for', web: 'B2B, dashboards, tools', mobile: 'Consumer & daily-use apps' },
    ],
  },
  {
    num: '05',
    id: 'hybrid',
    title: 'Hybrid paths',
    kicker: 'You do not have to pick only one',
    image:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=80&auto=format&fit=crop',
    cards: [
      { title: 'PWA', body: 'Installable web app with limited offline support.' },
      { title: 'Web first', body: 'Validate with a web MVP, then add mobile when patterns are clear.' },
      { title: 'Mobile first', body: 'Field app now, admin dashboard on desktop later.' },
      { title: 'Shared backend', body: 'One API for web and mobile clients (Supabase, Firebase, custom).' },
    ],
  },
  {
    num: '06',
    id: 'costs',
    title: 'Budget & timeline',
    kicker: 'Planning signals',
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80&auto=format&fit=crop',
    timeline: [
      { label: 'Landing page', time: '1–2 weeks', level: 1 },
      { label: 'Full web app', time: '2–3 months', level: 2 },
      { label: 'Mobile + backend', time: '3–4 months', level: 3 },
      { label: 'IoT + dashboard', time: 'Scoped per project', level: 4 },
    ],
    note: 'If budget allows only one platform, ship where core users already are. Add the second platform after paying customers or clear usage data.',
  },
  {
    num: '07',
    id: 'checklist',
    title: 'Decision checklist',
    kicker: 'Score your team',
    image:
      'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=900&q=80&auto=format&fit=crop',
    checklist: [
      { web: 'Users find us through Google search', mobile: 'Users search in app stores' },
      { web: 'We ship features several times per month', mobile: 'Push notifications drive retention' },
      { web: 'Desktop or tablet is primary', mobile: 'Phone is primary' },
      { web: 'We are testing demand first', mobile: 'Users expect a phone app' },
      { web: 'B2B or internal audience', mobile: 'Consumers or field teams' },
    ],
  },
  {
    num: '08',
    id: 'next-steps',
    title: 'Next steps',
    kicker: 'From guide to action',
    image:
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80&auto=format&fit=crop',
    content: [
      'Write a one-page brief: who the user is, the job your product does, must-have v1 features and your target launch date.',
      'Bring that brief to a discovery call. A good studio pressure-tests your platform choice and quotes from documented scope.',
    ],
  },
];

// Legacy export for any imports still using guideSections
export const guideSections = guideChapters.map((ch) => ({
  id: ch.id,
  title: ch.title,
  content: ch.content,
  bullets: ch.bullets,
  note: ch.note,
  table: ch.comparison
    ? [['Factor', 'Web app', 'Mobile app'], ...ch.comparison.map((r) => [r.label, r.web, r.mobile])]
    : undefined,
  checklist: ch.checklist,
}));
