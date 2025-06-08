'use client';
import { TextEffect } from '@/components/ui/text-effect';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { ArrowLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { TextMorph } from './ui/text-morph';
import { Button } from './ui/button';

function CopyButton() {
  const [text, setText] = useState('Copy');
  const pathname = usePathname();
  const currentUrl = typeof window !== 'undefined' ? window.location.origin + pathname : '';

  useEffect(() => {
    setTimeout(() => {
      setText('Copy');
    }, 2000);
  }, [text]);

  return (
    <button
      onClick={() => {
        setText('Copied');
        navigator.clipboard.writeText(currentUrl);
      }}
      className="font-base flex items-center gap-1 text-center text-sm text-zinc-500 transition-colors dark:text-zinc-300"
      type="button"
    >
      <TextMorph>{text}</TextMorph>
      <span>URL</span>
    </button>
  );
}

export function Header() {
  const pathname = usePathname();
  const showBackButton = pathname !== '/';
  const isBlogPage = pathname.startsWith('/blog');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="mb-8 flex items-start justify-between">
      <div className="flex flex-col gap-2">
        <Link href="/" className="text-3xl font-medium">
          Laxman K R
        </Link>

        <div className="text-zinc-600 dark:text-zinc-300">
          <TextEffect as="div" preset="fade" per="char" delay={0.5}>
            Full Stack AI Developer
          </TextEffect>
        </div>

        {showBackButton && (
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
          >
            <ArrowLeft className="h-5 w-5" /> Back
          </Link>
        )}
      </div>

      <div className="flex flex-col items-end gap-2">
        <Avatar className="size-10">
          <AvatarImage src="https://github.com/thaletto.png" />
          <AvatarFallback className="bg-zinc-600 dark:bg-zinc-400 text-zinc-100 dark:text-zinc-900 text-xl">
            LKR
          </AvatarFallback>
        </Avatar>

        <HoverCard open={isOpen} onOpenChange={setIsOpen}>
          <HoverCardTrigger asChild>
            <Button
              variant="ghost"
              className="text-zinc-600 dark:text-zinc-300 font-normal p-0 h-auto hover:bg-transparent"
              onClick={() => setIsOpen(!isOpen)}
            >
              @thaletto
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="shadow-lg border-0 text-zinc-600 dark:text-zinc-300 bg-zinc-900 dark:bg-zinc-50 w-full">
            <div className="flex items-start gap-4">
              <img src={'/adc.png'} width={50} height={50} />
              <div className="flex flex-col gap-1">
                <p className="text-zinc-50 dark:text-zinc-900 font-medium">A Developer Company</p>
                <p className="text-zinc-400 dark:text-zinc-600">Founder & CEO</p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
        {isBlogPage && <CopyButton />}
      </div>
    </header>
  );
}
