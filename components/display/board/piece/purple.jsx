import clsx from "clsx";

import { colorClasses } from "@/utilities/client.js";

/**
 *
 * @param props
 * @param props.className
 */
const PurplePiece = ({ className }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 4000 4000"
		className={clsx(
			colorClasses.get("purple"),
			className
		)}
	>
		<defs>
			<circle id="purpleShape" cx="2000" cy="2000" r="1900" />
			<clipPath id="purpleClip">
				<use href="#purpleShape" />
			</clipPath>
		</defs>
		<use href="#purpleShape" fill="currentColor" stroke="black" strokeOpacity={0.25} stroke-width={800} clip-path="url(#purpleClip)" />
	</svg>
);

export default PurplePiece;
