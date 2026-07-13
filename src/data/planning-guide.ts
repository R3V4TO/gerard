export const guideMeta = {
  slug: 'web-app-vs-mobile',
  title: 'Web App vs Mobile App Decision Guide',
  subtitle: 'A practical framework for teams evaluating their first digital product',
  author: 'VersaCarte',
  version: '1.0',
  updated: 'July 2026',
  path: '/guide/web-app-vs-mobile',
  downloadPath: '/downloads/versacarte-web-vs-mobile-guide.html',
};

export const guideSections = [
  {
    id: 'introduction',
    title: 'Introduction',
    content: [
      'You have an idea, a budget, and a deadline. The first fork in the road is usually platform: should you build a web application or a native mobile app?',
      'There is no universal right answer. The best choice depends on who your users are, how often they need your product, what device capabilities you require, and how quickly you need to ship.',
      'This guide walks you through the decision in plain language so you can align your team, brief a studio confidently, and avoid paying for the wrong platform first.',
    ],
  },
  {
    id: 'web-app',
    title: 'When a web app is the better choice',
    content: [
      'A web app runs in the browser. Users visit a URL, log in if needed, and use your product without installing anything from an app store.',
    ],
    bullets: [
      'Your users are on laptops and desktops as much as phones',
      'You need to ship fast and iterate weekly without app store review delays',
      'SEO and shareable links matter for discovery (marketing sites, dashboards, portals)',
      'You want one codebase to reach every device with a browser',
      'Your product is used occasionally rather than multiple times per day',
      'You need admin panels, internal tools, or B2B workflows',
    ],
    note: 'Modern web apps can be installable (PWAs), work offline in limited ways, and feel app-like on mobile. For many MVPs, a well-built web app is enough to validate demand before investing in native mobile.',
  },
  {
    id: 'mobile-app',
    title: 'When a mobile app is the better choice',
    content: [
      'A mobile app is installed from the App Store or Google Play. It can use device hardware deeply and stay present on the user\'s home screen.',
    ],
    bullets: [
      'Users will open your product daily or several times per week',
      'You need push notifications as a core retention channel',
      'Camera, GPS, Bluetooth, NFC, or background sync are central to the product',
      'You are building a consumer product where app store presence builds trust',
      'Offline-first usage is required (field workers, travel, poor connectivity)',
      'You need the polish and performance users expect from top-tier mobile products',
    ],
    note: 'Cross-platform frameworks like React Native and Expo let you ship iOS and Android from one codebase, which reduces cost compared to building twice natively.',
  },
  {
    id: 'comparison',
    title: 'Side-by-side comparison',
    table: [
      ['Factor', 'Web app', 'Mobile app'],
      ['Time to first launch', 'Often faster', 'Longer (stores, review, devices)'],
      ['Discovery', 'SEO, ads, direct links', 'App store search, ads, word of mouth'],
      ['Updates', 'Instant for all users', 'Store review for native changes'],
      ['Device access', 'Browser APIs, limited hardware', 'Full camera, GPS, push, background'],
      ['Cost to build MVP', 'Typically lower', 'Typically higher'],
      ['User habit', 'Bookmark or PWA install', 'Home screen icon, push alerts'],
      ['Best for', 'B2B, dashboards, content, tools', 'Consumer, field, daily-use products'],
    ],
  },
  {
    id: 'hybrid',
    title: 'Hybrid options worth knowing',
    content: [
      'You do not always have to pick only one. Many successful products start on one platform and expand later.',
    ],
    bullets: [
      'PWA (Progressive Web App): a web app that can be installed and work offline for basic flows',
      'Web first, mobile later: validate with a web MVP, then build mobile once usage patterns are clear',
      'Mobile first, web portal later: common for field apps that later need an admin dashboard on desktop',
      'Shared backend: Supabase, Firebase, or custom APIs let web and mobile clients share the same data layer',
    ],
  },
  {
    id: 'costs',
    title: 'Budget and timeline signals',
    content: [
      'Rough ranges vary by scope and region, but these patterns hold for most studio engagements:',
    ],
    bullets: [
      'Marketing landing page or simple web site: weeks, lower budget',
      'Full web application with auth and database: mid budget, 2 to 3 months',
      'Cross-platform mobile app with backend: higher budget, 3 to 4 months',
      'IoT or hardware plus dashboard: scoped separately, often longest timeline',
    ],
    note: 'If your budget only supports one platform, ship where your core users already are. You can add the second platform after you have paying customers or clear usage data.',
  },
  {
    id: 'checklist',
    title: 'Decision checklist',
    content: ['Score each statement. Mostly yes on the left column leans web. Mostly yes on the right leans mobile.'],
    checklist: [
      { web: 'Users mainly find us through Google search', mobile: 'Users will search in the App Store or Play Store' },
      { web: 'We need to update features several times per month', mobile: 'Push notifications are essential to retention' },
      { web: 'Desktop or tablet is the primary work environment', mobile: 'Phone is the primary device' },
      { web: 'We are testing demand before a large investment', mobile: 'We already know users want this on their phone' },
      { web: 'Internal staff or B2B clients are the audience', mobile: 'Consumers or field teams are the audience' },
    ],
  },
  {
    id: 'next-steps',
    title: 'Next steps',
    content: [
      'Once you have a lean answer, write a one-page brief: who the user is, the main job your product does, must-have features for v1, and your target launch date.',
      'Bring that brief to a discovery call. A good studio will pressure-test your platform choice, suggest a phased roadmap, and quote based on documented scope rather than vague ideas.',
      'VersaCarte builds web platforms, mobile apps, and connected systems for teams worldwide. If you want a second opinion on your decision, we offer free discovery calls.',
    ],
  },
];
