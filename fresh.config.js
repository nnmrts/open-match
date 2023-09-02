import "std/dotenv/load";

import twindConfig from "./twind.config.js";

import twindPlugin from "$fresh/plugins/twindv1.ts";
import { defineConfig } from "$fresh/server.ts";

const {
	env
} = Deno;

const freshConfig = defineConfig({
	plugins: [twindPlugin(twindConfig)],
	port: Number(env.get("PORT")) || 3000
});

export default freshConfig;
