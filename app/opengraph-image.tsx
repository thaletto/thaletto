// app/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage({ title }: { title?: string }) {
    return new ImageResponse(
        <div
            style={{
                background: "#fcfcfc",
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: 'column',
                alignItems: "center",
                justifyContent: "center",
                padding: 80,
            }}
        >
            <h1
                style={{
                    fontSize: 72,
                    fontWeight: 700,
                    color: "#4a515b",
                    textAlign: "center",
                    lineHeight: 1.2,
                    maxWidth: 1000,
                }}
            >
                {"Laxman K R"}
            </h1>
            <h2
                style={{
                    fontSize: 58,
                    fontWeight: 600,
                    color: "#4a515b",
                    textAlign: "center",
                    lineHeight: 1.2,
                    maxWidth: 1000,
                }}
            >
                AI Engineer
            </h2>
        </div>,
        size,
    );
}
