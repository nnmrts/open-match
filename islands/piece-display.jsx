import {
	useEffect,
	useRef,
	useState
} from "preact/hooks";
import clsx from "clsx";
import { useSpring, animated } from "@react-spring/web";

import { eventSource as eventSourceSignal } from "@/signals.js";
import {
	useBoardId,
	useEventSourceListener,
	usePiece
} from "@/hooks.js";
import Piece from "@/components/display/board/piece.jsx";

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
 * @param props.animationState
 * @param props.refillingAnimationState
 */
// eslint-disable-next-line max-lines-per-function, max-statements
const PieceDisplay = ({
	color,
	tile,
	user,
	nextTile,
	inMatch,
	availableMoves,
	columnIndex,
	tileIndex,
	animationState,
	refillingAnimationState
}) => {
	const boardId = useBoardId();

	const pieceRef = useRef(null);

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

	const {
		maxOffset,
		bind,
		eventSourceHandler
	} = usePiece({
		availableMoves,
		columnIndex,
		tileIndex,
		api,
		style,
		ref: pieceRef,
		tile,
		user
	});

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

	const [transition, setTransition] = useState(null);
	const [refillingTransition, setRefillingTransition] = useState(null);
	const [colorClass, setColorClass] = useState(null);

	const debug = true;

	useEffect(() => {
		const {
			type,
			durationMilliseconds,
			offsetInPixels
		} = animationState;

		switch (type) {
			case "none":
				// setTransition({
				// 	filter: "brightness(1) drop-shadow(0px 0px 0px currentColor)",
				// 	transitionDuration: "0ms"
				// });
				setTransition(null);
				break;
			case "falling":
				setTransition({
					transform: `translateY(${offsetInPixels}px)`,
					transitionDuration: `${durationMilliseconds}ms`
				});
				break;
			case "matching":
				setTransition({
					transform: "scale(1.25)",
					filter: "brightness(1.25) drop-shadow(0px 0px 20px currentColor)",
					transitionDuration: `${durationMilliseconds}ms`
				});
				break;
			case "matched":
				setTransition({
					transform: "scale(0)",
					filter: "brightness(1) drop-shadow(0px 0px 0px currentColor)",
					transitionDuration: `${durationMilliseconds}ms`
				});
				break;
			// no default
		}
	}, [animationState]);

	useEffect(() => {
		const {
			type,
			durationMilliseconds
		} = refillingAnimationState;

		switch (type) {
			case "none":
				setRefillingTransition({
					transitionDuration: "0ms",
					opacity: 0
				});

				setTimeout(() => {
					setRefillingTransition(null);
				}, 100);
				break;
			case "falling":
				setRefillingTransition({
					transform: "translateY(0%)",
					transitionDuration: `${durationMilliseconds}ms`,
					opacity: 1
				});
				break;
			// no default
		}
	}, [refillingAnimationState]);

	return (
		<>
			{
				nextTile?.piece?.color && (
					<div
						className={clsx(
							"absolute w-[60%] h-[60%] will-change-transform flex z-50 -translate-y-[400%] opacity-0",
							{
								"transition-transform": refillingTransition
							}
						)}
						style={refillingTransition}
					>
						<Piece color={nextTile?.piece?.color} />
					</div>
				)
			}
			<animated.div
				className={clsx(
					"absolute w-[60%] h-[60%] will-change-transform cursor-grab touch-none select-none flex active:cursor-grabbing brightness-100",
					{
						"transition-[filter]": !transition,
						"transition-transform": transition
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
				<Piece color={color} />
			</animated.div>
		</>
	);
};

export default PieceDisplay;
