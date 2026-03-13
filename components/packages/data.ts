// ── Packages Data ──────────────────────────────────
export const packagesData = [
  {
    id: 'ppa',
    name: 'Pay-Per-Appointment',
    badge: 'Minimum Package',
    badgeType: 'outline' as const,
    tagline: 'Test the waters. Only pay for results.',
    priceMonthly: 2500,
    noteMonthly: '15 appointments ($167/appt) + ad spend',
    quarterlyTotal: '$6,750/quarter',
    quarterlySave: '$250/mo',
    accent: '#FE6462',
    highlight: false,
    heroFeatures: [
      '15 qualified appointments / mo',
      'Meta Ads management',
      'Lead qualification & booking',
      'Basic CRM setup',
    ],
    moreFeatures: [
      'Automated appointment reminders',
      'SMS & email follow-up sequences',
      'Real-time lead notifications',
      'Dedicated landing page',
      'Weekly performance reports',
    ],
  },
  {
    id: 'growth',
    name: 'Growth Engine',
    badge: 'Most Popular',
    badgeType: 'popular' as const,
    tagline: 'Complete top-of-funnel system with website and SEO.',
    priceMonthly: 3497,
    noteMonthly: '+ ad spend (you control budget)',
    quarterlyTotal: '$9,441/quarter',
    quarterlySave: '$350/mo',
    accent: '#6B8EFE',
    highlight: true,
    heroFeatures: [
      '20+ Qualified Appointments per month',
      'Custom conversion-optimized website',
      'Local SEO',
      '24/7 Website chat widget',
    ],
    moreFeatures: [
      'Top-of-funnel paid ads management',
      'Automated appointment reminders',
    ],
  },
  {
    id: 'full',
    name: 'Full Scale Partner',
    badge: 'Premium',
    badgeType: 'premium' as const,
    tagline: 'Complete revenue engine with automation stack and sales optimization.',
    priceMonthly: 4997,
    noteMonthly: '+ 4% revenue share on closed deals',
    quarterlyTotal: '$13,491/quarter',
    quarterlySave: '$500/mo',
    accent: '#94D96B',
    highlight: false,
    featuresTitle: 'Everything in Growth Engine, plus',
    heroFeatures: [
      'Google Business optimization',
      'AEO (AI Engine Optimization)',
      'Full automation stack',
      'Rehash Engine\u2122 (automated follow-up)',
    ],
    moreFeatures: [
      'Sales training & scripts',
      'Custom sales presentation',
      'Pricing configurator & quoting software',
      'Dedicated success manager',
      '10-step sales framework',
      'Sales audit & process optimization',
      'Monthly strategy sessions',
      'Review request automation',
      'Referral program',
    ],
  },
];

// ── Results Data ───────────────────────────────────
export const resultsData = [
  {
    name: 'W&S Construction',
    location: 'Bellefontaine, OH',
    logo: 'https://storage.googleapis.com/msgsndr/XN3QKivTiLO5b0k6VrqV/media/6967c3e0264f136b6abbbd4f.png',
    before: '$143k', after: '$312k', unit: 'revenue/mo', increase: '+118%',
  },
  {
    name: 'Diamond Roofers',
    location: 'Tukwila, WA',
    logo: 'https://storage.googleapis.com/msgsndr/XVmgV2URJXsmrugEzlcS/media/69408e9990c8fc8a9fbb52f2.jpg',
    before: '3', after: '7', unit: 'jobs/mo', increase: '+133%',
  },
  {
    name: 'Plastering by Nealeigh',
    location: 'Greenville, OH',
    logo: 'https://storage.googleapis.com/msgsndr/UrIbmSbNwH6Sfvb4CBZw/media/694939147614ce923b7fa2c6.png',
    before: '6', after: '14', unit: 'jobs/mo', increase: '+133%',
  },
  {
    name: 'Blue Water Poolscapes',
    location: 'Berea, KY',
    logo: 'https://storage.googleapis.com/msgsndr/yHN6QY4b97yJaEcdk36w/media/696a8fb5f8c5b87bdfef6304.webp',
    before: '$211k', after: '$566k', unit: 'revenue/mo', increase: '+168%',
  },
  {
    name: 'Aquatic Pools',
    location: 'Phoenix, AZ',
    logo: 'https://storage.googleapis.com/msgsndr/RAmAO69TYtGlSS2rVnm9/media/6957ee1b4478a2a1a2bf8db0.png',
    before: '8', after: '37', unit: 'appts/mo', increase: '+362%',
  },
  {
    name: 'Thomas Solutions',
    location: 'Chicago, IL',
    logo: 'https://storage.googleapis.com/msgsndr/6zwaVBcn8pWvy1rl2vea/media/697723a9eb392b2a57739d74.png',
    before: '5', after: '18', unit: 'appts/mo', increase: '+260%',
  },
];

