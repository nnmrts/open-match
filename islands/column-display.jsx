import {
	useEffect, useState, useReducer
} from "preact/hooks";

import TileDisplay from "./tile-display.jsx";

const minDuration = 250;
const maxDuration = 500;

const reducer = (state, action) => {
	const {
		type,
		payload
	} = action;

	switch (type) {
		case "set":
			return new Map([...state, ...payload]);
		case "delete":
			return new Map([...state].filter(([key]) => key !== payload));
		case "clear":
			return new Map([...state].map(([key]) => [key, { type: "none" }]));
		default:
			return state;
	}
};

/**
 *
 * @param props
 * @param props.column
 * @param props.columnIndex
 * @param props.user
 * @param props.handleColumnAnimationEnd
 * @param props.gridMeasurements
 * @param props.nextColumn
 * @param props.handled
 */
// eslint-disable-next-line max-lines-per-function
const ColumnDisplay = ({
	column,
	columnIndex,
	user,
	handleColumnAnimationEnd,
	handled,
	gridMeasurements,
	nextColumn
}) => {
	const [currentColumn, setCurrentColumn] = useState(null);
	const [currentNextColumn, setCurrentNextColumn] = useState(null);
	const [animationStates, dispatchAnimationStates] = useReducer(
		reducer,
		new Map([
			...column.map((tile) => [
				[
					tile.tileIndex,
					{
						type: "none"
					}
				],
				[
					`refilling-${tile.tileIndex}`,
					{
						type: "none"
					}
				]
			]).flat()
		])
	);

	const animateMatchedTiles = async (matchedTileIndices) => {
		for (const tileIndex of matchedTileIndices) {
			dispatchAnimationStates({
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
			setTimeout(resolve, minDuration);
		});

		for (const tileIndex of matchedTileIndices) {
			dispatchAnimationStates({
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
			setTimeout(resolve, maxDuration);
		});
	};

	const animateFallingTiles = async (matchedTileIndices) => {
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
			const durationMilliseconds = (
				(tileIndex * (maxDuration - minDuration)) /
				(column.length - 1)
			) +
			minDuration;

			const gapPixels = gapUnit === "pixel" ? gap : gridHeight * (gap / 100);

			const offsetInPixels = (
				(
					gapPixels +
					tileHeight
				) *
				numberOfMatchedTilesBelow
			);

			dispatchAnimationStates({
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
			const durationMilliseconds = (
				(emptyTileIndex * (maxDuration - minDuration)) /
				(column.length - 1)
			) +
			minDuration;

			const gapPixels = gapUnit === "pixel" ? gap : gridHeight * (gap / 100);

			const offsetInPixels = (
				(
					gapPixels +
					tileHeight
				) *
				emptyTileIndices.length
			);

			dispatchAnimationStates({
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

	const animateTiles = async () => {
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

		const matchedTileIndices = column
			.filter((tile) => tile.inMatch())
			.map((tile) => tile.tileIndex);

		await animateMatchedTiles(matchedTileIndices);
		await animateFallingTiles(matchedTileIndices);

		if (!handled) {
			handleColumnAnimationEnd(columnIndex, true);
		}
	};

	useEffect(() => {
		if (column && gridMeasurements) {
			dispatchAnimationStates({
				type: "clear"
			});
		}
	}, [column, gridMeasurements]);

	useEffect(() => {
		if ([...animationStates.values()].every(({ type }) => type === "none")) {
			if (column && gridMeasurements) {
				setCurrentColumn(column);
			}
		}
	}, [animationStates]);

	useEffect(() => {
		if ([...animationStates.values()].every(({ type }) => type === "none")) {
			if (column && gridMeasurements) {
				animateTiles();
			}
		}
	}, [currentColumn]);

	useEffect(() => {
		if (nextColumn) {
			setCurrentNextColumn(nextColumn);
		}
	}, [nextColumn]);

	if (!currentColumn) {
		return (
			<li
				className="h-full aspect-square p-[20%] relative w-full"
			/>
		);
	}

	return currentColumn
		.map((tile, tileIndex) => {
			const {
				availableMoves
			} = tile;

			return (
				<TileDisplay
					key={`${columnIndex}-${tileIndex}`}
					{...{
						...tile,
						availableMoves,
						inMatch: tile.inMatch(),
						columnHeight: column.length,
						nextTile: currentNextColumn?.[tileIndex],
						user,
						animationState: animationStates.get(tileIndex),
						refillingAnimationState: animationStates.get(`refilling-${tileIndex}`)
					}}
				/>
			);
		});
};

export default ColumnDisplay;
