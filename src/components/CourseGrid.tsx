import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import CourseCard from './CourseCard';
import type { CourseData } from './CourseCard';

// VERIFIED COURSE CATALOG
const allCourses: CourseData[] = [
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
    
    href: 'https://strikes.in/course/thunder-web',
    syllabus: [
      { title: 'PHASE 1: JavaScript Mastery - Module 1: Introduction to JavaScript' },
      { title: 'Module 2: JavaScript Fundamentals' },
      { title: 'Module 3: Control Flow' },
      { title: 'Module 4: Functions and Execution Context' },
      { title: 'Module 5: Call Stack and Closures' },
      { title: 'Module 6: Data Types Deep Dive' },
      { title: 'Module 7: Objects in JavaScript' },
    ]
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
    
    href: 'https://strikes.in/course/devops',
    syllabus: [
      { title: 'Module 1: DevOps Foundations & Linux' },
      { title: 'Module 2: Git & Version Control Mastery' },
      { title: 'Module 3: Networking, DNS & TLS Essentials' },
      { title: 'Module 4: CI/CD with Jenkins & GitHub Actions' },
      { title: 'Module 5: Docker & Containerisation' },
      { title: 'Module 6: Kubernetes Core' },
      { title: 'Module 7: Kubernetes in Production' },
    ]
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
    
    href: 'https://strikes.in/course/combo',
    syllabus: [
      { title: 'Getting Started: Your Journey Overview' },
      { title: 'Part 1: C++ & DSA Fundamentals' },
      { title: 'Part 2: Data Structures Deep Dive' },
      { title: 'Part 3: Advanced Algorithms' },
      { title: 'Part 4: AI Fundamentals & Theory' },
      { title: 'Part 5: Building AI Applications' },
      { title: 'Part 6: Advanced AI & Multi-Agent Systems' },
    ]
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
    
    href: 'https://strikes.in/course/689ecf2b6793e719cdee9efc',
    syllabus: [
      { title: 'C++ Foundations for DSA' },
      { title: 'Core Concepts of Algorithmic Analysis' },
      { title: 'Basic Data Structures & Algorithms' },
      { title: 'The C++ Standard Template Library (STL)' },
      { title: 'Object-Oriented Programming (OOP) for Data Structures' },
      { title: 'Linear Data Structures' },
      { title: 'Non-Linear Data Structures' },
    ]
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
    
    href: 'https://strikes.in/course/689ee05f1d8fc292bd27df7c',
    syllabus: [
      { title: 'The New Age of AI: Introduction to Generative AI' },
      { title: 'How Language Models Think: Tokens, Prompts, and Predictions' },
      { title: 'Unlocking the Black Box: An Intuition for Deep Learning' },
      { title: 'The Engine of Modern LLMs: The Transformer Architecture' },
      { title: 'Representing Meaning: Embeddings & Vector Databases' },
      { title: 'The Modern AI Stack: Introduction to LangChain' },
      { title: 'Building the Knowledge Base for Agents: RAG In-Depth' },
    ]
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
    
    href: 'https://strikes.in/course/nexus-webdev',
    syllabus: [
      { title: 'Part 1: Web Development - Internet, HTML & CSS' },
      { title: 'Part 2: Web Development - JavaScript Fundamentals' },
      { title: 'Part 3: Web Development - React, TypeScript & Next.js' },
      { title: 'Part 4: Web Development - Backend & Databases' },
      { title: 'Part 5: Web Development - Advance Projects with Deployment' },
      { title: 'Part 6: Web Development - Testing, Deployment & Career Launch' },
    ]
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
    
    href: 'https://strikes.in/course/nexus-blockchain',
    syllabus: [
      { title: 'Part 1: Blockchain - Fundamentals & Cryptography' },
      { title: 'Part 2: Blockchain - Ethereum, Solana & Smart Contracts' },
      { title: 'Part 3: Blockchain - Rust, Advance & Deployment' },
      { title: 'Part 4: Blockchain - Security, DeFi & Real-World dApps' },
    ]
  },
  {
    id: 'system-design',
    title: 'High Level Design (HLD): System Design Mastery',
    description: 'Master designing scalable, distributed, production-grade systems. Learn the HLD interview framework, architecture patterns, load balancing, caching, database design, message queues, and real-world system design problems from URL shorteners to YouTube, WhatsApp and Twitter.',
    thumbnail: 'https://dolia18uq98lp.cloudfront.net/course/1eaa1b1d-c354-4f80-81bf-d4c35cc2b5a2.jpeg',
    duration: 'Recorded',
    hours: 'Recorded Course',
    
    
    
    
    isUpcoming: false,
    category: 'paid',
    hidden: true, // Withdrawn from the Paid section/filter; record kept intact.

    href: 'https://strikes.in/course/system-design',
    syllabus: [
      { title: 'Part 1: System Design Foundations' },
      { title: 'Part 2: CAP Theorem, Consistency & Availability' },
      { title: 'Part 3: Architecture Patterns' },
      { title: 'Part 4: Load Balancing & Scaling' },
      { title: 'Part 5: Caching & Performance' },
      { title: 'Part 6: Database Design & Storage' },
      { title: 'Part 7: Message Queues & Async Processing' },
    ]
  },
  {
    id: 'dsa-premium',
    title: 'Data Structures & Algorithms (DSA) Mastery in C++',
    description: 'Welcome to the ultimate guide to Data Structures and Algorithms (DSA) in C++! This comprehensive course takes you from the basics of programming all the way to advanced problem solving. Start with a solid C++ foundation, then master arrays, strings, recursion, linked lists, stacks, queues, trees, graphs, dynamic programming, tries and segment trees. Solve hundreds of curated problems and build the confidence to crack technical interviews and real-world challenges.',
    thumbnail: 'https://dolia18uq98lp.cloudfront.net/course/62ec6cfc-3d7c-4e82-a454-92a1970c0cca.jpeg',
    duration: 'Recorded',
    hours: '2024 Course | 80 Lectures',
    
    
    
    
    isUpcoming: false,
    category: 'paid',
    hidden: true, // Withdrawn from the Paid section/filter; record kept intact.

    href: 'https://strikes.in/course/dsa-premium',
    syllabus: [
      { title: 'C++ Foundations for Programming' },
      { title: 'Arrays & Sorting Algorithms' },
      { title: 'Complexity Analysis & Binary Search' },
      { title: 'Strings & KMP Algorithm' },
      { title: 'Pointers & Recursion' },
      { title: 'Object-Oriented Programming for DSA' },
      { title: 'Linear Data Structures: Linked Lists, Stacks & Queues' },
    ]
  },
  {
    id: 'lld',
    title: 'System Design',
    description: 'Master Object-Oriented Design, Design Patterns, SOLID Principles, and Schema Design with real-world case studies.',
    thumbnail: 'https://dolia18uq98lp.cloudfront.net/course/1eaa1b1d-c354-4f80-81bf-d4c35cc2b5a2.jpeg',
    duration: 'Live & Recorded',
    hours: 'Upcoming Course',
    
    
    
    
    isUpcoming: false,
    category: 'free',
    isYouTubeFree: true,
    href: 'https://youtube.com/playlist?list=PLQEaRBV9gAFvzp6XhcNFpk1WdOcyVo9qT',
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
    
    href: 'https://strikes.in/course/hld',
  },
  {
    id: 'dsa-cpp',
    title: 'Data Structures & Algorithms in C++',
    description: 'Master problem solving, competitive programming foundations, and tech interview questions in modern C++.',
    thumbnail: 'https://dolia18uq98lp.cloudfront.net/course/caa46009-ca64-4dce-94d7-7357e6bdc251.png',
    duration: 'Live & Recorded',
    hours: 'Upcoming Course',
    
    
    
    
    isUpcoming: false,
    category: 'free',
    isYouTubeFree: true,
    href: 'https://www.youtube.com/playlist?list=PLQEaRBV9gAFu4ovJ41PywklqI7IyXwr01',
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
    
    href: 'https://strikes.in/course/spring%20boot',
  }
];

