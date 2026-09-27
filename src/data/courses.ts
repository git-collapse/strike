// Central course catalog + domain types.
// Extracted from CourseGrid so the data model is decoupled from the UI and can
// be shared by the grid, the cards, and the course-details modal.
//
// Metadata policy (no fabrication):
//  - `tags`   : topic classification, read directly from each course's own title
//               and description — used by the category filters and keyword search.
//  - `level`  : difficulty, taken from the scope each course states about itself
//               (e.g. "from scratch / beginner" → All Levels, "mastery / advanced").
//  - `mentor` : instructor, assigned only where a mentor's OWN stated track in
//               Mentors.tsx clearly covers the topic (Rohit Negi → DSA & System
//               Design; Aditya Tandon → Web Development, DevOps & GenAI). Left
//               undefined for cross-track or unlisted topics rather than guessed.

export type CourseTopic =
  | 'DSA'
  | 'System Design'
  | 'Generative AI'
  | 'DevOps'
  | 'Web Development'
  | 'Blockchain';

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export interface CourseData {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  duration?: string;
  hours?: string;
  prerequisites?: string;
  modules?: string;
  originalPrice?: number;
  currentPrice?: number;
  discountPercentage?: string;
  grantPrice?: number;
  isUpcoming?: boolean;
  category: 'paid' | 'free' | 'upcoming';
  isYouTubeFree?: boolean;
  // When true the course data is retained but withheld from every rendered
  // list (used to pull a course from the catalog without deleting its record).
  hidden?: boolean;
  href: string;
  syllabus?: { title: string; modules?: number }[];
  tags?: CourseTopic[];
  mentor?: string;
  level?: CourseLevel;
  featured?: boolean;
}

// Minimal mentor lookup for card/detail display. Names, roles and photos mirror
// the verified entries in Mentors.tsx (single source of who these people are).
export const MENTORS: Record<string, { name: string; role: string; initials: string; image?: string }> = {
  'Rohit Negi': { name: 'Rohit Negi', role: 'Founder & Lead Instructor', initials: 'RN', image: '/rohit_negi.jpg' },
  'Aditya Tandon': { name: 'Aditya Tandon', role: 'Co-Founder & Senior Instructor', initials: 'AT', image: '/aditya_tandon.jpg' },
};

