import { SignJWT } from "jose";
import {
	JWT_ALG,
	JWT_REFRESH_TOKEN_SECRET,
	JWT_REFRESH_TOKEN_TIME_IN_SECONDS,
} from "../auth-consts";
import type { RefreshTokenPayload } from "../models/refresh-token";

const JWT_SECRET = new TextEncoder().encode(JWT_REFRESH_TOKEN_SECRET);

async function signRefreshToken(payload: RefreshTokenPayload) {
	const now = Math.floor(Date.now() / 1000);
	const expiration = now + JWT_REFRESH_TOKEN_TIME_IN_SECONDS;

	return await new SignJWT({ userId: payload.userId })
		.setProtectedHeader({ alg: JWT_ALG })
		.setIssuedAt(now)
		.setExpirationTime(expiration)
		.sign(JWT_SECRET);
}

export { signRefreshToken };
