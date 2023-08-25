import { kv } from "@/utilities.js";

/**
 *
 * @param id
 */
const getRoom = async (id) => (await kv.get(["rooms", id])).value;

export default getRoom;
