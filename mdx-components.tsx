import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { codeToHtml, createCssVariablesTheme } from "shiki";

// @ts-ignore
import { BlockMath, InlineMath } from "react-katex";

import { BlockSideTitle } from "@/components/common/block-sidetitle";
import { Card } from "@/components/common/card";
import LinkChip from "@/components/common/link-chip";
import About from "@/components/about";

const cssVariablesTheme = createCssVariablesTheme({});

export const components: Record<
    string,
    (props: any) => ReactNode | Promise<ReactNode>
> = {
    h1: (props) => (
        <h1
            className="font-semibold text-xl md:text-3xl mb-8 text-rurikon-600 text-balance"
            {...props}
        />
    ),
    h2: (props) => (
        <h2
            className="font-semibold text-lg md:text-2xl mt-8 text-rurikon-600 text-balance"
            {...props}
        />
    ),
    h3: (props) => (
        <h3
            className="font-semibold text-base md:text-xl mt-8 text-rurikon-600 text-balance"
            {...props}
        />
    ),
    ul: (props) => (
        <ul
            className="mt-2 list-disc list-outside marker:text-rurikon-200 pl-5"
            {...props}
        />
    ),
    ol: (props) => (
        <ol
            className="mt-2 list-decimal list-outside marker:text-rurikon-200 pl-5"
            {...props}
        />
    ),
    li: (props) => <li className="pl-1.5 [&>p]:mt-0" {...props} />,
    a: ({ href, ...props }) => {
        return (
            <Link
                className="wrap-break-word decoration-from-font underline underline-offset-2 decoration-rurikon-300 hover:decoration-rurikon-600 focus-visible:outline focus-visible:outline-rurikon-400
        focus-visible:rounded-xs
        focus-visible:outline-offset-1
        focus-visible:outline-dotted"
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
    p: (props) => <p className="mt-4" {...props} />,
    blockquote: (props) => (
        <blockquote
            className="pl-6 -ml-6 sm:pl-10 sm:-ml-10 md:pl-14 md:-ml-14 not-mobile:text-rurikon-400"
            {...props}
        />
    ),
    pre: (props) => (
        <pre
            className="mt-4 whitespace-pre md:whitespace-pre-wrap"
            {...props}
        />
    ),
    code: async (props) => {
        if (typeof props.children === "string") {
            const code = await codeToHtml(props.children, {
                lang: "jsx",
                theme: cssVariablesTheme,
                // theme: 'min-light',
                // theme: 'snazzy-light',
                transformers: [
                    {
                        // Since we're using dangerouslySetInnerHTML, the code and pre
                        // tags should be removed.
                        pre: (hast) => {
                            if (hast.children.length !== 1) {
                                throw new Error(
                                    "<pre>: Expected a single <code> child",
                                );
                            }
                            if (hast.children[0].type !== "element") {
                                throw new Error(
                                    "<pre>: Expected a <code> child",
                                );
                            }
                            return hast.children[0];
                        },
                        postprocess(html) {
                            return html.replace(/^<code>|<\/code>$/g, "");
                        },
                    },
                ],
            });

            return (
                <code
                    className="
                      inline shiki css-variables
                      rounded-md px-1.5 py-0.5
                      bg-rurikon-50
                      text-rurikon-700
                      text-[0.805rem] sm:text-[13.8px] md:text-[0.92rem]
                    "
                    dangerouslySetInnerHTML={{ __html: code }}
                />
            );
        }

        return <code className="inline" {...props} />;
    },
    Card,
    Image,
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
    hr: (props) => (
        <hr className="my-14 w-24 border-rurikon-border" {...props} />
    ),
    BlockSideTitle,
    InlineMath,
    BlockMath,
    LinkChip,
    About,
};

export function useMDXComponents(inherited: MDXComponents): MDXComponents {
    return {
        ...inherited,
        ...(components as any),
    };
}
