import { axisVariables, directionAxes } from "@/utilities/client.js";

/**
 *
 * @param direction
 * @param root0
 * @param root0.api
 * @param root0.maxOffset
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
