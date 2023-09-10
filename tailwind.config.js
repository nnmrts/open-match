export default {
	content: [
		"./routes/**/*.jsx",
		"./components/**/*.jsx",
		"./islands/**/*.jsx"
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ["\"Inter\"", "sans-serif"],
				mono: ["\"Roboto Mono\"", "monospace"]
			},
			keyframes: {
				match: {
					"0%": {
						transform: "scale(1)",
						filter: "brightness(1) drop-shadow(0px 0px 0px currentColor)"
					},
					"50%": {
						transform: "scale(1.25)",
						filter: "brightness(1.25) drop-shadow(0px 0px 20px currentColor)"
					},
					"100%": {
						transform: "scale(0)",
						filter: "brightness(1) drop-shadow(0px 0px 100px currentColor)"
					}
				}
			},
			animation: {
				match: "match 500ms ease-in-out forwards"
			},
			screens: {
				"portrait-room": {
					raw: "(min-aspect-ratio: 1/1.4)"
				}
			}
		},
		gridTemplateColumns: {
			header: "50% repeat(auto-fit,minmax(5%,1fr))",
			headerMobile: "75% repeat(auto-fit,minmax(5%,1fr))",
			cards: "repeat(auto-fill, minmax(200px, 1fr))",
			"cards-lg": "repeat(auto-fill, minmax(300px, 1fr))"
		}
	}
};
