import Tile from "./tile.js";

import { uint32ArrayMax } from "@/constants.js";

/**
 *
 */
const Column = class extends Array {

	decorate = ({
		columnIndex,
		pieces,
		numberOfDifferentPieces,
		boardHeight
	}) => {
		this.columnIndex = columnIndex;
		this.pieces = pieces;
		this.numberOfDifferentPieces = numberOfDifferentPieces;
		this.boardHeight = boardHeight;

		return this;
	};

	#isFull = () => !this.some(({ piece }) => piece === null);

	refill = () => {
		const {
			columnIndex,
			pieces,
			numberOfDifferentPieces,
			boardHeight
		} = this;

		const notEmptyTiles = this.filter(({ piece }) => piece !== null);

		const numberOfTilesToAdd = this.length - notEmptyTiles.length;

		const newTiles = [...crypto.getRandomValues((new Uint32Array(numberOfTilesToAdd)))]
			.map((value, tileIndex) => new Tile({
				piece: pieces[
					Number(
						(BigInt(numberOfDifferentPieces) * BigInt(value)) /
						BigInt(uint32ArrayMax)
					)
				],
				columnIndex,
				tileIndex,
				boardHeight
			}));

		return Column
			.from(
				[...newTiles, ...notEmptyTiles]
					.map((tile, tileIndex) => Tile.from({
						...tile.snapshot(),
						tileIndex
					}))
			)
			.decorate({
				columnIndex,
				pieces,
				numberOfDifferentPieces,
				boardHeight
			});
	};

	snapshot = () => structuredClone([...this.map((tile) => tile.snapshot())]);

	/**
	 *
	 */
	get availableMoves() {
		return new Set(
			this
				.map((tile, tileIndex) => (
					[...tile.availableMoves]
						.map((direction) => [tileIndex, direction])
				))
				.flat()
		);
	}

	static from = (snapshot) => {
		const tiles = snapshot.map((tileSnapshot) => Tile.from(tileSnapshot));

		return new Column(...tiles);
	};

};

export default Column;
