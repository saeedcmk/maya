import { type NextRequest, NextResponse } from "next/server";
import {
	JWT_ACCESS_TOKEN_NAME,
	JWT_REFRESH_TOKEN_NAME,
} from "@/features/auth/auth-consts";
import { prisma } from "@/lib/prisma";

async function GET(req: NextRequest) {
	const refreshToken = req.cookies.get(JWT_REFRESH_TOKEN_NAME)?.value;

	if (refreshToken) {
		await prisma.refreshToken.deleteMany({
			where: { token: refreshToken },
		});
	}

	const response = NextResponse.json({ success: true });

	response.cookies.delete(JWT_ACCESS_TOKEN_NAME);
	response.cookies.delete(JWT_REFRESH_TOKEN_NAME);

	return response;
}

export { GET };
