import type { MetadataRoute } from "next";
import { env } from "../lib/env";

export default function robots(): MetadataRoute.Robots {
  const isStaging = env.appEnv === "staging";

  return {
    rules: {
      userAgent: "*",
      ...(isStaging ? { disallow: "/" } : { allow: "/" }),
    },
    ...(isStaging ? {} : { sitemap: `${env.appUrl}/sitemap.xml` }),
  };
}
