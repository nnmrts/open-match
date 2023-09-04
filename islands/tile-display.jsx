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
	...tile
}) => {
	const debug = false;

	return (
		<li
			key={`${columnIndex}-${tileIndex}`}
			className={clsx(
				"h-full aspect-square p-[20%] relative w-full",
				{
					"backdrop-brightness-75": parity === 0,
					"backdrop-brightness-50": parity === 1,
					"border border-red-600": debug && inMatch
				}
			)}
			style={{
				zIndex: (columnHeight - tileIndex) + 1
			}}
		>
			{
				availableMoves.size > 0 && (
					<div
						className="absolute top-0 left-0 flex flex-col items-center justify-between w-full h-full pointer-events-none"
					>
						<div
							className={clsx(
								"bg-white h-1/4 w-1",
								{
									"opacity-0": !debug || !availableMoves.has("up")
								}
							)}
						/>
						<div className="flex justify-between w-full">
							<div
								className={clsx(
									"bg-white h-1 w-1/4",
									{
										"opacity-0": !debug || !availableMoves.has("left")
									}
								)}
							/>
							<div
								className={clsx(
									"bg-white h-1 w-1/4",
									{
										"opacity-0": !debug || !availableMoves.has("right")
									}
								)}
							/>
						</div>
						<div
							className={clsx(
								"bg-white h-1/4 w-1",
								{
									"opacity-0": !debug || !availableMoves.has("down")
								}
							)}
						/>
					</div>

				)
			}
			<PieceDisplay
				{...{
					...piece,
					animationState,
					availableMoves,
					columnIndex,
					inMatch,
					nextTile,
					refillingAnimationState,
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
