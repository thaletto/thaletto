import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Laxman K R | @thaletto Portfolio & Blogs',
    short_name: 'Laxman K R | @thaletto Portfolio & Blogs',
    description: 'Portfolio and blog website of a fullstack developer',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}