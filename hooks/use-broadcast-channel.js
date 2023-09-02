import { useState, useEffect } from "preact/hooks";

/**
 *
 * @param channelName
 */
const useBroadcastChannel = (channelName) => {
	const [channel, setChannel] = useState(null);

	useEffect(() => {
		const currentChannel = new BroadcastChannel(channelName);

		setChannel(currentChannel);

		return () => currentChannel.close();
	}, [channelName]);

	return channel;
};

export default useBroadcastChannel;
