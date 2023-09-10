import clsx from "clsx";

import PieceDisplay from "@/islands/piece-display.jsx";

/**
 *
 * @param props
 * @param props.columnIndex
 * @param props.tileIndex
 * @param props.transition
 * @param props.nextTransition
 * @param props.nextTile
 * @param props.columnHeight
 * @param props.piece
 * @param props.parity
 * @param props.availableMoves
 * @param props.user
 * @param props.inMatch
 * @param props.animationState
 * @param props.refillingAnimationState
 * @param props.swapAnimationState
 */
const TileDisplay = ({
	columnIndex,
	tileIndex,
	transition,
	nextTransition,
	nextTile,
	columnHeight,
	piece,
	parity,
	availableMoves,
	user,
	inMatch,
	animationState,
	refillingAnimationState,
	swapAnimationState,
	...tile
}) => {
	const debug = false;

	return (
		<li
			key={`${columnIndex}-${tileIndex}`}
			className={clsx(
				"h-full aspect-square p-[20%] relative w-full"
			)}
			// style={{
			// 	zIndex: (columnHeight - tileIndex) + 1
			// }}
		>
			<PieceDisplay
				{...{
					...piece,
					animationState,
					availableMoves,
					columnIndex,
					inMatch,
					nextTile,
					refillingAnimationState,
					swapAnimationState,
					tile,
					tileIndex,
					transition,
					user
				}}
			/>
		</li>
	);
};

export default TileDisplay;
