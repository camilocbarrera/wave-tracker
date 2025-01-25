/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    OPENCELLID_API_KEY: process.env.OPENCELLID_API_KEY,
  },
}

export default nextConfig
