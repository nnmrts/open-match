import { kv } from "@/utilities.js";
import Board from "@/logic/board.js";

const handler = {
	GET: async (request, context) => {
		const roomEntries = await kv.list({ prefix: ["rooms"] });

		const rooms = [];

		for await (const { value } of roomEntries) {
			rooms.push(value);
		}

		return new Response(
			JSON.stringify(rooms),
			{
				headers: new Headers({
					"content-type": "application/json;charset=UTF-8"
				})
			}
		);
	},
	POST: async (request, context) => {
		const { name } = await request.json();

		const id = crypto.randomUUID();

		await kv.set(
			["rooms", id],
			{
				name,
				id,
				players: [],
				board: (new Board({ id })).snapshot()
			}
		);

		return new Response(
			id,
			{
				headers: new Headers({
					"content-type": "text/plain;charset=UTF-8"
				}),
				status: 200
			}
		);
	}
};

export {
	handler
};
