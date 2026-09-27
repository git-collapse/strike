import { useOverclock } from '../context/OverclockContext';
import { motion } from 'framer-motion';
import { ShoppingCart, Network, Bot, Container, MessagesSquare, Boxes } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// "Projects Based Learning" — a real strikes.in homepage section that sits
// between Courses and Track Your Progress. Each project is grounded in an
// actual course track from ../data/courses (Web Dev, System Design, GenAI,
// DevOps, Blockchain) so the section elaborates capabilities the catalog
// genuinely teaches rather than inventing new claims. Difficulty and stack
// chips describe the project scope, not fabricated metrics.
type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

interface Project {
  icon: LucideIcon;
  title: string;
  track: string;
  desc: string;
  stack: string[];
  level: Difficulty;
}

const DIFFICULTY_META: Record<Difficulty, string> = {
  Beginner: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25',
  Intermediate: 'text-amber-300 bg-amber-500/10 border-amber-500/25',
  Advanced: 'text-fuchsia-300 bg-fuchsia-500/10 border-fuchsia-500/25',
};

const projects: Project[] = [
  {
    icon: ShoppingCart,
    title: 'Full-Stack E-Commerce Platform',
    track: 'Web Development',
    desc: 'Build a production-style store with auth, cart, payments, and an admin dashboard.',
    stack: ['React', 'Node.js', 'MongoDB'],
    level: 'Advanced',
  },
  {
    icon: Network,
    title: 'Scalable URL Shortener',
    track: 'System Design',
    desc: 'Design a high-throughput service with caching, sharding, and rate limiting.',
    stack: ['Redis', 'Load Balancing', 'Sharding'],
    level: 'Intermediate',
  },
  {
    icon: Bot,
    title: 'Autonomous AI Agent',
    track: 'Generative AI',
    desc: 'Ship a reasoning agent that plans, calls tools, and answers over your own data.',
    stack: ['LangChain', 'RAG', 'Vector DB'],
    level: 'Advanced',
  },
  {
    icon: Container,
    title: 'CI/CD Pipeline on Kubernetes',
    track: 'DevOps',
    desc: 'Containerise, automate, and roll out an app to a self-healing K8s cluster.',
    stack: ['Docker', 'Kubernetes', 'Terraform'],
    level: 'Intermediate',
  },
  {
    icon: MessagesSquare,
    title: 'Real-Time Chat Application',
    track: 'Web Development',
    desc: 'Wire up live messaging with presence, typing indicators, and WebSocket rooms.',
    stack: ['WebSockets', 'React', 'Node.js'],
    level: 'Intermediate',
  },
  {
    icon: Boxes,
    title: 'Decentralized Voting dApp',
    track: 'Blockchain',
    desc: 'Write and deploy a smart contract, then connect it to a Web3 frontend.',
    stack: ['Solidity', 'Ethereum', 'Web3'],
    level: 'Advanced',
  },
];

const ProjectsBasedLearning = () => {
  const { isOverclocked } = useOverclock();

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto empty-space-zone" id="projects">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <h4 className="text-cyan-400 font-bold tracking-widest uppercase text-sm mb-2">Projects Based Learning</h4>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 tracking-tight">
          Learn By <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Building</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Every track ends in real, portfolio-ready projects — the kind that belong on your resume and
          hold up in an interview, not throwaway tutorials.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
      >
        {projects.map(({ icon: Icon, title, track, desc, stack, level }) => (
          <motion.div
            key={title}
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90 } } }}
            whileHover={{ y: -6 }}
            className={`group relative flex flex-col gap-4 rounded-2xl border bg-[#0a0a0c] p-6 sm:p-7 transition-all duration-300 ${
              isOverclocked
                ? 'border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(34,211,238,0.25)]'
                : 'border-white/10 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]'
            }`}
          >
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-500/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Icon size={22} className="text-cyan-400" />
              </div>
              <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${DIFFICULTY_META[level]}`}>
                {level}
              </span>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400/80 mb-1">{track}</p>
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
            </div>

            <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
              {stack.map((tech) => (
                <span key={tech} className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-gray-400 ring-1 ring-white/10">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ProjectsBasedLearning;
