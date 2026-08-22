/**
 * ---------------------------------------------------------------------------
 * CENTRAL PROFILE DATA
 * ---------------------------------------------------------------------------
 * This is the only file you need to edit to update the content of the site.
 * Content comes from Bharath's resume.
 * ---------------------------------------------------------------------------
 */

export type Link = { label: string; href: string };

export type Project = {
  id: string;
  index: string;
  category: string;
  name: string;
  summary: string;
  problem: string;
  solution: string;
  engineering: string;
  /** Omit when there is no outcome worth stating yet. */
  result?: string;
  tech: string[];
  github?: string;
  demo?: string;
  /** Small telemetry-styled metadata shown on the card. Decorative. */
  meta?: { label: string; value: string }[];
};

export type Role = {
  id: string;
  company: string;
  title: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
  tech: string[];
};

export type SkillGroup = {
  title: string;
  items: string[];
};

export const profile = {
  name: 'Bharath K',
  displayName: 'Bharath K',
  role: '',

  /** Hero — the big line. A blinking caret is appended to it automatically. */
  headline: 'hi, bharath here.',

  /** The one word in `headline` that gets the bold, glowing highlight. */
  headlineAccent: 'bharath',

  /** Hero — primary statement. Editable. */
  statement:
    'I build software and intelligent systems with a focus on solving interesting problems and turning ideas into useful products.',

  /** Hero — secondary personality line. Editable. */
  personalityLine:
    'Code with a little obsession for speed and music.',

  /**
   * Portrait shown in the hero. Save your photo to `public/bharath.jpg`
   * (or change this path). Until the file exists, the hero shows a
   * clearly-marked placeholder frame instead of a broken image.
   */
  photo: '/bharath.jpg',
  photoAlt: 'Bharath K',

  location: 'Chennai, Tamil Nadu, India',
  availability: '',

  email: 'bharathkalimuthu1423@gmail.com',
  phone: '+91 9884454818',
  links: {
    github: 'https://github.com/BharathK05',
    linkedin: 'https://www.linkedin.com/in/bharathk0611',
    resume: '', // optional, e.g. '/resume.pdf'
  },

  interests: ['Engineering', 'F1', 'Music'],
};

/** About — written from the resume; the personal colour is yours to adjust. */
export const about = {
  lead:
    'I am a Computer Science undergraduate who likes understanding how things work, not just how to make them work.',
  paragraphs: [
    'I am in my third year of a B.Tech in Computer Science at SRM Institute of Science and Technology, and most of what I have learned has come from building things end to end, a retrieval pipeline over messy PDFs, a healthcare app that actually shipped to the App Store, a signal processing pipeline for underwater audio.',
    'My work sits in two places that keep overlapping: AI systems, retrieval, evaluation, and the unglamorous engineering that turns a promising model into something people can rely on and iOS, where I care about the interface as much as the architecture behind it.',
    'I have also contributed to open source, including a documentation fix to LlamaIndex that was reviewed, approved, and merged by the maintainers. Small, but the review loop taught me more than the change did.',
  ],
  /** Small telemetry-inspired readout in the About section. */
  readout: [
    { label: 'FOCUS', value: 'Artificial Intelligence' },
    { label: 'CURRENTLY', value: 'Bachelors in Computer Science ' },
    { label: 'BASED IN', value: 'Chennai, Tamil Nadu' },
  ],
};

export const skills: SkillGroup[] = [
  {
    title: 'Languages',
    items: ['Python', 'Swift', 'SQL'],
  },
  {
    title: 'AI / ML',
    items: [
      'PyTorch',
      'Scikit-learn',
      'Hugging Face',
      'LangChain',
      'OpenAI API',
      'Gemini API',
      'Gradio',
      'n8n',
    ],
  },
  {
    title: 'Data',
    items: ['NumPy', 'Pandas', 'Matplotlib', 'ChromaDB'],
  },
  {
    title: 'iOS Development',
    items: [
      'SwiftUI',
      'UIKit',
      'Core ML',
      'Xcode',
      'App Store Connect',
      'TestFlight',
    ],
  },
  {
    title: 'Platforms',
    items: ['Firebase', 'Supabase', 'Git', 'GitHub'],
  },
  {
    title: 'Tools & Methods',
    items: [
      'Jira',
      'Figma',
      'AutoCAD',
      'Agile (Scrum)',
      'Open Source Contribution',
      'Claude Code'
    ],
  },
];

/**
 * PROJECTS
 * Structured problem -> solution -> engineering -> result so a recruiter can
 * scan them. `result` is omitted where there is no measured outcome yet.
 */
