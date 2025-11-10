import { SignJWT } from "jose";
import {
	JWT_ACCESS_TOKEN_SECRET,
	JWT_ACCESS_TOKEN_TIME_IN_SECONDS,
	JWT_ALG,
} from "../auth-consts";
import { AccessTokenPayload } from "../models/access-token";

const JWT_SECRET = new TextEncoder().encode(JWT_ACCESS_TOKEN_SECRET);

async function signAccessToken(payload: AccessTokenPayload): Promise<string> {
	const now = Math.floor(Date.now() / 1000);
	const expiration = now + JWT_ACCESS_TOKEN_TIME_IN_SECONDS;

	return await new SignJWT({
		userId: payload.userId,
		nickname: payload.nickname,
		publicId: payload.publicId,
	})
		.setProtectedHeader({ alg: JWT_ALG })
		.setIssuedAt(now)
		.setExpirationTime(expiration)
		.sign(JWT_SECRET);
}

export { signAccessToken };
