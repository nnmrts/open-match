/**
 *
 * @param root0
 * @param root0.data
 */
const defaultEventHandler = ({
	data
}) => {
	const json = JSON.stringify(data);

	return json;
};

export default defaultEventHandler;
