/**
 *
 * @param options
 * @param options.data
 * @param options.id
 * @param options.payload
 * @param options.boardStates
 */
const moveEventHandler = ({
	payload,
	boardStates
}) => {
	const json = JSON.stringify({
		type: "move",
		payload: {
			...payload,
			boardStates
		}
	});

	return json;
};

export default moveEventHandler;
