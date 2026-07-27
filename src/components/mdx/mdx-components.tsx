import type { MDXComponents } from "mdx/types";
import { DitheredImage } from "@/components/dithered-image";
import { components as baseComponents } from "../../../mdx-components";

export type ContentKind = "projects" | "timeline" | "writings";

const EXTERNAL_LINK = /^https?:/;
const IMAGE_CONTRACT =
	/^\.\/([A-Za-z0-9_.-]+)#(\d+)x(\d+)(?::(crisp|dither))?$/;
const HEADING_SEPARATOR = /[^a-z0-9]+/g;
const EDGE_HYPHENS = /(^-|-$)/g;

function headingId(children: React.ReactNode) {
	const text = Array.isArray(children) ? children.join(" ") : String(children);
	return text
		.toLowerCase()
		.replace(HEADING_SEPARATOR, "-")
		.replace(EDGE_HYPHENS, "");
}

function PostImage({
	alt,
	kind,
	slug,
	src,
	title,
}: {
	alt?: string;
	kind: ContentKind;
	slug: string;
	src: string;
	title?: string;
}) {
	if (src.startsWith("/") && src.endsWith(".svg")) {
		return (
			// biome-ignore lint/performance/noImgElement: small technical marks remain native and crisp
			<img
				alt={alt ?? ""}
				className="mdx-inline-logo"
				height={18}
				src={src}
				width={18}
			/>
		);
	}
	const match = src.match(IMAGE_CONTRACT);
	if (!match) {
		throw new Error(`MDX image must use ./file#WIDTHxHEIGHT, received ${src}`);
	}
	const [, file, width, height, treatment] = match;
	const imageSrc = `/content/${kind}/${slug}/${file}`;
	if (treatment === "crisp") {
		return (
			<span className="mdx-crisp-figure">
				{/* biome-ignore lint/performance/noImgElement: dimensioned technical diagrams must remain unprocessed and crisp */}
				<img
					alt={alt ?? ""}
					height={Number(height)}
					src={imageSrc}
					width={Number(width)}
				/>
			</span>
		);
	}
	return (
		<DitheredImage
			alt={alt ?? ""}
			caption={title}
			height={Number(height)}
			src={imageSrc}
			width={Number(width)}
		/>
	);
}

export function mdxComponents(slug: string, kind: ContentKind): MDXComponents {
	return {
		...(baseComponents as MDXComponents),
		a: ({ href = "", ...props }) => {
			const external = EXTERNAL_LINK.test(href);
			return (
				<a
					{...props}
					className="mdx-link"
					href={href}
					rel={external ? "noreferrer" : undefined}
					target={external ? "_blank" : undefined}
				>
					{props.children}
					{external ? <span aria-hidden> ↗</span> : null}
				</a>
			);
		},
		h2: ({ children, ...props }) => (
			<h2 id={headingId(children)} {...props}>
				{children}
			</h2>
		),
		h3: ({ children, ...props }) => (
			<h3 id={headingId(children)} {...props}>
				{children}
			</h3>
		),
		img: ({ alt, src, title }) => (
			<PostImage
				alt={alt}
				kind={kind}
				slug={slug}
				src={String(src)}
				title={title}
			/>
		),
	};
}
