import { UnauthorizedError } from "../../errors/unauthorized-error";
import type { Session } from "../../types/session";
import { getSessionServer } from "./get-session-server";

async function getSessionOrThrowServer(): Promise<Session> {
	const session = await getSessionServer();

	if (!session) {
		throw new UnauthorizedError("Session is required");
	}

	return session;
}

export { getSessionOrThrowServer };
