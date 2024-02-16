import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), svgr({ include: '**/*.svg' })],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.js'),
            name: '@jezvejs/react',
            formats: ['es', 'umd'],
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
