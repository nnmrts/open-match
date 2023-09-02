import { coordinatesConfigResolver } from "./coordinates-config-resolver.js";

export const hoverConfigResolver = {
	...coordinatesConfigResolver,
	mouseOnly: (value = true) => value
};
