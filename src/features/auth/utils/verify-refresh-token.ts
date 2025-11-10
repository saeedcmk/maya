import { jwtVerify } from "jose";
import { JWT_ALG, JWT_REFRESH_TOKEN_SECRET } from "../auth-consts";
import type { RefreshTokenPayload } from "../models/refresh-token";

const JWT_SECRET = new TextEncoder().encode(JWT_REFRESH_TOKEN_SECRET);

async function verifyRefreshToken(
	token: string
): Promise<RefreshTokenPayload | null> {
	try {
		const { payload } = await jwtVerify(token, JWT_SECRET, {
			algorithms: [JWT_ALG],
		});
		return payload as RefreshTokenPayload;
	} catch (err: any) {
		if (err.code === "ERR_JWT_EXPIRED") {
			console.warn("Refresh token expired");
		} else {
			console.warn("Invalid refresh token", err);
		}
		return null;
	}
}

export { verifyRefreshToken };
