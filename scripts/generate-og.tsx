import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";
// biome-ignore lint/correctness/noUnusedImports: We actually need it, liar.
import React from "react";
import satori from "satori";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TITLE_REGEX = /title:\s*[`"']([^`"']+)[`"']/;
const DESCRIPTION_REGEX = /description:\s*[`"']([^`"']+)[`"']/;

// Parse MDX frontmatter/metadata
function parseMDXMetadata(content: string): {
	title?: string;
	description?: string;
	slug?: string;
} {
	const titleMatch = content.match(TITLE_REGEX);
	const descMatch = content.match(DESCRIPTION_REGEX);
	return {
		title: titleMatch?.[1],
		description: descMatch?.[1],
	};
}

// Get all MDX content
async function getContentItems() {
	const items: Array<{ id: string; title: string; description: string }> = [];

	// Read projects
	const projectsDir = path.join(
		__dirname,
		"..",
		"app",
		"projects",
		"_projects"
	);
	try {
		const files = await fs.readdir(projectsDir);
		// TEMP: Log files for debugging
		console.log("Project files:", files);

		for (const file of files.filter((f) => f.endsWith(".mdx"))) {
			const content = await fs.readFile(path.join(projectsDir, file), "utf-8");
			const meta = parseMDXMetadata(content);
			// TEMP: Log metadata for debugging
			console.log("Project meta:", file, meta);

			if (meta.title) {
				items.push({
					id: `projects/${file.replace(".mdx", "")}`,
					title: meta.title,
					description: meta.description || "",
				});
			}
		}
	} catch {
		console.log("⚠️  No projects found");
	}

	// Read writings
	const writingsDir = path.join(
		__dirname,
		"..",
		"app",
		"writings",
		"_articles"
	);
	try {
		const files = await fs.readdir(writingsDir);
		for (const file of files.filter((f) => f.endsWith(".mdx"))) {
			const content = await fs.readFile(path.join(writingsDir, file), "utf-8");
			const meta = parseMDXMetadata(content);
			if (meta.title) {
				items.push({
					id: `writings/${file.replace(".mdx", "")}`,
					title: meta.title,
					description: meta.description || "",
				});
			}
		}
	} catch {
		console.log("⚠️  No writings found");
	}

	// Read timeline
	const timelineDir = path.join(
		__dirname,
		"..",
		"app",
		"timeline",
		"_timeline"
	);
	try {
		const files = await fs.readdir(timelineDir);
		for (const file of files.filter((f) => f.endsWith(".mdx"))) {
			const content = await fs.readFile(path.join(timelineDir, file), "utf-8");
			const meta = parseMDXMetadata(content);
			if (meta.title) {
				items.push({
					id: `timeline/${file.replace(".mdx", "")}`,
					title: meta.title,
					description: meta.description || "",
				});
			}
		}
	} catch {
		console.log("⚠️  No timeline items found");
	}

	return items;
}

// Static pages
const staticPages = [
	{
		id: "home",
		title: "Laxman K R",
		description: "AI Engineer",
	},
	{
		id: "projects",
		title: "Projects",
		description: "Made by Laxman K R",
	},
	{
		id: "writings",
		title: "Writings",
		description: "Thoughts, tutorials, and insights",
	},
	{
		id: "timeline",
		title: "Timeline",
		description: "My journey and experiences",
	},
];

// OG Image Component
function OGImage({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				padding: 80,
				background: "#fcfcfc",
				fontFamily: "ABC Arizona Flare",
			}}
		>
			{/* Header */}
			<div style={{ display: "flex", alignItems: "center", gap: 20 }}>
				<div
					style={{
						width: 60,
						height: 60,
						borderRadius: 12,
						background: "#1447e6",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<svg
						aria-hidden="true"
						fill="white"
						height="32"
						viewBox="0 0 256 256"
						width="32"
					>
						<path d="M240,128a15.79,15.79,0,0,1-10.5,15l-63.44,23.07L143,229.5a16,16,0,0,1-30,0L89.94,166.06,26.5,143a16,16,0,0,1,0-30L89.94,89.94,113,26.5a16,16,0,0,1,30,0l23.07,63.44L229.5,113A15.79,15.79,0,0,1,240,128Z" />
					</svg>
				</div>
				<div
					style={{
						color: "#73773",
						fontSize: 24,
						fontWeight: 700,
						letterSpacing: "0.05em",
					}}
				>
					THALETTO
				</div>
			</div>

			{/* Main Content */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 20,
					flex: 1,
					justifyContent: "center",
				}}
			>
				<h1
					style={{
						fontSize: 72,
						color: "#0a0a0a",
						margin: 0,
						fontWeight: 700,
						lineHeight: 1,
					}}
				>
					{title}
				</h1>

				<p
					style={{
						fontSize: 32,
						color: "#737373",
						margin: 0,
						lineHeight: 1.4,
						maxWidth: "90%",
					}}
				>
					{description}
				</p>
			</div>
		</div>
	);
}

async function generateOGImages() {
	console.log("🎨 Generating Open Graph images...");

	// Ensure output directory exists
	const outputDir = path.join(__dirname, "..", "public", "og");
	await fs.mkdir(outputDir, { recursive: true });

	// Load font
	const arizonaFlarePath = path.join(
		__dirname,
		"..",
		"app",
		"fonts",
		"ABCArizona-FlareRegular.otf"
	);

	let arizonaFlare: ArrayBuffer;

	try {
		const fontBuffer = await fs.readFile(arizonaFlarePath);
		arizonaFlare = fontBuffer.buffer.slice(
			fontBuffer.byteOffset,
			fontBuffer.byteOffset + fontBuffer.byteLength
		) as ArrayBuffer;
	} catch {
		console.log(
			"⚠️  Arizona Flare font not found locally, using system fonts as fallback"
		);
		arizonaFlare = new ArrayBuffer(0);
	}

	// Get all content items
	const contentItems = await getContentItems();
	const allItems = [...staticPages, ...contentItems];

	// Generate all images in parallel
	const imagePromises = allItems.map(async (item) => {
		const id = item.id;
		console.log(`  📸 Generating ${id}.png`);

		try {
			const svg = await satori(
				<OGImage description={item.description} title={item.title} />,
				{
					width: 1200,
					height: 630,
					fonts:
						arizonaFlare.byteLength > 0
							? [
									{
										name: "ABC Arizona Flare",
										data: arizonaFlare,
										weight: 400,
										style: "normal",
									},
								]
							: [],
				}
			);

			const resvg = new Resvg(svg, {
				fitTo: {
					mode: "width",
					value: 1200,
				},
			});

			const pngData = resvg.render();
			const pngBuffer = pngData.asPng();

			const outputPath = path.join(outputDir, `${id}.png`);
			await fs.mkdir(path.dirname(outputPath), { recursive: true });
			await fs.writeFile(outputPath, pngBuffer);

			return { id, success: true };
		} catch (error) {
			console.error(`  ❌ Failed to generate ${id}.png:`, error);
			return { id, success: false, error };
		}
	});

	// Wait for all images to complete
	const results = await Promise.allSettled(imagePromises);

	// Count successes and failures
	const completed = results.filter((r) => r.status === "fulfilled").length;
	const failed = results.filter((r) => r.status === "rejected").length;

	if (failed > 0) {
		console.log(`⚠️  ${failed} images failed to generate`);
	}

	console.log(`✅ Generated ${completed} Open Graph images successfully`);
}

// Run the script
generateOGImages().catch(console.error);
