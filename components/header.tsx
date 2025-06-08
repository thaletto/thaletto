'use client';
import { TextEffect } from '@/components/ui/text-effect';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';

export function Header() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <Link href="/" className="text-3xl font-medium">
          Laxman K R
        </Link>

        <div className="text-zinc-600 dark:text-zinc-400">
          <TextEffect as="div" preset="fade" per="char" delay={0.5}>
            Full Stack AI Developer
          </TextEffect>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Avatar className="size-10">
          <AvatarImage src="https://github.com/thaletto.png" />
          <AvatarFallback className="bg-zinc-600 dark:bg-zinc-400 text-zinc-100 dark:text-zinc-900 text-xl">
            LKR
          </AvatarFallback>
        </Avatar>
        <HoverCard>
          <HoverCardTrigger className="text-zinc-600 dark:text-zinc-400">
            @thaletto
          </HoverCardTrigger>
          <HoverCardContent className="shadow-lg border-0 text-zinc-600 dark:text-zinc-400 bg-zinc-900 dark:bg-zinc-50 w-full">
            <div className="flex items-start gap-4">
              <img src={'/adc.png'} width={50} height={50} />
              <div className="flex flex-col gap-1">
                <p className="text-zinc-50 dark:text-zinc-900 font-medium">A Developer Company</p>
                <p className="text-zinc-400 dark:text-zinc-600">Founder & CEO</p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </header>
  );
}
