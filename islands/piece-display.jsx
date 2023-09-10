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
import { colorClasses } from "@/utilities/client.js";

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
 * @param props.swapAnimationState
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
	refillingAnimationState,
	swapAnimationState
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

	// Unified state for the display
	const [displayState, setDisplayState] = useState({
		transition: null,
		refillingTransition: null,
		swapTransition: null,
		currentColor: null,
		currentNextTile: null,
		currentTile: null
	});

	const {
		swapTransition,
		transition,
		refillingTransition,
		currentColor,
		currentNextTile,
		currentTile
	} = displayState;

	// eslint-disable-next-line max-lines-per-function
	const computeNextState = () => {
		const nextState = { ...displayState };

		nextState.currentColor = color;
		nextState.currentNextTile = nextTile;
		nextState.currentTile = tile;

		// Logic for swapAnimationState
		const {
			type: swapType,
			durationMilliseconds: swapDuration,
			offsetInPixels: swapOffset
		} = swapAnimationState;

		switch (swapType) {
			case "none":
			case "stop":
				nextState.swapTransition = null;
				break;
			case "up":
				nextState.swapTransition = {
					transform: `translateY(-${swapOffset}px)`,
					transitionDuration: `${swapDuration}ms`
				};
				break;
			case "down":
				nextState.swapTransition = {
					transform: `translateY(${swapOffset}px)`,
					transitionDuration: `${swapDuration}ms`
				};
				break;
			case "left":
				nextState.swapTransition = {
					transform: `translateX(-${swapOffset}px)`,
					transitionDuration: `${swapDuration}ms`
				};
				break;
			case "right":
				nextState.swapTransition = {
					transform: `translateX(${swapOffset}px)`,
					transitionDuration: `${swapDuration}ms`
				};
				break;
			// no default
		}

		// Logic for animationState
		const {
			type: animType,
			durationMilliseconds: animDuration,
			offsetInPixels: animOffset
		} = animationState;

		switch (animType) {
			case "none":
			case "stop":
				nextState.transition = currentNextTile === nextState.currentNextTile
					? transition
					: null;
				break;
			case "falling":
				nextState.transition = {
					transform: `translateY(${animOffset}px)`,
					transitionDuration: `${animDuration}ms`
				};
				break;
			case "matching":
				nextState.transition = {
					transform: "scale(1.25)",
					filter: "brightness(1.25) drop-shadow(0px 0px 20px currentColor)",
					transitionDuration: `${animDuration}ms`
				};
				break;
			case "matched":
				nextState.transition = {
					transform: "scale(0)",
					filter: "brightness(1) drop-shadow(0px 0px 0px currentColor)",
					transitionDuration: `${animDuration}ms`
				};
				break;
			// no default
		}

		// Logic for refillingAnimationState
		const {
			type: refillType,
			durationMilliseconds: refillDuration
		} = refillingAnimationState;

		switch (refillType) {
			case "none":
			case "stop":
				if (refillingTransition?.opacity === 0) {
					nextState.refillingTransition = {
						transform: "translateY(-400%)",
						transitionDuration: "0ms"
					};
				}
				else if (currentNextTile === nextState.currentNextTile) {
					nextState.refillingTransition = refillingTransition;
				}
				else {
					nextState.refillingTransition = {
						transform: "translateY(0%)",
						transitionDuration: "0ms",
						opacity: 0
					};
				}
				break;
			case "falling":
				nextState.refillingTransition = {
					transform: "translateY(0%)",
					transitionDuration: `${refillDuration}ms`,
					opacity: 1
				};
				break;
			// no default
		}

		return nextState;
	};

	useEffect(() => {
		setDisplayState(computeNextState());
	}, [
		animationState,
		refillingAnimationState,
		swapAnimationState,
		color,
		nextTile,
		tile
	]);

	return (
		<>
			{
				(currentNextTile?.piece?.color) && (
					<div
						className={clsx(
							"absolute w-[60%] h-[60%] will-change-transform flex z-50 -translate-y-[400%] opacity-0 transition-[filter,color,transform,opacity]",
							colorClasses.get(currentNextTile.piece.color),
							{
								"pointer-events-none": refillingTransition
							}
						)}
						style={refillingTransition}
					>
						<Piece color={currentNextTile.piece.color} />
					</div>
				)
			}
			<animated.div
				className={clsx(
					"absolute w-[60%] h-[60%] will-change-transform cursor-grab touch-none select-none flex active:cursor-grabbing brightness-100 duration-0",
					colorClasses.get(currentColor),
					{
						"pointer-events-none transition-[filter,color,transform] duration-0": transition || swapTransition,
						"transition-[filter,color]": !transition && !swapTransition
					}
				)}
				ref={pieceRef}
				style={
					swapTransition ?? transition ?? {
						...style,
						x: style.x.to((value) => Math.min(Math.abs(value), maxOffset) * Math.sign(value)),
						y: style.y.to((value) => Math.min(Math.abs(value), maxOffset) * Math.sign(value))
					}
				}
				{...bind()}
			>
				<Piece color={currentColor} />
			</animated.div>
		</>
	);
};

export default PieceDisplay;
