import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(process.cwd(), 'index.html'),
          register: path.resolve(process.cwd(), 'register.html'),
          login: path.resolve(process.cwd(), 'login.html'),
          dashboard: path.resolve(process.cwd(), 'dashboard.html'),
          language: path.resolve(process.cwd(), 'language.html'),
          quiz: path.resolve(process.cwd(), 'quiz.html'),
          aptitude: path.resolve(process.cwd(), 'aptitude.html'),
          result: path.resolve(process.cwd(), 'result.html'),
          profile: path.resolve(process.cwd(), 'profile.html'),
          gate: path.resolve(process.cwd(), 'gate.html'),
          upgrade: path.resolve(process.cwd(), 'upgrade.html'),
          
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
