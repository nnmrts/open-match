/**
 *
 * @param id
 * @param callback
 */
const subscribeRoom = (id, callback) => {
	const broadcastChannel = new BroadcastChannel(id);

	broadcastChannel.onmessage = (event) => {
		callback(event);
	};

	return () => {
		broadcastChannel.close();
	};
};

export default subscribeRoom;
