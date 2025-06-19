const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const getBasePath = () => {
  if (BASE_URL && BASE_URL.indexOf("/") !== -1) {
    return BASE_URL.substring(BASE_URL.indexOf("/"));
  }
  return undefined;
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: getBasePath(),
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
