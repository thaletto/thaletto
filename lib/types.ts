export type Project = {
  name: string
  description: string
  link: string
  image: string
  id: string
};

export type WorkExperience = {
  company: string
  title: string
  start: Date
  end: Date | 'Present'
  id: string
};

type BaseEducation = {
  institution: string
  degree: string
  start: Date
  end: Date | 'Present'
  id: string
};

type SchoolEducation = BaseEducation & {
  typeofEducation: 'school'
  marks: number
  cgpa?: never
};

type GraduateEducation = BaseEducation & {
  typeofEducation: 'college' | 'university'
  cgpa: number
  marks?: never
  paper?: string
};

export type Education = SchoolEducation | GraduateEducation

export type BlogPost = {
  title: string
  description: string
  published: Date
  link: string
  id: string
};

export type SocialLink = {
  label: string
  link: string
};