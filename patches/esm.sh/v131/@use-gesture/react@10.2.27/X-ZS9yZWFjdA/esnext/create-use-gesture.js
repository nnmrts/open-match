import { registerAction } from "./actions.js";
import { parseMergedHandlers } from "./parser.js";
import { useRecognizers } from "./use-recognizers.js";

/**
 *
 * @param actions
 */
export function createUseGesture(actions) {
	actions.forEach(registerAction);

	return function useGesture(
		_handlers,
		_config
	) {
		const {
			handlers, nativeHandlers, config
		} = parseMergedHandlers(_handlers, _config || {});

		return useRecognizers(handlers, config, undefined, nativeHandlers);
	};
}
