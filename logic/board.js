import Piece from "./piece.js";
import Tile from "./tile.js";

import Column from "@/logic/column.js";
import { uint32ArrayMax } from "@/constants.js";

/**
 *
 */
const Board = class {

	static #defaultWidth = 7;

	static #defaultHeight = 7;

	static #defaultShape = "rectangle";

	static #defaultNumberOfDifferentPieces = 5;

	static #defaultPieces = [
		"blue",
		"red",
		"green",
		"orange",
		"yellow",
		"purple"
	]
		.map((color) => new Piece({ color }));

	#updateVicinities = () => {
		const {
			columns
		} = this;

		for (const [columnIndex, column] of columns.entries()) {
			for (const [tileIndex, tile] of column.entries()) {
				tile.vicinity = this.getVicinity({
					columnIndex,
					tileIndex
				});
			}
		}
	};

	snapshot = () => {
		const {
			width,
			height,
			shape,
			numberOfDifferentPieces,
			pieces,
			columns
		} = this;

		return structuredClone({
			width,
			height,
			shape,
			numberOfDifferentPieces,
			pieces: pieces.map((piece) => piece.snapshot()),
			columns: columns.map((column) => column.snapshot())
		});
	};

	refillColumns = () => {
		const {
			columns
		} = this;

		for (const [columnIndex, column] of columns.entries()) {
			this.columns[columnIndex] = column.refill();
		}
	};

	update = () => {
		const {
			columns
		} = this;

		this.#updateVicinities();

		// const { columns: oldColumns } = this.snapshot();

		// console.log({ oldColumns });

		const tilesToEmpty = [];

		for (const [columnIndex, column] of columns.entries()) {
			for (const [tileIndex, tile] of column.entries()) {
				const inMatch = tile.inMatch();

				if (inMatch) {
					tilesToEmpty.push(tile);
				}
			}
		}

		for (const tile of tilesToEmpty) {
			tile.empty();
		}

		if (tilesToEmpty.length) {
			this.refillColumns();

			// const { columns: newColumns } = this.snapshot();

			// // console.log({ newColumns });

			this.update();
		}

		// console.log(this.snapshot());
	};

	/**
	 *
	 * @param options
	 * @param options.width
	 * @param options.height
	 * @param options.pieces
	 * @param options.numberOfDifferentPieces
	 */
	static getRandomColumns({
		width,
		height,
		pieces,
		numberOfDifferentPieces
	}) {
		return Array(width)
			.fill()
			.map((empty, columnIndex) => (
				[...crypto.getRandomValues((new Uint32Array(height)))]
					.map((value, tileIndex) => new Tile({
						piece: pieces[
							Number(
								(BigInt(numberOfDifferentPieces) * BigInt(value)) /
										BigInt(uint32ArrayMax)
							)
						],
						columnIndex,
						tileIndex,
						boardHeight: height
					}))
			));
	}

	/**
	 * Board.
	 *
	 * @param {object} options - Options.
	 * @param {number} options.width - Width of the board.
	 * @param {number} options.height - Height of the board.
	 * @param {string|string[]} options.shape - Shape of the board.
	 * @param {number} options.numberOfDifferentPieces - Number of different pieces.
	 * @param {Piece[]} options.pieces - Pieces.
	 * @param options.id
	 * @param {Array} options.columns
	 */
	constructor({
		width = Board.#defaultWidth,
		height = Board.#defaultHeight,
		shape = Board.#defaultShape,
		numberOfDifferentPieces = Board.#defaultNumberOfDifferentPieces,
		pieces = Board.#defaultPieces,
		id = crypto.randomUUID(),
		columns = Board.getRandomColumns({
			width: width ?? Board.#defaultWidth,
			height: height ?? Board.#defaultHeight,
			pieces: pieces ?? Board.#defaultPieces,
			numberOfDifferentPieces: numberOfDifferentPieces ?? Board.#defaultNumberOfDifferentPieces
		})
	} = {
		width: Board.#defaultWidth,
		height: Board.#defaultHeight,
		shape: Board.#defaultShape,
		numberOfDifferentPieces: Board.#defaultNumberOfDifferentPieces,
		pieces: Board.#defaultPieces,
		id: crypto.randomUUID(),
		columns: Board.getRandomColumns({
			width: Board.#defaultWidth,
			height: Board.#defaultHeight,
			pieces: Board.#defaultPieces,
			numberOfDifferentPieces: Board.#defaultNumberOfDifferentPieces
		})
	}) {
		this.width = width;
		this.height = height;
		this.shape = shape;
		this.pieces = pieces.map((piece) => (piece instanceof Piece
			? piece
			: Piece.from(piece)));
		this.numberOfDifferentPieces = numberOfDifferentPieces ?? this.pieces.length;

		this.id = id;

		this.columns = columns
			.map((column, columnIndex) => (
				(
					Column.from(column
						.map((tile) => (
							tile instanceof Tile
								? tile
								: Tile.from(tile)
						)))
				)
					.decorate({
						columnIndex,
						pieces,
						numberOfDifferentPieces,
						boardHeight: this.height
					})
			));

		this.update();
	}

	getVicinity = ({
		columnIndex,
		tileIndex
	}) => new Map([
		["top", this.columns[columnIndex][tileIndex - 1]],
		["topRight", this.columns[columnIndex + 1]?.[tileIndex - 1]],
		["right", this.columns[columnIndex + 1]?.[tileIndex]],
		["bottomRight", this.columns[columnIndex + 1]?.[tileIndex + 1]],
		["bottom", this.columns[columnIndex][tileIndex + 1]],
		["bottomLeft", this.columns[columnIndex - 1]?.[tileIndex + 1]],
		["left", this.columns[columnIndex - 1]?.[tileIndex]],
		["topLeft", this.columns[columnIndex - 1]?.[tileIndex - 1]]
	]
		.filter(([direction, tile]) => tile));

	static from = ({
		pieces,
		columns,
		...snapshot
	}) => new Board({
		...snapshot,
		pieces: pieces.map((piece) => Piece.from(piece)),
		columns: columns.map((column) => Column.from(column.map((tile) => Tile.from(tile))))
	});

};

export default Board;
