import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";

const jobs = defineCollection({
  name: "jobs",
  directory: "content/jobs",
  include: "**/*.md",
  schema: z.object({
    jobTitle: z.string(),
    summary: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    company: z.string(),
    location: z.string(),
    tags: z.array(z.string()),
    content: z.string(),
  }),
});

const education = defineCollection({
  name: "education",
  directory: "content/education",
  include: "**/*.md",
  schema: z.object({
    degree: z.string(),
    institution: z.string(),
    location: z.string(),
    result: z.object({
      value: z.number(),
      type: z.enum(["CGPA", "Percent"]),
    }),
    summary: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    tags: z.array(z.string()),
    content: z.string(),
  }),
});

const projects = defineCollection({
  name: "projects",
  directory: "content/projects",
  include: "**/*.md",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    image: z.string(),
    link: z.string().optional(),
    content: z.string(),
  }),
});

const blogs = defineCollection({
  name: "blogs",
  directory: "content/blogs",
  include: "**/*.md",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    content: z.string(),
  }),
});

const about = defineCollection({
  name: "about",
  directory: "content/about",
  include: "**/*.md",
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    content: z.string(),
  }),
});

export default defineConfig({
  collections: [jobs, education, projects, blogs, about],
});
