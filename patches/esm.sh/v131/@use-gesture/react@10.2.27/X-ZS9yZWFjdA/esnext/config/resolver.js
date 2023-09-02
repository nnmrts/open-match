import { ConfigResolverMap } from "../actions.js";

import { sharedConfigResolver } from "./shared-config-resolver.js";

/**
 *
 * @param config
 * @param resolvers
 */
export function resolveWith(
	config = {},
	resolvers
) {
	const result = {};

	for (const [key, resolver] of Object.entries(resolvers)) {
		switch (typeof resolver) {
			case "function":
				const r = resolver.call(result, config[key], key, config);

				// prevents deprecated resolvers from applying in dev mode
				if (!Number.isNaN(r)) {
					result[key] = r;
				}
				break;
			case "object":
				result[key] = resolveWith(config[key], resolver);
				break;
			case "boolean":
				if (resolver) {
					result[key] = config[key];
				}
				break;
		}
	}

	return result;
}

/**
 *
 * @param newConfig
 * @param gestureKey
 * @param _config
 */
export function parse(newConfig, gestureKey, _config = {}) {
	const {
		target, eventOptions, window, enabled, transform, ...rest
	} = newConfig;

	_config.shared = resolveWith({
		target,
		eventOptions,
		window,
		enabled,
		transform
	}, sharedConfigResolver);

	if (gestureKey) {
		const resolver = ConfigResolverMap.get(gestureKey);

		_config[gestureKey] = resolveWith({
			shared: _config.shared,
			...rest
		}, resolver);
	}
	else {
		for (const key in rest) {
			const resolver = ConfigResolverMap.get(key);

			if (resolver) {
				_config[key] = resolveWith({
					shared: _config.shared,
					...rest[key]
				}, resolver);
			}
			else if (![
				"drag",
				"pinch",
				"scroll",
				"wheel",
				"move",
				"hover"
			].includes(key)) {
				if (key === "domTarget") {
					throw Error("[@use-gesture]: `domTarget` option has been renamed to `target`.");
				}
				// eslint-disable-next-line no-console
				console.warn(
					`[@use-gesture]: Unknown config key \`${key}\` was used. Please read the documentation for further information.`
				);
			}
		}
	}

	return _config;
}
