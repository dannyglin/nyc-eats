/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so the site can be hosted on GitHub Pages.
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
}

module.exports = nextConfig
