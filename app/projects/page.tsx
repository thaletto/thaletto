'use client';
import { motion } from 'framer-motion';
import { ProjectCard } from '@/components/project';
import { PROJECTS } from '@/lib/data';
import { VARIANTS_CONTAINER, VARIANTS_SECTION, TRANSITION_SECTION } from '@/components/ui/motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ProjectsPage() {
  return (
    <>
      <div className="container mx-auto py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          <ArrowLeft className="h-5 w-5" /> Back
        </Link>
      </div>
      <motion.main
        className="container min-h-screen mx-auto py-4"
        variants={VARIANTS_CONTAINER}
        initial="hidden"
        animate="visible"
      >
        <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
          <h3 className="mb-5 text-2xl font-medium">
            <span className="italic">All</span> Projects
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {PROJECTS.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </motion.section>
      </motion.main>
    </>
  );
}
