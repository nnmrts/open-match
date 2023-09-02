const handler = {
	POST: async (request, { params: { id }, state: { user: { name: userName } } }) => {
		const body = await request.json();

		const broadcastChannel = new BroadcastChannel(id);

		broadcastChannel.postMessage({
			type: "move-attempt",
			payload: body,
			from: userName
		});

		setTimeout(() => {
			broadcastChannel.close();
		}, 5);

		return new Response("YAY");
	}
};

export {
	handler
};
