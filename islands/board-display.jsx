import { useEffect, useState } from "preact/hooks";

import ColumnsDisplay from "./columns-display.jsx";

import {
	useBoard, useEventSource, useEventSourceListener
} from "@/hooks.js";
import { eventSource as eventSourceSignal } from "@/signals.js";
import Board from "@/logic/board.js";

/**
 *
 * @param board
 * @param board.id
 * @param boardSnapshot
 * @param board.user
 */
// eslint-disable-next-line max-lines-per-function
const BoardDisplay = ({
	id,
	user,
	...boardSnapshot
}) => {
	const {
		board,
		loading: boardLoading,
		mutate: mutateBoard
	} = useBoard(boardSnapshot);

	const [eventSource] = useEventSource(`/api/rooms/${id}/events`, false);

	const [boardStates, setBoardStates] = useState([]);
	const [boardStatesLeft, setBoardStatesLeft] = useState([]);
	const [noAvailableMovesMessageShown, setNoAvailableMovesMessageShown] = useState(false);

	useEffect(() => {
		if (eventSource) {
			eventSourceSignal.value = eventSource;
		}
	}, [eventSource]);

	const debug = false;

	useEventSourceListener(
		eventSourceSignal.value,
		["message"],
		async ({ data }) => {
			const {
				type,
				payload
			} = JSON.parse(data);

			switch (type) {
				case "move":
				case "shuffle": {
					const {
						boardStates: payloadBoardStates
					} = payload;

					setBoardStates(payloadBoardStates);
					break;
				}

				// no default
			}
		}
	);

	const updateBoard = async (boardState, callback = () => {}) => {
		await mutateBoard(Board.from({ ...boardState }));

		callback();

		setBoardStatesLeft((currentBoardStatesLeft) => currentBoardStatesLeft.slice(1));
	};

	useEffect(() => {
		if (boardStates) {
			setBoardStatesLeft(boardStates);
		}
	}, [boardStates]);

	useEffect(() => {
		if (boardStates && boardStates.length > 0 && boardStates.length === boardStatesLeft.length) {
			updateBoard(boardStates[0]);
		}
		else if (boardStatesLeft && boardStatesLeft.length === 0 && noAvailableMovesMessageShown) {
			setNoAvailableMovesMessageShown(false);
		}
	}, [boardStatesLeft]);

	const handleNoAvailableMoves = async () => {
		if (noAvailableMovesMessageShown) {
			await fetch(
				`/api/rooms/${id}/shuffle`,
				{
					method: "POST",
					headers: new Headers({
						"content-type": "application/json"
					}),
					body: JSON.stringify({
						reason: "noAvailableMoves"
					})
				}
			);
		}
	};

	useEffect(() => {
		handleNoAvailableMoves();
	}, [noAvailableMovesMessageShown]);

	useEffect(() => {
		if (board && board.availableMoves.size === 0 && boardStatesLeft.length === 0) {
			setNoAvailableMovesMessageShown(true);
		}
	}, [board, boardStatesLeft]);

	const handleAnimationEnd = async (callback) => {
		// await new Promise((resolve) => {
		// 	setTimeout(resolve, 1000);
		// });

		if (boardStatesLeft.length > 0) {
			updateBoard(boardStatesLeft[0], callback);
		}
	};

	if (boardLoading) {
		return (
			<div className="flex items-center justify-center p-2 h-[min(100%,calc(100vw-var(--main-padding)))]">
				Loading...
			</div>
		);
	}

	const {
		columns
	} = board;

	return (
		<>
			{
				(noAvailableMovesMessageShown) && (
					<div className="absolute z-50 flex flex-col items-center justify-center w-full h-full gap-2 bg-black bg-opacity-75 backdrop-blur-sm">
						<span className="text-3xl font-bold">No available Moves</span>
						<span className="text-3xl font-bold">Shuffling...</span>
					</div>
				)
			}
			<ColumnsDisplay
				{...{
					columns,
					user,
					handleAnimationEnd,
					boardStatesLeft
				}}
			/>
		</>
	);
};

export default BoardDisplay;
