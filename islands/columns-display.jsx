import {
	useEffect, useRef, useState
} from "preact/hooks";

import ColumnDisplay from "./column-display.jsx";

/**
 *
 * @param props
 * @param props.columns
 * @param props.user
 * @param props.handleBoardMove
 * @param props.handleAnimationEnd
 * @param props.boardStatesLeft
 */
const ColumnsDisplay = ({
	columns,
	user,
	handleAnimationEnd,
	boardStatesLeft
}) => {
	const [animationEndCount, setAnimationEndCount] = useState(0);
	const [instantCount, setInstantCount] = useState(0);

	const gridRef = useRef();

	const [gridMeasurements, setGridMeasurements] = useState(null);

	const width = columns.length;
	const height = columns[0].length;

	const handleColumnAnimationEnd = (columnIndex, instant) => {
		if (instant) {
			setInstantCount((currentInstantCount) => currentInstantCount + 1);
		}
		else {
			setAnimationEndCount((currentAnimationEndCount) => currentAnimationEndCount + 1);
		}
	};

	useEffect(() => {
		if (animationEndCount + instantCount === width) {
			setAnimationEndCount(0);
			setInstantCount(0);
			handleAnimationEnd();
		}
	}, [animationEndCount, instantCount]);

	useEffect(() => {
		if (gridRef.current) {
			setGridMeasurements({
				height: gridRef.current.getBoundingClientRect().height,
				gapPercentage: Number(getComputedStyle(gridRef.current).gap.replace(/%$/u, "")),
				tileHeight: Number(getComputedStyle(gridRef.current.querySelector("li")).height.replace(/px$/u, ""))
			});
		}
	}, [gridRef.current]);

	return (
		<ul
			className="grid grid-flow-col gap-[2%] p-2 h-[min(100%,calc(100vw-var(--main-padding)))]"
			style={{
				gridTemplateColumns: `repeat(${width}, 1fr)`,
				gridTemplateRows: `repeat(${height}, 1fr)`,
				aspectRatio: `${width}/${height}`
			}}
			ref={gridRef}
		>
			{
				columns
					.map((column, columnIndex) => (
						<ColumnDisplay
							key={columnIndex}
							{...{
								column,
								columnIndex,
								user,
								handleColumnAnimationEnd,
								gridMeasurements,
								nextColumn: boardStatesLeft.map((boardState) => boardState.columns[columnIndex])?.[0]
							}}
						/>
					))
			}
		</ul>
	);
};

export default ColumnsDisplay;
