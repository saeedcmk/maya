import { apiClient } from "@/lib/data/api/api-client";
import type { ApiSuccessResponse } from "@/lib/data/api/api-response";
import type { LoginInput } from "../models/login";

async function login(input: LoginInput): Promise<void> {
	await apiClient
		.post("auth/login", {
			json: input,
		})
		.json<ApiSuccessResponse<void>>();
}

export { login };
