/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cadmaxpro-buket.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/**',
      }
    ]
  }
};

export default nextConfig;
