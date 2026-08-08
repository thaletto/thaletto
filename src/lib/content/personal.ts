// The personal registry — the one file to edit when life moves on.
// Sources: legacy site resume data + posts.

export interface Experience {
  company: string
  role: string
  from: number
  to?: number
  url?: string
}

export const experience: Experience[] = [
  {
    company: 'Tata Consultancy Services',
    role: 'AI Engineer',
    from: 2024,
  },
]
