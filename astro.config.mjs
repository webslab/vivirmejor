// @ts-check
import { defineConfig, sharpImageService } from "astro/config";

import lit from "@astrojs/lit";
import purgecss from "astro-purgecss";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
	site: "https://base.kennycallado.dev",
	server: {
		port: 3000,
	},
	vite: {
		esbuild: {
			target: "es2021",
		},
		build: {
			rollupOptions: {
				external: [
					"sharp",
				],
			},
		},
	},
	image: {
		service: sharpImageService(),
		remotePatterns: [{ protocol: "https" }],
	},
	integrations: [
		lit(),
		sitemap(),
		purgecss({
			keyframes: false,
			safelist: {
				greedy: [/*astro*/],
				deep: [
					/dropdown-menu-end/,
				],
			},
		}),
	],
});
