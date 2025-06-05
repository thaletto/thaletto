'use client'
import { TextEffect } from '@/components/ui/text-effect'
import Link from 'next/link'

export function Header() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <Link
          href="/"
          className="text-3xl font-medium text-black dark:text-white"
        >
          Laxman K R{' '}
          <Link href="#contact">
            <span className="text-lg font-normal text-zinc-600 dark:text-zinc-500">
              @thaletto
            </span>
          </Link>
        </Link>
        <TextEffect
          as="p"
          preset="fade"
          per="char"
          className="text-zinc-600 dark:text-zinc-500"
          delay={0.5}
        >
          Full Stack AI Developer
        </TextEffect>
      </div>
    </header>
  )
}
