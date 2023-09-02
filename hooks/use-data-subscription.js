import { useEffect } from "preact/hooks";

/**
 * The same as useEffect, but also cleans up when the page is hidden and re-runs
 * the effect when the page is shown again.
 *
 * @param callback
 * @param array
 */
const useDataSubscription = (callback, array) => {
	useEffect(() => {
		let cleanup = callback();

		const pageHideHandler = () => {
			cleanup?.();
			cleanup = undefined;
		};

		addEventListener("pagehide", pageHideHandler);
		const pageShowHandler = () => {
			cleanup?.();
			cleanup = callback();
		};

		addEventListener("pageshow", pageShowHandler);

		return () => {
			cleanup?.();
			cleanup = undefined;
			removeEventListener("pagehide", pageHideHandler);
			removeEventListener("pageshow", pageShowHandler);
		};
	}, array);
};

export default useDataSubscription;
