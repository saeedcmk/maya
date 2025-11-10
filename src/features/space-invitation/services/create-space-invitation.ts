import { apiClient } from "@/lib/data/api/api-client";
import type { ApiSuccessResponse } from "@/lib/data/api/api-response";
import type { SpaceInvitationCreateInput } from "../models/space-invitation-create";

async function createSpaceInvitation(
	spaceId: string,
	input: SpaceInvitationCreateInput
): Promise<boolean> {
	await apiClient
		.post(`space/${spaceId}/invitation`, {
			json: input,
		})
		.json<ApiSuccessResponse>();

	return true;
}

export { createSpaceInvitation };
