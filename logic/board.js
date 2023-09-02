import Piece from "./piece.js";
import Tile from "./tile.js";

import Column from "@/logic/column.js";
import { uint32ArrayMax } from "@/constants.js";
import { directionPositions, findPermutation } from "@/utilities/logic.js";

const {
	max,
	min
} = Math;

/**
 *
 */
const Board = class {

	static #defaultWidth = 7;

	static #defaultHeight = 7;

	static #defaultShape = "rectangle";

	static #defaultPieces = [
		"blue",
		"red",
		"green",
		"orange",
		"yellow",
		"purple"
	]
		.map((color) => new Piece({ color }));

	static #defaultNumberOfDifferentPieces = this.#defaultPieces.length;

	static #defaultTilesNeededToMatch = 3;

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

	update = async ({
		consumer = async () => {},
		solveMatches = true
	} = {
		consumer: async () => {},
		solveMatches: true
	}) => {
		const {
			columns
		} = this;

		this.#updateVicinities();

		await consumer(this.snapshot());

		if (solveMatches) {
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

			if (tilesToEmpty.length > 0) {
				this.refillColumns();

				await this.update({ consumer });
			}
		}
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

	validate = () => {
		const {
			width,
			height,
			tilesNeededToMatch,
			numberOfDifferentPieces
		} = this;

		if (width <= 1 || height <= 1) {
			throw new Error("Board is too small.");
		}
		if (width < tilesNeededToMatch || height < tilesNeededToMatch) {
			throw new Error("Board is too small to have any matches.");
		}
		else if (tilesNeededToMatch <= 1) {
			throw new Error("Board would match indefinitely.");
		}
		else if (numberOfDifferentPieces < 2) {
			throw new Error("Board must have at least two different pieces.");
		}
	};

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
	 * @param options.tilesNeededToMatch
	 */
	constructor({
		width = Board.#defaultWidth,
		height = Board.#defaultHeight,
		shape = Board.#defaultShape,
		pieces = Board.#defaultPieces,
		numberOfDifferentPieces = pieces?.length ?? Board.#defaultNumberOfDifferentPieces,
		tilesNeededToMatch = Board.#defaultTilesNeededToMatch,
		id = crypto.randomUUID(),
		columns = Board.getRandomColumns({
			width: width ?? Board.#defaultWidth,
			height: height ?? Board.#defaultHeight,
			pieces: pieces ?? Board.#defaultPieces,
			numberOfDifferentPieces
		})
	} = {
		width: Board.#defaultWidth,
		height: Board.#defaultHeight,
		shape: Board.#defaultShape,
		numberOfDifferentPieces: Board.#defaultNumberOfDifferentPieces,
		pieces: Board.#defaultPieces,
		tilesNeededToMatch: Board.#defaultTilesNeededToMatch,
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
		this.tilesNeededToMatch = tilesNeededToMatch;

		this.validate();

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

	move = async ({
		tile: {
			columnIndex,
			tileIndex
		},
		direction,
		consumer = async () => {}
	}) => {
		const currentTile = this.columns[columnIndex][tileIndex];
		const currentTileSnapshot = currentTile.snapshot();
		const {
			columnIndex: currentTileColumnIndex,
			tileIndex: currentTileTileIndex
		} = currentTileSnapshot;

		const otherTile = currentTile.vicinity.get(directionPositions.get(direction));
		const otherTileSnapshot = otherTile.snapshot();
		const {
			columnIndex: otherTileColumnIndex,
			tileIndex: otherTileTileIndex
		} = otherTileSnapshot;

		const newColumns = this.columns.map((column, innerColumnIndex) => {
			const newColumn = Column.from(column.snapshot());

			newColumn.decorate({
				columnIndex: innerColumnIndex,
				pieces: this.pieces,
				numberOfDifferentPieces: this.numberOfDifferentPieces,
				boardHeight: this.height
			});

			return newColumn;
		});

		newColumns[currentTileColumnIndex][currentTileTileIndex] = Tile.from({
			...otherTileSnapshot,
			columnIndex: currentTileColumnIndex,
			tileIndex: currentTileTileIndex
		});
		newColumns[otherTileColumnIndex][otherTileTileIndex] = Tile.from({
			...currentTileSnapshot,
			columnIndex: otherTileColumnIndex,
			tileIndex: otherTileTileIndex
		});

		this.columns = [...newColumns];

		await this.update({ consumer });
	};

	/**
	 *
	 */
	get deadlockPossible() {
		const {
			width,
			height,
			numberOfDifferentPieces,
			tilesNeededToMatch
		} = this;

		const upperBound = (
			(width * height) /
			(min((tilesNeededToMatch - 1) * height, (tilesNeededToMatch - 1) * width))
		);
		const lowerBound = (
			1 +
			(
				((width * height) - max(tilesNeededToMatch * height, tilesNeededToMatch * width)) /
				(min((tilesNeededToMatch - 1) * height, (tilesNeededToMatch - 1) * width))
			)
		);

		const deadlockPossible = (
			numberOfDifferentPieces <= lowerBound ||
			numberOfDifferentPieces >= upperBound
		);

		return deadlockPossible;
	}

	/**
	 *
	 */
	get availableMoves() {
		const { columns } = this;

		return new Set(
			columns
				.map((column, columnIndex) => (
					[...column.availableMoves]
						.map((move) => [columnIndex, ...move])
				))
				.flat()
		);
	}

	/**
	 *
	 */
	get availableMovesAndNoMatches() {
		const {
			availableMoves,
			columns
		} = this;

		return (
			availableMoves.size > 0 &&
			columns.every((column) => column.every((tile) => !tile.inMatch()))
		);
	}

	shuffle = async ({
		consumer = async () => {}
	} = {
		consumer: async () => {}
	}) => {
		const {
			columns,
			deadlockPossible,
			pieces,
			numberOfDifferentPieces,
			height
		} = this;

		const piecesArray = columns.map((column) => column.map((tile) => tile.piece)).flat(2);

		const limit = deadlockPossible ? 1_000 : 1_000;

		const newPiecesArray = await findPermutation(
			piecesArray,
			async (permutation) => {
				console.log(permutation);

				const newColumns = columns.map((column, columnIndex) => (
					Column.from(
						[...permutation]
							.slice(columnIndex * height, (columnIndex + 1) * height)
							.map((piece, boardIndex) => {
								const tileIndex = boardIndex % height;

								return Tile.from({
									...column[tileIndex].snapshot(),
									piece,
									columnIndex,
									tileIndex,
									boardHeight: column.length
								});
							})
					)
						.decorate({
							columnIndex,
							pieces,
							numberOfDifferentPieces,
							boardHeight: height
						})
				));

				const newBoard = Board.from({
					...this.snapshot(),
					columns: newColumns.map((column) => column.snapshot())
				});

				await newBoard.update();

				await consumer(newBoard.snapshot());

				return newBoard.availableMovesAndNoMatches;
			},
			limit
		);

		console.log("deadlockPossible");
		console.log(deadlockPossible);

		if (newPiecesArray) {
			const newColumns = columns.map((column, columnIndex) => (
				Column.from(
					[...newPiecesArray]
						.slice(columnIndex * height, (columnIndex + 1) * height)
						.map((piece, boardIndex) => {
							const tileIndex = boardIndex % height;

							return Tile.from({
								...column[tileIndex].snapshot(),
								piece,
								columnIndex,
								tileIndex,
								boardHeight: column.length
							});
						})
				)
					.decorate({
						columnIndex,
						pieces,
						numberOfDifferentPieces,
						boardHeight: height
					})
			));

			this.columns = [...newColumns];

			await this.update({ consumer });
		}
		else {
			throw new Error("Could not find a valid permutation. Need to repopulate board");
		}
	};

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
