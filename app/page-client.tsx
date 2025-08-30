'use client';
import { motion } from 'motion/react';
import { About } from '@/components/about';
import { ProjectList } from '@/components/project';
import { WorkExperience } from '@/components/work';
import { Blogs } from '@/components/blogs';
import { Contact } from '@/components/contact';
import { Education } from '@/components/education';
import { SkillsAndCertificate } from '@/components/skills';
import {
  VARIANTS_CONTAINER,
  VARIANTS_SECTION,
  TRANSITION_SECTION,
  TRANSITION_IMAGE,
} from '@/components/magicui/motion';
import { PortfolioData } from '@/types';

interface Props {
  data: PortfolioData;
}

export default function PageClient({ data }: Props) {
  return (
    <motion.main
      className="space-y-12"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <About />
      </motion.section>

      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_IMAGE}>
        <ProjectList PROJECTS={data.PROJECTS} />
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <WorkExperience WORK_EXPERIENCE={data.WORK_EXPERIENCE} />
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <Education EDUCATION={data.EDUCATION} />
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <SkillsAndCertificate CERTIFICATES={data.CERTIFICATES}/>
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <Blogs />
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <Contact />
      </motion.section>
    </motion.main>
  );
}
