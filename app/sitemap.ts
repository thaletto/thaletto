import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://thaletto.vercel.app",
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: "https://thaletto.vercel.app/projects",
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: "https://thaletto.verce.app/thoughts",
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
        },
    ];
}
