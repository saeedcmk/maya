import { cookies } from "next/headers";
import { JWT_ACCESS_TOKEN_NAME } from "../../auth-consts";
import type { Session } from "../../types/session";
import { verifyAccessToken } from "../../utils/verify-access-token";

let session: Session | null;

async function getSessionServer(): Promise<Session | null> {
	if (typeof session !== "undefined") {
		return session;
	}

	const cookieStore = await cookies();

	const accessToken = cookieStore.get(JWT_ACCESS_TOKEN_NAME)?.value;
	const accessPayload = accessToken
		? await verifyAccessToken(accessToken || "")
		: null;

	session = accessPayload;

	return session;
}

export { getSessionServer };
