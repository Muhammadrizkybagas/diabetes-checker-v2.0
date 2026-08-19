import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  /* CONFIG */
  webpack: (config, { isServer }) => {
    // ONNX
    config.resolve.fallback = { 
      fs: false, 
      path: false, 
      crypto: false 
    };

    return config;
  },
};

export default nextConfig;