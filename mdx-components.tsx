import About from "@/components/about";
import Hero from "@/components/about/hero";
import ThatsWhatSheSaid from "@/components/about/thats-what-she-said";
import ViewCount from "@/components/about/view-count";
import { BlockSideTitle } from "@/components/common/block-sidetitle";
import { Callout } from "@/components/common/callout";
import { Card } from "@/components/common/card";
import LinkChip from "@/components/common/link-chip";
import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { codeToHtml, createCssVariablesTheme } from "shiki";
import { Mermaid } from "@/components/mermaid";
import { Code } from "@/components/common/code-block";
// @ts-ignore
import { BlockMath, InlineMath } from "react-katex";

const cssVariablesTheme = createCssVariablesTheme({});

export const components: Record<
	string,
	(props: any) => ReactNode | Promise<ReactNode>
> = {
	h1: (props) => (
		<h1
			className="font-semibold text-xl md:text-3xl mb-8 text-balance"
			{...props}
		/>
	),
	h2: (props) => (
		<h2
			className="font-semibold text-lg md:text-2xl mt-8 text-balance"
			{...props}
		/>
	),
	h3: (props) => (
		<h3
			className="font-semibold text-base md:text-xl mt-8 text-balance"
			{...props}
		/>
	),
	ul: (props) => (
		<ul
			className="mt-2 list-disc list-outside marker:text-muted-foreground pl-5"
			{...props}
		/>
	),
	ol: (props) => (
		<ol
			className="mt-2 list-decimal list-outside marker:text-muted-foreground pl-5"
			{...props}
		/>
	),
	li: (props) => (
		<li className="pl-1.5 [&>p]:mt-0 text-muted-foreground" {...props} />
	),
	a: ({ href, ...props }) => {
		return (
			<Link
				className="wrap-break-word underline underline-offset-2 text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-ring focus-visible:rounded-xs focus-visible:outline-offset-2"
				href={href}
				draggable={false}
				{...(href?.startsWith("https://")
					? {
							target: "_blank",
							rel: "noopener noreferrer",
						}
					: {})}
				{...props}
			/>
		);
	},
	strong: (props) => <strong className="font-bold" {...props} />,
	p: (props) => (
		<p className="mt-4 font-normal text-muted-foreground" {...props} />
	),
	blockquote: (props) => (
		<blockquote
			className="pl-6 -ml-6 sm:pl-10 sm:-ml-10 md:pl-14 md:-ml-14 not-mobile:text-muted-foreground"
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
			<pre className="mt-4 overflow-x-auto rounded-lg p-4 bg-shiki-background text-shiki-foreground">
				<code
					className="shiki css-variables"
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			</pre>
		);
	},
	code: (props) => {
		return (
			<code className="inline rounded-md px-1.5 py-0.5 bg-shiki-background text-shiki-foreground text-[0.9rem]">
				{props.children}
			</code>
		);
	},
	img: async ({ src, alt, title }) => {
		let img: React.ReactNode;

		if (src.startsWith("https://")) {
			img = (
				<Image
					className="mt-4"
					src={src}
					alt={alt}
					quality={95}
					placeholder="blur"
					draggable={false}
				/>
			);
		} else {
			const image = await import(src);
			img = (
				<Image
					className="mt-4"
					src={image.default}
					alt={alt}
					quality={95}
					placeholder="blur"
					draggable={false}
				/>
			);
		}

		if (title) {
			return <BlockSideTitle title={title}>{img}</BlockSideTitle>;
		}

		return img;
	},
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
