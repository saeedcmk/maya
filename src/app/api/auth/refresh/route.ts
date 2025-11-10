import type { NextRequest } from "next/server";
import {
	JWT_REFRESH_TOKEN_GRACE_PERIOD_SECONDS,
	JWT_REFRESH_TOKEN_TIME_IN_SECONDS,
} from "@/features/auth/auth-consts";
import { signAccessToken } from "@/features/auth/utils/sign-access-token";
import { signRefreshToken } from "@/features/auth/utils/sign-refresh-token";
import { verifyRefreshToken } from "@/features/auth/utils/verify-refresh-token";
import { failure, success } from "@/lib/data/api/api-response";
import { prisma } from "@/lib/prisma";

async function POST(req: NextRequest) {
	try {
		const { refreshToken }: { refreshToken: string } = await req.json();

		const refreshPayload = refreshToken
			? await verifyRefreshToken(refreshToken)
			: null;

		if (!refreshToken || !refreshPayload) {
			return failure("Invalid or missing refresh token", 401);
		}

		const storedToken = await prisma.refreshToken.findUnique({
			where: { token: refreshToken },
			include: { user: true },
		});

		const now = new Date();

		if (!storedToken) {
			return failure("Refresh token is not found", 401);
		}

		if (storedToken.expiresAt < now) {
			return failure("Refresh token has expired", 401);
		}

		if (
			storedToken.revoked &&
			(!storedToken.revokedAt ||
				(now.getTime() - storedToken.revokedAt.getTime()) / 1000 >
					JWT_REFRESH_TOKEN_GRACE_PERIOD_SECONDS)
		) {
			return failure("Refresh token has been revoked", 401);
		}

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

		const newAccessToken = await signAccessToken({
			userId: refreshPayload.userId,
			nickname: storedToken.user.nickname,
			publicId: storedToken.user.publicId,
		});

		return success({
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
		});
	} catch (err) {
		console.error(err?.toString());
		return failure("Failed to refresh token", 500);
	}
}

export { POST };
