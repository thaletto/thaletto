import { promises as fs } from "fs";
import { Metadata } from "next";
import path from "path";

export default async function Page(props: {
    params: Promise<{
        slug: string;
    }>;
}) {
    const params = await props.params;
    const { default: MDXContent, metadata } = await import(
        "../_projects/" + `${params.slug}.mdx`
    );

    return <MDXContent />;
}

export async function generStaticParams() {
    const projects = await fs.readdir(
        path.join(process.cwd(), "app", "projects", "_projects"),
    );

    return projects
        .filter((name) => name.endsWith(".mdx"))
        .map((name) => ({
            params: {
                slug: name.replace(/\.mdx$/, ""),
            },
        }));
}

export async function generateMetadata(props: {
    params: Promise<{
        slug: string;
    }>;
}): Promise<Metadata> {
    const params = await props.params;
    const metadata = (await import("../_projects/" + `${params.slug}.mdx`))
        .metadata;
    return {
        title: metadata.title,
        description: metadata.description,
    };
}
