/**
 *
 */
const Piece = class {

	static #defaultType = "normal";

	/**
	 *
	 * @param options
	 * @param options.type
	 * @param options.color
	 */
	constructor({
		type = Piece.#defaultType,
		color
	}) {
		this.type = type;
		this.color = color;
	}

	matchesWith = (piece) => this.color === piece?.color;

	snapshot = () => structuredClone({
		type: this.type,
		color: this.color
	});

	/**
	 *
	 * @param snapshot
	 */
	static from(snapshot) {
		return new Piece(snapshot);
	}

};

export default Piece;
