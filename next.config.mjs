/** @type {import('next').NextConfig} */
const nextConfig = {
  // In development, send no-cache headers for all responses so the browser
  // never serves stale chunk URLs after a restart.
  async headers() {
    if (process.env.NODE_ENV !== 'development') return [];
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
          { key: 'Pragma',        value: 'no-cache' },
        ],
      },
    ];
  },
};

export default nextConfig;
