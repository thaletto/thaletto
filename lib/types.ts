export type Project = {
  name: string
  description: string
  link: string
  image: string
  id: string
}

export type WorkExperience = {
  company: string
  title: string
  start: Date
  end: Date | 'Present'
  id: string
}

export type BlogPost = {
  title: string
  description: string
  published: Date
  link: string
  id: string
}

export type SocialLink = {
  label: string
  link: string
}