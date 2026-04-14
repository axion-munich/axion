export type NavLink = {
  id: string;
  label: string;
};

export type Highlight = {
  title: string;
  text: string;
};

export type Track = {
  name: string;
  description: string;
  experienceLabel: string;
  experienceItems: string[];
  focusLabel: string;
  focusAreas: string[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type StartupTestimonial = {
  quote: string;
  founder: string;
  title: string;
  company: string;
  logo: string;
  logoAlt: string;
};

export const navLinks: NavLink[] = [
  { id: "about", label: "Mission" },
  { id: "students", label: "Students" },
  { id: "start-ups", label: "Start–Ups" },
];

export const hero = {
  kicker: "Based in Munich",
  title: "Students consult, founders scale, investors discover",
  subtitle:
    "axion is a Munich-based, student-driven consulting club where students from Germany’s top universities tackle real start-up challenges. We provide tailored support in strategy and operational consulting, focusing on areas such as market entry, organizational development, financial management, and fundraising preparation. Our interdisciplinary teams of students leverage diverse academic backgrounds to deliver actionable solutions for client start-ups. Beyond consulting, we serve as a bridge to Europe’s venture capital ecosystem. We prepare start-ups for fundraising and connect them with leading VCs, business angels, and innovation networks.",
  ctaPrimary: { label: "For Students", href: "#students" },
  ctaSecondary: { label: "For Start-ups", href: "#start-ups" },
};

export const missionText =
  "Our mission is to turn early-stage start-up ideas into reality through student led consulting while giving students the opportunity to create real impact and gain hands-on experience.";

export const studentsIntro = "Why us?";

export const studentHighlights: Highlight[] = [
  {
    title: "Why Join",
    text: "At axion, you’ll gain hands-on experience by working directly with real start-ups. You’ll develop skills in strategy and operational consulting, and entrepreneurship while building a strong network in founders ecosystem for your future career.",
  },
  {
    title: "Who We’re Looking For",
    text: "We welcome motivated students from all German universities and study backgrounds, from business and economics to engineering, informatics, and the social sciences. What matters most is your curiosity, drive, and willingness to learn.",
  },
  {
    title: "What You’ll Do",
    text: "You’ll join a project team, working on tailored operational or strategic solutions for a real early-stage start-up. You’ll also take part in workshops, providing you with essential training to set you up for a successful consulting project. Finally, you will participate in our in-person events, where you’ll meet other students, present your project work and join us for the afterparty.",
  },
  {
    title: "Time Commitment",
    text: "Expect to spend a maximum of up to 10 hours per week, including project work, workshops, external events and team activities.",
  },
];

export const tracks: Track[] = [
  {
    name: "Summary",
    description:
      "In the Consulting Track, you will work in interdisciplinary teams on real projects, tackling the strategic and operational challenges faced by start-ups across various industries. You’ll develop solutions that help start-ups grow, raise capital, and strengthen their position in Munich’s start-up ecosystem.",
    experienceLabel: "Your experience with us:",
    experienceItems: [
      "Work in project teams (3–5 people)",
      "Deliver strategic recommendations, analytical reports, market analyses, and guide start-ups through the implementation of these insights",
    ],
    focusLabel: "Core Focus Areas:",
    focusAreas: [
      "Market & Competitor analysis",
      "Go-to-market Design",
      "Pricing & Fundraising strategies",
      "Budget Strategy & Profitability",
      "Operational Transformation",
      "Investor (VC) Pitch Preparation",
    ],
  },
];

export const joinRequirementsIntro =
  "Want to join the team? Here is everything you need to bring with you:";

export const joinRequirements: Highlight[] = [
  {
    title: "Motivation",
    text: "You are a highly motivated student who is interested in the start-up ecosystem and eager to take ownership and learn.",
  },
  {
    title: "Student",
    text: "You are enrolled at a German university or other tertiary education facility.",
  },
  {
    title: "Contribution",
    text: "You are a team player, ready to commit yourself during the project and stick to deadlines.",
  },
];

export const startupSupportText =
  "axion is a Munich-based, student-driven consulting club where students from Germany’s top universities tackle real start-up challenges. We provide tailored support in strategy and operational consulting, focusing on areas such as market entry, organizational development, financial management, and fundraising preparation. Our interdisciplinary teams of students leverage diverse academic backgrounds to deliver actionable solutions for client start-ups. Beyond consulting, we serve as a bridge to Europe’s venture capital ecosystem. We prepare start-ups for fundraising and connect them with leading VCs, business angels, and innovation networks.";

export const whyUsLabel = "Why us?";

export const applicationStatus = {
  title: "Project applications are open year-round.",
  details: "",
  ctaLabel: "Contact us",
  ctaHref: "#contacts",
};

export const startupTestimonials: StartupTestimonial[] = [
  {
    quote:
      "Axion's market analysis and KPI framework gave us a much stronger story for investors and a real edge in our funding round.",
    founder: "Arsenii Bohomol",
    title: "Founder of Baton Gourmet S.L.",
    company: "Baton",
    logo: "/startup-logos/baton.png",
    logoAlt: "Baton logo",
  },
  {
    quote:
      "Axion helped us automate our processes and build an AI-powered go-to-market strategy ready for scale.",
    founder: "Ralf Breitenfeldt",
    title: "Founder of HCM4ALL",
    company: "HCM4ALL",
    logo: "/startup-logos/hcm4all.jpg",
    logoAlt: "HCM4ALL logo",
  },
];

export const studentFaqs: FaqItem[] = [
  {
    question: "Do I need prior consulting experience to apply?",
    answer:
      "No prior consulting experience is required. We provide all new members with the training, workshops, and mentorship needed to succeed. While prior experience is a plus, your motivation and curiosity matter most.",
  },
  {
    question: "I don’t study economics or a related field. Can I still apply?",
    answer:
      "Absolutely! We welcome students from all academic backgrounds, because we believe that interdisciplinarity is what makes consulting truly valuable. Since we work with start-ups across a wide range of industries, every field of study brings unique insights and skills that can make a real difference in our projects.",
  },
  {
    question: "Do I need to speak German to join?",
    answer:
      "No. We welcome both international and domestic students, and all communication within our projects, workshops, and final presentations is conducted in English.",
  },
  {
    question: "What is the application deadline and how does the recruitment process look like?",
    answer:
      "Applications for Summer Semester 2026 will open on April 13, 2026. The application deadline is on May 6, 2026 EOD. We will be reviewing applications as soon as they arrive, so early applications are encouraged. If shortlisted, we’ll invite you to a short video interview during our interview weekend on May 7–9, 2026. You’ll hear from us on May 11, 2026 regarding the admission decision.",
  },
];

export const startupFaqs: FaqItem[] = [
  {
    question:
      "What does the project journey with us look like, and how much of your time will it take?",
    answer:
      "Our projects kick off on May 18, 2026 after we onboard and train our new members through workshops led by experienced consultants from top-tier consulting firms and internal mentors. Over eight weeks, our dedicated team will work on tailored solutions for your startup, with final results delivered by mid July. To stay aligned, we schedule brief weekly check-ins, requiring about one to two hours of your time each week for feedback and discussions.",
  },
  {
    question: "What are the costs of working with us, and how significant are they for a start-up?",
    answer:
      "We charge a small project fee well below €1000, which is considerably lower than the rates of most student consultancies and professional consultancies. Our focus is on making high-quality consulting accessible to early-stage startups rather than generating profit.",
  },
  {
    question: "What sets us apart from traditional student consultancies?",
    answer:
      "Unlike many student consultancies that provide overly theoretical advice, we focus on creating solutions that are realistic, relevant, and ready to be put into action. At axion, we combine strategic insights with operational analysis and actively support you throughout the implementation of our recommendations. Moreover, we dedicate our work exclusively to the early-stage start-ups, helping founders turn ideas into real growth through hands-on support at a fraction of the cost charged by most student consultancies. We also connect you to Munich’s vibrant student ecosystem, including start-ups, investors, and other initiatives that can help your venture grow. Think of us not just as consultants but as your start-up’s first friends in Munich’s innovation scene.",
  },
  {
    question:
      "Beyond consulting, how do we support your fundraising efforts and connect you with venture capital networks?",
    answer:
      "Beyond project work, we actively connect startups with Munich’s entrepreneurial ecosystem. Through our network of mentors, university initiatives, and early-stage investors, we help you reach the right people for your next funding steps. As part of this support, we work with you to prepare and refine your pitch deck so that your story and strategy resonate with potential investors and partners",
  },
];


export const contact = {
  email: "contact@axion-munich.de",
  phone: "+49 17 662 973 685",
  line: "Email: contact@axion-munich.de Phone number: +49 17 662 973 685",
  instagram: "https://www.instagram.com/axion_munich",
  linkedin: "https://www.linkedin.com/company/axion-munich",
};