const CourseGrid = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'paid' | 'free' | 'upcoming'>('all');

  const filteredCourses = allCourses.filter(course => {
    if (course.hidden) return false; // withdrawn courses never render
    if (activeTab === 'all') return true;
    return course.category === activeTab;
  });

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-black min-h-screen scroll-mt-24 empty-space-zone" id="courses">
      
      {/* HEADER & FILTER BAR */}
      <div className="mb-12 text-center md:text-left empty-space-zone">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Strike coding courses</h2>
        <p className="mt-3 text-gray-400 text-base md:text-lg max-w-2xl mx-auto md:mx-0 mb-8">
          Learn from the best with hands-on projects and guided practice.
        </p>

        {/* Category Filter Buttons — animated sliding pill marks the active tab */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
          {[
            { id: 'all', label: 'All Courses' },
            { id: 'paid', label: 'Paid Courses' },
            { id: 'free', label: 'Free Courses' },
            { id: 'upcoming', label: 'Upcoming Courses' }
          ].map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                aria-pressed={active}
                className={twMerge(
                  clsx(
                    "relative px-5 py-2.5 rounded-full text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black",
                    active ? "text-black" : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                  )
                )}
              >
                {active && (
                  <motion.span
                    layoutId="courseFilterPill"
                    className="absolute inset-0 rounded-full bg-white"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SINGLE DYNAMIC GRID — keyed remount swaps content instantly, then the
          new set animates in (no dependency on an exit animation completing). */}
      {filteredCourses.length > 0 ? (
        <motion.div
          key={activeTab}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch empty-space-zone"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.06
              }
            }
          }}
        >
          {filteredCourses.map(course => (
            <motion.div
              key={course.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
              }}
              whileHover={{ y: -5 }}
              className="flex h-full"
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 bg-[#111] rounded-2xl border border-white/5 flex flex-col items-center justify-center animate-in fade-in duration-300">
          <p className="text-xl font-bold text-gray-300 mb-2">No courses found</p>
          <p className="text-gray-500">There are currently no courses matching this category.</p>
          <button
            onClick={() => setActiveTab('all')}
            className="mt-6 text-accent-primary hover:text-white transition-colors text-sm font-bold"
          >
            Clear Filter
          </button>
        </div>
      )}

    </section>
  );
};

export default CourseGrid;
