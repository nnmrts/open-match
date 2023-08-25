import { defineConfig } from "https://esm.sh/@twind/core@1.1.3";
import presetTailwind from "https://esm.sh/@twind/preset-tailwind";
import presetAutoprefix from "https://esm.sh/@twind/preset-autoprefix";

export default {
	...defineConfig({
		presets: [presetTailwind(), presetAutoprefix()],
		theme: {
			extend: {
				fontFamily: {
					sans: ["\"Inter\"", "sans-serif"],
					mono: ["\"Roboto Mono\"", "monospace"]
				}
			}
		}
	}),
	selfURL: import.meta.url
};
