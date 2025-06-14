'use client';
import { motion } from 'motion/react';
import { ProjectCard } from '@/components/project';
import { PROJECTS } from '@/lib/data';
import {
  VARIANTS_CONTAINER,
  VARIANTS_SECTION,
  TRANSITION_IMAGE,
} from '@/components/ui/motion';

export default function ProjectsPage() {
  return (
    <motion.main
      className="container mx-auto min-h-screen py-4"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_IMAGE}>
        <h3 className="mb-5 text-2xl font-medium">
          <span className="italic">All</span> Projects
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {PROJECTS.sort((a, b) => b.date.getTime() - a.date.getTime()).map(
            (project) => (
              <ProjectCard key={project.id} project={project} priority={false} />
            )
          )}
        </div>
      </motion.section>
    </motion.main>
  );
}
