'use client';
import { motion } from 'framer-motion';
import { BLOG_POSTS } from '@/lib/data';
import { VARIANTS_CONTAINER, VARIANTS_SECTION, TRANSITION_IMAGE } from '@/components/ui/motion';
import { AnimatedBackground } from '@/components/ui/animated-background';
import Link from 'next/link';

export default function BlogPage() {
  return (
    <motion.main
      className="container min-h-screen mx-auto py-4"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_IMAGE}>
        <h3 className="mb-5 text-2xl font-medium">
          <span className="italic">All</span> Blogs
        </h3>
        <div className="flex flex-col space-y-0">
          <AnimatedBackground
            enableHover
            className="h-full w-full rounded-lg bg-zinc-50/40 dark:bg-zinc-900/80"
            transition={{
              type: 'spring',
              bounce: 0,
              duration: 0.2,
            }}
          >
            {BLOG_POSTS.map(post => (
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
                      {post.published &&
                        ` • Published on ${post.published.toLocaleDateString('en-GB', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}`}
                    </span>
                  </p>
                  {post.published && (
                    <p className="text-zinc-600 dark:text-zinc-300 sm:hidden">
                      Published on{' '}
                      {post.published.toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </AnimatedBackground>
        </div>
      </motion.section>
    </motion.main>
  );
}
