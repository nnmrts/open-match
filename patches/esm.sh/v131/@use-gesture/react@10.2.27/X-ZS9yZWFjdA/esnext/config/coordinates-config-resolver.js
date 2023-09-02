import { commonConfigResolver } from "./common-config-resolver.js";

const DEFAULT_AXIS_THRESHOLD = 0;

export const coordinatesConfigResolver = {
	...commonConfigResolver,
	axis(
		_v,
		_k,
		{ axis }
	) {
		this.lockDirection = axis === "lock";
		if (!this.lockDirection) {
			return axis;
		}
	},
	axisThreshold(value = DEFAULT_AXIS_THRESHOLD) {
		return value;
	},
	bounds(
		value = {}
	) {
		if (typeof value === "function") {
			// @ts-ignore
			return (state) => coordinatesConfigResolver.bounds(value(state));
		}

		if ("current" in value) {
			return () => value.current;
		}

		if (typeof HTMLElement === "function" && value instanceof HTMLElement) {
			return value;
		}

		const {
			left = -Infinity, right = Infinity, top = -Infinity, bottom = Infinity
		} = value;

		return [[left, right], [top, bottom]];
	}
};
