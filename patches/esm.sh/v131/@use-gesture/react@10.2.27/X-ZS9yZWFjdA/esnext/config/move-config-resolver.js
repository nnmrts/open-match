import { coordinatesConfigResolver } from "./coordinates-config-resolver.js";

export const moveConfigResolver = {
	...coordinatesConfigResolver,
	mouseOnly: (value = true) => value
};
