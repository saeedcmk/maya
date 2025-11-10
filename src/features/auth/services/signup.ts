import { apiClient } from "@/lib/data/api/api-client";
import type { ApiSuccessResponse } from "@/lib/data/api/api-response";
import type { SignUpInput } from "../models/signup";

async function signUp(input: SignUpInput): Promise<void> {
	await apiClient
		.post("auth/signup", {
			json: input,
		})
		.json<ApiSuccessResponse<void>>();
}

export { signUp };
