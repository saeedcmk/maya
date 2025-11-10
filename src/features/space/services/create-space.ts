import { apiClient } from "@/lib/data/api/api-client";
import type { ApiSuccessResponse } from "@/lib/data/api/api-response";
import type { SpaceCreateInput } from "../models/space-create";
import type { Space } from "../types/space";

async function createSpace(input: SpaceCreateInput): Promise<Space> {
	const { data: createdSpace } = await apiClient
		.post("space", {
			json: input,
		})
		.json<ApiSuccessResponse<Space>>();

	return createdSpace;
}

export { createSpace };
