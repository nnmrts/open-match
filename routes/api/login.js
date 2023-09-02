import { setCookie } from "std/http";
import { Temporal } from "@js-temporal/polyfill";

import { kv } from "@/utilities/server.js";

const {
	Duration
} = Temporal;

const handler = {
	POST: async (request, context) => {
		const formData = await request.formData();

		const username = formData.get("username");

		const { value: user } = await kv.get(["users", username]);

		const password = formData.get("password");

		const passwordHashBuffer = await crypto.subtle.digest(
			"SHA-256",
			new TextEncoder().encode(password)
		);

		const passwordHash = [...new Uint8Array(passwordHashBuffer)]
			.map((b) => b.toString(16).padStart(2, "0"))
			.join("");

		const sessionId = crypto.randomUUID();

		const { hostname } = new URL(request.url);

		const headers = new Headers();

		const cookie = {
			name: "auth",
			value: sessionId,
			maxAge: Duration.from({ days: 1 }).total({ unit: "seconds" }),
			sameSite: "Lax",
			domain: hostname,
			path: "/",
			secure: true
		};

		if ((user && passwordHash === user.passwordHash) || !user) {
			if (user) {
				await kv.set(
					["users", username],
					{
						...user,
						sessionId
					}
				);
			}
			else {
				await kv.set(
					["users", username],
					{
						name: username,
						passwordHash,
						sessionId
					}
				);
			}

			setCookie(
				headers,
				cookie
			);

			headers.set("location", "/");

			return new Response(
				null,
				{
					status: 303,
					headers
				}
			);
		}

		return new Response(
			null,
			{
				status: 403
			}
		);
	}
};

export { handler };