// ── Phone Demo Steps ───────────────────────────────
export const phoneSteps = [
  { num: 1, title: 'Attract', desc: 'Scroll-stopping ads built for your trade' },
  { num: 2, title: 'Qualify', desc: 'Only serious homeowners get through' },
  { num: 3, title: 'Book', desc: 'They pick a time that works for both of you' },
  { num: 4, title: 'Remind', desc: 'Auto reminders keep show rates high' },
];

// ── FB Ad Mockups ──────────────────────────────────
export const fbAds = [
  {
    initials: 'PR', page: 'Premium Remodeling',
    copy: "Get a Premium Kitchen remodel without the 'Premium' price",
    img: 'https://storage.googleapis.com/msgsndr/odDqIyBG9N40GtGHw9NQ/media/6940aa5c021234a338f385d9.jpg',
    type: 'Photo Ad', reactions: '2.4K', comments: '186 comments',
  },
  {
    initials: 'SR', page: 'Storm Roofing Co',
    copy: 'New roof for as low as $7,000 + FREE Gutters',
    img: 'https://storage.googleapis.com/msgsndr/odDqIyBG9N40GtGHw9NQ/media/6940ac5e96e7534e8feed63b.jpg',
    type: 'Video Ad', reactions: '1.8K', comments: '243 comments',
  },
  {
    initials: 'SR', page: 'Storm Roofing Co',
    copy: 'Before the Next Storm Hits, Secure Your Roof',
    img: 'https://storage.googleapis.com/msgsndr/odDqIyBG9N40GtGHw9NQ/media/6940ac5e96e7534e8feed63b.jpg',
    type: 'Photo Ad', reactions: '3.1K', comments: '312 comments',
  },
  {
    initials: 'PR', page: 'Premium Remodeling',
    copy: 'Full Kitchen/Bathroom remodels starting $9,500',
    img: 'https://storage.googleapis.com/msgsndr/odDqIyBG9N40GtGHw9NQ/media/6940aa5c021234a338f385d9.jpg',
    type: 'Video Ad', reactions: '2.7K', comments: '198 comments',
  },
];

// ── What We Build Features ─────────────────────────
export const buildFeatures = [
  { emoji: '\uD83C\uDF10', title: '20-40 Page SEO Website', desc: 'High-converting website optimized to rank organically and book appointments 24/7.', color: 'rgba(254,100,98,0.15)' },
  { emoji: '\uD83D\uDCAC', title: 'Website Chat Widget', desc: 'Capture leads 24/7 with automated chat converting after-hours traffic into booked calls.', color: 'rgba(148,217,107,0.15)' },
  { emoji: '\uD83D\uDCCD', title: 'Local SEO Optimization', desc: 'Dominate local search results and map pack for every city you serve.', color: 'rgba(107,142,254,0.15)' },
  { emoji: '\uD83E\uDD16', title: 'AEO (AI Engine Optimization)', desc: 'Get recommended by ChatGPT & Gemini when customers ask for contractor recommendations.', color: 'rgba(168,85,247,0.15)' },
  { emoji: '\uD83D\uDD04', title: 'Rehash Engine\u2122', desc: 'Automated system to reactivate old leads and extract $70k-$210k from your database.', color: 'rgba(236,72,153,0.15)' },
  { emoji: '\uD83D\uDCF1', title: 'Missed Call Text Back', desc: 'Recover 20-30% of missed calls with instant automated text responses.', color: 'rgba(59,130,246,0.15)' },
  { emoji: '\u2B50', title: 'Review Automation', desc: 'Automated review generation that builds trust and credibility at scale.', color: 'rgba(245,158,11,0.15)' },
  { emoji: '\uD83D\uDCCA', title: 'Weekly Reporting & Analytics', desc: 'Clear dashboards showing exactly what\'s working and where your revenue comes from.', color: 'rgba(20,184,166,0.15)' },
  { emoji: '\uD83E\uDD1D', title: 'Referral Program Automation', desc: 'Turn customers into lead sources with 60%+ close rates and $0 acquisition cost.', color: 'rgba(139,92,246,0.15)' },
];

