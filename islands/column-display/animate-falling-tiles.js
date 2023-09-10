import { maxDuration } from "@/islands/column-display/constants.js";

/**
 *
 * @param options
 * @param options.matchedTileIndices
 * @param options.gridMeasurements
 * @param options.column
 * @param options.dispatch
 */
const animateFallingTiles = async ({
	matchedTileIndices,
	gridMeasurements,
	column,
	dispatch
}) => {
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

	const fallingTiles = column
		.filter(({ tileIndex }) => !matchedTileIndices.includes(tileIndex))
		.map(({ vicinity, tileIndex }) => {
			let numberOfMatchedTilesBelow = 0;
			let tileBelow = vicinity.get("bottom");

			while (tileBelow) {
				if (tileBelow.inMatch()) {
					numberOfMatchedTilesBelow += 1;
				}

				tileBelow = tileBelow.vicinity.get("bottom");
			}

			return [tileIndex, numberOfMatchedTilesBelow];
		})
		.filter(([, numberOfMatchedTilesBelow]) => numberOfMatchedTilesBelow > 0);

	let totalDuration = 0;

	for (const [tileIndex, numberOfMatchedTilesBelow] of fallingTiles) {
		const durationMilliseconds = maxDuration;

		const gapPixels = gapUnit === "pixel" ? gap : gridHeight * (gap / 100);

		const offsetInPixels = (
			(
				gapPixels +
				tileHeight
			) *
			numberOfMatchedTilesBelow
		);

		dispatch({
			type: "set",
			payload: [
				[
					tileIndex,
					{
						type: "falling",
						durationMilliseconds,
						offsetInPixels
					}
				]
			]
		});

		totalDuration = Math.max(totalDuration, durationMilliseconds);
	}

	const emptyTileIndices = Array(matchedTileIndices.length)
		.fill()
		.map((empty, index) => index);

	for (const emptyTileIndex of emptyTileIndices) {
		const durationMilliseconds = maxDuration;

		dispatch({
			type: "set",
			payload: [
				[
					`refilling-${emptyTileIndex}`,
					{
						type: "falling",
						durationMilliseconds
					}
				]
			]
		});

		totalDuration = Math.max(totalDuration, durationMilliseconds);
	}

	await new Promise((resolve) => {
		setTimeout(resolve, totalDuration);
	});
};

export default animateFallingTiles;
