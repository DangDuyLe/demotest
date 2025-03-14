/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'ipfs.io',
      'gateway.ipfs.io',
      'ipfs.infura.io',
      'nft-cdn.alchemy.com',
      'i.seadn.io',
      'raw.githubusercontent.com',
      'gateway.pinata.cloud',
      'cloudflare-ipfs.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ipfs.dweb.link',
      },
      {
        protocol: 'https',
        hostname: '**.arweave.net',
      }
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side polyfills
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        path: require.resolve('path-browserify'),
        buffer: require.resolve('buffer/'),
        fs: false,
        net: false,
        tls: false,
        http: false,
        https: false,
        zlib: false
      }
    }

    // Ignore native module build errors
    config.resolve.alias = {
      ...config.resolve.alias,
      './build/Release/ecdh': false,
    }

    return config
  },
}

module.exports = nextConfig 