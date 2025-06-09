import { BLOG_POSTS } from '@/lib/data';
import { AnimatedBackground } from './ui/animated-background';
import Link from 'next/link';
import { BlogPost } from '@/lib/types';
import { ChevronRight } from 'lucide-react';

export function BlogItem({ post }: { post: BlogPost }) {
  return (
    <Link key={post.id} className="-mx-3 rounded-xl px-3 py-3" href={post.link} data-id={post.id}>
      <div className="flex flex-col space-y-1">
        <h4 className="font-normal dark:text-zinc-50">{post.title}</h4>
        <p className="text-zinc-600 dark:text-zinc-300">{post.description}</p>
      </div>
    </Link>
  );
}

export function Blogs() {
  return (
    <>
      <div className="mb-5 flex items-center gap-1">
        <Link
          href="/blogs"
          className="flex items-center gap-1 text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
        >
          <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-50">Blogs</h3>
          <ChevronRight className="mt-1" />
        </Link>
      </div>
      <div className="flex flex-col space-y-0 w-full">
        <AnimatedBackground
          enableHover
          className="h-full w-full rounded-lg bg-zinc-50/40 dark:bg-zinc-900/80"
          transition={{
            type: 'spring',
            bounce: 0,
            duration: 0.2,
          }}
        >
          {BLOG_POSTS.slice(0, 4).map(post => (
            <Link
              key={post.id}
              className="-mx-3 rounded-xl px-3 py-3"
              href={post.link}
              data-id={post.id}
            >
              <div className="flex flex-col space-y-1">
                <h4 className="font-normal dark:text-zinc-50">{post.title}</h4>
                <p className="text-zinc-600 dark:text-zinc-300">
                  {post.description}
                  <span className="hidden sm:inline">
                    {post.published && ` • Published on ${post.published.toLocaleDateString('en-GB', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}`}
                  </span>
                </p>
                {post.published && (
                  <p className="text-zinc-600 dark:text-zinc-300 sm:hidden">
                    Published on {post.published.toLocaleDateString('en-GB', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </AnimatedBackground>
      </div>
    </>
  );
}
