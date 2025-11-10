import { type NextRequest, NextResponse } from "next/server";
import { kyClient } from "@/lib/data/api/api-client";
import {
	type ApiSuccessResponse,
	isApiFailureResponse,
} from "@/lib/data/api/api-response";
import {
	JWT_ACCESS_TOKEN_NAME,
	JWT_ACCESS_TOKEN_TIME_IN_SECONDS,
	JWT_REFRESH_TOKEN_NAME,
	JWT_REFRESH_TOKEN_TIME_IN_SECONDS,
} from "./auth-consts";
import { verifyAccessToken } from "./utils/verify-access-token";
import { verifyRefreshToken } from "./utils/verify-refresh-token";

function redirectToLogin(request: NextRequest) {
	const url = request.nextUrl.clone();

	url.pathname = "/auth/login";
	url.searchParams.set(
		"callbackUrl",
		`${request.nextUrl.pathname}${request.nextUrl.search}`
	);

	const response = NextResponse.redirect(url);

	response.cookies.delete(JWT_ACCESS_TOKEN_NAME);
	response.cookies.delete(JWT_REFRESH_TOKEN_NAME);

	return response;
}

async function authMiddleware(request: NextRequest, response: NextResponse) {
	try {
		const url = request.nextUrl.clone();

		// Exclude /auth routes entirely
		if (url.pathname.startsWith("/auth")) {
			return response;
		}

		const accessToken = request.cookies.get(JWT_ACCESS_TOKEN_NAME)?.value;
		const accessPayload = accessToken
			? await verifyAccessToken(accessToken || "")
			: null;

		if (accessPayload) {
			// Access token valid, allow request
			return response;
		}

		// Access token invalid/expired → try refresh token
		const refreshToken = request.cookies.get(JWT_REFRESH_TOKEN_NAME)?.value;
		const refreshPayload = refreshToken
			? await verifyRefreshToken(refreshToken)
			: null;

		// Verify refresh token
		if (!refreshToken || !refreshPayload) {
			return redirectToLogin(request);
		}

		const refreshResponse = await kyClient(url.origin)
			.post("api/auth/refresh", {
				json: { refreshToken },
			})
			.json<
				ApiSuccessResponse<{ accessToken: string; refreshToken: string }>
			>();

		response.cookies.set(
			JWT_ACCESS_TOKEN_NAME,
			refreshResponse.data.accessToken,
			{
				httpOnly: false,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				path: "/",
				maxAge: JWT_ACCESS_TOKEN_TIME_IN_SECONDS,
			}
		);

		response.cookies.set(
			JWT_REFRESH_TOKEN_NAME,
			refreshResponse.data.refreshToken,
			{
				httpOnly: false,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				path: "/",
				maxAge: JWT_REFRESH_TOKEN_TIME_IN_SECONDS,
			}
		);

		return response;
	} catch (err) {
		if (isApiFailureResponse(err)) {
			console.error(err.error);
		} else {
			console.error(err?.toString());
		}
		return redirectToLogin(request);
	}
}

export { authMiddleware };
