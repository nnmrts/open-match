import { useState, useEffect } from "preact/hooks";

import Board from "@/logic/board.js";

/**
 *
 * @param boardSnapshot
 */
const useBoard = (boardSnapshot) => {
	const [board, setBoard] = useState(null);
	const [temporaryBoard, setTemporaryBoard] = useState(null);
	const [loading, setLoading] = useState(true);

	const mutate = async (updatedBoard) => {
		const newBoard = Board.from({ ...updatedBoard.snapshot() });

		await newBoard.update({ solveMatches: false });

		setBoard(newBoard);
	};

	const updateBoard = async () => {
		await temporaryBoard.update();

		setBoard(temporaryBoard);

		setLoading(false);
	};

	useEffect(() => {
		if (boardSnapshot) {
			setLoading(true);

			setTemporaryBoard(Board.from(boardSnapshot));
		}
	}, [JSON.stringify(boardSnapshot)]);

	useEffect(() => {
		if (temporaryBoard) {
			updateBoard();
		}
	}, [temporaryBoard]);

	return {
		board,
		loading,
		mutate
	};
};

export default useBoard;
