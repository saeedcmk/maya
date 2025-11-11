import { cookies } from "next/headers";
import { JWT_ACCESS_TOKEN_NAME } from "../../auth-consts";
import type { Session } from "../../types/session";
import { verifyAccessToken } from "../../utils/verify-access-token";

async function getSessionServer(): Promise<Session | null> {
	const cookieStore = await cookies();

	const accessToken = cookieStore.get(JWT_ACCESS_TOKEN_NAME)?.value;
	const accessPayload = accessToken
		? await verifyAccessToken(accessToken || "")
		: null;

	return accessPayload;
}

export { getSessionServer };
