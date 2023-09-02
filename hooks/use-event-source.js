import {
	useRef, useState, useEffect
} from "preact/hooks";

import useSsr from "./use-ssr.js";

/**
 *
 * @param url
 * @param withCredentials
 * @param ESClass
 */
const useEventSource = (url, withCredentials) => {
	const { isBrowser } = useSsr();

	if (isBrowser) {
		const source = useRef(null);
		const [status, setStatus] = useState("init");

		useEffect(() => {
			if (url) {
				const eventSource = new EventSource(url, { withCredentials });

				source.current = eventSource;

				eventSource.addEventListener("open", () => setStatus("open"));
				eventSource.addEventListener("error", () => setStatus("error"));

				return () => {
					source.current = null;
					eventSource.close();
				};
			}

			setStatus("closed");

			return undefined;
		}, [
			url,
			withCredentials,
			EventSource
		]);

		return [source.current, status];
	}

	return [null, "closed"];
};

export default useEventSource;
