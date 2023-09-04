import {
	createUseGesture,
	dragAction,
	hoverAction,
	moveAction
} from "@use-gesture/react";

import onDrag from "./get-bind/on-drag.js";
import onDragEnd from "./get-bind/on-drag-end.js";

const useGesture = createUseGesture([
	dragAction,
	hoverAction,
	moveAction
]);

// eslint-disable-next-line max-lines-per-function
/**
 *
 * @param options
 * @param options.api
 * @param options.style
 * @param options.tileIndex
 * @param options.columnIndex
 * @param options.availableMoves
 * @param options.maxOffset
 */
// eslint-disable-next-line max-lines-per-function
const getBind = ({
	api,
	style,
	tileIndex,
	columnIndex,
	availableMoves,
	maxOffset
}) => {
	const bind = useGesture(
		{
			// onHover: ({ active, event }) => console.log("hover", event, active),
			// onMove: ({ event }) => console.log("move", event),
			onDrag: ({
				active,
				offset,
				elapsedTime
			}) => {
				onDrag({
					active,
					offset,
					elapsedTime,
					api,
					tileIndex,
					columnIndex
				});
			},
			onDragEnd: ({
				offset
			}) => {
				onDragEnd({
					offset,
					availableMoves,
					columnIndex,
					tileIndex,
					api,
					maxOffset
				});
			}
		},
		{
			drag: {
				from: () => [style.x.get(), style.y.get()]
			}
		}
	);

	return bind;
};

export default getBind;
