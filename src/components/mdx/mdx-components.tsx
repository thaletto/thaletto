import type { MDXComponents } from 'mdx/types'
import { ZoomImage } from '~/components/blog/zoom-image'
import { TechStack, TechStackItem } from '~/components/tech-stack'
import { AwsLight } from '~/components/ui/svgs/awsLight'
import { ClaudeAiIcon } from '~/components/ui/svgs/claudeAiIcon'
import { Cloudflare } from '~/components/ui/svgs/cloudflare'
import { CodexDark } from '~/components/ui/svgs/codexDark'
import { CodexLight } from '~/components/ui/svgs/codexLight'
import { EffectLight } from '~/components/ui/svgs/effectLight'
import { Fastapi } from '~/components/ui/svgs/fastapi'
import { Golang } from '~/components/ui/svgs/golang'
import { GoogleCloud } from '~/components/ui/svgs/googleCloud'
import { Grafana } from '~/components/ui/svgs/grafana'
import { HuggingFace } from '~/components/ui/svgs/huggingFace'
import { Kotlin } from '~/components/ui/svgs/kotlin'
import { Netlify } from '~/components/ui/svgs/netlify'
import { Npm } from '~/components/ui/svgs/npm'
import { NextjsIconDark } from '~/components/ui/svgs/nextjsIconDark'
import { Python } from '~/components/ui/svgs/python'
import { QdrantIconLight } from '~/components/ui/svgs/qdrantIconLight'
import { ReactLight } from '~/components/ui/svgs/reactLight'
import { ShadcnUi } from '~/components/ui/svgs/shadcnUi'
import { Sqlite } from '~/components/ui/svgs/sqlite'
import { Tailwindcss } from '~/components/ui/svgs/tailwindcss'
import { Tanstack } from '~/components/ui/svgs/tanstack'
import { TensorflowIconDark } from '~/components/ui/svgs/tensorflowIconDark'
import { Typescript } from '~/components/ui/svgs/typescript'
import { Upstash } from '~/components/ui/svgs/upstash'
import { Vercel } from '~/components/ui/svgs/vercel'
import { VercelDark } from '~/components/ui/svgs/vercelDark'
import { tiltFromSlug } from '~/lib/motion/polaroid'
import { CodeBlockPre } from './code-block'
import { MermaidDiagram } from './mermaid-diagram'
import { PhotoStack, PhotoStackCaption, PhotoStackFrames } from './photo-stack'

// Post images arrive as ./file.png#WxH (dimensions encoded by the content
// pipeline); rewrite to the content route and unpack the dimensions.
// Absolute .svg paths render inline without the zoom treatment.
function PostImage({
  slug,
  src,
  alt,
  title,
  kind,
}: {
  slug: string
  src: string
  alt?: string
  title?: string
  kind: ContentKind
}) {
  if (src.startsWith('/') && src.endsWith('.svg')) {
    return (
      // biome-ignore lint/performance/noImgElement: small technical marks remain native and crisp
      <img alt={alt ?? ''} className="mdx-inline-logo" height={18} src={src} width={18} />
    )
  }
  const match = src.match(/^\.\/([A-Za-z0-9_.-]+)#(\d+)x(\d+)$/)
  if (!match) throw new Error(`post image needs ./file#WxH format, got: ${src}`)
  const [, file, width, height] = match
  // deterministic scatter in [-1°, +1°] per file; hover straightens
  const tilt = tiltFromSlug(file) / 2
  const img = (
    <ZoomImage
      src={`/content/${kind}/${slug}/${file}`}
      alt={alt ?? ''}
      width={+width}
      height={+height}
      sizes="(max-width: 704px) 100vw, 656px"
      style={{ '--img-tilt': `${tilt.toFixed(2)}deg` } as React.CSSProperties}
    />
  )
  if (!title) return img
  // Markdown images render inside <p>, where <figure> is invalid HTML —
  // block-level spans carry the same styling.
  return (
    <span className="post-figure block">
      {img}
      <span className="post-figcaption block">{title}</span>
    </span>
  )
}

export type ContentKind = 'blog' | 'projects'

export function mdxComponents(slug: string, kind: ContentKind = 'blog'): MDXComponents {
  return {
    pre: (props) => <CodeBlockPre {...props} />,
    MermaidDiagram: (props: { code: string; caption?: string }) => <MermaidDiagram {...props} />,
    PhotoStack,
    PhotoStackCaption,
    PhotoStackFrames,
    TechStack,
    TechStackItem,
    AwsLight,
    ClaudeAiIcon,
    Cloudflare,
    CodexDark,
    CodexLight,
    EffectLight,
    Fastapi,
    Golang,
    GoogleCloud,
    Grafana,
    HuggingFace,
    Kotlin,
    Netlify,
    Npm,
    NextjsIconDark,
    Python,
    QdrantIconLight,
    ReactLight,
    ShadcnUi,
    Sqlite,
    Tailwindcss,
    Tanstack,
    TensorflowIconDark,
    Typescript,
    Upstash,
    Vercel,
    VercelDark,
    img: (props) => (
      <PostImage
        slug={slug}
        kind={kind}
        src={props.src as string}
        alt={props.alt}
        title={props.title}
      />
    ),
  }
}
