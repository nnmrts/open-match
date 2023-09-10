import clsx from "clsx";

import { colorClasses } from "@/utilities/client.js";

/**
 *
 * @param props
 * @param props.className
 */
const YellowPiece = ({ className }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 4000 4000"
		className={clsx(
			colorClasses.get("yellow"),
			className
		)}
	>
		<defs>
			<rect id="yellowShape" x="400" y="400" width="3200" height="3200" />
			<clipPath id="yellowClip">
				<use href="#yellowShape" />
			</clipPath>
		</defs>
		<use href="#yellowShape" fill="currentColor" stroke="black" strokeOpacity={0.35} stroke-width={800} clip-path="url(#yellowClip)" />
	</svg>
);

export default YellowPiece;
