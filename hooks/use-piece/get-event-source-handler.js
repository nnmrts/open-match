import getPosition from "./get-position.js";

import { moveAttempt as moveAttemptSignal } from "@/signals.js";
import { directionPositions } from "@/utilities/client.js";

/**
 *
 * @param options
 * @param options.data
 * @param options.columnIndex
 * @param options.tileIndex
 * @param options.user
 * @param options.api
 */
const getEventSourceHandler = ({
	columnIndex,
	tileIndex,
	user,
	api
}) => ({ data: dataJson }) => {
	const {
		type,
		payload,
		from
	} = JSON.parse(dataJson);

	switch (type) {
		case "move": {
			const {
				tile: {
					columnIndex: payloadTileColumnIndex,
					tileIndex: payloadTileIndex
				},
				direction: payloadDirection
			} = payload;

			if (
				payloadTileColumnIndex === columnIndex &&
				payloadTileIndex === tileIndex
			) {

			}

			break;
		}

		case "move-attempt": {
			if (from !== user.value.name) {
				const {
					tile: {
						columnIndex: payloadTileColumnIndex,
						tileIndex: payloadTileIndex
					},
					direction: payloadDirection
				} = payload;

				moveAttemptSignal.value = payload;

				if (
					payloadTileColumnIndex === columnIndex &&
					payloadTileIndex === tileIndex
				) {
					if (payloadDirection === "none") {
						api.start({
							x: 0,
							y: 0,
							scale: 1
						});
					}
					else {
						api.start({
							...getPosition({
								directionToMoveTo: payloadDirection,
								positionToMoveTo: directionPositions.get(payloadDirection)
							}),
							scale: 1.2
						});
					}
				}
			}

			break;
		}
		// no default
	}
};

export default getEventSourceHandler;
