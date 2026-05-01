import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
// @ts-expect-error
import { BlockMath, InlineMath } from "react-katex";
import { codeToHtml, createCssVariablesTheme } from "shiki";
import About from "@/components/about";
import Hero from "@/components/about/hero";
import ThatsWhatSheSaid from "@/components/about/thats-what-she-said";
import ViewCount from "@/components/about/view-count";
import { BlockSideTitle } from "@/components/common/block-sidetitle";
import { Callout } from "@/components/common/callout";
import { Card } from "@/components/common/card";
import { Code } from "@/components/common/code-block";
import LinkChip from "@/components/common/link-chip";
import { Mermaid } from "@/components/mermaid";

const cssVariablesTheme = createCssVariablesTheme({});

export const components: Record<
	string,
	(props: any) => ReactNode | Promise<ReactNode>
> = {
	h1: (props) => (
		<h1
			className="mb-8 text-balance font-semibold text-xl md:text-3xl"
			{...props}
		/>
	),
	h2: (props) => (
		<h2
			className="mt-8 text-balance font-semibold text-lg md:text-2xl"
			{...props}
		/>
	),
	h3: (props) => (
		<h3
			className="mt-8 text-balance font-semibold text-base md:text-xl"
			{...props}
		/>
	),
	ul: (props) => (
		<ul
			className="mt-2 list-outside list-disc pl-5 marker:text-muted-foreground"
			{...props}
		/>
	),
	ol: (props) => (
		<ol
			className="mt-2 list-outside list-decimal pl-5 marker:text-muted-foreground"
			{...props}
		/>
	),
	li: (props) => (
		<li className="pl-1.5 text-muted-foreground [&>p]:mt-0" {...props} />
	),
	a: ({ href, ...props }) => (
		<Link
			className="wrap-break-word text-muted-foreground underline underline-offset-2 hover:text-foreground focus-visible:rounded-xs focus-visible:outline focus-visible:outline-ring focus-visible:outline-offset-2"
			draggable={false}
			href={href}
			{...(href?.startsWith("https://")
				? {
						target: "_blank",
						rel: "noopener noreferrer",
					}
				: {})}
			{...props}
		/>
	),
	strong: (props) => <strong className="font-bold" {...props} />,
	p: (props) => (
		<p className="mt-4 font-normal text-muted-foreground" {...props} />
	),
	blockquote: (props) => (
		<blockquote
			className="-ml-6 pl-6 not-mobile:text-muted-foreground sm:-ml-10 sm:pl-10 md:-ml-14 md:pl-14"
			{...props}
		/>
	),
	pre: async (props) => {
		const codeEl = props.children;

		// Safety check
		if (typeof codeEl !== "object" || !("props" in codeEl)) {
			return (
				<pre
					className="mt-4 whitespace-pre md:whitespace-pre-wrap"
					{...props}
				/>
			);
		}

		const rawCode = codeEl.props.children;
		const lang = codeEl.props.className?.replace("language-", "") || "text";

		const html = await codeToHtml(String(rawCode), {
			lang,
			theme: cssVariablesTheme,
			transformers: [
				{
					pre: (hast) => {
						const child = hast.children[0];
						if (child && child.type === "element") {
							return child;
						}
						return hast;
					},
					postprocess: (html) => html.replace(/^<code>|<\/code>$/g, ""),
				},
			],
		});

		return (
			<pre className="mt-4 overflow-x-auto rounded-lg bg-shiki-background p-4 text-shiki-foreground">
				<code
					className="shiki css-variables"
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			</pre>
		);
	},
	code: (props) => (
		<code className="inline rounded-md bg-shiki-background px-1.5 py-0.5 text-[0.9rem] text-shiki-foreground">
			{props.children}
		</code>
	),
	img: async ({ src, alt, title }) => {
		let img: React.ReactNode;

		if (src.startsWith("https://")) {
			img = (
				<Image
					alt={alt}
					className="mt-4"
					draggable={false}
					placeholder="blur"
					quality={95}
					src={src}
				/>
			);
		} else {
			const image = await import(src);
			img = (
				<Image
					alt={alt}
					className="mt-4"
					draggable={false}
					placeholder="blur"
					quality={95}
					src={image.default}
				/>
			);
		}

		if (title) {
			return <BlockSideTitle title={title}>{img}</BlockSideTitle>;
		}

		return img;
	},
	table: (props) => (
		<div className="mt-4 overflow-hidden overflow-x-auto rounded-md border border-muted">
			<table className="w-full text-muted-foreground text-sm" {...props} />
		</div>
	),

	thead: (props) => (
		<thead className="border-muted border-b bg-secondary" {...props} />
	),
	tbody: (props) => <tbody {...props} />,

	tr: (props) => (
		<tr className="border-muted/40 border-b last:border-0" {...props} />
	),

	th: (props) => (
		<th
			className="border-muted border-r p-2 text-center font-semibold text-foreground last:border-r-0"
			{...props}
		/>
	),

	td: (props) => (
		<td
			className="border-muted/40 border-r p-2 text-center align-middle last:border-r-0"
			{...props}
		/>
	),
	hr: (props) => <hr className="my-14 w-24 border" {...props} />,
	Card,
	Image,
	Code,
	BlockSideTitle,
	Callout,
	InlineMath,
	BlockMath,
	ViewCount,
	LinkChip,
	Mermaid,
	Hero,
	About,
	ThatsWhatSheSaid,
};

export function useMDXComponents(inherited: MDXComponents): MDXComponents {
	return {
		...inherited,
		...(components as any),
	};
}
