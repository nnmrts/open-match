/**
 *
 * @param options
 * @param options.data
 */
const defaultEventHandler = ({
	data
}) => {
	const json = JSON.stringify(data);

	return json;
};

export default defaultEventHandler;
