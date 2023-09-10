import { useState } from "react";

import useEventListener from "./use-event-listener.js";
import useIsomorphicLayoutEffect from "./use-isomorphic-layout-effect.js";

/**
 *
 */
const useWindowSize = () => {
	const [windowSize, setWindowSize] = useState({
		width: 0,
		height: 0
	});

	const handleSize = () => {
		setWindowSize({
			width: window.innerWidth,
			height: window.innerHeight
		});
	};

	useEventListener("resize", handleSize);

	// Set size at the first client-side load
	useIsomorphicLayoutEffect(() => {
		handleSize();
	}, []);

	return windowSize;
};

export default useWindowSize;
