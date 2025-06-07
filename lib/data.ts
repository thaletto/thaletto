import {
  Project,
  WorkExperience,
  BlogPost,
  SocialLink,
  Education,
} from './types'
import { generateId } from './utils'

export const PROJECTS: Project[] = [
  {
    name: 'E-Commerce website & CMS',
    description:
      'E-Commerce website with a custom CMS for managing products, orders, and customers for a client.',
    link: 'https://krcrackers.co',
    image: '/projects/krcrackers.png',
    id: generateId(),
  },
]

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
    start: new Date('2024'),
    end: 'Present',
    id: generateId('work'),
  },
]

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
    id: generateId('edu')
  },
  {
    typeofEducation: 'school',
    marks: 82.6,
    institution: 'Maharishi International Residential School',
    degree: 'CBSE X',
    start: new Date('2017'),
    end: new Date('2018'),
    id: generateId('edu')
  }
]

export const BLOG_POSTS: BlogPost[] = [
  {
    title: 'Exploring the Intersection of Design, AI, and Design Engineering',
    description: 'How AI is changing the way we design',
    link: '/blog/exploring-the-intersection-of-design-ai-and-design-engineering',
    published: new Date('2024-03-15'),
    id: generateId('blog'),
  },
  {
    title: 'Why I left my job to start my own company',
    description:
      'A deep dive into my decision to leave my job and start my own company',
    link: '/blog/why-i-left-my-job',
    published: new Date('2024-03-10'),
    id: generateId('blog'),
  },
  {
    title: 'What I learned from my first year of freelancing',
    description:
      'A look back at my first year of freelancing and what I learned',
    link: '/blog/first-year-freelancing',
    published: new Date('2024-03-05'),
    id: generateId('blog'),
  },
  {
    title: 'How to Export Metadata from MDX for Next.js SEO',
    description:
      'A guide on exporting metadata from MDX files to leverage Next.js SEO features.',
    link: '/blog/example-mdx-metadata',
    published: new Date('2024-03-01'),
    id: generateId('blog'),
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Github',
    link: 'https://github.com/thaletto',
  },
  {
    label: 'Twitter',
    link: 'https://x.com/thaletto',
  },
  {
    label: 'LinkedIn',
    link: 'https://www.linkedin.com/in/laxmanramesh',
  },
  {
    label: 'Instagram',
    link: 'https://www.instagram.com/thaletto',
  },
]

export const EMAIL = 'krlaxman@gmail.com'