export const projects: Project[] = [
  {
    id: 'p01',
    index: '01',
    category: 'AI ENGINEERING',
    name: 'DocuMindAI',
    summary:
      'An Enterprise grade RAG document intelligence platform that makes complex PDFs answerable in conversation.',
    problem:
      'Answers live buried inside long, dense PDFs. Finding one detail means reading the whole document, and that does not scale past a handful of files.',
    solution:
      'A retrieval augmented platform that turns a document set into a conversation, ask a question in plain language, get an answer grounded in the source material.',
    engineering:
      'LangChain orchestrates the pipeline: documents are chunked and embedded into ChromaDB, the relevant chunks are retrieved per question, and Google Gemini generates the answer from that retrieved context. Gradio provides the chat interface.',
    result: 'Check out yourself, Click the Demo link below!',
    tech: ['Python', 'Google Gemini', 'LangChain', 'ChromaDB', 'Gradio'],
    github: 'https://github.com/BharathK05/DocuMindAI',
    demo: 'https://huggingface.co/spaces/Bhrthx/DocuMindAI',
    meta: [
      { label: 'RETRIEVAL', value: 'RAG' },
      { label: 'VECTOR STORE', value: 'CHROMA' },
    ],
  },
  {
    id: 'p02',
    index: '02',
    category: 'iOS / HEALTHCARE',
    name: 'DialysisOne',
    summary:
      'A iOS app for dialysis patients, taken from first sketch through to App Store release.',
    problem:
      'Dialysis patients manage a demanding, repetitive routine, and the tools available to them are rarely built with that daily reality in mind.',
    solution:
      'A native iOS app in Swift built specifically around the patient, rather than around the clinic that treats them.',
    engineering:
      'Built with Swift and UIKit in Xcode, and shipped through App Store Connect. The interesting part was less any single technical trick than owning the whole lifecycle, design, build, review, and release, including everything App Store submission demands of you.',
    result: 'Launched on the App Store as a production release.',
    tech: ['Swift', 'UIKit', 'Xcode', 'App Store Connect'],
    github: 'https://github.com/BharathK05/Dialysis-One-App',
    demo: 'https://dialysisone.vercel.app/',
    meta: [
      { label: 'PLATFORM', value: 'iOS' },
      { label: 'STATUS', value: 'SHIPPED' },
    ],
  },
  {
    id: 'p03',
    index: '03',
    category: 'NLP / MACHINE LEARNING',
    name: 'Sentiment Analysis with RoBERTa',
    summary:
      'A transformer-based sentiment classifier with a full evaluation pipeline behind it.',
    problem:
      'Baseline sentiment models handle the easy cases and fall over on the rest, negation, sarcasm, and context they cannot see.',
    solution:
      'A sentiment analysis system built on the RoBERTa transformer, with an evaluation pipeline to prove the difference rather than assume it.',
    engineering:
      'Fine-tuned RoBERTa through Hugging Face Transformers, with the evaluation harness treated as part of the project rather than an afterthought, without it, "better" is just a claim.',
    result: 'Improved prediction quality over the baseline models.',
    tech: ['Python', 'Hugging Face Transformers', 'RoBERTa', 'NLP'],
    github: 'https://github.com/BharathK05/Sentiment-Analysis-with-RoBERTa-Model',
    demo: 'https://github.com/BharathK05/Sentiment-Analysis-with-RoBERTa-Model',
    meta: [
      { label: 'MODEL', value: 'RoBERTa' },
      { label: 'TASK', value: 'CLASSIFY' },
    ],
  },
];

export const experience: Role[] = [
  {
    id: 'e01',
    company: 'Infosys',
    title: 'iOS App Developer Intern',
    period: 'Mar 2026',
    location: 'Mysuru, Karnataka',
    summary:
      'Built and shipped an Hospital Management iOS app.',
    highlights: [
      'Built and shipped an iOS app using Swift and SwiftUI, ranked 3rd out of 10 teams.',
      'Worked in an Agile (Scrum) team using Jira, contributing to a 20% reduction in delivery delays.',
    ],
    tech: ['Swift', 'SwiftUI', 'Jira', 'Agile'],
  },
  {
    id: 'e02',
    company: 'SSN College of Engineering',
    title: 'Research Intern',
    period: 'Jun 2024 – Jul 2024',
    location: 'Chennai, Tamil Nadu',
    summary:
      'Worked on underwater acoustics — pulling a usable signal out of a very noisy channel.',
    highlights: [
      'Built an underwater audio signal processing pipeline in Python using NumPy and Matplotlib.',
      'Applied filtering techniques to improve SNR and reduce MSE.',
    ],
    tech: ['Python', 'NumPy', 'Matplotlib', 'Signal Processing'],
  },
  {
    id: 'e03',
    company: 'AutoSys Engineering Pvt Ltd',
    title: 'AutoCAD Intern',
    period: 'Dec 2023 – Jan 2024',
    location: 'Chennai, Tamil Nadu',
    summary:
      'Produced engineering drawings for Reliance Group projects, where precision was the whole job.',
    highlights: [
      'Produced precise engineering drawings using AutoCAD.',
      'Improved drafting speed and accuracy across onsite projects.',
    ],
    tech: ['AutoCAD', 'Technical Drafting'],
  },
];


/** Open source contributions, shown under Experience. */
export const openSource = [
  {
    id: 'os01',
    project: 'LlamaIndex',
    detail:
      'Identified and resolved documentation issues in the contributor resources; raised a pull request that was reviewed, approved, and merged by the maintainers.',
    tech: ['Open Source', 'Python', 'Documentation'],
  },
];

/** "Outside the Code" — the personal section. */
export const outside = {
  title: 'Outside the IDE',
  subtitle: 'There is more to engineering than code.',
  intro:
    'When I am not building software, I spend time with music. Piano mostly, the same kind of problem-solving, just with your hands.',
  body:
    'A Trinity College London certified musician. I love play pieces, recently I am spending my time in music production!, If your new to piano, you can try by playing it down!',
  /** The one deliberate F1 × piano connection. */
  connection: {
    kicker: 'ON TIMING',
    line: 'Different disciplines. Same obsession with',
    /* The single word that carries the site's only gold. */
    emphasis: 'timing.',
    left: {
      title: 'A racing lap',
      items: ['Braking point', 'Apex', 'Throttle', 'Reaction'],
    },
    right: {
      title: 'A phrase of music',
      items: ['Attack', 'Sustain', 'Release', 'Reaction'],
    },
    note: 'Both are decided in the same fraction of a second. Both are ruined by hesitation.',
  },
};

export const contact = {
  title: "Let's Work Together",
  message:
    'I am always happy to talk about interesting problems, internships, engineering roles, or collaborations. The fastest way to reach me is email.',
};

export const nav: Link[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];
