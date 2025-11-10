import { apiClient } from "@/lib/data/api/api-client";
import type { ApiSuccessResponse } from "@/lib/data/api/api-response";
import type { SpaceMemberCreateInput } from "../models/space-member-create";

async function addMemberToSpace(
	spaceId: string,
	input: SpaceMemberCreateInput
): Promise<boolean> {
	await apiClient
		.post(`space/${spaceId}/member`, {
			json: input,
		})
		.json<ApiSuccessResponse>();

	return true;
}

export { addMemberToSpace };
