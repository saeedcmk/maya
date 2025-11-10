import type { NextRequest } from "next/server";
import { JWT_ACCESS_TOKEN_NAME } from "@/features/auth/auth-consts";
import { verifyAccessToken } from "@/features/auth/utils/verify-access-token";
import { failure, success } from "@/lib/data/api/api-response";

const GET = async (request: NextRequest) => {
	try {
		const accessToken = request.cookies.get(JWT_ACCESS_TOKEN_NAME)?.value;
		const accessPayload = accessToken
			? await verifyAccessToken(accessToken || "")
			: null;

		if (!accessPayload) {
			return failure("Failed to retrieve identity", 500);
		}

		return success(accessPayload);
	} catch (err) {
		console.error(err?.toString());
		return failure("Failed to retrieve identity", 500);
	}
};

export { GET };
