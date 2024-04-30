import { defineConfig } from 'vite';
import vitePluginDts from 'vite-plugin-dts';

export default defineConfig({
	plugins: [
		vitePluginDts({
			include: ['src/**/*'],
		}),
	],
	build: {
		target: 'esnext',
		minify: false,
		lib: {
			entry: 'src/index.ts',
			formats: ['es', 'cjs'],
			fileName: (format, entry) =>
				`${entry}.${format === 'cjs' ? 'cjs' : 'js'}`,
		},
		// https://github.com/vitejs/vite/issues/16262
		rollupOptions: {
			input: 'src/index.ts',
			output: {
				preserveModules: true,
			},
		},
	},
});
