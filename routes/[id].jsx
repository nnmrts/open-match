import { useSignal } from "@preact/signals";

import { getRoom } from "@/utilities/server.js";
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
 * @param props.data
 * @param props.data.name
 * @param props.data.board
 * @param props.data.id
 * @param props.state
 * @param props.state.user
 */
const Room = ({
	data: {
		name,
		board: boardSnapshot,
		id
	},
	state: {
		user
	}
}) => {
	const userSignal = useSignal(user);

	return (
		<section className="relative flex flex-col items-center h-full border-0 rounded md:border-4 border-neutral-900 [--room-header-height:5rem]">
			<style>
				{`
					main {
						display: flex;
						flex-direction: column;
						height: calc(100vh - 12rem);
						--main-padding: 0rem;
					}

					@media (min-width: 768px) {
						main {
							--main-padding: 2rem;
						}
					}
				`}
			</style>
			<h2 className="flex items-center w-full  h-[var(--room-header-height)] p-4 bg-neutral-600">Room {name}</h2>

			<BoardDisplay
				{...{
					...boardSnapshot,
					id,
					user: userSignal
				}}
			/>
		</section>
	);
};

export { handler };

export default Room;
