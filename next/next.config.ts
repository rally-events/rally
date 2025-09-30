import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    externalDir: true,
    turbo: {
      resolveExtensions: [
        ".tsx",
        ".ts",
        ".jsx",
        ".js",
        ".mjs",
        ".json",
      ],
    },
  },
  transpilePackages: ["@rally/schemas", "@rally/db", "@rally/api", "@rally/api-client"],
}

export default nextConfig
