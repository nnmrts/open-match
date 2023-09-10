import { minDuration } from "@/islands/column-display/constants.js";

/**
 *
 * @param options
 * @param options.currentColumn
 * @param options.gridMeasurements
 * @param options.column
 * @param options.dispatch
 */
// eslint-disable-next-line max-statements
const animateSwappedTiles = async ({
	gridMeasurements,
	column,
	currentColumn,
	dispatch
}) => {
	let totalDuration = 0;

	if (currentColumn) {
		const matchedTileIndices = currentColumn
			.filter((tile) => tile.inMatch())
			.map((tile) => tile.tileIndex);

		if (matchedTileIndices.length === 0) {
			const changedTiles = currentColumn
				.filter(({
					tileIndex,
					piece: {
						color
					}
				}) => color !== column[tileIndex].piece.color);

			if (changedTiles.length > 0) {
				totalDuration = minDuration;

				const {
					height: {
						value: gridHeight,
						unit: gridHeightUnit
					},
					gap: {
						value: gap,
						unit: gapUnit
					},
					tileHeight: {
						value: tileHeight,
						unit: tileHeightUnit
					}
				} = gridMeasurements;

				const gapPixels = gapUnit === "pixel" ? gap : gridHeight * (gap / 100);

				const offsetInPixels = (
					(
						gapPixels +
						tileHeight
					)
				);

				if (changedTiles.length === 1) {
					// left or right
					const [tile] = changedTiles;
					const newTile = column[tile.tileIndex];

					let direction = "none";

					if (
						tile.vicinity.get("left")?.piece?.color !==
						newTile.vicinity.get("left")?.piece?.color
					) {
						direction = "left";
					}
					else if (
						tile.vicinity.get("right")?.piece?.color !==
						newTile.vicinity.get("right")?.piece?.color
					) {
						if (column.columnIndex === 0) {
							direction = "right";
						}
					}

					dispatch({
						type: "set",
						payload: [
							[
								`swap-${tile.tileIndex}`,
								{
									type: direction,
									durationMilliseconds: minDuration,
									offsetInPixels
								}
							]
						]
					});
				}
				else if (changedTiles.length === 2) {
					// up and down

					const [topTile, bottomTile] = changedTiles;

					const states = [[topTile, "down"], [bottomTile, "up"]];

					for (const [tile, direction] of states) {
						dispatch({
							type: "set",
							payload: [
								[
									`swap-${tile.tileIndex}`,
									{
										type: direction,
										durationMilliseconds: minDuration,
										offsetInPixels
									}
								]
							]
						});
					}
				}
			}
		}
	}

	await new Promise((resolve) => {
		setTimeout(resolve, totalDuration);
	});
};

export default animateSwappedTiles;
