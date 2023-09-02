import Piece from "./piece.js";

import { positionDirections } from "@/utilities/logic.js";

/**
 *
 */
const Tile = class {

	/**
	 *
	 * @param options
	 * @param options.piece
	 * @param options.columnIndex
	 * @param options.tileIndex
	 * @param options.boardHeight
	 */
	constructor({
		piece,
		columnIndex,
		tileIndex,
		boardHeight
	}) {
		this.piece = piece;
		this.columnIndex = columnIndex;
		this.tileIndex = tileIndex;
		this.boardHeight = boardHeight;
		this.parity = Number(
			(
				this.boardHeight % 2 === 1 &&
				((columnIndex * this.boardHeight) + tileIndex) % 2 === 1
			) ||
			(
				this.boardHeight % 2 === 0 &&
				(
					(
						(columnIndex * this.boardHeight) +
						tileIndex +
						columnIndex
					) %
					2 === 1
				)
			)
		);
	}

	inMatch = () => {
		const {
			piece,
			vicinity
		} = this;

		return (
			(
				piece.matchesWith(vicinity.get("left")?.piece) &&
				(
					piece.matchesWith(vicinity.get("right")?.piece) ||
					piece.matchesWith(
						vicinity.get("left")?.vicinity?.get("left")?.piece
					)
				)
			) ||
			(
				piece.matchesWith(vicinity.get("right")?.piece) &&
				piece.matchesWith(
					vicinity.get("right")?.vicinity?.get("right")?.piece
				)
			) ||
			(
				piece.matchesWith(vicinity.get("top")?.piece) &&
				(
					piece.matchesWith(vicinity.get("bottom")?.piece) ||
					piece.matchesWith(
						vicinity.get("top")?.vicinity?.get("top")?.piece
					)
				)
			) ||
			(
				piece.matchesWith(vicinity.get("bottom")?.piece) &&
				piece.matchesWith(
					vicinity.get("bottom")?.vicinity?.get("bottom")?.piece
				)
			)
		);
	};

	empty = () => {
		this.piece = null;
	};

	snapshot = () => structuredClone({
		piece: this.piece?.snapshot(),
		columnIndex: this.columnIndex,
		tileIndex: this.tileIndex,
		boardHeight: this.boardHeight
	});

	/**
	 *
	 */
	get possibleMoves() {
		const {
			vicinity
		} = this;

		return new Set(
			[
				["left", vicinity.get("left")?.piece],
				["right", vicinity.get("right")?.piece],
				["top", vicinity.get("top")?.piece],
				["bottom", vicinity.get("bottom")?.piece]
			]
				.filter(([position, piece]) => piece)
				.map(([position, piece]) => positionDirections.get(position))
		);
	}

	/**
	 *
	 */
	get availableMoves() {
		return new Set(
			[...this.possibleMoves]
				// eslint-disable-next-line max-statements
				.filter((direction) => {
					switch (direction) {
						case "up": {
							const topTile = this.vicinity.get("top");

							const hypotheticalTopTile = Tile.from(this.snapshot());

							hypotheticalTopTile.vicinity = new Map([
								["top", topTile.vicinity.get("top")],
								["right", topTile.vicinity.get("right")],
								["bottom", topTile],
								["left", topTile.vicinity.get("left")]
							]);

							const hypotheticalCurrentTile = Tile.from(topTile.snapshot());

							hypotheticalCurrentTile.vicinity = new Map([
								["top", hypotheticalTopTile],
								["right", this.vicinity.get("right")],
								["bottom", this.vicinity.get("bottom")],
								["left", this.vicinity.get("left")]
							]);

							hypotheticalTopTile.vicinity.set("bottom", hypotheticalCurrentTile);

							return (
								hypotheticalTopTile.inMatch() ||
								hypotheticalCurrentTile.inMatch()
							);
						}

						case "right": {
							const rightTile = this.vicinity.get("right");

							const hypotheticalRightTile = Tile.from(this.snapshot());

							hypotheticalRightTile.vicinity = new Map([
								["top", rightTile.vicinity.get("top")],
								["right", rightTile.vicinity.get("right")],
								["bottom", rightTile.vicinity.get("bottom")],
								["left", rightTile]
							]);

							const hypotheticalCurrentTile = Tile.from(rightTile.snapshot());

							hypotheticalCurrentTile.vicinity = new Map([
								["top", this.vicinity.get("top")],
								["right", hypotheticalRightTile],
								["bottom", this.vicinity.get("bottom")],
								["left", this.vicinity.get("left")]
							]);

							hypotheticalRightTile.vicinity.set("left", hypotheticalCurrentTile);

							return (
								hypotheticalRightTile.inMatch() ||
							hypotheticalCurrentTile.inMatch()
							);
						}

						case "down": {
							const bottomTile = this.vicinity.get("bottom");

							const hypotheticalBottomTile = Tile.from(this.snapshot());

							hypotheticalBottomTile.vicinity = new Map([
								["top", bottomTile],
								["right", bottomTile.vicinity.get("right")],
								["bottom", bottomTile.vicinity.get("bottom")],
								["left", bottomTile.vicinity.get("left")]
							]);

							const hypotheticalCurrentTile = Tile.from(bottomTile.snapshot());

							hypotheticalCurrentTile.vicinity = new Map([
								["top", this.vicinity.get("top")],
								["right", this.vicinity.get("right")],
								["bottom", hypotheticalBottomTile],
								["left", this.vicinity.get("left")]
							]);

							hypotheticalBottomTile.vicinity.set("top", hypotheticalCurrentTile);

							return (
								hypotheticalBottomTile.inMatch() ||
								hypotheticalCurrentTile.inMatch()
							);
						}

						case "left": {
							const leftTile = this.vicinity.get("left");

							const hypotheticalLeftTile = Tile.from(this.snapshot());

							hypotheticalLeftTile.vicinity = new Map([
								["top", leftTile.vicinity.get("top")],
								["right", leftTile],
								["bottom", leftTile.vicinity.get("bottom")],
								["left", leftTile.vicinity.get("left")]
							]);

							const hypotheticalCurrentTile = Tile.from(leftTile.snapshot());

							hypotheticalCurrentTile.vicinity = new Map([
								["top", this.vicinity.get("top")],
								["right", this.vicinity.get("right")],
								["bottom", this.vicinity.get("bottom")],
								["left", hypotheticalLeftTile]
							]);

							hypotheticalLeftTile.vicinity.set("right", hypotheticalCurrentTile);

							return (
								hypotheticalLeftTile.inMatch() ||
								hypotheticalCurrentTile.inMatch()
							);
						}

						default:
							return false;
							// throw new Error(`Unknown direction: ${direction}`);
					}
				})
		);
	}

	static from = ({
		piece,
		columnIndex,
		tileIndex,
		boardHeight
	}) => new Tile({
		piece: Piece.from(piece),
		columnIndex,
		tileIndex,
		boardHeight
	});

};

export default Tile;
