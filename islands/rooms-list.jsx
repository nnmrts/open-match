import { TbTrash } from "react-icons/tb";
import { useEffect, useState } from "preact/hooks";

import Button from "@/components/input/button.jsx";

/**
 *
 */
const RoomsList = () => {
	const [rooms, setRooms] = useState([]);
	const [loading, setLoading] = useState(true);

	const updateRooms = async () => {
		const response = await fetch("/api/rooms");

		const data = await response.json();

		setRooms(data);

		setLoading(false);
	};

	useEffect(() => {
		updateRooms();

		setInterval(
			updateRooms,
			5000
		);
	}, []);

	const handleDelete = async (id) => {
		const response = await fetch(
			`/api/rooms/${id}`,
			{
				method: "DELETE"
			}
		);

		if (response.ok) {
			updateRooms();
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center w-full p-8 bg-neutral-900">
				<div className="w-16 h-16 border-b-4 rounded-full animate-spin border-neutral-500" />
			</div>
		);
	}

	if (rooms.length === 0) {
		return (
			<div className="flex items-center justify-center w-full p-8 bg-neutral-900">
				No rooms found
			</div>
		);
	}

	return (
		<ul>
			{rooms.map(({ name, id }) => (
				<li className="w-full group">
					<a href={`/${id}`} className="flex items-center justify-between w-full p-4 bg-neutral-700 group-even:bg-neutral-600 hover:brightness-150">
						<span>{name}</span>
						<Button
							onClick={(event) => {
								event.preventDefault();
								handleDelete(id);
							}}
						>
							<TbTrash className="w-6 h-6 " />
						</Button>
					</a>
				</li>
			))}
		</ul>

	);
};

export default RoomsList;
