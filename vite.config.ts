import path from 'path';
import checker from 'vite-plugin-checker';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import 'jotai/babel/plugin-react-refresh';

// ----------------------------------------------------------------------

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const PORT = parseInt(process.env.VITE_PORT);

  return defineConfig({
    plugins: [
      TanStackRouterVite(),
      react({ babel: { plugins: ['jotai/babel/plugin-react-refresh'] } }),
      checker({
        typescript: true,
        eslint: {
          useFlatConfig: true,
          lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
          dev: { logLevel: ['error'] },
        },
        overlay: {
          position: 'tl',
          initialIsOpen: false,
        },
      }),
    ],
    build: {
      sourcemap: true,
    },
    resolve: {
      alias: [
        {
          find: /^~(.+)/,
          replacement: path.resolve(process.cwd(), 'node_modules/$1'),
        },
        {
          find: /^src(.+)/,
          replacement: path.resolve(process.cwd(), 'src/$1'),
        },
      ],
    },
    server: {
      port: PORT,
      host: true,
      proxy: {
        [process.env.VITE_API_URL]: {
          target: process.env.VITE_API_DOMAIN,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: { port: PORT, host: true },
  });
};
