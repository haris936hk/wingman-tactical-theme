import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {reactRouter} from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    hydrogen(),
    oxygen(),
    reactRouter(),
    tsconfigPaths(),
  ],
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0,
  },
  ssr: {
    optimizeDeps: {
      /**
       * Include dependencies here if they throw CJS<>ESM errors.
       * For example, for the following error:
       *
       * > ReferenceError: module is not defined
       * >   at /Users/.../node_modules/example-dep/index.js:1:1
       *
       * Include 'example-dep' in the array below.
       * @see https://vitejs.dev/config/dep-optimization-options
       */
      include: ['set-cookie-parser', 'cookie', 'react-router'],
    },
    // Exclude browser-only 3D libraries from server bundle
    external: [
      'three',
      'three-globe',
      'three-conic-polygon-geometry',
      'three-fatline',
      'three-geojson-geometry',
      '@react-three/fiber',
      '@react-three/drei',
      '@tweenjs/tween.js',
      'yaot',
      'suspend-react',
      'd3-geo',
      'd3-array',
      'd3-color',
      'd3-interpolate',
      'd3-scale',
      'd3-scale-chromatic',
    ],
    noExternal: [],
  },
  server: {
    allowedHosts: ['.tryhydrogen.dev'],
  },
});