export const allCourses: CourseData[] = [
  {
    id: 'thunder-web',
    title: 'Thunder: 100 Days of Code',
    description: 'Web Development + System Design + Security + DevOps',
    thumbnail: 'https://dolia18uq98lp.cloudfront.net/course/028bc14e-679b-4ca7-8ee8-22ce93a522d6.png',
    duration: 'Validity: 2 Years',
    hours: '100+ Hours',
    originalPrice: 7999,
    currentPrice: 5499,
    grantPrice: 3499,
    isUpcoming: false,
    category: 'paid',
    tags: ['Web Development', 'System Design', 'DevOps'],
    level: 'All Levels',
    featured: true,
    href: 'https://strikes.in/course/thunder-web',
    syllabus: [
      { title: 'PHASE 1: JavaScript Mastery - Module 1: Introduction to JavaScript' },
      { title: 'Module 2: JavaScript Fundamentals' },
      { title: 'Module 3: Control Flow' },
      { title: 'Module 4: Functions and Execution Context' },
      { title: 'Module 5: Call Stack and Closures' },
      { title: 'Module 6: Data Types Deep Dive' },
      { title: 'Module 7: Objects in JavaScript' },
    ],
  },
  {
    id: 'devops',
    title: 'DevOps: From Foundations to Production',
    description: 'Linux + Git + CI/CD + Docker + Kubernetes + Terraform + Cloud + Observability',
    thumbnail: 'https://dolia18uq98lp.cloudfront.net/course/3047d244-fa7e-4a7b-8dc4-4169948a9742.png',
    duration: 'Validity: 2 Years',
    hours: '40+ Hours | 12 Modules',
    originalPrice: 4999,
    currentPrice: 2999,
    grantPrice: 1799,
    isUpcoming: false,
    category: 'paid',
    tags: ['DevOps'],
    mentor: 'Aditya Tandon',
    level: 'Intermediate',
    href: 'https://strikes.in/course/devops',
    syllabus: [
      { title: 'Module 1: DevOps Foundations & Linux' },
      { title: 'Module 2: Git & Version Control Mastery' },
      { title: 'Module 3: Networking, DNS & TLS Essentials' },
      { title: 'Module 4: CI/CD with Jenkins & GitHub Actions' },
      { title: 'Module 5: Docker & Containerisation' },
      { title: 'Module 6: Kubernetes Core' },
      { title: 'Module 7: Kubernetes in Production' },
    ],
  },
  {
    id: 'combo',
    title: 'Complete DSA + GenAI Combo: From Algorithms to AI Agents',
    description: 'Master the complete tech stack! This comprehensive combo course combines Data Structures & Algorithms with Generative AI Engineering. Start with C++ and DSA fundamentals, solve 300+ problems, then dive into building autonomous AI agents. Perfect for those who want to become full-stack AI engineers with strong algorithmic foundations.',
    thumbnail: 'https://dolia18uq98lp.cloudfront.net/course/61baa760-861e-4fbc-bce4-557dc37bd941.png',
    duration: 'Validity : 3 years',
    hours: '100+ hrs',
    originalPrice: 7999,
    currentPrice: 5499,
    grantPrice: 3999,
    isUpcoming: false,
    category: 'paid',
    tags: ['DSA', 'Generative AI'],
    level: 'All Levels',
    href: 'https://strikes.in/course/combo',
    syllabus: [
      { title: 'Getting Started: Your Journey Overview' },
      { title: 'Part 1: C++ & DSA Fundamentals' },
      { title: 'Part 2: Data Structures Deep Dive' },
      { title: 'Part 3: Advanced Algorithms' },
      { title: 'Part 4: AI Fundamentals & Theory' },
      { title: 'Part 5: Building AI Applications' },
      { title: 'Part 6: Advanced AI & Multi-Agent Systems' },
    ],
  },
  {
    id: '689ecf2b6793e719cdee9efc',
    title: 'Data Structures and Algorithms in C++: From Beginner to Advanced',
    description: 'Welcome to the ultimate guide to Data Structures and Algorithms (DSA) in C++! This comprehensive course is designed to take you from the basic principles of programming to a level of proficiency where you can confidently solve complex computational problems. We will start with a solid foundation in C++, explore fundamental and advanced data structures, master key algorithmic paradigms, and even touch upon modern applications.',
    thumbnail: 'https://dolia18uq98lp.cloudfront.net/course/caa46009-ca64-4dce-94d7-7357e6bdc251.png',
    duration: 'Validity: 3 Years',
    hours: '100+ hrs',
    originalPrice: 4999,
    currentPrice: 3999,
    grantPrice: 2499,
    isUpcoming: false,
    category: 'paid',
    tags: ['DSA'],
    mentor: 'Rohit Negi',
    level: 'All Levels',
    href: 'https://strikes.in/course/689ecf2b6793e719cdee9efc',
    syllabus: [
      { title: 'C++ Foundations for DSA' },
      { title: 'Core Concepts of Algorithmic Analysis' },
      { title: 'Basic Data Structures & Algorithms' },
      { title: 'The C++ Standard Template Library (STL)' },
      { title: 'Object-Oriented Programming (OOP) for Data Structures' },
      { title: 'Linear Data Structures' },
      { title: 'Non-Linear Data Structures' },
    ],
  },
  {
    id: '689ee05f1d8fc292bd27df7c',
    title: 'The Complete Generative AI Engineering Bootcamp: Build & Deploy Autonomous AI Agents',
    description: 'This is the definitive course for anyone serious about building the next generation of AI. We will take you on a comprehensive journey from zero to hero, starting with the fundamental concepts of Generative AI and the Transformer architecture. You will then immediately apply this knowledge to build, test, and deploy sophisticated, autonomous AI agents capable of reasoning, planning, and using tools to solve complex problems.',
    thumbnail: 'https://dolia18uq98lp.cloudfront.net/course/e5d4d382-6966-4928-bd0b-955b56fdbf14.jpg',
    duration: 'Validity: 3 Years',
    hours: '50+ hrs',
    originalPrice: 4999,
    currentPrice: 3999,
    grantPrice: 2399,
    isUpcoming: false,
    category: 'paid',
    tags: ['Generative AI'],
    mentor: 'Aditya Tandon',
    level: 'All Levels',
    href: 'https://strikes.in/course/689ee05f1d8fc292bd27df7c',
    syllabus: [
      { title: 'The New Age of AI: Introduction to Generative AI' },
      { title: 'How Language Models Think: Tokens, Prompts, and Predictions' },
      { title: 'Unlocking the Black Box: An Intuition for Deep Learning' },
      { title: 'The Engine of Modern LLMs: The Transformer Architecture' },
      { title: 'Representing Meaning: Embeddings & Vector Databases' },
      { title: 'The Modern AI Stack: Introduction to LangChain' },
      { title: 'Building the Knowledge Base for Agents: RAG In-Depth' },
    ],
  },
  {
    id: 'nexus-webdev',
    title: 'Web Development',
    description: 'Complete recorded course on Web Development from Beginner to Advance Level. Gain hands-on experience in HTML, CSS, JavaScript and full-stack development with React, TypeScript, Next.js, Node.js and MongoDB. Build robust web applications, launch them to production, and develop the skills to become a sought-after developer.',
    thumbnail: 'https://dolia18uq98lp.cloudfront.net/course/d3f702b7-3268-4796-8d50-2a74b9825272.png',
    duration: 'Recorded',
    hours: '2024 Course',
    originalPrice: 5999,
    currentPrice: 3999,
    grantPrice: 2999,
    isUpcoming: false,
    category: 'paid',
    tags: ['Web Development'],
    mentor: 'Aditya Tandon',
    level: 'All Levels',
    href: 'https://strikes.in/course/nexus-webdev',
    syllabus: [
      { title: 'Part 1: Web Development - Internet, HTML & CSS' },
      { title: 'Part 2: Web Development - JavaScript Fundamentals' },
      { title: 'Part 3: Web Development - React, TypeScript & Next.js' },
      { title: 'Part 4: Web Development - Backend & Databases' },
      { title: 'Part 5: Web Development - Advance Projects with Deployment' },
      { title: 'Part 6: Web Development - Testing, Deployment & Career Launch' },
    ],
  },
  {
    id: 'nexus-blockchain',
    title: 'Blockchain',
    description: 'Complete recorded course on Blockchain from fundamentals to advanced. Explore blockchain internals, cryptography, Ethereum, Solana, smart contracts with Solidity, and Rust. Build and deploy full decentralized applications (dApps) and gain in-demand blockchain skills.',
    thumbnail: 'https://dolia18uq98lp.cloudfront.net/course/55c5eb3f-0b95-47c0-aa58-55868156d8c8.png',
    duration: 'Recorded',
    hours: 'Recorded Course',
    originalPrice: 5999,
    currentPrice: 3999,
    grantPrice: 2999,
    isUpcoming: false,
    category: 'paid',
    tags: ['Blockchain'],
    level: 'All Levels',
    href: 'https://strikes.in/course/nexus-blockchain',
    syllabus: [
      { title: 'Part 1: Blockchain - Fundamentals & Cryptography' },
      { title: 'Part 2: Blockchain - Ethereum, Solana & Smart Contracts' },
      { title: 'Part 3: Blockchain - Rust, Advance & Deployment' },
      { title: 'Part 4: Blockchain - Security, DeFi & Real-World dApps' },
    ],
  },
  {
    id: 'lld',
    title: 'System Design',
    description: 'Master Object-Oriented Design, Design Patterns, SOLID Principles, and Schema Design with real-world case studies.',
    thumbnail: 'https://dolia18uq98lp.cloudfront.net/course/1eaa1b1d-c354-4f80-81bf-d4c35cc2b5a2.jpeg',
    duration: 'Live & Recorded',
    hours: 'Full Playlist',
    isUpcoming: false,
    category: 'free',
    isYouTubeFree: true,
    tags: ['System Design'],
    mentor: 'Rohit Negi',
    level: 'Intermediate',
    href: 'https://youtube.com/playlist?list=PLQEaRBV9gAFvzp6XhcNFpk1WdOcyVo9qT',
    syllabus: [
      { title: 'Object-Oriented Design Foundations' },
      { title: 'SOLID Principles in Practice' },
      { title: 'Core Design Patterns' },
      { title: 'Schema & Database Design' },
      { title: 'Real-World Case Studies' },
    ],
  },
  {
    id: 'dsa-java',
    title: 'Data Structures & Algorithms in Java',
    description: 'Complete DSA from scratch to advanced in Java covering Collections framework, algorithmic paradigms, and interview problems.',
    duration: 'Live & Recorded',
    hours: 'Upcoming Course',
    currentPrice: 0,
    isUpcoming: true,
    category: 'upcoming',
    tags: ['DSA'],
    mentor: 'Rohit Negi',
    level: 'All Levels',
    href: 'https://strikes.in/course/dsa-java',
  },
  {
    id: 'fullstack-go',
    title: 'Full Stack Development with Go',
    description: 'Build ultra-fast, concurrent web applications, microservices, and modern frontend integrations with Golang and React.',
    duration: 'Live & Recorded',
    hours: 'Upcoming Course',
    currentPrice: 0,
    isUpcoming: true,
    category: 'upcoming',
    tags: ['Web Development'],
    mentor: 'Aditya Tandon',
    level: 'Intermediate',
    href: 'https://strikes.in/course/fullstack-go',
  },
  {
    id: 'hld',
    title: 'HLD: High Level Design',
    description: 'Architect distributed, fault-tolerant, planetary-scale systems from load balancers to distributed databases and message brokers.',
    duration: 'Live & Recorded',
    hours: 'Upcoming Course',
    currentPrice: 0,
    isUpcoming: true,
    category: 'upcoming',
    tags: ['System Design'],
    mentor: 'Rohit Negi',
    level: 'Advanced',
    href: 'https://strikes.in/course/hld',
  },
  {
    id: 'dsa-cpp',
    title: 'Data Structures & Algorithms in C++',
    description: 'Master problem solving, competitive programming foundations, and tech interview questions in modern C++.',
    thumbnail: 'https://dolia18uq98lp.cloudfront.net/course/caa46009-ca64-4dce-94d7-7357e6bdc251.png',
    duration: 'Live & Recorded',
    hours: 'Full Playlist',
    isUpcoming: false,
    category: 'free',
    isYouTubeFree: true,
    tags: ['DSA'],
    mentor: 'Rohit Negi',
    level: 'All Levels',
    href: 'https://www.youtube.com/playlist?list=PLQEaRBV9gAFu4ovJ41PywklqI7IyXwr01',
    syllabus: [
      { title: 'Problem Solving & Complexity Foundations' },
      { title: 'Arrays, Strings & Two Pointers' },
      { title: 'Recursion & Backtracking' },
      { title: 'Trees, Graphs & Dynamic Programming' },
      { title: 'Interview Problem Patterns' },
    ],
  },
  {
    id: 'spring boot',
    title: 'Spring Boot Full Course',
    description: 'Build production-grade Java backends with Spring Boot — REST APIs, dependency injection, Spring Data JPA, authentication, and deployment-ready microservices.',
    duration: 'Live & Recorded',
    hours: 'Upcoming Course',
    currentPrice: 0,
    isUpcoming: true,
    category: 'upcoming',
    tags: ['Web Development'],
    level: 'Intermediate',
    href: 'https://strikes.in/course/spring%20boot',
  },
];

// Topics that actually appear in the (visible) catalog, in a stable order for
// the filter row. Derived from real course tags — never a hard-coded fiction.
const TOPIC_ORDER: CourseTopic[] = ['DSA', 'System Design', 'Generative AI', 'DevOps', 'Web Development', 'Blockchain'];

export const availableTopics = (courses: CourseData[] = allCourses): CourseTopic[] => {
  const present = new Set<CourseTopic>();
  courses.forEach((c) => {
    if (c.hidden) return;
    c.tags?.forEach((t) => present.add(t));
  });
  return TOPIC_ORDER.filter((t) => present.has(t));
};

// Related courses = same topic tag, excluding the course itself and hidden ones.
export const relatedCourses = (course: CourseData, limit = 3): CourseData[] => {
  const tags = new Set(course.tags ?? []);
  return allCourses
    .filter((c) => !c.hidden && c.id !== course.id && (c.tags ?? []).some((t) => tags.has(t)))
    .slice(0, limit);
};
