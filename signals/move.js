import { signal } from "@preact/signals";

const move = signal({
	direction: "none",
	tile: {
		columnIndex: -1,
		tileIndex: -1
	}
});

export default move;
