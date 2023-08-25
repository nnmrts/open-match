import RoomsList from "@/islands/rooms-list.jsx";

/**
 *
 */
const App = () => (
	<>
		<section className="w-full border-4 border-neutral-900 rounded">
			<hgroup className="w-full bg-neutral-900 p-4 flex justify-between items-center">
				<h2>Rooms</h2>
				<a
					className="p-2 flex justify-center items-center bg-neutral-800 rounded aspect-square h-12 text-lg font-bold hover:bg-neutral-700"
					href="/new"
				>
					<span>+</span>
				</a>
			</hgroup>

			<RoomsList />

		</section>
	</>
);

export default App;
