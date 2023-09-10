import { axisVariables, directionAxes } from "@/utilities/client.js";

/**
 *
 * @param direction
 * @param options
 * @param options.api
 * @param options.maxOffset
 */
const handleUnavailableMove = (direction, { api, maxOffset }) => {
	api.start({
		to: Array(2)
			.fill()
			.map(() => {
				const axisVariable = axisVariables.get(directionAxes.get(direction));

				return Array(3)
					.fill()
					.map((empty, index) => ({
						[axisVariable]: (maxOffset / 5) * (index - 1)
					}));
			})
			.flat()
			.slice(0, -1),
		config: {
			duration: 50
		}
	});
};

export default handleUnavailableMove;
