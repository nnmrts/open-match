/**
 *
 * @param string
 */
const getCssUnit = (string) => {
	const [numberPart, ...unitParts] = string.split(/^(?:(?:\d|\.)+)/u);

	const unitPart = unitParts.join("");

	switch (unitPart) {
		case "px":
			return "pixel";
		case "%":
			return "percentage";
		default:
			throw new Error(`Unknown unit: ${unitPart}`);
	}
};

export default getCssUnit;
