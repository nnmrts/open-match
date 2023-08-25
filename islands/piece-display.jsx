import { DragGesture } from "@use-gesture/vanilla";
import { useEffect, useRef } from "preact/hooks";

/**
 *
 * @param options
 * @param options.color
 */
const PieceDisplay = ({ color }) => {
	const pieceRef = useRef(null);

	const handleClick = () => {

	};

	useEffect(() => {
		if (pieceRef.current) {
			const gesture = new DragGesture(
				pieceRef.current,
				({
					type, direction, distance, axis
				}) => {
					if (type === "pointerup") {
						const [xDirection, yDirection] = direction;

						const [xDistance, yDistance] = distance;

						// TODO: handle up, down, left, right or click
					}
				}
			);
		}
	}, [pieceRef.current]);

	return (
		<div
			className="w-full h-full rounded-full"
			style={{
				backgroundColor: color
			}}
			ref={pieceRef}
		/>
	);
};

export default PieceDisplay;
