import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
	JWT_ACCESS_TOKEN_NAME,
	JWT_ACCESS_TOKEN_TIME_IN_SECONDS,
	JWT_REFRESH_TOKEN_GRACE_PERIOD_SECONDS,
	JWT_REFRESH_TOKEN_NAME,
	JWT_REFRESH_TOKEN_TIME_IN_SECONDS,
} from "../auth-consts";
import { signAccessToken } from "./sign-access-token";
import { signRefreshToken } from "./sign-refresh-token";
import { verifyAccessToken } from "./verify-access-token";
import { verifyRefreshToken } from "./verify-refresh-token";

async function verifyAuthentication(
	request: NextRequest,
	response: NextResponse,
	errorFn: (request: NextRequest) => NextResponse
): Promise<
	{ response: NextResponse } & (
		| { success: false }
		| {
				success: true;
				userId: string;
		  }
	)
> {
	const accessToken = request.cookies.get(JWT_ACCESS_TOKEN_NAME)?.value;
	const accessPayload = accessToken
		? await verifyAccessToken(accessToken || "")
		: null;

	if (accessPayload) {
		// Access token valid, allow request
		return { success: true, response, userId: accessPayload.userId };
	}

	// Access token invalid/expired → try refresh token
	const refreshToken = request.cookies.get(JWT_REFRESH_TOKEN_NAME)?.value;
	const refreshPayload = refreshToken
		? await verifyRefreshToken(refreshToken)
		: null;

	// Verify refresh token
	if (!refreshToken || !refreshPayload) {
		return { success: false, response: errorFn(request) };
	}

	// Check DB for refresh token status
	const storedToken = await prisma.refreshToken.findUnique({
		where: { token: refreshToken },
		include: { user: true },
	});

	const now = new Date();

	if (
		!storedToken ||
		storedToken.expiresAt < now ||
		(storedToken.revoked &&
			(!storedToken.revokedAt ||
				(now.getTime() - storedToken.revokedAt.getTime()) / 1000 >
					JWT_REFRESH_TOKEN_GRACE_PERIOD_SECONDS))
	) {
		return { success: false, response: errorFn(request) };
	}

	// Rotate refresh token
	const newRefreshToken = await signRefreshToken({
		userId: refreshPayload.userId,
	});

	await prisma.$transaction([
		prisma.refreshToken.update({
			where: { token: refreshToken },
			data: { revoked: true, revokedAt: new Date() },
		}),

		prisma.refreshToken.create({
			data: {
				token: newRefreshToken,
				userId: refreshPayload.userId,
				expiresAt: new Date(
					Date.now() + JWT_REFRESH_TOKEN_TIME_IN_SECONDS * 1000
				),
			},
		}),
	]);

	// Issue new access token
	const newAccessToken = await signAccessToken({
		userId: refreshPayload.userId,
		nickname: storedToken.user.nickname,
		publicId: storedToken.user.publicId,
	});

	response.cookies.set(JWT_ACCESS_TOKEN_NAME, newAccessToken, {
		httpOnly: false,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		path: "/",
		maxAge: JWT_ACCESS_TOKEN_TIME_IN_SECONDS,
	});

	response.cookies.set(JWT_REFRESH_TOKEN_NAME, newRefreshToken, {
		httpOnly: false,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		path: "/",
		maxAge: JWT_REFRESH_TOKEN_TIME_IN_SECONDS,
	});

	return { success: true, response, userId: storedToken.userId };
}

export { verifyAuthentication };
