/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

import { Controller } from "./controller.js";

/**
 * Utility hook called by all gesture hooks and that will be responsible for
 * the internals.
 *
 * @param {InternalHandlers} handlers
 * @param {GenericOptions} config
 * @param {GestureKey} gestureKey
 * @param {NativeHandler} nativeHandlers
 * @return Nothing when config.target is set, a binding function when not.
 */
export function useRecognizers(
	handlers,
	config = {},
	gestureKey,
	nativeHandlers
) {
	const ctrl = React.useMemo(() => new Controller(handlers), []);

	ctrl.applyHandlers(handlers, nativeHandlers);
	ctrl.applyConfig(config, gestureKey);

	React.useEffect(ctrl.effect.bind(ctrl));

	React.useEffect(() => ctrl.clean.bind(ctrl), []);

	// When target is undefined we return the bind function of the controller which
	// returns prop handlers.
	// @ts-ignore
	if (config.target === undefined) {
		return ctrl.bind.bind(ctrl);
	}

	return undefined;
}
