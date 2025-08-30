'use client';
import { TextEffect } from '@/components/magicui/text-effect';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ArrowLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { TextMorph } from './magicui/text-morph';

function CopyButton() {
  const [text, setText] = useState('Copy');
  const pathname = usePathname();
  const currentUrl =
    typeof window !== 'undefined' ? window.location.origin + pathname : '';

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setText('Copy');
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [text]);

  return (
    <button
      onClick={() => {
        setText('Copied');
        navigator.clipboard.writeText(currentUrl);
      }}
      className="font-base flex items-center gap-1 text-center text-sm text-zinc-500 transition-colors"
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
  const isBlogPage = pathname.startsWith('/blogs');

  const handleBackClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window.document.startViewTransition === 'function') {
      e.preventDefault();
      document.body.classList.add('slide-right');
      document
        .startViewTransition(() => {
          window.location.href = '/';
        })
        .finished.finally(() => {
          document.body.classList.remove('slide-right');
        });
    }
  };

  return (
    <header className="mb-8 flex items-start justify-between">
      <div className="flex flex-col gap-2">
        <Link href="/" className="text-3xl font-medium">
          <TextEffect as="div" preset="fade" per="char" delay={0.5}>
            Laxman K R
          </TextEffect>
        </Link>

        <div className="text-zinc-600">
          <TextEffect as="div" preset="fade" per="char" delay={0.5}>
            Full Stack AI Developer
          </TextEffect>
        </div>

        {showBackButton && (
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-zinc-600 transition-colors hover:text-zinc-900"
            onClick={handleBackClick}
          >
            <ArrowLeft className="h-5 w-5" /> Back
          </Link>
        )}
      </div>

      <div className="flex flex-col items-end gap-2">
        <Link
          href="https://github.com/thaletto"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Avatar className="size-12 transition-opacity hover:opacity-90">
            <AvatarImage src="https://github.com/thaletto.png" />
            <AvatarFallback className="bg-zinc-600 text-xl text-zinc-100">
              LKR
            </AvatarFallback>
          </Avatar>
        </Link>

        <p className="h-auto p-0 font-normal text-zinc-600 hover:bg-transparent">
          @thaletto
        </p>
        {isBlogPage && <CopyButton />}
      </div>
    </header>
  );
}
