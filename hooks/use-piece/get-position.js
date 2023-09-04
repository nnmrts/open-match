import { moveAttempt as moveAttemptSignal } from "@/signals.js";
import { directionPositions, oppositeDirections } from "@/utilities/client.js";

/**
 *
 * @param options
 * @param options.tile
 * @param options.maxOffset
 * @param options.moveAttemptTileVicinityEntryPosition
 * @param options.positionToMoveTo
 * @param options.directionToMoveTo
 */
const getPosition = ({
	tile,
	maxOffset,
	positionToMoveTo,
	directionToMoveTo
}) => {
	const {
		value: {
			tile: {
				columnIndex: moveAttemptTileColumnIndex,
				tileIndex: moveAttemptTileIndex
			},
			direction: moveAttemptDirection
		}
	} = moveAttemptSignal;

	const position = {
		x: 0,
		y: 0
	};

	let actualPositionToMoveTo = positionToMoveTo;

	const actualDirectionToMoveTo = directionToMoveTo || moveAttemptDirection;

	if (!actualPositionToMoveTo) {
		if (tile) {
			const moveAttemptTileVicinityEntry = [...tile.vicinity.entries()]
				.find(([
					currentPosition,
					{
						columnIndex: vicinityTileColumnIndex,
						tileIndex: vicinityTileIndex
					}
				]) => (
					vicinityTileColumnIndex === moveAttemptTileColumnIndex &&
					vicinityTileIndex === moveAttemptTileIndex &&
					currentPosition === directionPositions.get(oppositeDirections.get(moveAttemptDirection))
				));

			if (moveAttemptTileVicinityEntry) {
				([actualPositionToMoveTo] = moveAttemptTileVicinityEntry);
			}
		}
	}

	switch (actualDirectionToMoveTo) {
		case "left":
		case "right":
			switch (actualPositionToMoveTo) {
				case "left":
					position.x = -maxOffset;
					break;
				case "right":
					position.x = maxOffset;
					break;

					// no default
			}
			break;
		case "up":
		case "down":
			switch (actualPositionToMoveTo) {
				case "top":
					position.y = -maxOffset;
					break;
				case "bottom":
					position.y = maxOffset;
					break;

					// no default
			}
			break;

			// no default
	}

	return position;
};

export default getPosition;
