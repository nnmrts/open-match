/**
 *
 */
const useBoardId = () => {
	const { pathname } = window?.location || {};

	return pathname?.split("/")[1];
};

export default useBoardId;
