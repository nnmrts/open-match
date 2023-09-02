import Board from "@/logic/board.js";
import { kv } from "@/utilities/server.js";

const handler = {
	POST: async (request, { params: { id }, state: { user: { name: userName } } }) => {
		const move = await request.json();

		const broadcastChannel = new BroadcastChannel(id);

		const { value: room } = await kv.get(["rooms", id]);

		const { board: boardSnapshot } = room;

		const board = Board.from(boardSnapshot);

		const boardStates = [];

		await board.update();

		await board.move({
			...move,
			consumer: (currentBoard) => {
				boardStates.push(currentBoard);
			}
		});

		const newBoardSnapshot = board.snapshot();

		await kv.set(
			["rooms", id],
			{
				...room,
				board: newBoardSnapshot
			}
		);

		broadcastChannel.postMessage({
			type: "move",
			payload: {
				...move,
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
