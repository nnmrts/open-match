import { useEffect, useReducer } from "preact/hooks";

import TileDisplay from "./tile-display.jsx";
import animateMatchedTiles from "./column-display/animate-matched-tiles.js";
import animateFallingTiles from "./column-display/animate-falling-tiles.js";
import animateSwappedTiles from "./column-display/animate-swapped-tiles.js";

const minDuration = 250;
const maxDuration = 500;

const reducer = (state, action) => {
	const { type, payload } = action;

	switch (type) {
		case "ADVANCE":
			return {
				...state,
				animationStep: state.animationStep + 1
			};
		case "RESET_ANIMATIONS_AND_ADVANCE":
			return {
				...state,
				animationStates: new Map(
					[...state.animationStates]
						.map(([key]) => [key, { type: "none" }])
				),
				animationStep: state.animationStep + 1
			};
		case "RESET":
			return {
				...state,
				animationStep: 0
			};
		case "CLEAR_ANIMATIONS_AND_ADVANCE":
			return {
				...state,
				animationStates: new Map(
					[...state.animationStates]
						.map(([key]) => [key, { type: "none" }])
				),
				animationStep: state.animationStep + 1
			};
		case "SET_ANIMATION_AND_COLUMN_AND_ADVANCE":
			return {
				...state,
				animationStates: payload.animationStates,
				currentColumn: payload.currentColumn,
				currentNextColumn: payload.currentNextColumn,
				animationStep: state.animationStep + 1
			};

		case "set":
			return {
				...state,
				animationStates: new Map([...state.animationStates, ...payload])
			};

		case "clear":
			return {
				...state,
				animationStates: new Map(
					[...state.animationStates]
						.map(([key]) => [key, { type: "none" }])
				)
			};

		case "stop":
			return {
				...state,
				animationStates: new Map(
					[...state.animationStates]
						.map(([key]) => [key, { type: "stop" }])
				)
			};

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
 * @param props.boardStatesLeft
 * @param props.boardStates
 */
// eslint-disable-next-line max-lines-per-function
const ColumnDisplay = ({
	column,
	columnIndex,
	user,
	handleColumnAnimationEnd,
	handled,
	gridMeasurements,
	nextColumn,
	boardStatesLeft,
	boardStates
}) => {
	const debug = columnIndex === 0;

	const initialState = {
		animationStates: new Map([
			...column.map((tile) => [
				[tile.tileIndex, { type: "none" }],
				[`refilling-${tile.tileIndex}`, { type: "none" }],
				[`swap-${tile.tileIndex}`, { type: "none" }]
			]).flat()
		]),
		currentColumn: null,
		currentNextColumn: null,
		animationStep: 0
	};

	const [state, dispatch] = useReducer(reducer, initialState);
	const {
		animationStates,
		currentColumn,
		currentNextColumn,
		animationStep
	} = state;

	const animateTiles = async () => {
		const matchedTileIndices = column
			.filter((tile) => tile.inMatch())
			.map((tile) => tile.tileIndex);

		await animateMatchedTiles({
			matchedTileIndices,
			dispatch
		});

		await animateFallingTiles({
			matchedTileIndices,
			gridMeasurements,
			column,
			dispatch
		});
	};

	useEffect(() => {
		// Start the animation sequence when column and gridMeasurements are available
		if (column && gridMeasurements) {
			dispatch({
				type: "ADVANCE"
			});
		}
	}, [column, gridMeasurements]);

	useEffect(() => {
		if (animationStep === 1) {
			// Clear animation states
			dispatch({
				type: "CLEAR_ANIMATIONS_AND_ADVANCE"
			});
		}

		if (animationStep === 2) {
			if (boardStatesLeft.length === boardStates.length - 1) {
				// Perform swapped tile animations if on first board state
				animateSwappedTiles({
					gridMeasurements,
					column,
					currentColumn,
					dispatch
				}).then(() => {
					dispatch({
						type: "ADVANCE"
					});
				});
			}
			else {
				// only dispatch advance
				dispatch({
					type: "ADVANCE"
				});
			}
		}

		if (animationStep === 3) {
			// Stop animations and set current column simultaneously

			dispatch({
				type: "SET_ANIMATION_AND_COLUMN_AND_ADVANCE",
				payload: {
					animationStates: new Map(
						[...animationStates]
							.map(([key, { type }]) => [key, { type: key.startsWith?.("swap") ? "stop" : type }])
					),
					currentColumn: column,
					currentNextColumn: nextColumn
				}
			});
		}

		if (animationStep === 4) {
			// Animate tiles after current column is set
			animateTiles().then(() => {
				dispatch({
					type: "ADVANCE"
				});
			});
		}

		if (animationStep === 5) {
			// Reset everything
			dispatch({
				type: "RESET_ANIMATIONS_AND_ADVANCE"
			});
		}

		if (animationStep === 6) {
			if (!handled) {
				handleColumnAnimationEnd(columnIndex);
			}

			dispatch({
				type: "RESET"
			});
		}
	}, [animationStep]);

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
						refillingAnimationState: animationStates.get(`refilling-${tileIndex}`),
						swapAnimationState: animationStates.get(`swap-${tileIndex}`)
					}}
				/>
			);
		});
};

export default ColumnDisplay;
