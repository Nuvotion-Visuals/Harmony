const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true
  },
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname
  }
}

module.exports = withBundleAnalyzer(nextConfig)
