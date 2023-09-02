import { useEffect, useState } from "preact/hooks";

import TileDisplay from "./tile-display.jsx";

const minDuration = 250;
const maxDuration = 500;

/**
 *
 * @param props
 * @param props.column
 * @param props.columnIndex
 * @param props.user
 * @param props.handleColumnAnimationEnd
 * @param props.gridMeasurements
 * @param props.nextColumn
 */
// eslint-disable-next-line max-lines-per-function
const ColumnDisplay = ({
	column,
	columnIndex,
	user,
	handleColumnAnimationEnd,
	gridMeasurements,
	nextColumn
}) => {
	const [currentColumn, setCurrentColumn] = useState(null);
	const [transitions, setTransitions] = useState(new Map());

	const animateTiles = async () => {
		const {
			height: gridHeight,
			gapPercentage,
			tileHeight
		} = gridMeasurements;

		setCurrentColumn(column);

		const newTransitions = new Map();

		const matchedTileIndices = column
			.filter((tile) => tile.inMatch())
			.map((tile) => tile.tileIndex);

		// for (const tileIndex of matchedTileIndices) {
		// 	newTransitions.set(
		// 		tileIndex,
		// 		{
		// 			transform: "scale(0)",
		// 			transitionDuration: `${maxDuration}ms`,
		// 			transitionDelay: `${minDuration}ms`
		// 		}
		// 	);
		// }

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

		for (const [tileIndex, numberOfMatchedTilesBelow] of fallingTiles) {
			const durationMilliseconds = (
				(tileIndex * (maxDuration - minDuration)) /
				(column.length - 1)
			) +
			minDuration;

			const offsetInPixels = (
				(
					(gridHeight * (gapPercentage / 100)) +
					tileHeight
				) *
				numberOfMatchedTilesBelow
			);

			newTransitions.set(
				tileIndex,
				{
					transform: `translateY(${offsetInPixels}px)`,
					transitionDuration: `${maxDuration}ms`,
					transitionDelay: `${maxDuration}ms`
				}
			);
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

			const offsetInPixels = (
				(
					(gridHeight * (gapPercentage / 100)) +
					tileHeight
				) *
				emptyTileIndices.length
			);

			newTransitions.set(
				`next-${emptyTileIndex}`,
				{
					transform: "translateY(0%)",
					transitionDuration: `${durationMilliseconds}ms`,
					transitionDelay: `${maxDuration}ms`,
					opacity: 1
				}
			);
		}

		await new Promise((resolve) => {
			setTimeout(resolve, maxDuration);
		});

		setTransitions(newTransitions);
	};

	const updateColumn = async () => {
		const firstMatchedTileIndex = column.findIndex((tile) => tile.inMatch());

		if (firstMatchedTileIndex === -1) {
			setCurrentColumn(column);

			setTimeout(
				() => {
					if (transitions.size > 0) {
						setTransitions(new Map());
					}
					handleColumnAnimationEnd(columnIndex, true);
				},
				1000
			);
		}
		else {
			animateTiles();
		}
	};

	useEffect(() => {
		updateColumn();
	}, [column]);

	useEffect(() => {
		if (transitions && transitions.size > 0) {
			const longestDuration = Math.max(
				...[...transitions]
					.map(([, { transitionDuration, transitionDelay = "0ms" }]) => Number(transitionDuration.replace(/ms$/u, "")) + Number(transitionDelay.replace(/ms$/u, "")))
			);

			setTimeout(
				() => {
					setTransitions(new Map());
					handleColumnAnimationEnd(columnIndex, false);
				},
				longestDuration
			);
		}
	}, [transitions]);

	// useEffect(() => {
	// 	if (currentColumn) {
	// 		setTransitions(new Map());
	// 	}
	// }, [currentColumn]);

	const debug = true;

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

			console.log("tile");
			console.log(tile);

			return (
				<TileDisplay
					key={`${columnIndex}-${tileIndex}`}
					{...{
						...tile,
						availableMoves,
						inMatch: tile.inMatch(),
						columnHeight: column.length,
						nextTile: nextColumn?.[tileIndex],
						nextTransition: transitions.get(`next-${tileIndex}`),
						transition: transitions.get(tileIndex),
						user
					}}
				/>
			);
		});
};

export default ColumnDisplay;
