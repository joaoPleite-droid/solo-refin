/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite rodar `next build` sem pisar na pasta do servidor de desenvolvimento.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
