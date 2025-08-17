import {
  Project,
  WorkExperience,
  BlogPost,
  SocialLink,
  Education,
  Skill,
  Certificate,
} from './types';
import { generateId } from './utils';
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
  SiPrisma,
  SiDocker,
  SiNodedotjs,
  SiGithub,
  SiX,
  SiLinkedin,
  SiInstagram,
  SiMeta,
  SiHuggingface,
} from 'react-icons/si';
import { FaJava, FaUniversity } from 'react-icons/fa';

export const PROJECTS: Project[] = [
  {
    name: 'MathGPT',
    description:'ChatGPT alternative specialised in math, data analytics and statistics, with ability to create interactive charts.',
    link: 'https://mathgpt-thaletto.vercel.app',
    image: '/projects/mathgpt.png',
    tags: ['AI SDK', 'AI Agents', 'Tools'],
    id: generateId(),
    date: new Date('2025-08'),
  },
  {
    name: 'E-Commerce website & CMS',
    description:
      'E-Commerce website with a custom CMS for managing products, orders, and customers for a client.',
    link: 'https://krcrackers.co',
    image: '/projects/krcrackers.png',
    tags: ['Next.js', 'SSR', 'PostgreSQL'],
    id: generateId(),
    date: new Date('2024-09'),
  },
  {
    name: 'Lung nodule detection',
    description:
      'Complex & irregular lung nodule detection using YOLO, V-Net & DETR',
    link: 'https://drive.google.com/file/d/1_XcKu5bFmmrTHHc4nxXetIZbXwiMjkj3/view?usp=sharing',
    image: '/projects/lungnodule.png',
    tags: ['CNN', 'Transformers', 'Deep Learning'],
    id: generateId(),
    date: new Date('2024-05'),
  },
  {
    name: 'Lense',
    description:
      'AI-powered marketplace for pre-owned products with instant valuation',
    github: 'https://github.com/thaletto/Lense',
    image: '/projects/lense.png',
    tags: ['Android Application', 'Jetpack Compose', 'Kotlin'],
    id: generateId(),
    date: new Date('2024-02'),
  },
  {
    name: 'Parkinsons Disease Detection',
    description:
      'Implemented multiple supervised and unsupervised machine learning models for early parkinsons disease detection',
    github: 'https://github.com/thaletto/Parkinson-Disease-Detection',
    image: '/projects/parkinsons.png',
    tags: ['ML', 'Gradient Boost', 'EDA'],
    id: generateId(),
    date: new Date('2023-09'),
  },
];

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: 'TCS',
    title: 'Full Stack AI Developer',
    start: new Date('2024-11-07'),
    end: 'Present',
    id: generateId('work'),
  },
  {
    company: 'Freelance',
    title: 'Full Stack Developer',
    start: new Date('2024-08-19'),
    end: new Date('2024-10-28'),
    id: generateId('work'),
  },
];

export const EDUCATION: Education[] = [
  {
    typeofEducation: 'university',
    institution: 'Amrita School of Computing',
    degree: 'B.Tech Computer Science and Engineering',
    start: new Date('2020-09'),
    end: new Date('2024-05-06'),
    cgpa: 7.02,
    id: generateId('edu'),
  },
  {
    typeofEducation: 'school',
    marks: 88.6,
    institution: 'Maharishi International Residential School',
    degree: 'CBSE XII',
    start: new Date('2019'),
    end: new Date('2020'),
    id: generateId('edu'),
  },
  {
    typeofEducation: 'school',
    marks: 82.6,
    institution: 'Maharishi International Residential School',
    degree: 'CBSE X',
    start: new Date('2017'),
    end: new Date('2018'),
    id: generateId('edu'),
  },
];

export const SKILLS: Skill[] = [
  { name: 'Next.js', id: generateId('skill'), icon: SiNextdotjs },
  { name: 'React', id: generateId('skill'), icon: SiReact },
  { name: 'TS/JS', id: generateId('skill'), icon: SiTypescript },
  { name: 'TailwindCSS', id: generateId('skill'), icon: SiTailwindcss },
  { name: 'tRPC', id: generateId('skill'), icon: SiTrpc },
  { name: 'React Query', id: generateId('skill'), icon: SiReactquery },
  { name: 'Node.js', id: generateId('skill'), icon: SiNodedotjs },
  { name: 'Java', id: generateId('skill'), icon: FaJava },
  { name: 'Python', id: generateId('skill'), icon: SiPython },
  { name: 'LangChain', id: generateId('skill'), icon: SiLangchain },
  { name: 'FastAPI', id: generateId('skill'), icon: SiFastapi },
  { name: 'Flask', id: generateId('skill'), icon: SiFlask },
  { name: 'Pandas', id: generateId('skill'), icon: SiPandas },
  { name: 'TensorFlow', id: generateId('skill'), icon: SiTensorflow },
  { name: 'MongoDB', id: generateId('skill'), icon: SiMongodb },
  { name: 'PostgreSQL', id: generateId('skill'), icon: SiPostgresql },
  { name: 'MySQL', id: generateId('skill'), icon: SiMysql },
  { name: 'Docker', id: generateId('skill'), icon: SiDocker },
  { name: 'Git', id: generateId('skill'), icon: SiGit },
  { name: 'Jenkins', id: generateId('skill'), icon: SiJenkins },
];

export const CERTIFICATES: Certificate[] = [
  {
    name: 'MCP for Production Automation',
    issuedBy: 'Hugging Face',
    issuedDate: new Date('2025-06-18'),
    link: 'https://github.com/thaletto/mcp',
    icon: SiHuggingface,
    id: generateId('certificate'),
  },
  {
    name: 'Advanced React',
    issuedBy: 'Meta',
    issuedDate: new Date('2024-02'),
    link: 'https://www.coursera.org/verify/GVQDTDYQVGJ6',
    icon: SiMeta,
    id: generateId('certificate'),
  },
  {
    name: 'Programming Fundamentals in Kotlin',
    issuedBy: 'Meta',
    issuedDate: new Date('2023-08'),
    link: 'https://www.coursera.org/verify/W36X2TYW38KV',
    icon: SiMeta,
    id: generateId('certificate'),
  },
  {
    name: 'Fundamentals of Visualization',
    issuedBy: 'University of California, Davis',
    issuedDate: new Date('2023-02'),
    link: 'https://www.coursera.org/verify/V7N46QJQCNBY',
    icon: FaUniversity,
    id: generateId('certificate'),
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    title: 'How I stole the design of my portfolio',
    description: 'Reflecting on the making process of this website',
    link: '/blog/how-i-stole-the-design-of-my-portfolio',
    published: new Date('2025-06-12'),
    id: generateId('blog'),
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    userid: 'thaletto',
    link: 'https://github.com/thaletto',
    icon: SiGithub,
    id: generateId('social'),
  },
  {
    userid: 'thaletto',
    link: 'https://x.com/thaletto',
    icon: SiX,
    id: generateId('social'),
  },
  {
    userid: 'laxmanramesh',
    link: 'https://www.linkedin.com/in/laxmanramesh',
    icon: SiLinkedin,
    id: generateId('social'),
  },
  {
    userid: 'thaletto',
    link: 'https://www.instagram.com/thaletto',
    icon: SiInstagram,
    id: generateId('social'),
  },
];

export const EMAIL = 'krlaxman@gmail.com';
