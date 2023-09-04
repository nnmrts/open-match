import clsx from "clsx";

/**
 *
 * @param props
 * @param props.className
 */
const RedPiece = ({ className }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 4000 4000"
		className={clsx(
			"text-red-600",
			className
		)}
		transform="rotate(180)"
	>
		<defs>
			<polygon id="redShape" points="0,3732 4000,3732 2000,268" />
			<clipPath id="redClip">
				<use href="#redShape" />
			</clipPath>
		</defs>
		<use href="#redShape" fill="currentColor" stroke="black" strokeOpacity={0.25} stroke-width={800} clip-path="url(#redClip)" />
	</svg>
);

export default RedPiece;
