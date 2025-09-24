import ProjectsPage from "@/components/projects-page";
import { MotionMain, MotionSection } from "@/components/motion";
import {
  TRANSITION_SECTION,
  VARIANTS_CONTAINER,
  VARIANTS_SECTION,
} from "@/components/motion/constants";
import { getPortfolioData } from "@/functions";

export default async function Projects() {
  const data = await getPortfolioData();
  const projects = data.PROJECTS;

  return (
    <MotionMain
      className="container mx-auto min-h-screen py-4 space-y-6"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <MotionSection
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="text-2xl font-medium">
          <span className="italic">All</span> Projects
        </h3>
      </MotionSection>
      <ProjectsPage projects={projects} />
    </MotionMain>
  );
}
