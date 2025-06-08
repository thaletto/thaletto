'use client';
import { TextEffect } from '@/components/ui/text-effect';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export function Header() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <Link href="/" className="text-3xl font-medium">
          Laxman K R
        </Link>

        <TextEffect
          as="p"
          preset="fade"
          per="char"
          className="text-zinc-600 dark:text-zinc-400"
          delay={0.5}
        >
          Full Stack AI Developer
        </TextEffect>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Avatar className="size-10">
          <AvatarImage src="https://github.com/thaletto.png" />
          <AvatarFallback className="bg-zinc-600 dark:bg-zinc-400 text-zinc-100 dark:text-zinc-900 text-xl">
            LKR
          </AvatarFallback>
        </Avatar>
        <Link href="#contact">
          <p className="text-zinc-600 dark:text-zinc-400">@thaletto</p>
        </Link>
      </div>
    </header>
  );
}
