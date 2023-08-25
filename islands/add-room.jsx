import { useState } from "preact/hooks";

/**
 *
 */
const AddRoom = () => {
	const [name, setName] = useState("");

	const handleChange = ({ currentTarget: { value } }) => {
		setName(value);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const response = await fetch("/api/rooms", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ name })
		});

		const id = await response.text();

		location.pathname = `/${id}`;
	};

	return (
		<form
			onSubmit={handleSubmit}
		>
			<div>
				<label htmlFor="name">Name</label>
				<input
					id="name"
					name="name"
					type="text"
					onChange={handleChange}
				/>
			</div>
			<button
				type="submit"
			>
				Create
			</button>
		</form>
	);
};

export default AddRoom;
