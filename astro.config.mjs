// @ts-check
import { defineConfig, sharpImageService } from "astro/config";
import { WEBSLAB_DOMAIN, WEBSLAB_PROJECT } from "./src/_includes/lib/consts.ts";

import lit from "@astrojs/lit";
import purgecss from "astro-purgecss";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
	site: `https://${WEBSLAB_PROJECT}.${WEBSLAB_DOMAIN}`,
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
					target: "http://localhost:8000",
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
				standard: [/^jodit/],
				greedy: [/*astro*/],
				deep: [
					/dropdown-menu-end/,
				],
			},
		}),
	],
});
