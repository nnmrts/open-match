import BluePiece from "./piece/blue.jsx";
import RedPiece from "./piece/red.jsx";
import GreenPiece from "./piece/green.jsx";
import OrangePiece from "./piece/orange.jsx";
import YellowPiece from "./piece/yellow.jsx";
import PurplePiece from "./piece/purple.jsx";

/**
 *
 * @param props
 * @param props.color
 */
const Piece = ({ color }) => {
	const className = "transition-[filter] duration-200 hover:brightness-125 hover:drop-shadow-[0px_0px_10px_currentColor] ease-in-out";

	switch (color) {
		case "blue":
			return <BluePiece className={className} />;
		case "red":
			return <RedPiece className={className} />;
		case "green":
			return <GreenPiece className={className} />;
		case "orange":
			return <OrangePiece className={className} />;
		case "yellow":
			return <YellowPiece className={className} />;
		case "purple":
			return <PurplePiece className={className} />;
		default: {
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 4000 4000"
				>
				</svg>
			);
		}
	}
};

export default Piece;
