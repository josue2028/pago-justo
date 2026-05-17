import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
const __dirname = dirname(fileURLToPath(import.meta.url));
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            '@app': resolve(__dirname, './src/app'),
            '@domain': resolve(__dirname, './src/domain'),
            '@modules': resolve(__dirname, './src/modules'),
            '@shared': resolve(__dirname, './src/shared'),
            '@core/engine': resolve(__dirname, './src/domain/calculator'),
            '@core/ui': resolve(__dirname, './src/shared/ui'),
            '@core/utils': resolve(__dirname, './src/shared/lib'),
            '@features': resolve(__dirname, './src/modules'),
            '@/core/engine': resolve(__dirname, './src/domain/calculator'),
            '@/core/ui': resolve(__dirname, './src/shared/ui'),
            '@/core/utils': resolve(__dirname, './src/shared/lib'),
            '@/features': resolve(__dirname, './src/modules'),
            '@/pages': resolve(__dirname, './src/app/routes'),
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './tests/setup.ts',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            include: ['src/domain/calculator/**/*.ts'],
        },
    },
});
