import {
	createUseGesture,
	dragAction,
	hoverAction,
	moveAction
} from "@use-gesture/react";
import {
	useRef, useEffect, useState
} from "preact/hooks";
import clsx from "clsx";
import { useSpring, animated } from "@react-spring/web";

import { eventSource as eventSourceSignal, moveAttempt as moveAttemptSignal } from "@/signals.js";
import {
	oppositeDirections, directionPositions, axisVariables, directionAxes
} from "@/utilities/client.js";
import { useBoardId, useEventSourceListener } from "@/hooks.js";

const horizontalDirections = new Map([
	[0, "none"],
	[-1, "left"],
	[1, "right"]
]);

const verticalDirections = new Map([
	[0, "none"],
	[-1, "up"],
	[1, "down"]
]);

const directions = new Map([["horizontal", horizontalDirections], ["vertical", verticalDirections]]);

// "blue",
// "red",
// "green",
// "orange",
// "yellow",
// "purple"

const colorClasses = new Map([
	["blue", "bg-blue-500 text-blue-500 [clip-path:polygon(50%_0%,_0%_100%,_100%_100%)]"],
	["red", "bg-red-500 text-red-500 [clip-path:polygon(50%_100%,_0%_0%,_100%_0%)]"],
	["green", "bg-green-500 text-green-500 [clip-path:polygon(50%_0%,_100%_50%,_50%_100%,_0%_50%)]"],
	["orange", "bg-orange-500 text-orange-500 [clip-path:polygon(50%_0%,_100%_38%,_82%_100%,_18%_100%,_0%_38%)]"],
	["yellow", "bg-yellow-500 text-yellow-500"],
	["purple", "bg-purple-500 text-purple-500 rounded-full"]
]);

const clientUpdateInterval = 10;

const useGesture = createUseGesture([
	dragAction,
	hoverAction,
	moveAction
]);

const getPosition = ({
	moveAttemptDirection,
	moveAttemptTileVicinityEntryPosition,
	offset
}) => {
	const position = {
		x: 0,
		y: 0
	};

	switch (moveAttemptDirection) {
		case "left":
		case "right":
			switch (moveAttemptTileVicinityEntryPosition) {
				case "left":
					position.x = -offset;
					break;
				case "right":
					position.x = offset;
					break;

				// no default
			}
			break;
		case "up":
		case "down":
			switch (moveAttemptTileVicinityEntryPosition) {
				case "top":
					position.y = -offset;
					break;
				case "bottom":
					position.y = offset;
					break;

				// no default
			}
			break;

		// no default
	}

	return position;
};

/**
 *
 * @param props
 * @param props.color
 * @param props.tile
 * @param props.user
 * @param props.transition
 * @param props.nextTransition
 * @param props.nextTile
 * @param props.inMatch
 * @param props.availableMoves
 * @param props.columnIndex
 * @param props.tileIndex
 */
