import { maxDuration, minDuration } from "./constants.js";

/**
 *
 * @param options
 * @param options.matchedTileIndices
 * @param options.dispatch
 */
const animateMatchedTiles = async ({
	matchedTileIndices,
	dispatch
}) => {
	for (const tileIndex of matchedTileIndices) {
		dispatch({
			type: "set",
			payload: [
				[
					tileIndex,
					{
						type: "matching",
						durationMilliseconds: minDuration
					}
				]
			]
		});
	}

	await new Promise((resolve) => {
		setTimeout(resolve, matchedTileIndices.length > 0 ? minDuration : 0);
	});

	for (const tileIndex of matchedTileIndices) {
		dispatch({
			type: "set",
			payload: [
				[
					tileIndex,
					{
						type: "matched",
						durationMilliseconds: maxDuration
					}
				]
			]
		});
	}

	await new Promise((resolve) => {
		setTimeout(resolve, matchedTileIndices.length > 0 ? maxDuration : 0);
	});
};

export default animateMatchedTiles;
