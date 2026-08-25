import path from 'path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'professorjavas.com',
      },
    ],
  },
}

export default nextConfig