// eslint-disable-next-line max-lines-per-function
const PieceDisplay = ({
	color,
	tile,
	user,
	transition,
	nextTransition,
	nextTile,
	inMatch,
	availableMoves,
	columnIndex,
	tileIndex
}) => {
	const pieceRef = useRef(null);

	const [displayedWidth, setDisplayedWidth] = useState(0);

	const {
		value: {
			tile: {
				columnIndex: moveAttemptTileColumnIndex,
				tileIndex: moveAttemptTileIndex
			},
			direction: moveAttemptDirection
		}
	} = moveAttemptSignal;

	const moveAttemptTileVicinityEntry = [...tile.vicinity.entries()]
		.find(([
			position,
			{
				columnIndex: vicinityTileColumnIndex,
				tileIndex: vicinityTileIndex
			}
		]) => (
			vicinityTileColumnIndex === moveAttemptTileColumnIndex &&
			vicinityTileIndex === moveAttemptTileIndex &&
			position === directionPositions.get(oppositeDirections.get(moveAttemptDirection))
		));

	const boardId = useBoardId();

	const [style, api] = useSpring(() => ({
		from: {
			x: 0,
			y: 0,
			scale: 1
		},
		config: {
			mass: 1,
			tension: 200,
			friction: 20,
			precision: 0.00001
		}
	}));

	useEffect(() => {
		if (pieceRef.current) {
			const {
				width
			} = pieceRef.current.getBoundingClientRect();

			setDisplayedWidth(width);
		}
	}, [pieceRef.current]);

	const maxOffset = displayedWidth / 3;
	const minRelevantOffset = 0;

	const position = moveAttemptTileVicinityEntry
		? getPosition({
			moveAttemptDirection,
			moveAttemptTileVicinityEntryPosition: moveAttemptTileVicinityEntry[0],
			offset: maxOffset
		})
		: {
			x: 0,
			y: 0
		};

	useEffect(() => {
		api.start({
			x: position.x,
			y: position.y,
			scale: 1
		});
	}, [position.x, position.y]);

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

	const eventSourceHandler = ({ data: dataJson }) => {
		const {
			type,
			payload,
			from
		} = JSON.parse(dataJson);

		switch (type) {
			case "move": {
				const {
					tile: {
						columnIndex: payloadTileColumnIndex,
						tileIndex: payloadTileIndex
					},
					direction: payloadDirection
				} = payload;

				if (
					payloadTileColumnIndex === columnIndex &&
					payloadTileIndex === tileIndex
				) {

				}

				break;
			}

			case "move-attempt": {
				if (from !== user.value.name) {
					const {
						tile: {
							columnIndex: payloadTileColumnIndex,
							tileIndex: payloadTileIndex
						},
						direction: payloadDirection
					} = payload;

					moveAttemptSignal.value = payload;

					if (
						payloadTileColumnIndex === columnIndex &&
						payloadTileIndex === tileIndex
					) {
						if (payloadDirection === "none") {
							api.start({
								x: 0,
								y: 0,
								scale: 1
							});
						}
						else {
							api.start({
								...getPosition({
									moveAttemptDirection: payloadDirection,
									moveAttemptTileVicinityEntryPosition: directionPositions.get(payloadDirection),
									offset: maxOffset
								}),
								scale: 1.2
							});
						}
					}
				}

				break;
			}
			// no default
		}
	};

	useEventSourceListener(
		eventSourceSignal.value,
		["message"],
		eventSourceHandler,
		[
			boardId,
			user.value.name,
			maxOffset
		]
	);

	const handleMoveAttempt = async (value) => {
		moveAttemptSignal.value = value;

		await fetch(
			`/api/rooms/${boardId}/move-attempt`,
			{
				method: "POST",
				headers: new Headers({
					"content-type": "application/json"
				}),
				body: JSON.stringify(value)
			}
		);
	};

	const handleUnavailableMove = (direction) => {
		api.start({
			to: Array(2)
				.fill()
				.map(() => {
					const axisVariable = axisVariables.get(directionAxes.get(direction));

					return Array(3)
						.fill()
						.map((empty, index) => ({
							[axisVariable]: (maxOffset / 5) * (index - 1)
						}));
				})
				.flat()
				.slice(0, -1),
			config: {
				duration: 50
			}
		});
	};

	const handleMove = async (direction) => {
		if (availableMoves.has(direction)) {
			const payload = {
				tile: {
					columnIndex: tile.columnIndex,
					tileIndex: tile.tileIndex
				},
				direction
			};

			await fetch(
				`/api/rooms/${boardId}/move`,
				{
					method: "POST",
					headers: new Headers({
						"content-type": "application/json;charset=UTF-8"
					}),
					body: JSON.stringify(payload)
				}
			);
		}
		else {
			handleUnavailableMove(direction);
		}
	};

	const bind = useGesture(
		{
			// onHover: ({ active, event }) => console.log("hover", event, active),
			// onMove: ({ event }) => console.log("move", event),
			onDrag: ({
				active,
				offset: [xOffset, yOffset],
				elapsedTime
			}) => {
				const type = Math.abs(xOffset) > Math.abs(yOffset)
					? "horizontal"
					: "vertical";

				if (type === "horizontal") {
					api.start({
						x: xOffset,
						y: 0,
						scale: 1.2,
						immediate: (name) => name === "x"
					});

					if (
						Math.round(elapsedTime) % clientUpdateInterval === 0 &&
						Math.abs(xOffset) >= minRelevantOffset
					) {
						handleMoveAttempt({
							tile: {
								columnIndex: tile.columnIndex,
								tileIndex: tile.tileIndex
							},
							direction: directions.get(type).get(Math.sign(xOffset))
						});
					}
				}
				else if (type === "vertical") {
					api.start({
						x: 0,
						y: active ? yOffset : 0,
						scale: 1.2,
						immediate: (name) => name === "y"
					});

					if (
						Math.round(elapsedTime) % clientUpdateInterval === 0 &&
						Math.abs(yOffset) >= minRelevantOffset
					) {
						handleMoveAttempt({
							tile: {
								columnIndex: tile.columnIndex,
								tileIndex: tile.tileIndex
							},
							direction: directions.get(type).get(Math.sign(yOffset))
						});
					}
				}
			},
			onDragEnd: ({
				offset: [xOffset, yOffset]
			}) => {
				api.start({
					x: 0,
					y: 0,
					scale: 1
				});

				const type = Math.abs(xOffset) > Math.abs(yOffset)
					? "horizontal"
					: "vertical";

				if (xOffset !== 0 || yOffset !== 0) {
					if (type === "horizontal") {
						handleMove(directions.get(type).get(Math.sign(xOffset)));
					}
					else if (type === "vertical") {
						handleMove(directions.get(type).get(Math.sign(yOffset)));
					}
				}
				else {
					console.log("IMPLEMENT CLICK MOVE");
				}

				handleMoveAttempt({
					tile: {
						columnIndex: tile.columnIndex,
						tileIndex: tile.tileIndex
					},
					direction: "none"
				});
			}
		},
		{
			drag: {
				from: () => [style.x.get(), style.y.get()]
			}
		}
	);

	const debug = true;

	return (
		<>
			{
				nextTile?.piece?.color && (
					<div
						className={clsx(
							"absolute w-[60%] h-[60%] will-change-transform flex ease-in-out z-50 transition-[transform,opacity] -translate-y-[200%] opacity-0",
							colorClasses.get(nextTile?.piece?.color)
						)}
						style={
							nextTransition ?? {
								opacity: 0
							}
						}
					/>
				)
			}
			<animated.div
				className={clsx(
					"absolute w-[60%] h-[60%] will-change-transform cursor-grab touch-none select-none flex active:cursor-grabbing hover:brightness-125 hover:drop-shadow-[0px_0px_10px_currentColor] ease-in-out",
					colorClasses.get(color),
					{
						"transition-[filter]": !transition,
						"transition-transform": transition,
						"animate-match": inMatch
					}
				)}
				ref={pieceRef}
				style={
					transition ??
					{
						...style,
						x: style.x.to((value) => Math.min(Math.abs(value), maxOffset) * Math.sign(value)),
						y: style.y.to((value) => Math.min(Math.abs(value), maxOffset) * Math.sign(value))
					}
				}
				{...bind()}
			>
			</animated.div>
		</>
	);
};

export default PieceDisplay;
