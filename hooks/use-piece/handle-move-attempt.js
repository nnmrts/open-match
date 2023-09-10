import { moveAttempt as moveAttemptSignal } from "@/signals.js";
import useBoardId from "@/hooks/use-board-id.js";

/**
 *
 * @param direction
 * @param options
 * @param options.columnIndex
 * @param options.tileIndex
 * @param options.post
 */
const handleMoveAttempt = async (
	direction,
	{
		columnIndex,
		tileIndex,
		post = true
	}
) => {
	const boardId = useBoardId();

	const value = {
		tile: {
			columnIndex,
			tileIndex
		},
		direction
	};

	moveAttemptSignal.value = value;

	if (post) {
		await fetch(
			`/api/rooms/${boardId}/move-attempt`,
			{
				method: "POST",
				headers: new Headers({
					"content-type": "application/json"
				}),
				body: JSON.stringify(value)
			}
		);
	}
};

export default handleMoveAttempt;
