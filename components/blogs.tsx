import { BLOG_POSTS } from '@/lib/data'
import { AnimatedBackground } from './ui/animated-background'
import Link from 'next/link'

export function Blogs() {
  return (
    <>
      <h3 className="mb-5 text-xl font-medium">Blog</h3>
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
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.id}
              className="-mx-3 rounded-xl px-3 py-3"
              href={post.link}
              data-id={post.id}
            >
              <div className="flex flex-col space-y-1">
                <h4 className="font-normal dark:text-zinc-100">{post.title}</h4>
                <p className="text-zinc-500 dark:text-zinc-400">
                  {post.description}
                </p>
              </div>
            </Link>
          ))}
        </AnimatedBackground>
      </div>
    </>
  )
}
