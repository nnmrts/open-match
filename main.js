import "std/dotenv/load";

import prefetchPlugin from "prefetch";

import manifest from "./fresh.gen.ts";
import twindConfig from "./twind.config.js";

import twindPlugin from "$fresh/plugins/twindv1.ts";
import { start } from "$fresh/server.ts";

const {
	env
} = Deno;

await start(
	manifest,
	{
		plugins: [twindPlugin(twindConfig), prefetchPlugin({ throttle: 4 })],
		port: Number(env.get("PORT")) || 3000
	}
);
