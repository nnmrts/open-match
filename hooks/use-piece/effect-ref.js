/**
 *
 * @param options
 * @param options.ref
 * @param options.setDisplayedWidth
 */
const effectRef = ({
	ref,
	setDisplayedWidth
}) => {
	if (ref.current) {
		const {
			width
		} = ref.current.getBoundingClientRect();

		setDisplayedWidth(width);
	}
};

export default effectRef;
