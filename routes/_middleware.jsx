import { getCookies } from "std/http";

import { kv } from "@/utilities.js";

/**
 *
 * @param root0
 * @param root0.headers
 * @param context
 */
const handler = async ({ headers }, context) => {
	const cookies = getCookies(headers);

	let isAllowed = false;

	if (cookies.auth) {
		for await (const { value: { sessionId } } of kv.list({ prefix: ["users"] })) {
			if (sessionId === cookies.auth) {
				isAllowed = true;
				break;
			}
		}
	}

	context.state.isAllowed = isAllowed;

	return context.next();
};

export { handler };
