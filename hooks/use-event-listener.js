import { useEffect, useRef } from "preact/hooks";

import useIsomorphicLayoutEffect from "./use-isomorphic-layout-effect.js";

// MediaQueryList Event based useEventListener interface

/**
 *
 * @param eventName
 * @param handler
 * @param element
 * @param options
 */
const useEventListener = (
	eventName,
	handler,
	element,
	options
) => {
	// Create a ref that stores handler
	const savedHandler = useRef(handler);

	useIsomorphicLayoutEffect(() => {
		savedHandler.current = handler;
	}, [handler]);

	useEffect(() => {
		// Define the listening target
		const targetElement = element?.current ?? window;

		if (targetElement && targetElement.addEventListener) {
			// Create event listener that calls handler function stored in ref
			const listener = (event) => savedHandler.current(event);

			targetElement.addEventListener(eventName, listener, options);

			// Remove event listener on cleanup
			return () => {
				targetElement.removeEventListener(eventName, listener, options);
			};
		}

		return () => {
			// do nothing
		};
	}, [
		eventName,
		element,
		options
	]);
};

export default useEventListener;
