import { useEffect, useState } from "preact/hooks";

/**
 *
 * @param query
 */
const useMediaQuery = (query) => {
	const getMatches = (innerQuery) => {
	// Prevents SSR issues
		if (typeof window.matchMedia !== "undefined") {
			return window.matchMedia(innerQuery).matches;
		}

		return false;
	};

	const [matches, setMatches] = useState(getMatches(query));

	const handleChange = () => {
		setMatches(getMatches(query));
	};

	useEffect(() => {
		const matchMedia = window.matchMedia(query);

		// Triggered at the first client-side load and if query changes
		handleChange();

		matchMedia.addEventListener("change", handleChange);

		return () => {
			matchMedia.removeEventListener("change", handleChange);
		};
	}, [query]);

	return matches;
};

export default useMediaQuery;
