/**
 *
 * @param options
 * @param options.api
 * @param options.x
 * @param options.y
 */
const effectPosition = ({
	api,
	x,
	y
}) => {
	api.start({
		x,
		y,
		scale: 1
	});
};

export default effectPosition;
