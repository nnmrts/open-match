import Board from "@/logic/board.js";
import { kv } from "@/utilities/server.js";

const handler = {
	POST: async (request, { params: { id }, state: { user: { name: userName } } }) => {
		const shuffle = await request.json();

		const {
			reason
		} = shuffle;

		const broadcastChannel = new BroadcastChannel(id);

		const { value: room } = await kv.get(["rooms", id]);

		const { board: boardSnapshot } = room;

		const board = Board.from(boardSnapshot);

		const boardStates = [];

		await board.update();

		if (reason === "noAvailableMoves" && board.availableMoves.size > 0) {
			return new Response(
				"The board has available moves",
				{
					status: 409
				}
			);
		}

		await board.shuffle({
			consumer: (currentBoard) => {
				boardStates.push(currentBoard);
			}
		});

		// const lastBoardState = boardStates.at(-1);

		const newBoardSnapshot = board.snapshot();

		await kv.set(
			["rooms", id],
			{
				...room,
				board: newBoardSnapshot
			}
		);

		broadcastChannel.postMessage({
			type: "shuffle",
			payload: {
				...shuffle,
				boardStates
			},
			from: userName
		});

		setTimeout(() => {
			broadcastChannel.close();
		}, 5);

		return new Response(
			null,
			{
				status: 204
			}
		);
	}
};

export {
	handler
};
