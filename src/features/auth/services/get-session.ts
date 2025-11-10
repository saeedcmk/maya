import { apiClient } from "@/lib/data/api/api-client";
import type { ApiSuccessResponse } from "@/lib/data/api/api-response";
import type { Session } from "../types/session";

async function getSession(): Promise<Session> {
	const { data } = await apiClient
		.get("auth/session")
		.json<ApiSuccessResponse<Session>>();

	return data;
}

export { getSession };
