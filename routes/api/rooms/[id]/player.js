import { kv } from "@/utilities/server.js";

const handler = {
	POST: async (request, { params: { id }, state: { user: { name: userName } } }) => {
		const broadcastChannel = new BroadcastChannel(id);

		const { value: room } = await kv.get(["rooms", id]);

		room.players = [...(new Set([...room.players, userName]))];

		await kv.set(
			["rooms", id],
			room
		);

		broadcastChannel.postMessage({
			type: "players",
			payload: {
				action: "join"
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
	},
	DELETE: async (request, { params: { id }, state: { user: { name: userName } } }) => {
		const broadcastChannel = new BroadcastChannel(id);

		const { value: room } = await kv.get(["rooms", id]);

		room.players = room.players.filter((player) => player !== userName);

		await kv.set(
			["rooms", id],
			room
		);

		broadcastChannel.postMessage({
			type: "players",
			payload: {
				action: "leave"
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
