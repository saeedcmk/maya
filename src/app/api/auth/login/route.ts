import { NextResponse } from "next/server";
import {
	JWT_ACCESS_TOKEN_NAME,
	JWT_ACCESS_TOKEN_TIME_IN_SECONDS,
	JWT_REFRESH_TOKEN_NAME,
	JWT_REFRESH_TOKEN_TIME_IN_SECONDS,
} from "@/features/auth/auth-consts";
import type { LoginInput } from "@/features/auth/models/login";
import { hashUsername } from "@/features/auth/utils/hash-username";
import { signAccessToken } from "@/features/auth/utils/sign-access-token";
import { signRefreshToken } from "@/features/auth/utils/sign-refresh-token";
import { verifyPassword } from "@/features/auth/utils/verify-password";
import { failure } from "@/lib/data/api/api-response";
import { prisma } from "@/lib/prisma";

async function POST(req: Request) {
	const { username, password }: LoginInput = await req.json();

	const normalizedUsername = username.trim();
	if (!normalizedUsername) {
		return failure("Username is required", 400, "VALIDATION_ERROR", {
			fields: {
				username: "required",
			},
		});
	}

	const normalizedPassword = password.trim();
	if (!normalizedPassword) {
		return failure("Password is required", 400, "VALIDATION_ERROR", {
			fields: {
				password: "required",
			},
		});
	}

	const hashedUsername = hashUsername(normalizedUsername);

	const user = await prisma.user.findUnique({
		where: { username: hashedUsername },
	});

	if (!user) {
		return failure("Invalid credentials", 401);
	}

	const isPasswordValid = await verifyPassword(password, user.password);

	if (!isPasswordValid) {
		return failure("Invalid credentials", 401);
	}

	const accessToken = await signAccessToken({
		userId: user.id,
		nickname: user.nickname,
		publicId: user.publicId,
	});

	const refreshTokenValue = await signRefreshToken({ userId: user.id });

	await prisma.refreshToken.create({
		data: {
			token: refreshTokenValue,
			userId: user.id,
			expiresAt: new Date(
				Date.now() + JWT_REFRESH_TOKEN_TIME_IN_SECONDS * 1000
			),
		},
	});

	const response = NextResponse.json({ success: true });

	response.cookies.set(JWT_ACCESS_TOKEN_NAME, accessToken, {
		httpOnly: false,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		path: "/",
		maxAge: JWT_ACCESS_TOKEN_TIME_IN_SECONDS,
	});

	response.cookies.set(JWT_REFRESH_TOKEN_NAME, refreshTokenValue, {
		httpOnly: false,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		path: "/",
		maxAge: JWT_REFRESH_TOKEN_TIME_IN_SECONDS,
	});

	return response;
}

export { POST };
