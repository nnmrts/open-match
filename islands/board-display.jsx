import clsx from "clsx";

import PieceDisplay from "@/islands/piece-display.jsx";
import Board from "@/logic/board.js";

/**
 *
 * @param board
 * @param board.id
 * @param boardSnapshot
 */
const BoardDisplay = ({ id, ...boardSnapshot }) => {
	const board = Board.from(boardSnapshot);

	const {
		columns,
		width,
		height
	} = board;

	const broadcastChannel = new BroadcastChannel(`board${id}`);

	const debug = true;

	return (
		<ul
			className="grid h-full grid-flow-col gap-2 p-2"
			style={{
				gridTemplateColumns: `repeat(${width}, 1fr)`,
				gridTemplateRows: `repeat(${height}, 1fr)`,
				aspectRatio: `${width}/${height}`
			}}
		>
			{
				columns
					.map((column, columnIndex) => (
						column
							.map((tile, tileIndex) => {
								const {
									piece, parity, availableMoves
								} = tile;

								return (
									<li
										key={`${columnIndex}-${tileIndex}`}
										className={clsx(
											"h-full aspect-square p-4 relative",
											{
												"backdrop-brightness-75": parity === 0,
												"backdrop-brightness-50": parity === 1,
												"border border-red-600": debug && tile.inMatch()
											}
										)}
									>
										{
											availableMoves.size > 0 && (
												<div
													className="absolute top-0 left-0 flex flex-col items-center justify-between w-full h-full"
												>
													<div
														className={clsx(
															"bg-white h-1/4 w-1",
															{
																"opacity-0": debug && !availableMoves.has("top")
															}
														)}
													/>
													<div className="flex justify-between w-full">
														<div
															className={clsx(
																"bg-white h-1 w-1/4",
																{
																	"opacity-0": debug && !availableMoves.has("left")
																}
															)}
														/>
														<div
															className={clsx(
																"bg-white h-1 w-1/4",
																{
																	"opacity-0": debug && !availableMoves.has("right")
																}
															)}
														/>
													</div>
													<div
														className={clsx(
															"bg-white h-1/4 w-1",
															{
																"opacity-0": debug && !availableMoves.has("bottom")
															}
														)}
													/>
												</div>

											)
										}
										<PieceDisplay {...piece} />
									</li>
								);
							})
					))
			}
		</ul>
	);
};

export default BoardDisplay;
