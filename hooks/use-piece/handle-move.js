import useBoardId from "@/hooks/use-board-id.js";
import handleUnavailableMove from "@/hooks/use-piece/handle-unavailble-move.js";

/**
 *
 * @param direction
 * @param options
 * @param options.availableMoves
 * @param options.columnIndex
 * @param options.tileIndex
 * @param options.api
 * @param options.maxOffset
 */
const handleMove = async (
	direction,
	{
		availableMoves,
		columnIndex,
		tileIndex,
		api,
		maxOffset
	}
) => {
	const boardId = useBoardId();

	if (availableMoves.has(direction)) {
		const payload = {
			tile: {
				columnIndex,
				tileIndex
			},
			direction
		};

		await fetch(
			`/api/rooms/${boardId}/move`,
			{
				method: "POST",
				headers: new Headers({
					"content-type": "application/json;charset=UTF-8"
				}),
				body: JSON.stringify(payload)
			}
		);
	}
	else {
		handleUnavailableMove(
			direction,
			{
				api,
				maxOffset
			}
		);
	}
};

export default handleMove;
