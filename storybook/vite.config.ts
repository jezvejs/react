import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const customAliasPaths = [
  'common',
  'stories',
];

export default defineConfig({
    plugins: [react(), svgr({ include: '**/*.svg' })],
    resolve: {
        alias: {
            ...Object.fromEntries(customAliasPaths.map((item) => ([
                item, path.resolve(__dirname, `./src/${item}`),
            ]))),
        },
    },
});
