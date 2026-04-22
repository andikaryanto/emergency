import type { MetadataRoute } from "next";
import { blogPosts } from "../lib/blog-posts";
import { env } from "../lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  if (env.appEnv === "staging") {
    return [];
  }

  const baseUrl = env.appUrl;
  const lastModified = new Date();
  const blogEntries = blogPosts.map((post) => ({
    url: baseUrl + "/blog/" + post.slug,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: baseUrl + "/produk",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: baseUrl + "/fitur",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: baseUrl + "/harga",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: baseUrl + "/faq",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: baseUrl + "/terms",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: baseUrl + "/contact",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: baseUrl + "/blog",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogEntries,
    {
      url: baseUrl + "/signup",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
