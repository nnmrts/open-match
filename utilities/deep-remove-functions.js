/**
 *
 * @param object
 */
const deepRemoveFunctions = (object) => Object.fromEntries(
	Object.entries(object)
		.filter(([key, value]) => typeof value !== "function")
		.map(([key, value]) => {
			if (typeof value === "object" && value !== null) {
				return [key, deepRemoveFunctions(value)];
			}

			return [key, value];
		})
);

export default deepRemoveFunctions;
