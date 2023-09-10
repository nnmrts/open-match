import clsx from "clsx";

import { colorClasses } from "@/utilities/client.js";

/**
 *
 * @param props
 * @param props.className
 */
const OrangePiece = ({ className }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 4000 4000"
		className={clsx(
			colorClasses.get("orange"),
			className
		)}
	>
		<defs>
			<polygon id="orangeShape" points="2000,100 3848.078,1465.142 3155.571,3535.571 844.289,3535.571 151.922,1465.142" />
			<clipPath id="orangeClip">
				<use href="#orangeShape" />
			</clipPath>
		</defs>
		<use href="#orangeShape" fill="currentColor" stroke="black" strokeOpacity={0.25} stroke-width={800} clip-path="url(#orangeClip)" />
	</svg>
);

export default OrangePiece;