// ── Full Scale Partner Extras ──────────────────────
export const fullScaleExtras = [
  'Hiring & Recruiting Support',
  'Sales Training Program',
  'RevOps System Implementation',
  '$10M Sales Training Playbook',
  'Dedicated Success Manager',
  'Google & Bing Profile Optimization',
  'CRM Optimization & Training',
  'Monthly Strategy Sessions',
  'Close Rate Optimization',
  'Custom Sales Presentation',
  'Pricing Configurator',
];

// ── Funnel Steps ───────────────────────────────────
export const funnelSteps = [
  { num: 1, title: 'Top of Funnel', desc: 'SEO gets you found by high-intent searchers. Paid ads scale your reach to homeowners ready to buy.' },
  { num: 2, title: 'Qualification', desc: 'Quiz funnels filter out tire-kickers. Only serious homeowners with real projects make it through.' },
  { num: 3, title: 'Automated Follow-Up', desc: 'Instant texts, emails, and reminders. No lead falls through the cracks, even at 2am.' },
  { num: 4, title: 'Booked & Confirmed', desc: 'Appointment lands on your calendar. Reminders reduce no-shows. You show up and close.' },
];

// ── Ecosystem Nodes ────────────────────────────────
export const ecosystemNodes = [
  { num: '01', title: 'Website Building', sub: 'CRM | Lead Capture' },
  { num: '02', title: 'SEO / GMB', sub: 'Local Dominance' },
  { num: '03', title: 'AEO', sub: 'GPT, Gemini, Alexa' },
  { num: '04', title: 'Backend Systems', sub: 'Automations' },
  { num: '05', title: 'Paid Advertising', sub: 'Meta Ads' },
];

// ── Outcome Cards ──────────────────────────────────
export const outcomeCards = [
  {
    title: 'Booked Appointments',
    icon: 'calendar',
    appointments: [
      { time: '9:00 AM', name: 'Roof Estimate - Johnson' },
      { time: '2:00 PM', name: 'Kitchen Remodel - Martinez' },
    ],
  },
  {
    title: 'Conversations',
    icon: 'chat',
    conversations: [
      { initials: 'JS', name: 'John Smith', badge: 'New Lead', preview: 'I need a quote for my kitchen remodel...', time: '2m', unread: true },
      { initials: 'MT', name: 'Maria Torres', badge: 'New Lead', preview: "Yes, I'm available Thursday at 10am", time: '15m', unread: true },
      { initials: 'KC', name: 'Kevin Chen', badge: 'New Lead', preview: 'Looking to get a deck built this spring', time: '28m', unread: true },
      { initials: 'RJ', name: 'Robert Johnson', preview: 'Great, see you tomorrow!', time: '1h', unread: false },
      { initials: 'LW', name: 'Lisa Williams', preview: 'Thanks for the estimate', time: '3h', unread: false },
    ],
  },
  {
    title: 'Reactivated Lead',
    icon: 'refresh',
    rehash: {
      label: 'Old Lead - 6 months ago',
      context: 'Auto-rehash sequence triggered',
      messages: [
        { dir: 'out', text: 'Hi David! Just checking in, are you still thinking about that bathroom remodel?' },
        { dir: 'in', text: "Hey! Actually yes, we're ready now. Can you come out this week?" },
      ],
    },
  },
];

// ── Qualifying Questions ───────────────────────────
export const qualifyQuestions = [
  { q: 'Are you within 60 minutes of Dallas?', a: 'Yes' },
  { q: 'Are you the homeowner?', a: 'Yes' },
  { q: 'How will you be paying?', options: ['Cash', 'Financing', 'Insurance'], selected: 'Cash' },
  { q: 'Scope of project?', a: 'Full Roof Replacement' },
  { q: 'When do you need this done?', options: ['ASAP', '1-3 Mo', '6+ Mo'], selected: 'ASAP' },
];

// ── PPA Steps ──────────────────────────────────────
export const ppaSteps = [
  { title: 'You Fund The Ads', desc: 'You control your ad budget directly. Minimum $50/day ad spend.' },
  { title: 'We Run Everything', desc: 'Ad creative, targeting, landing pages, and lead qualification\u2014all handled.' },
  { title: 'Appointments Hit Your Calendar', desc: 'Qualified homeowners book directly on your calendar.' },
  { title: '15 Appointments Hit Your Calendar', desc: '$2,500/mo for 15 appointments \u2014 just $167 each + ad spend.' },
];
