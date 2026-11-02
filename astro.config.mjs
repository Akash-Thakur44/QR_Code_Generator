import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

const deploymentTarget =
  process.env.ASTRO_DEPLOY_TARGET ?? (process.env.VERCEL ? 'vercel' : 'node');

if (deploymentTarget !== 'node' && deploymentTarget !== 'vercel') {
  throw new Error(`Unsupported ASTRO_DEPLOY_TARGET: ${deploymentTarget}`);
}

export default defineConfig({
  output: 'server',
  adapter:
    deploymentTarget === 'vercel'
      ? vercel()
      : node({ mode: 'standalone' }),
  integrations: [react()],
  security: {
    checkOrigin: false
  },
  vite: {
    plugins: [tailwindcss()],
  }
});
