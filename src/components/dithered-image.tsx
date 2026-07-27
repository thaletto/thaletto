"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { sounds } from "@/lib/sound";
import { cn } from "@/lib/utils";

const BAYER = [
	[0, 8, 2, 10],
	[12, 4, 14, 6],
	[3, 11, 1, 9],
	[15, 7, 13, 5],
] as const;

export function DitheredImage({
	alt,
	caption,
	className,
	height,
	priority = false,
	src,
	width,
}: {
	alt: string;
	caption?: string;
	className?: string;
	height: number;
	priority?: boolean;
	src: string;
	width: number;
}) {
	const imageRef = useRef<HTMLImageElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const closeRef = useRef<HTMLButtonElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const [zoomed, setZoomed] = useState(false);

	useEffect(() => {
		const image = imageRef.current;
		const canvas = canvasRef.current;
		if (!(image && canvas)) {
			return;
		}
		const draw = () => {
			const rect = image.getBoundingClientRect();
			const columns = Math.max(1, Math.round(rect.width / 3));
			const rows = Math.max(1, Math.round(rect.height / 3));
			const sample = document.createElement("canvas");
			sample.width = columns;
			sample.height = rows;
			const sampleContext = sample.getContext("2d", {
				willReadFrequently: true,
			});
			const context = canvas.getContext("2d");
			if (!(sampleContext && context)) {
				return;
			}
			sampleContext.drawImage(image, 0, 0, columns, rows);
			const pixels = sampleContext.getImageData(0, 0, columns, rows).data;
			const ratio = window.devicePixelRatio || 1;
			canvas.width = Math.round(rect.width * ratio);
			canvas.height = Math.round(rect.height * ratio);
			context.setTransform(ratio, 0, 0, ratio, 0, 0);
			context.fillStyle = "#fcfcfc";
			context.fillRect(0, 0, rect.width, rect.height);
			context.fillStyle = "#343434";
			const cellWidth = rect.width / columns;
			const cellHeight = rect.height / rows;
			for (let row = 0; row < rows; row += 1) {
				for (let column = 0; column < columns; column += 1) {
					const index = (row * columns + column) * 4;
					const luminance =
						(0.2126 * pixels[index] +
							0.7152 * pixels[index + 1] +
							0.0722 * pixels[index + 2]) /
						255;
					if (1 - luminance > (BAYER[row % 4][column % 4] + 0.5) / 16) {
						context.fillRect(
							column * cellWidth,
							row * cellHeight,
							cellWidth + 0.2,
							cellHeight + 0.2
						);
					}
				}
			}
		};
		if (image.complete) {
			draw();
		} else {
			image.addEventListener("load", draw, { once: true });
		}
		const resizeObserver = new ResizeObserver(draw);
		resizeObserver.observe(image);
		return () => resizeObserver.disconnect();
	}, []);

	useEffect(() => {
		if (!zoomed) {
			return;
		}
		const close = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				sounds.playCue("close").catch(() => undefined);
				setZoomed(false);
			} else if (event.key === "Tab") {
				event.preventDefault();
				closeRef.current?.focus();
			}
		};
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", close);
		closeRef.current?.focus();
		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", close);
			triggerRef.current?.focus();
		};
	}, [zoomed]);

	function openZoom() {
		sounds.playCue("open").catch(() => undefined);
		setZoomed(true);
	}

	return (
		<>
			<span className={cn("dithered-figure", className)}>
				<button
					aria-label={`Open ${alt || "image"}`}
					className="dithered-image group"
					onClick={openZoom}
					ref={triggerRef}
					type="button"
				>
					{/* biome-ignore lint/performance/noImgElement: canvas needs the decoded DOM image */}
					<img
						alt=""
						decoding="async"
						fetchPriority={priority ? "high" : "auto"}
						height={height}
						ref={imageRef}
						src={src}
						width={width}
					/>
					<canvas aria-hidden className="dither-canvas" ref={canvasRef} />
				</button>
				{caption ? <span className="dithered-caption">{caption}</span> : null}
			</span>
			{zoomed && typeof document !== "undefined"
				? createPortal(
						<div
							aria-label={alt || "Expanded image"}
							aria-modal="true"
							className="image-lightbox"
							role="dialog"
						>
							<button
								aria-label="Close image"
								className="lightbox-close"
								onClick={() => {
									sounds.playCue("close").catch(() => undefined);
									setZoomed(false);
								}}
								ref={closeRef}
								type="button"
							>
								<X />
							</button>
							{/* biome-ignore lint/performance/noImgElement: preserve intrinsic zoom size */}
							<img alt={alt} height={height} src={src} width={width} />
						</div>,
						document.body
					)
				: null}
		</>
	);
}
