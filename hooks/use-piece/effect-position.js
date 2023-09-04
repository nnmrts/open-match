/**
 *
 * @param root0
 * @param root0.api
 * @param root0.x
 * @param root0.y
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
