import { jwtVerify } from "jose";
import { JWT_ACCESS_TOKEN_SECRET, JWT_ALG } from "../auth-consts";
import type { AccessTokenPayload } from "../models/access-token";

const JWT_SECRET = new TextEncoder().encode(JWT_ACCESS_TOKEN_SECRET);

async function verifyAccessToken(
	token: string
): Promise<AccessTokenPayload | null> {
	try {
		const { payload } = await jwtVerify(token, JWT_SECRET, {
			algorithms: [JWT_ALG],
		});

		return payload as AccessTokenPayload;
	} catch (err: any) {
		if (err?.code === "ERR_JWT_EXPIRED") {
			console.warn("Access token expired");
		} else {
			console.warn("Invalid access token", err);
		}

		return null;
	}
}

export { verifyAccessToken };
