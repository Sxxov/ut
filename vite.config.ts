import * as p from 'node:path';
import * as fs from 'node:fs/promises';
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
			input: await Promise.all(
				(await fs.readdir('src'))
					.map((filename) => `src/${filename}`)
					.map(async (path) =>
						(await fs.stat(path)).isDirectory()
							? `${path}/index.ts`
							: path,
					),
			),
			output: {
				preserveModules: true,
			},
		},
	},
});
