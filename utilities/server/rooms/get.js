import kv from "@/utilities/server/kv.js";

/**
 *
 * @param id
 */
const getRoom = async (id) => (await kv.get(["rooms", id])).value;

export default getRoom;
