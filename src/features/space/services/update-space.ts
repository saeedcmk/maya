import { apiClient } from "@/lib/data/api/api-client";
import type { ApiSuccessResponse } from "@/lib/data/api/api-response";
import type { SpaceUpdateInput } from "../models/space-update";
import type { Space } from "../types/space";

async function updateSpace(
	id: string,
	input: SpaceUpdateInput
): Promise<Space> {
	const { data } = await apiClient
		.patch(`space/${id}`, {
			json: input,
		})
		.json<ApiSuccessResponse<Space>>();

	return data;
}

export { updateSpace };
