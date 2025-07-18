import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    plugins: [react(), svgr({ include: '**/*.svg' })],
    build: {
        lib: {
            entry: resolve('src/index.ts'),
            name: '@jezvejs/react',
            formats: ['es'],
            fileName: (format) => `jezvejs-react.${format}.js`,
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
    },
});
