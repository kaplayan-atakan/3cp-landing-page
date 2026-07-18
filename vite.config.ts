import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The GitHub Pages project site is served from /3cp-landing-page/.
// `vite dev` stays at the root for convenience; the production build AND
// `vite preview` use the project subpath — preview serves the built output,
// whose asset URLs are already absolute under /3cp-landing-page/, so a root
// base would 404 every one of them. `command` is 'serve' for both dev and
// preview, so it can't tell them apart; `isPreview` (Vite compares it `=== true`)
// is what distinguishes preview from dev.
export default defineConfig(({ command, isPreview }) => ({
  plugins: [react()],
  base: command === 'build' || isPreview === true ? '/3cp-landing-page/' : '/',
}));
