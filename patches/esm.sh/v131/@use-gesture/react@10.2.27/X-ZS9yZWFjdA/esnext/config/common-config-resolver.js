import { V } from "../utils/maths.js";

/**
 *
 * @param v
 */
export const identity = (v) => v;
export const DEFAULT_RUBBERBAND = 0.15;

export const commonConfigResolver = {
	enabled(value = true) {
		return value;
	},
	eventOptions(value, _k, config) {
		return {
			...config.shared.eventOptions,
			...value
		};
	},
	preventDefault(value = false) {
		return value;
	},
	triggerAllEvents(value = false) {
		return value;
	},
	rubberband(value = 0) {
		switch (value) {
			case true:
				return [DEFAULT_RUBBERBAND, DEFAULT_RUBBERBAND];
			case false:
				return [0, 0];
			default:
				return V.toVector(value);
		}
	},
	from(value) {
		if (typeof value === "function") {
			return value;
		}
		// eslint-disable-next-line eqeqeq
		if (value != null) {
			return V.toVector(value);
		}
	},
	transform(value, _k, config) {
		const transform = value || config.shared.transform;

		this.hasCustomTransform = Boolean(transform);

		const originalTransform = transform || identity;

		return (v) => {
			const r = originalTransform(v);

			if (!isFinite(r[0]) || !isFinite(r[1])) {
				// eslint-disable-next-line no-console
				console.warn(`[@use-gesture]: config.transform() must produce a valid result, but it was: [${r[0]},${[1]}]`);
			}

			return r;
		};

		return transform || identity;
	},
	threshold(value) {
		return V.toVector(value, 0);
	}
};

Object.assign(commonConfigResolver, {
	domTarget(value) {
		if (value !== undefined) {
			throw Error("[@use-gesture]: `domTarget` option has been renamed to `target`.");
		}

		return NaN;
	},
	lockDirection(value) {
		if (value !== undefined) {
			throw Error(
				"[@use-gesture]: `lockDirection` option has been merged with `axis`. Use it as in `{ axis: 'lock' }`"
			);
		}

		return NaN;
	},
	initial(value) {
		if (value !== undefined) {
			throw Error("[@use-gesture]: `initial` option has been renamed to `from`.");
		}

		return NaN;
	}
});
