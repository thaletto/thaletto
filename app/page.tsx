import { About } from "@/components/about";
import { Blogs } from "@/components/blogs";
import { Contact } from "@/components/contact";
import { Education } from "@/components/education";
import { MotionMain, MotionSection } from "@/components/motion";
import { TRANSITION_IMAGE, TRANSITION_SECTION, VARIANTS_CONTAINER, VARIANTS_SECTION } from "@/components/motion/constants";
import { ProjectList } from "@/components/projects-list";
import { SkillsAndCertificate } from "@/components/skills";
import { WorkExperience } from "@/components/work";
import { getPortfolioData } from "@/functions";

export default async function Personal() {
  const data = await getPortfolioData();
  return (
    <MotionMain
      className="space-y-12"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <MotionSection
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <About />
      </MotionSection>

      <MotionSection variants={VARIANTS_SECTION} transition={TRANSITION_IMAGE}>
        <ProjectList PROJECTS={data.PROJECTS} />
      </MotionSection>

      <MotionSection
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <WorkExperience WORK_EXPERIENCE={data.WORK_EXPERIENCE} />
      </MotionSection>

      <MotionSection
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <Education EDUCATION={data.EDUCATION} />
      </MotionSection>

      <MotionSection
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <SkillsAndCertificate CERTIFICATES={data.CERTIFICATES} />
      </MotionSection>

      <MotionSection
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <Blogs />
      </MotionSection>

      <MotionSection
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <Contact />
      </MotionSection>
    </MotionMain>
  );
}
