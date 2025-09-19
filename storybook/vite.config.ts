import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const customAliasPaths = [
    'common',
    'stories',
];

export default defineConfig({
    plugins: [react(), svgr({ include: '**/*.svg' })],
    resolve: {
        alias: {
            ...Object.fromEntries(customAliasPaths.map((item) => ([
                item, path.resolve(dirname, `./${item}`),
            ]))),
        },
    },
});
