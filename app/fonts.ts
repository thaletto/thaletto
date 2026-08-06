import { Geist, Geist_Mono } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

const latinFontVariables = [geist.variable, geistMono.variable].join(' ')

export function fontVariablesForLocale(_locale: string) {
  return latinFontVariables
}
