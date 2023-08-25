#!/usr/bin/env -S deno run -A --unstable --watch=static/,routes/import "std/dotenv/load";

import dev from "$fresh/dev.ts";

// await tailwindCSS({
// 	...tailwindConfig
// });

await dev(import.meta.url, "./main.js");
