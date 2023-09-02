import { useEffect } from "preact/hooks";

/**
 *
 * @param source
 * @param types
 * @param listener
 * @param dependencies
 */
const useEventSourceListener = (
	source,
	types,
	listener,
	dependencies = []
) => {
	useEffect(() => {
		if (source) {
			types.forEach((type) => source.addEventListener(type, listener));

			return () => types.forEach((type) => source.removeEventListener(type, listener));
		}

		return undefined;
	}, [source, ...dependencies]);
};

export default useEventSourceListener;
