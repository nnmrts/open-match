import { getRoom } from "@/utilities.js";
import BoardDisplay from "@/islands/board-display.jsx";

const handler = {
	GET: async ({ url }, context) => {
		const {
			params: {
				id
			}
		} = context;

		const room = await getRoom(id);

		return context.render(room);
	}
};

/**
 *
 * @param props
 * @param props.params
 * @param props.params.room
 * @param room
 * @param props.data
 * @param props.data.room
 * @param props.data.name
 * @param props.data.board
 * @param props.data.id
 */
const Room = ({
	data: {
		name, board: boardSnapshot, id
	}
}) => (
	<section className="flex flex-col items-center h-full border-4 rounded border-neutral-900">
		<style>
			{`
				main {
					display: flex;
					flex-direction: column;
					height: calc(100vh - 12rem);
				}
			`}
		</style>
		<h2 className="flex items-center w-full h-20 p-4 bg-neutral-600">Room {name}</h2>

		<BoardDisplay
			{...{
				...boardSnapshot,
				id
			}}
		/>
	</section>
);

export { handler };

export default Room;
