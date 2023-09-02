import { getCookies } from "std/http";

import { kv } from "@/utilities/server.js";

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
		for await (const { value: user } of kv.list({ prefix: ["users"] })) {
			const { sessionId, name } = user;

			if (sessionId === cookies.auth) {
				isAllowed = true;

				context.state.user = {
					sessionId,
					name
				};

				break;
			}
		}
	}

	context.state.isAllowed = isAllowed;

	return context.next();
};

export { handler };
