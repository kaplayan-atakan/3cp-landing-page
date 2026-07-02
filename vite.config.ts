import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The GitHub Pages project site is served from /3cp-landing-page/.
// Local dev/preview stay at the root for convenience; production build
// (and `vite preview`) use the project subpath.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/3cp-landing-page/' : '/',
}));
