import { defineConfig } from 'dumi';
import path from 'path';
const proxy = require('./config/proxy.ts');

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: '',
  },
  proxy,
  alias: {
    '@': path.resolve(__dirname, '.dumi'),
  },
  conventionRoutes: {
    exclude: [/\/components\//, /\/models\//],
  },
});
