import { useEffect, useState } from "preact/hooks";

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

	if (loading) {
		return (
			<div className="w-full flex items-center justify-center bg-neutral-900 p-8">
				<div className="animate-spin rounded-full h-16 w-16 border-b-4 border-neutral-500" />
			</div>
		);
	}

	return (
		<ul>
			{rooms.map(({ name, id }) => (
				<li className="w-full group">
					<a href={`/${id}`} className="p-4 w-full flex items-center bg-neutral-700 group-even:bg-neutral-600 hover:brightness-150">
						<span>{name}</span>
					</a>
				</li>
			))}
		</ul>

	);
};

export default RoomsList;
