import clsx from "clsx";

import { colorClasses } from "@/utilities/client.js";

/**
 *
 * @param props
 * @param props.className
 */
const BluePiece = ({ className }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 4000 4000"
		className={clsx(
			colorClasses.get("blue"),
			className
		)}
	>
		<defs>
			<polygon id="blueShape" points="0,3732 4000,3732 2000,268" />
			<clipPath id="blueClip">
				<use href="#blueShape" />
			</clipPath>
		</defs>
		<use href="#blueShape" fill="currentColor" stroke="black" strokeOpacity={0.35} stroke-width={800} clip-path="url(#blueClip)" />
	</svg>
);

export default BluePiece;
