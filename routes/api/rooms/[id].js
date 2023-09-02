import { kv } from "@/utilities/server.js";

const handler = {
	GET: async (request, { params: { id } }) => {
		const room = await kv.get(["rooms", id]);

		return new Response(
			JSON.stringify(room),
			{
				headers: new Headers({
					"content-type": "application/json;charset=UTF-8"
				})
			}
		);
	},
	DELETE: async (request, { params: { id } }) => {
		await kv.delete(["rooms", id]);

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
