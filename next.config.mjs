/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

// Configuração do PWA (único plugin ativo)
const pwaConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

// Configuração principal
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Adicione aqui os experimentos que quiser
    optimizeCss: true,
    scrollRestoration: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'seusite.com', // Substitua pelo seu domínio real
        port: '',
        pathname: '/**', // Permite todas as subpastas
      },
      {
        protocol: 'https',
        hostname: 'cdn.seusite.com', // Se usar CDN
      }
    ],
    formats: ['image/webp'], // Força conversão para WebP
    deviceSizes: [640, 750, 828, 1080, 1200], // Tamanhos responsivos
    minimumCacheTTL: 86400, // Cache de 1 dia (em segundos)
    unoptimized: process.env.NODE_ENV === 'development', // Mantém para dev
  },
};

export default pwaConfig(nextConfig); // Removido withAnalyzer