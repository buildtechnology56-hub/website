import { AgencyDatabase } from '../types/agency';

export const DEFAULT_PUBLIC_CONTENT: Omit<AgencyDatabase, 'inquiries'> = {
  siteContent: {
    heroHeadline: 'Transforming Ideas Into Powerful Digital Experiences.',
    heroSupportingText:
      'We build innovative websites, intelligent software solutions, and result-driven digital marketing strategies that help businesses grow, scale and succeed in the digital world.',
    heroPrimaryCta: "Let's Build Something Great",
    heroSecondaryCta: 'Explore Our Services',
    trustHeading: 'Your Technology Partner for Digital Growth',
    trustDescription:
      'From building powerful digital products to generating measurable business growth, we help brands turn their vision into reality through technology and innovation.',
    aboutHeading: 'Technology, Creativity & Strategy. All Under One Roof.',
    aboutDescription:
      'Build Technology is a digital solutions agency focused on helping businesses establish a powerful online presence. We combine modern development, creative thinking and performance-driven marketing to deliver digital solutions that create real business value.',
    aboutMission:
      'To engineer reliable, scalable digital products and performance marketing engines that turn complex business objectives into measurable commercial momentum.',
    aboutVision:
      'To serve as a trusted international technology partner for ambitious organizations across North America, Europe, the Middle East, and global growth markets.',
    aboutApproach:
      'Every engagement starts with operational clarity—aligning software architecture, intuitive user experience, and full-funnel customer acquisition from day one.',
    marketingHeadline: 'More Visibility. More Customers. More Growth.',
    marketingDescription:
      'We connect engineering precision with full-funnel acquisition across Meta Advertising, Google Advertising, technical SEO, social media growth, lead generation, and conversion rate optimization.',
    marketingCta: 'Grow Your Business',
    contactHeadline: "Let's Turn Your Ideas Into Reality.",
    contactDescription:
      'Have a project in mind? Let’s discuss how Build Technology can help your business grow.',
    contactEmail: 'buildtechnology56@gmail.com',
    phoneNumber: '+92 3322846238 Syed Mahdi Kazmi, +92 3112713755 Syed Haider Rizvi',
    footerTagline: 'Building Digital Experiences. Empowering Business Growth.',
    footerDescription:
      'International software engineering, custom web platforms, and performance digital marketing studio partnering with forward-thinking companies.',
    socialLinks: {
      linkedin: '',
      twitter: '',
      instagram: 'https://www.instagram.com/buildtechnology35?xtok=cWllOWJ2YmtucDJt',
      facebook: '',
      github: '',
    },
  },
  services: [
    {
      id: 'svc-web',
      number: '01',
      title: 'Web Development',
      description:
        'Modern, scalable and high-performance websites designed to turn visitors into customers.',
      deliverables: [
        'Business Websites',
        'Corporate Websites',
        'E-commerce Development',
        'Custom Web Applications',
        'Landing Pages',
        'Website Redesign',
        'Responsive Development',
      ],
      visualType: 'web',
      highlights:
        'Engineered for fast global load times, clean semantic SEO architecture, and conversion-ready user journeys across desktop and mobile.',
    },
    {
      id: 'svc-software',
      number: '02',
      title: 'Software Development',
      description:
        'Custom software solutions that simplify operations, automate workflows and improve business efficiency.',
      deliverables: [
        'Custom Software Development',
        'CRM Systems',
        'ERP Solutions',
        'Business Management Systems',
        'Automation Solutions',
        'Dashboard Development',
        'AI-Powered Applications',
      ],
      visualType: 'software',
      highlights:
        'Modular cloud-ready architectures, role-based internal portals, real-time analytics dashboards, and intelligent workflow automation.',
    },
    {
      id: 'svc-marketing',
      number: '03',
      title: 'Digital Marketing',
      description:
        'Strategic digital marketing solutions that increase brand awareness, reach the right audience and generate business opportunities.',
      deliverables: [
        'Social Media Marketing',
        'Facebook Marketing',
        'Instagram Marketing',
        'Content Strategy',
        'Social Media Management',
        'Brand Growth Strategy',
      ],
      visualType: 'marketing',
      highlights:
        'Cohesive editorial calendars, channel positioning, and audience nurturing built to compound brand equity across international markets.',
    },
    {
      id: 'svc-meta',
      number: '04',
      title: 'Meta Ads',
      description:
        'Performance-focused advertising campaigns designed to generate qualified leads, increase sales and maximize advertising returns.',
      deliverables: [
        'Facebook Ads',
        'Instagram Ads',
        'Lead Generation Campaigns',
        'E-commerce Advertising',
        'Retargeting Campaigns',
        'Campaign Optimization',
        'Audience Targeting',
      ],
      visualType: 'meta',
      highlights:
        'Structured creative testing, server-side conversion tracking, multi-stage retargeting funnels, and disciplined return-on-ad-spend optimization.',
    },
    {
      id: 'svc-google-seo',
      number: '05',
      title: 'Google Ads & SEO',
      description:
        'Improve your search visibility, reach high-intent customers and grow your business through data-driven search marketing.',
      deliverables: [
        'Google Search Ads',
        'YouTube Ads',
        'Performance Max Campaigns',
        'Search Engine Optimization',
        'Local SEO',
        'Google Business Profile Optimization',
        'Keyword Research',
      ],
      visualType: 'google',
      highlights:
        'High-intent search capture pairing technical on-page SEO and regional visibility with precision Google Search and Performance Max bidding.',
    },
    {
      id: 'svc-branding',
      number: '06',
      title: 'Branding & Creative Design',
      description:
        'Build a memorable brand identity with professional visual experiences that communicate your business value.',
      deliverables: [
        'Logo Design',
        'Brand Identity',
        'Graphic Design',
        'Social Media Creatives',
        'Marketing Designs',
        'Creative Campaign Assets',
      ],
      visualType: 'branding',
      highlights:
        'Distinctive visual identities, typography systems, and campaign creative toolkits built to command authority across every customer touchpoint.',
    },
  ],
  projects: [
    {
      id: 'proj-commerce',
      title: 'International Multi-Currency Storefront Architecture',
      category: 'Web & E-Commerce',
      shortDescription:
        'Demo storefront concept featuring regional currency localization, fast filterable product discovery, and streamlined checkout architecture.',
      fullSummary:
        'A conceptual demonstration of an international retail web platform engineered for rapid page transitions, multi-region currency handling, and clean editorial product merchandising.',
      technologies: ['Next.js', 'React', 'Node.js', 'Shopify', 'CSS3'],
      imageUrl: 'demo:commerce',
      projectUrl: '#contact',
      isDemo: true,
    },
    {
      id: 'proj-erp',
      title: 'Unified Operations & Resource ERP Workspace',
      category: 'Software & ERP',
      shortDescription:
        'Demo enterprise management portal integrating project pipelines, resource allocation views, and automated executive reporting.',
      fullSummary:
        'An illustrative custom software demonstration designed to unify cross-departmental workflows, task pipelines, and live operational reporting inside a single responsive web workspace.',
      technologies: ['React', 'Node.js', 'Python', 'MySQL', 'AI Technologies'],
      imageUrl: 'demo:erp',
      projectUrl: '#contact',
      isDemo: true,
    },
    {
      id: 'proj-marketing',
      title: 'Cross-Channel Acquisition & Creative Studio System',
      category: 'Digital Marketing',
      shortDescription:
        'Demo performance marketing framework combining Meta & Google attribution analytics with modular ad creative testing boards.',
      fullSummary:
        'An illustrative campaign architecture demonstrating how Build Technology pairs structured ad creative testing with regional audience attribution across Meta Ads, Google Search, and SEO landing pages.',
      technologies: ['Meta Ads', 'Google Ads', 'SEO', 'JavaScript', 'Next.js'],
      imageUrl: 'demo:marketing',
      projectUrl: '#contact',
      isDemo: true,
    },
    {
      id: 'proj-branding',
      title: 'Modular Corporate Identity & Digital Design System',
      category: 'Branding & Design',
      shortDescription:
        'Demo brand system unifying executive print collateral, responsive web typography, and digital campaign guidelines.',
      fullSummary:
        'An illustrative branding showcase displaying cohesive identity systems across corporate stationery, web interfaces, and mobile experiences.',
      technologies: ['Brand Identity', 'UI Architecture', 'HTML5', 'CSS3'],
      imageUrl: 'demo:branding',
      projectUrl: '#contact',
      isDemo: true,
    },
  ],
  testimonials: [
    {
      id: 'test-1',
      quote:
        'Placeholder slot reserved for a verified client review. Replace this entry with a genuine client endorsement, role, and company name from the Admin Dashboard once published.',
      authorName: 'Client Review Placeholder 01',
      authorRole: 'Editable Executive Role',
      companyName: 'Verified Client Organization (Pending)',
      isPlaceholder: true,
    },
    {
      id: 'test-2',
      quote:
        'Placeholder slot reserved for a verified software engineering client testimonial. Easily update or replace with authentic feedback inside the Build Technology Admin Portal.',
      authorName: 'Client Review Placeholder 02',
      authorRole: 'Editable Operations Lead',
      companyName: 'Verified Client Organization (Pending)',
      isPlaceholder: true,
    },
    {
      id: 'test-3',
      quote:
        'Placeholder slot reserved for a verified digital marketing partner story. Manage, publish, or remove testimonial entries anytime through the Admin Dashboard.',
      authorName: 'Client Review Placeholder 03',
      authorRole: 'Editable Growth Director',
      companyName: 'Verified Client Organization (Pending)',
      isPlaceholder: true,
    },
  ],
  faqs: [
    {
      id: 'faq-1',
      question: 'What services does Build Technology provide?',
      answer:
        'Build Technology delivers end-to-end digital capabilities across Web Development, Custom Software Development (CRM, ERP, automation, and AI-powered applications), Digital Marketing, Meta Ads, Google Ads & SEO, and Branding & Creative Design.',
    },
    {
      id: 'faq-2',
      question: 'Do you work with international clients?',
      answer:
        'Yes. We partner remotely and asynchronously with companies across the USA, UK, Canada, UAE, and other international markets, aligning communication and delivery milestones to your time zone.',
    },
    {
      id: 'faq-3',
      question: 'Can you build custom websites and software?',
      answer:
        'Yes. Every website, web application, CRM, ERP, or workflow automation tool we build is tailored around your exact operational requirements, user workflows, and scalability roadmap.',
    },
    {
      id: 'faq-4',
      question: 'Do you provide e-commerce solutions?',
      answer:
        'Yes. We design and engineer high-converting online stores using Shopify, WordPress/WooCommerce, and custom headless React or Next.js storefronts with multi-currency and conversion-focused checkout flows.',
    },
    {
      id: 'faq-5',
      question: 'Do you manage Facebook and Instagram advertising?',
      answer:
        'Yes. Our performance marketing team plans, designs, launches, and optimizes full-funnel Facebook and Instagram campaigns covering lead generation, e-commerce sales, audience targeting, and retargeting.',
    },
    {
      id: 'faq-6',
      question: 'Do you offer Google Ads and SEO?',
      answer:
        'Yes. We manage Google Search Ads, YouTube Ads, and Performance Max campaigns alongside technical Search Engine Optimization, Local SEO, keyword research, and Google Business Profile optimization.',
    },
    {
      id: 'faq-7',
      question: 'How can I start a project?',
      answer:
        'Complete the project inquiry form in our Contact section with your goals, required service, and timeline. Our team reviews every submission and responds promptly to schedule an initial discovery discussion.',
    },
    {
      id: 'faq-8',
      question: 'How can I request a quotation?',
      answer:
        'Submit your project scope and estimated budget range through the inquiry form below. Following a brief discovery call to clarify technical or campaign requirements, we prepare a transparent, itemized proposal.',
    },
  ],
};
