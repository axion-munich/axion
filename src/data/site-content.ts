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

export type TeamMember = {
  name: string;
  role: string;
  image: string;
};

export const navLinks: NavLink[] = [
  { id: "about", label: "Mission" },
  { id: "students", label: "Students" },
  { id: "start-ups", label: "Start–Ups" },
];

export const hero = {
  kicker: "Based in Munich",
  title: "Student consult, founders scale, investors discover",
  subtitle:
    "axion is a Munich-based, student-driven consulting club where students from Germany’s top universities tackle real start-up challenges. We provide tailored support in strategy and operational consulting, focusing on areas such as market entry, organizational development, financial management, and fundraising preparation. Our interdisciplinary teams of students leverage diverse academic backgrounds to deliver actionable solutions for client start-ups. Beyond consulting, we serve as a bridge to Europe’s venture capital ecosystem. We prepare start-ups for fundraising and connect them with leading VCs, business angels, and innovation networks.",
  ctaPrimary: { label: "For Students", href: "#students" },
  ctaSecondary: { label: "For Start-ups", href: "#start-ups" },
};

export const missionText =
  "As a Munich-based student initiative, we connect ambitious founders with resources and networks by running student-led consulting projects and building on the innovative environment of the city’s universities. Our mission is to empower early-stage startups with tailored consulting and access to Europe’s venture network, while at the same time providing students from German universities with hands-on experience across consulting, investment and entrepreneurial domains. We create a unique platform where founders receive the strategic and operational support they need to grow and students gain the knowledge, skills, and connections to launch their own careers – all within one organization.";

export const studentsIntro = "Why us? –";

export const studentHighlights: Highlight[] = [
  {
    title: "Why Join?",
    text: "At axion, you’ll gain hands-on experience by working directly with real start-ups and investors. You’ll develop skills in strategy and operational consulting, and entrepreneurship while building a strong network in founders ecosystem for your future career.",
  },
  {
    title: "Who We’re Looking For?",
    text: "We welcome motivated students from all German universities and study backgrounds, from business and economics to engineering, informatics, and the social sciences. What matters most is your curiosity, drive, and willingness to learn.",
  },
  {
    title: "What You’ll Do?",
    text: "You’ll join interdisciplinary project teams, tackling real challenges from early-stage start-ups. You’ll also take part in workshops and live pitching events with investors to prepare for careers in consulting, venture capital, or entrepreneurship.",
  },
  {
    title: "Time Commitment?",
    text: "Expect to spend a maximum of up to 10 hours per week, including project work, workshops, external events and team activities.",
  },
];

export const tracks: Track[] = [
  {
    name: "Consulting Track",
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
  {
    name: "Venture Track",
    description:
      "In the Venture Track, you will identify and evaluate start-ups, develop strategic insights through industry research, and foster collaboration across the venture ecosystem.",
    experienceLabel: "Your experience with us:",
    experienceItems: [
      "Scout for start-ups for potential cooperation via databases, LinkedIn, incubators, pitch events etc.",
      "Work on the research reports and their publishing within the VC community",
    ],
    focusLabel: "Core Focus Areas:",
    focusAreas: [
      "Start-up Ecosystem research",
      "Market and Trend Mapping",
      "Start-up evaluation and investment screening",
      "Development of the Start-up Industry Insights Report",
    ],
  },
];

export const joinRequirementsIntro =
  "Want to join the team? Here is everything you need to bring with you:";

export const joinRequirements: Highlight[] = [
  {
    title: "Motivation:",
    text: "You are eager to gain hands-on experience with real consulting projects and passionate about the start-up ecosystem. At axion, you can see the tangible impact of your recommendations in a short time and contribute to shaping the future. What matters most is your drive – with the right motivation, you can create meaningful change and global impact!",
  },
  {
    title: "Student:",
    text: "We welcome students from all German universities and tertiary education facilities – diversity is key to our work. You don’t need to come from an economics or business background: we are looking for motivated students from a wide range of study fields, since innovative consulting benefits from different perspectives.",
  },
  {
    title: "Contribution:",
    text: "During your time with axion, you can expect a variety of exciting activities such as workshops, team events, and Demo Days in addition to your consulting projects. In your first semester, participation in our mandatory courses and workshops is required to ensure a strong foundation. On average, you should plan to dedicate about 10 hours per week to this initiative.",
  },
];

export const startupSupportText =
  "axion is a Munich-based, student-driven consulting club where students from Germany’s top universities tackle real start-up challenges. We provide tailored support in strategy and operational consulting, focusing on areas such as market entry, organizational development, financial management, and fundraising preparation. Our interdisciplinary teams of students leverage diverse academic backgrounds to deliver actionable solutions for client start-ups. Beyond consulting, we serve as a bridge to Europe’s venture capital ecosystem. We prepare start-ups for fundraising and connect them with leading VCs, business angels, and innovation networks.";

export const whyUsLabel = "Why us? –";

export const applicationStatus = {
  title: "Applications are closed for Winter 2025/26",
  details: "",
  ctaLabel: "Interested? Contact us",
  ctaHref: "#contacts",
};

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
      "We accept applications on a rolling basis — so early applications are encouraged. You’ll hear back from us within a week after submitting your application. If shortlisted, we’ll invite you to a short video interview to learn more about you and your interests. Successful applicants will join a project team for the semester.",
  },
];

