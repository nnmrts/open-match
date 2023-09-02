import "std/dotenv/load";

import manifest from "./fresh.gen.ts";

import { start } from "$fresh/server.ts";
import freshConfig from "@/fresh.config.js";

await start(
	manifest,
	freshConfig
);
