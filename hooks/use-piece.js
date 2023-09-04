import { useState, useEffect } from "preact/hooks";

import handleMoveAttempt from "./use-piece/handle-move-attempt.js";
import handleMove from "./use-piece/handle-move.js";
import handleUnavailableMove from "./use-piece/handle-unavailble-move.js";
import effectRef from "./use-piece/effect-ref.js";
import effectPosition from "./use-piece/effect-position.js";
import getPosition from "./use-piece/get-position.js";
import getBind from "./use-piece/get-bind.js";
import getEventSourceHandler from "./use-piece/get-event-source-handler.js";

/**
 *
 * @param options
 * @param options.availableMoves
 * @param options.columnIndex
 * @param options.tileIndex
 */
const usePiece = (options) => {
	const {
		api,
		ref,
		tile
	} = options;

	const [displayedWidth, setDisplayedWidth] = useState(0);

	const maxOffsetPart = 3;

	const maxOffset = displayedWidth / maxOffsetPart;

	const position = getPosition({
		tile,
		maxOffset
	});

	const bind = getBind({
		...options,
		maxOffset
	});

	const eventSourceHandler = getEventSourceHandler(options);

	useEffect(() => {
		const handler = (event) => event.preventDefault();

		document.addEventListener("gesturestart", handler);
		document.addEventListener("gesturechange", handler);
		document.addEventListener("gestureend", handler);

		return () => {
			document.removeEventListener("gesturestart", handler);
			document.removeEventListener("gesturechange", handler);
			document.removeEventListener("gestureend", handler);
		};
	}, []);

	useEffect(() => {
		effectRef({
			ref,
			setDisplayedWidth
		});
	}, [ref.current]);

	useEffect(() => {
		effectPosition({
			api,
			x: position.x,
			y: position.y
		});
	}, [position.x, position.y]);

	return {
		maxOffset,
		bind,
		eventSourceHandler,
		handleMoveAttempt: (value) => {
			handleMoveAttempt(value, options);
		},
		handleMove: (value) => {
			handleMove(value, {
				...options,
				maxOffset
			});
		},
		handleUnavailableMove: (value) => {
			handleUnavailableMove(value, {
				...options,
				maxOffset
			});
		}
	};
};

export default usePiece;