export const startupFaqs: FaqItem[] = [
  {
    question:
      "What does the project journey with us look like, and how much of your time will it take?",
    answer:
      "Our projects kick off in late November after we onboard and train our new members through workshops led by experienced consultants from top-tier consulting firms and internal mentors. Over eight weeks, your dedicated team will work on tailored solutions for your startup, with final results delivered by the end of January. To stay aligned, we schedule brief weekly check-ins, requiring about one to two hours of your time each week for feedback and discussions.",
  },
  {
    question: "What are the costs of working with us, and how significant are they for a start-up?",
    answer:
      "We charge a small project fee well below €1000, which is considerably lower than the rates of most student consultancies and professional consultancies. Our focus is on making high-quality consulting accessible to early-stage startups rather than generating profit.",
  },
  {
    question: "What sets us apart from traditional student consultancies?",
    answer:
      "Unlike many student consultancies that provide overly theoretical advice, we focus on creating solutions that are realistic, relevant, and ready to be put into action. At Axion, we combine strategic insights with operational analysis and actively support you throughout the implementation of our recommendations. Moreover, we dedicate our work exclusively to the early-stage start-ups, helping founders turn ideas into real growth through hands-on support at a fraction of the cost charged by most student consultancies. We also connect you to Munich’s vibrant student ecosystem, including startups, investors, and other initiatives that can help your venture grow. Think of us not just as consultants but as your startup’s first friends in Munich’s innovation scene.",
  },
  {
    question:
      "Beyond consulting, how do we support your fundraising efforts and connect you with venture capital networks?",
    answer:
      "Beyond project work, we actively connect startups with Munich’s entrepreneurial ecosystem. Through our network of mentors, university initiatives, and early-stage investors, we help you reach the right people for your next funding steps. As part of this support, we work with you to prepare and refine your pitch deck so that your story and strategy resonate with potential investors and partners",
  },
];

export const stats = [
  { label: "Members", value: "14" },
  { label: "Nationalities", value: "8" },
];

export const teamMembers: TeamMember[] = [
  {
    name: "Fedor Olshevskiy",
    role: "Founder",
    image: "https://thb.tildacdn.net/tild6236-3563-4532-b932-376230656335/image1.jpg",
  },
  {
    name: "Matvei Bobreshov",
    role: "Founder",
    image: "https://thb.tildacdn.net/tild6466-3263-4134-b132-613639636436/image2.jpg",
  },
  {
    name: "Andrey Mikhaylenko",
    role: "Founder",
    image: "https://thb.tildacdn.net/tild6661-3736-4839-a262-646262353361/image3.jpg",
  },
  {
    name: "Alexandr Kuprienko",
    role: "Founder",
    image: "https://thb.tildacdn.net/tild3238-6532-4935-b261-313663363761/image4.jpg",
  },
  {
    name: "Paul Müller",
    role: "Board Member",
    image: "https://thb.tildacdn.net/tild3239-6265-4261-a464-633934626434/image5.jpg",
  },
  {
    name: "Kirill Khvastov",
    role: "Board Member",
    image: "https://thb.tildacdn.net/tild3133-6533-4637-b535-336466626635/image6.jpg",
  },
];

export const contact = {
  email: "contact@axion-munich.de",
  phone: "+49 17 662 973 685",
  line: "Email: contact@axion-munich.de Phone number: +49 17 662 973 685",
  instagram:
    "https://www.instagram.com/axion.munich?igsh=MXNyaWo3bjIwNnMzaA%3D%3D&utm_source=qr",
  linkedin: "https://www.linkedin.com/company/axion-munich",
};
