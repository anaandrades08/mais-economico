/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

// Cria o equivalente a __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const nextConfig = {
    webpack: (config) => {
      // Adiciona aliases ao Webpack
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname),
        '@components': path.resolve(__dirname, 'components'),
        '@lib': path.resolve(__dirname, 'lib'),
        '@api': path.resolve(__dirname, 'api'),
        '@styles': path.resolve(__dirname, 'styles'),
        '@app': path.resolve(__dirname, 'app'),
      };
      return config;
    },
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

export default nextConfig; // Agora exporta diretamente a configuração sem o PWA
