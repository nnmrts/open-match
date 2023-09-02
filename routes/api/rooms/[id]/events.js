import { subscribeRoom } from "@/utilities/server.js";

const handler = {
	GET: async (request, { params: { id } }) => {
		let cleanup;

		const body = new ReadableStream({
			start(controller) {
				controller.enqueue("retry: 1000\n\n");
				cleanup = subscribeRoom(
					id,
					async ({ data, data: { type } }) => {
						if (type === "move") {
							const json = JSON.stringify(data);

							controller.enqueue(`data: ${json}\n\n`);
						}
						else {
							const json = JSON.stringify(data);

							controller.enqueue(`data: ${json}\n\n`);
						}
					}
				);
			},
			cancel() {
				cleanup();
			}
		});

		return new Response(
			body.pipeThrough(new TextEncoderStream()),
			{
				headers: {
					"Content-Type": "text/event-stream",
					"Cache-Control": "no-cache"
				}
			}
		);
	}
};

export {
	handler
};
