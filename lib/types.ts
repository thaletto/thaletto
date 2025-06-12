import type { IconType } from 'react-icons'

export type Project = {
  name: string
  description: string
  link?: string
  github?: string
  image: string
  id: string
  date: Date
}

export type WorkExperience = {
  company: string
  title: string
  start: Date
  end: Date | 'Present'
  id: string
}

type BaseEducation = {
  institution: string
  degree: string
  start: Date
  end: Date | 'Present'
  id: string
}

type SchoolEducation = BaseEducation & {
  typeofEducation: 'school'
  marks: number
  cgpa?: never
}

type GraduateEducation = BaseEducation & {
  typeofEducation: 'college' | 'university'
  cgpa: number
  marks?: never
  paper?: string
}

export type Education = SchoolEducation | GraduateEducation

export type BlogPost = {
  title: string
  description: string
  published: Date
  link: string
  id: string
}

export type SocialLink = {
  userid: string
  link: string
  icon: IconType
  id: string
}

export type Skill = {
  name: string
  id: string
  icon: IconType
}
