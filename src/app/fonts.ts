import { JetBrains_Mono, Libre_Baskerville } from 'next/font/google'
import localFont from 'next/font/local'

const allo = localFont({
  src: './fonts/AlloVariable.woff2',
  weight: '100 900',
  variable: '--font-allo',
  display: 'swap',
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-libre-baskerville',
  display: 'swap',
})

export const fontVariables = [
  allo.variable,
  jetBrainsMono.variable,
  libreBaskerville.variable,
].join(' ')
