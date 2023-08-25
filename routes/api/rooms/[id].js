import { kv } from "@/utilities.js";

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
	}
};

export {
	handler
};
