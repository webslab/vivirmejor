// @ts-check
import { defineConfig, sharpImageService } from "astro/config";
import { WEBSLAB_PROJECT, WEBSLAB_SITE } from "./src/_includes/lib/consts.ts";

import lit from "@astrojs/lit";
import purgecss from "astro-purgecss";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
	site: WEBSLAB_SITE,
	server: {
		port: 3000,
	},

	vite: {
		esbuild: {
			target: "es2021",
		},

		server: {
			proxy: {
				"/filefind": {
					target: WEBSLAB_SITE,
					changeOrigin: true,
					secure: false,
				},

				["/" + WEBSLAB_PROJECT]: {
					target: WEBSLAB_SITE,
					changeOrigin: true,
					secure: false,
				},
			},
			cors: false,
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
				standard: [/^jodit/, /article-video/],
				greedy: [/*astro*/],
				deep: [
					/dropdown-menu-end/,
				],
			},
		}),
	],
});
