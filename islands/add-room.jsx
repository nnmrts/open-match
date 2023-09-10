import { useEffect, useState } from "preact/hooks";

import Button from "@/components/input/button.jsx";

/**
 *
 */
// eslint-disable-next-line max-lines-per-function
const AddRoom = () => {
	const [name, setName] = useState("");
	const [width, setWidth] = useState(7);
	const [height, setHeight] = useState(7);
	const [numberOfDifferentPieces, setNumberOfDifferentPieces] = useState(6);
	const [userChangedName, setUserChangedName] = useState(false);

	const handleChange = ({ currentTarget: { value } }, inputName) => {
		(new Map([
			["name", setName],
			["width", setWidth],
			["height", setHeight],
			["numberOfDifferentPieces", setNumberOfDifferentPieces]
		])).get(inputName)(value);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const response = await fetch("/api/rooms", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				name,
				width: Number(width),
				height: Number(height),
				numberOfDifferentPieces: Number(numberOfDifferentPieces)
			})
		});

		const id = await response.text();

		location.pathname = `/${id}`;
	};

	useEffect(() => {
		if (!userChangedName) {
			setName(`${width}x${height} - ${numberOfDifferentPieces}`);
		}
	}, [
		width,
		height,
		numberOfDifferentPieces
	]);

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col items-start gap-4 pt-4 md:gap-2"
		>
			<div
				className="flex flex-col w-full gap-2 md:flex-row md:items-center"
			>
				<label htmlFor="name" className="w-64">Name</label>
				<input
					id="name"
					name="name"
					type="text"
					onChange={(event) => {
						setUserChangedName(true);
						handleChange(event, "name");
					}}
					className="p-2"
					value={name}
				/>
			</div>
			<div
				className="flex flex-col w-full gap-2 md:flex-row md:items-center"
			>
				<label htmlFor="width" className="w-64">Width</label>
				<input
					id="width"
					name="width"
					type="number"
					onChange={(event) => {
						handleChange(event, "width");
					}}
					className="p-2"
					value={width}
				/>
			</div>
			<div
				className="flex flex-col w-full gap-2 md:flex-row md:items-center"
			>
				<label htmlFor="height" className="w-64">Height</label>
				<input
					id="height"
					name="height"
					type="number"
					onChange={(event) => {
						handleChange(event, "height");
					}}
					className="p-2"
					value={height}
				/>
			</div>
			<div
				className="flex flex-col w-full gap-2 md:flex-row md:items-center"
			>
				<label htmlFor="numberOfDifferentPieces" className="w-64">Number of different pieces</label>
				<input
					id="numberOfDifferentPieces"
					name="numberOfDifferentPieces"
					type="number"
					onChange={(event) => {
						handleChange(event, "numberOfDifferentPieces");
					}}
					className="p-2"
					value={numberOfDifferentPieces}
				/>
			</div>
			<Button type="submit" variant="contained">Create</Button>
		</form>
	);
};

export default AddRoom;
