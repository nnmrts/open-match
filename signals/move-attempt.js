import { signal } from "@preact/signals";

const moveAttempt = signal({
	direction: "none",
	tile: {
		columnIndex: -1,
		tileIndex: -1
	}
});

export default moveAttempt;
