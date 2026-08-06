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
  { company: '佐玩 Zolplay', companyEn: 'Zolplay', role: '创始人 & 创意总监', roleEn: 'Founder & Creative Director', from: 2021, url: 'https://zolplay.com' },
  { company: 'very very spaceship', companyEn: 'very very spaceship', role: '软件工程师 II', roleEn: 'Software Engineer II', from: 2018, to: 2020 },
  { company: '8ninths', companyEn: '8ninths', role: '全栈与 AR 工程师', roleEn: 'Full-stack & AR Engineer', from: 2017, to: 2018 },
  { company: 'Abletive 电子音乐社区', companyEn: 'Abletive', role: '创始人 & 独立开发者', roleEn: 'Founder & indie dev', from: 2014, to: 2016 },
]
