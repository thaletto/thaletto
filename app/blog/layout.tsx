'use client';
import { TextMorph } from '@/components/ui/text-morph';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { useEffect, useState } from 'react';

function CopyButton() {
  const [text, setText] = useState('Copy');
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

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

export default function LayoutBlogPost({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="pointer-events-none fixed top-0 left-0 z-10 h-12 w-full bg-gray-100 to-transparent backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)] dark:bg-zinc-950" />
      <ScrollProgress
        className="fixed top-0 z-20 h-1 bg-zinc-600 dark:bg-gray-400"
        springOptions={{
          bounce: 0,
        }}
      />
      <div className="prose prose-gray dark:prose-invert prose-h1:text-xl prose-h1:font-medium prose-h2:mt-12 prose-h2:scroll-m-20 prose-h2:text-lg prose-h2:font-medium prose-h3:text-base prose-h3:font-medium prose-h4:font-medium prose-h4:prose-base prose-h5:text-base prose-h5:font-medium prose-h6:text-base prose-h6:font-medium prose-strong:font-medium prose-hr:border-zinc-500 prose-hr:dark:border-zinc-400 prose-ul:marker:text-zinc-600 prose-ul:dark:marker:text-zinc-400 prose-li:marker:text-zinc-600 prose-li:dark:marker:text-zinc-400 prose-blockquote:border-l-zinc-600 w-full max-w-none py-12">
        {children}
      </div>
    </>
  );
}
