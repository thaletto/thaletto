import { createFileRoute } from '@tanstack/react-router'
import { allBlogs } from '.content-collections/generated';

export const Route = createFileRoute('/blogs')({
  component: Blogs,
})

function Blogs() {
  return (
    <div className="p-4">
      <h3 className="text-2xl font-bold mb-4">Blogs</h3>
      <p>Total blogs: {allBlogs.length}</p>
      {allBlogs.length === 0 && <p>No blog posts yet. Check back soon!</p>}
    </div>
  )
}
