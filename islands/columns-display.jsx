import {
	useEffect, useRef, useState
} from "preact/hooks";

import ColumnDisplay from "./column-display.jsx";

import { cssUnitUnitStrings, getCssUnit } from "@/utilities/client.js";

/**
 *
 * @param props
 * @param props.columns
 * @param props.user
 * @param props.handleBoardMove
 * @param props.handleAnimationEnd
 * @param props.boardStatesLeft
 */
// eslint-disable-next-line max-lines-per-function
const ColumnsDisplay = ({
	columns,
	user,
	handleAnimationEnd,
	boardStatesLeft
}) => {
	const [animationEndCount, setAnimationEndCount] = useState(0);

	const gridRef = useRef();

	const [gridMeasurements, setGridMeasurements] = useState(null);
	const [handledColumnIndices, setHandledColumnIndices] = useState(new Set());

	const width = columns.length;
	const height = columns[0].length;

	const handleColumnAnimationEnd = (columnIndex) => {
		setHandledColumnIndices((currentHandledColumnIndices) => new Set(
			[...currentHandledColumnIndices, columnIndex]
		));
	};

	useEffect(() => {
		if (handledColumnIndices.size === width) {
			handleAnimationEnd(() => {
				setHandledColumnIndices(new Set());
			});
		}
	}, [handledColumnIndices]);

	useEffect(() => {
		if (gridRef.current) {
			const heightValue = gridRef.current.getBoundingClientRect().height;
			const heightUnit = "pixel";

			const gapString = getComputedStyle(gridRef.current).gap;
			const gapUnit = getCssUnit(gapString);
			const gapUnitString = cssUnitUnitStrings.get(gapUnit);
			const gapValue = Number(
				gapString.replace(
					new RegExp(`${gapUnitString}$`, "u"),
					""
				)
			);

			const tileHeightString = getComputedStyle(gridRef.current.querySelector("li")).height;
			const tileHeightUnit = getCssUnit(tileHeightString);
			const tileHeightUnitString = cssUnitUnitStrings.get(tileHeightUnit);
			const tileHeightValue = Number(
				tileHeightString.replace(
					new RegExp(`${tileHeightUnitString}$`, "u"),
					""
				)
			);

			setGridMeasurements({
				height: {
					value: heightValue,
					unit: heightUnit
				},
				gap: {
					value: gapValue,
					unit: gapUnit
				},
				tileHeight: {
					value: tileHeightValue,
					unit: tileHeightUnit
				}
			});
		}
	}, [gridRef.current]);

	return (
		<ul
			className="grid grid-flow-col gap-2 p-2 h-[min(100%,calc(100vw-var(--main-padding)))]"
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
								handled: handledColumnIndices.has(columnIndex),
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
