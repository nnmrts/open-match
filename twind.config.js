import { defineConfig } from "@twind/core";
import presetTailwind from "@twind/preset-tailwind";
import presetAutoprefix from "@twind/preset-autoprefix";

import tailwindConfig from "./tailwind.config.js";

const {
	content,
	theme
} = tailwindConfig;

export default {
	content,
	...defineConfig({
		presets: [presetTailwind(), presetAutoprefix()],
		theme
	}),
	selfURL: import.meta.url
};
