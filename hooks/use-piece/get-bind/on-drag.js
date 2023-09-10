import handleMoveAttempt from "@/hooks/use-piece/handle-move-attempt.js";
import { directions } from "@/utilities/client.js";

const clientUpdateInterval = 10;
const minRelevantOffset = 0;

/**
 *
 * @param options
 * @param options.active
 * @param options.offset
 * @param options.offset.0
 * @param options.offset.1
 * @param options.elapsedTime
 * @param options.api
 * @param options.tileIndex
 * @param options.columnIndex
 */
const onDrag = ({
	active,
	offset: [xOffset, yOffset],
	elapsedTime,
	api,
	tileIndex,
	columnIndex
}) => {
	const type = Math.abs(xOffset) > Math.abs(yOffset)
		? "horizontal"
		: "vertical";

	const post = Math.round(elapsedTime) % clientUpdateInterval === 0 &&
		Math.abs(xOffset) >= minRelevantOffset;

	if (type === "horizontal") {
		api.start({
			x: xOffset,
			y: 0,
			scale: 1,
			immediate: (name) => name === "x"
		});

		handleMoveAttempt(
			directions.get(type).get(Math.sign(xOffset)),
			{
				tileIndex,
				columnIndex,
				post
			}
		);
	}
	else if (type === "vertical") {
		api.start({
			x: 0,
			y: active ? yOffset : 0,
			scale: 1,
			immediate: (name) => name === "y"
		});

		handleMoveAttempt(
			directions.get(type).get(Math.sign(yOffset)),
			{
				tileIndex,
				columnIndex,
				post
			}
		);
	}
};

export default onDrag;
