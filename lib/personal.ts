// The personal registry — the one file to edit when life moves on.
// Sources: legacy site resume data + posts.

export interface Experience {
  company: string
  companyEn: string
  role: string
  roleEn?: string
  from: number
  to?: number
  url?: string
}

export const experience: Experience[] = [
  {
    company: 'Tata Consultancy Services',
    companyEn: 'Tata Consultancy Services',
    role: 'AI Engineer',
    roleEn: 'AI Engineer',
    from: 2024,
  },
]
