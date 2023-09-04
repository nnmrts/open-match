import handleMove from "@/hooks/use-piece/handle-move.js";
import { directions } from "@/utilities/client.js";
import handleMoveAttempt from "@/hooks/use-piece/handle-move-attempt.js";

/**
 *
 * @param options
 * @param options.offset
 * @param options.offset.0
 * @param options.offset.1
 * @param options.availableMoves
 * @param options.columnIndex
 * @param options.tileIndex
 * @param options.api
 * @param options.maxOffset
 */
const onDragEnd = ({
	offset: [xOffset, yOffset],
	availableMoves,
	columnIndex,
	tileIndex,
	api,
	maxOffset
}) => {
	api.start({
		x: 0,
		y: 0,
		scale: 1
	});

	const type = Math.abs(xOffset) > Math.abs(yOffset)
		? "horizontal"
		: "vertical";

	if (xOffset !== 0 || yOffset !== 0) {
		if (type === "horizontal") {
			handleMove(
				directions.get(type).get(Math.sign(xOffset)),
				{
					availableMoves,
					columnIndex,
					tileIndex,
					api,
					maxOffset
				}
			);
		}
		else if (type === "vertical") {
			handleMove(
				directions.get(type).get(Math.sign(yOffset)),
				{
					availableMoves,
					columnIndex,
					tileIndex,
					api,
					maxOffset
				}
			);
		}
	}
	else {
		console.log("IMPLEMENT CLICK MOVE");
	}

	handleMoveAttempt(
		"none",
		{
			columnIndex,
			tileIndex
		}
	);
};

export default onDragEnd;
