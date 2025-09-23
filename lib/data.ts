import { BlogPost, SocialLink, Skill } from "@/types";
import { generateId } from "./utils";
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiTrpc,
  SiReactquery,
  SiPython,
  SiFastapi,
  SiFlask,
  SiPandas,
  SiTensorflow,
  SiGit,
  SiJenkins,
  SiLangchain,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiDocker,
  SiNodedotjs,
  SiGithub,
  SiX,
  SiLinkedin,
  SiInstagram,
  SiNotion,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";

export const SKILLS: Skill[] = [
  { name: "Next.js", id: generateId("skill"), icon: SiNextdotjs },
  { name: "React", id: generateId("skill"), icon: SiReact },
  { name: "TS/JS", id: generateId("skill"), icon: SiTypescript },
  { name: "TailwindCSS", id: generateId("skill"), icon: SiTailwindcss },
  { name: "tRPC", id: generateId("skill"), icon: SiTrpc },
  { name: "React Query", id: generateId("skill"), icon: SiReactquery },
  { name: "Node.js", id: generateId("skill"), icon: SiNodedotjs },
  { name: "Java", id: generateId("skill"), icon: FaJava },
  { name: "Python", id: generateId("skill"), icon: SiPython },
  { name: "LangChain", id: generateId("skill"), icon: SiLangchain },
  { name: "FastAPI", id: generateId("skill"), icon: SiFastapi },
  { name: "Flask", id: generateId("skill"), icon: SiFlask },
  { name: "Pandas", id: generateId("skill"), icon: SiPandas },
  { name: "TensorFlow", id: generateId("skill"), icon: SiTensorflow },
  { name: "MongoDB", id: generateId("skill"), icon: SiMongodb },
  { name: "PostgreSQL", id: generateId("skill"), icon: SiPostgresql },
  { name: "MySQL", id: generateId("skill"), icon: SiMysql },
  { name: "Docker", id: generateId("skill"), icon: SiDocker },
  { name: "Git", id: generateId("skill"), icon: SiGit },
  { name: "Jenkins", id: generateId("skill"), icon: SiJenkins },
];

export const STUDY_NOTES_SITE_URL =
  "https://laxmankr.notion.site/54f72abb3cf348a7902c48a41fe0d48a?v=68aa5ecbfa7947609269a0f777fdad7f";

export const PORTFOLIO_JSON_URL =
  "https://raw.githubusercontent.com/thaletto/static/refs/heads/main/portfolio.json";

export const RESUME_URL =
  "https://drive.google.com/file/d/1ICfI0bDb44GPHw5ZQKcSYHj7mIpFlMIu/view?usp=sharing";

export const BLOG_POSTS: BlogPost[] = [
  {
    title: "How I stole the design of my portfolio",
    description: "Reflecting on the making process of this website",
    link: "/blogs/how-i-stole-the-design-of-my-portfolio",
    published: new Date("2025-06-12"),
    id: generateId("blog"),
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    userid: "thaletto",
    link: "https://github.com/thaletto",
    icon: SiGithub,
    id: generateId("social"),
  },
  {
    userid: "thaletto",
    link: "https://x.com/thaletto",
    icon: SiX,
    id: generateId("social"),
  },
  {
    userid: "laxmanramesh",
    link: "https://www.linkedin.com/in/laxmanramesh",
    icon: SiLinkedin,
    id: generateId("social"),
  },
  {
    userid: "thaletto",
    link: "https://www.instagram.com/thaletto",
    icon: SiInstagram,
    id: generateId("social"),
  },
  {
    userid: "laxmankr",
    link: STUDY_NOTES_SITE_URL,
    icon: SiNotion,
    id: generateId("social"),
  },
];

export const EMAIL = "krlaxman@gmail.com";
