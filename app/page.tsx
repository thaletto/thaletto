'use client';
import { motion } from 'framer-motion';
import { About } from '@/components/about';
import { ProjectList } from '@/components/project';
import { WorkExperience } from '@/components/work';
import { Blogs } from '@/components/blogs';
import { Contact } from '@/components/contact';
import { Education } from '@/components/education';
import { Skills } from '@/components/skills';
import { VARIANTS_CONTAINER, VARIANTS_SECTION, TRANSITION_SECTION } from '@/components/ui/motion';

export default function Personal() {
  return (
    <motion.main
      className="space-y-12"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <About />
      </motion.section>

      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <ProjectList />
      </motion.section>

      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <WorkExperience />
      </motion.section>

      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <Education />
      </motion.section>

      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <Skills />
      </motion.section>

      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <Blogs />
      </motion.section>

      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <Contact />
      </motion.section>
    </motion.main>
  );
}
